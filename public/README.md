# Portfolio · 项目资源

按子目录组织资源。修改 JSON 引用即可，无需改代码。

## 目录约定

```
public/
├── images/
│   └── projects/
│       └── <slug>/        每个项目一个子目录
│           ├── cover.jpg  21:9 案例封面（必须）
│           ├── thumb.jpg  1:1 索引缩略图（必须）
│           ├── gallery-*.jpg  16:9 / 4:3 / 3:2 案例画廊
│           └── visual-*.jpg   4:3 过程视觉（决策日志同步画面）
├── videos/
│   └── <slug>.webm        视频字段填入此路径即自动渲染
├── fonts/                 （可选）商业字体 self-host，如 PP Editorial New
└── resume.pdf             简历 PDF（在 lib/config/resume.json 中引用）
```

## 图片规范（design-system.md §14）

- 格式：AVIF > WebP > JPG（fallback）
- 单图：≤ 200KB（mobile）/ 400KB（desktop）
- 命名：kebab-case，如 `gallery-01.jpg`
- 比例：参考 ui-spec.md 每个模块

## 视频规范（design-system.md §15）

- 格式：WebM (VP9) > MP4 (H.264)
- 单段：≤ 2MB（mobile）/ 5MB（desktop）
- 时长：≤ 15 秒 loop

## 配置位置

- 项目列表：`lib/config/projects.json`
- 站点信息：`lib/config/site.json`
- 履历：`lib/config/resume.json`
- 导航：`lib/config/nav.json`

## 占位符

当前所有图片位置均用 placeholder div 占位。
后续替换真实图片，更新 JSON 中对应路径即可。
