# assets/

字体、图片、视频、icon 等静态资源。

按 `docs/design-system.md` §5（字体）与 §14 / §15（图片视频）规范准备。

## 子目录约定

```
assets/
├── fonts/     PP Editorial New, Geist, Geist Mono（woff2，self-host）
├── images/    全站图片（AVIF / WebP，多分辨率 srcset）
├── videos/    作品演示视频（WebM，≤ 15s loop）
└── icons/     SVG icons（24×24 viewBox，1.5px stroke，Lucide 风格）
```

## 规范要点

- 字体子集化，单字体 ≤ 80KB
- 图片单张 ≤ 200KB（mobile）/ 400KB（desktop）
- 视频单段 ≤ 2MB（mobile）/ 5MB（desktop）
- icon 命名：kebab-case，如 `arrow-up-right.svg`
- 所有资源在 `lib/` 中按需 import，不散落引用
