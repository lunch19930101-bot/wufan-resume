#!/usr/bin/env python3
"""MiSans-VF 站点用字子集化（国内访问提速：1.3MB → ~440KB）

用法：先 npm run build 生成最新 out/，再 python3 scripts/subset-misans.py，
最后重新 build（public/fonts 会被拷进 out/）并部署。

注意：子集只含当前站内文案字符——**改过文案/新增页面后必须重跑本脚本**，
否则新增的字会回退到系统字体显示。原始全量字体备份在 /tmp 或自行保留。
"""
import io, os, glob, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, 'public/fonts/MiSans-VF.woff2')
ORIG = '/tmp/pwtest/MiSans-VF.orig.woff2'   # 全量字体备份路径

chars = set()
for pat in ['out/**/*.html', 'out/_next/static/chunks/*.js', 'out/_next/static/css/*.css']:
    for f in glob.glob(os.path.join(ROOT, pat), recursive=True):
        s = io.open(f, encoding='utf-8', errors='ignore').read()
        chars |= set(re.findall(r'[ -~　-〿一-鿿！-～—‘’“”…·×─-╿]', s))
chars |= set('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,:;!?\n\t')

txt_file = '/tmp/misans-chars.txt'
io.open(txt_file, 'w', encoding='utf-8').write(''.join(sorted(chars)))
cjk = [c for c in chars if '一' <= c <= '鿿']
print(f'unique chars: {len(chars)} | CJK: {len(cjk)}')

if not os.path.exists(ORIG):
    print(f'备份全量字体 → {ORIG}')
    import shutil; shutil.copy(FONT, ORIG)

r = subprocess.run([sys.executable, '-m', 'fontTools.subset', ORIG,
                    '--text-file=' + txt_file, '--flavor=woff2',
                    '--output-file=' + FONT, '--layout-features=*'])
sys.exit(r.returncode)
