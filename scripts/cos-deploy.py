#!/usr/bin/env python3
"""
Portfolio → 腾讯云 COS 静态网站部署
（解决国内直连 github.io 慢的问题；免备案 myqcloud.com 默认域名）

用法（密钥只走环境变量，绝不写进仓库）:
  COS_SECRET_ID=xxx COS_SECRET_KEY=yyy python3 scripts/cos-deploy.py

流程:
  1. CAM GetUserAppId 拿账号 APPID
  2. 建桶 wufan-resume-<appid>（ap-shanghai，公有读）
  3. 开启静态网站（index.html / 404.html）
  4. 上传 out/ 全量（多线程；HTML 不缓存，_next/static 永久缓存）
"""
import mimetypes
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

from qcloud_cos import CosConfig, CosS3Client
from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.cam.v20190116.cam_client import CamClient
from tencentcloud.cam.v20190116.models import GetUserAppIdRequest

REGION = "ap-shanghai"
BUCKET_BASE = "wufan-resume"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "out")
SITE_URL_TPL = "https://{bucket}.cos-website.{region}.myqcloud.com/"

SECRET_ID = os.environ.get("COS_SECRET_ID")
SECRET_KEY = os.environ.get("COS_SECRET_KEY")
if not (SECRET_ID and SECRET_KEY):
    sys.exit("缺少 COS_SECRET_ID / COS_SECRET_KEY 环境变量")


def get_appid() -> str:
    cred = credential.Credential(SECRET_ID, SECRET_KEY)
    client = CamClient(cred, "")
    resp = client.GetUserAppId(GetUserAppIdRequest())
    return str(resp.AppId)


# 显式 MIME 表（带 charset，对齐 GitHub Pages 响应头）。
# 不依赖系统 mimetypes —— 不同机器对 woff2/js 的映射不一致。
MIME_MAP = {
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".eot": "application/vnd.ms-fontobject",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".map": "application/json; charset=utf-8",
    ".wasm": "application/wasm",
}

# 显式「内联展示」类型 —— 明确告诉浏览器/内核：这是网页，别当文件下载。
# （myqcloud.com 是文件存储域名，微信内置浏览器等会按域名猜测行为，显式声明可破）
INLINE_EXTS = {".html", ".htm", ".css", ".js", ".mjs", ".json",
               ".xml", ".txt", ".svg", ".pdf"}


def guess_type(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    return MIME_MAP.get(ext) or mimetypes.guess_type(path)[0] or "application/octet-stream"


def cache_rule(key: str) -> str:
    if key.endswith(".html"):
        return "no-cache"
    if key.startswith("_next/static/"):
        return "public, max-age=31536000, immutable"
    return "public, max-age=86400"


def main() -> None:
    appid = get_appid()
    bucket = f"{BUCKET_BASE}-{appid}"
    print(f"APPID: {appid}  桶: {bucket}")

    config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY, Scheme="https")
    client = CosS3Client(config)

    # 1. 建桶（已存在则跳过）
    try:
        client.create_bucket(Bucket=bucket, ACL="public-read")
        print("桶已创建（公有读）")
    except Exception as e:
        if "already" in str(e).lower() or "exist" in str(e).lower() or "BucketAlreadyExist" in str(e):
            print("桶已存在，复用")
        else:
            raise

    # 2. 静态网站配置
    client.put_bucket_website(
        Bucket=bucket,
        WebsiteConfiguration={
            "IndexDocument": {"Suffix": "index.html"},
            "ErrorDocument": {"Key": "404.html"},
        },
    )
    print("静态网站已开启（index.html / 404.html）")

    # 3. 收集文件
    jobs = []
    for root, _dirs, files in os.walk(OUT_DIR):
        for f in files:
            if f == ".DS_Store":
                continue
            path = os.path.join(root, f)
            key = os.path.relpath(path, OUT_DIR).replace(os.sep, "/")
            jobs.append((path, key))
    total_bytes = sum(os.path.getsize(p) for p, _ in jobs)
    print(f"待上传: {len(jobs)} 个文件 / {total_bytes / 1048576:.1f}MB")

    # 4. 多线程上传
    done = [0]
    lock_print_every = max(1, len(jobs) // 10)

    def upload(job):
        path, key = job
        ctype = guess_type(path)
        ext = os.path.splitext(path)[1].lower()
        extra = {}
        if ext in INLINE_EXTS:
            # 显式内联 —— 防止部分手机浏览器把页面当文件弹出下载
            extra["ContentDisposition"] = "inline"
        with open(path, "rb") as fp:
            client.put_object(
                Bucket=bucket,
                Key=key,
                Body=fp,
                ContentType=ctype,
                CacheControl=cache_rule(key),
                EnableMD5=False,
                **extra,
            )
        return key

    errors = []
    with ThreadPoolExecutor(max_workers=16) as pool:
        futures = {pool.submit(upload, j): j[1] for j in jobs}
        for fut in as_completed(futures):
            try:
                fut.result()
                done[0] += 1
                if done[0] % lock_print_every == 0 or done[0] == len(jobs):
                    print(f"  进度 {done[0]}/{len(jobs)}")
            except Exception as e:
                errors.append((futures[fut], str(e)))

    if errors:
        print("失败文件:")
        for k, e in errors[:10]:
            print(f"  {k}: {e}")
        sys.exit(1)

    print(f"\n✅ 上传完成 → {SITE_URL_TPL.format(bucket=bucket, region=REGION)}")


if __name__ == "__main__":
    try:
        main()
    except TencentCloudSDKException as e:
        sys.exit(f"腾讯云 API 错误: {e.code} {e.message}")
