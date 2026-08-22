# Portfolio · "Make to Think"

> Personal UI / Product Design Portfolio
> Stage 1 scaffold complete — awaiting confirmation before Stage 2.

个人 UI / 产品设计作品集网站，按 `docs/` 中既定设计规范实现。

---

## Quick Start

```bash
# 切换到正确的 Node 版本
nvm use

# 安装依赖（首次或拉取新代码后）
npm install

# 启动开发服务器
npm run dev
# 打开 http://localhost:3000

# 生产构建（静态导出到 ./out）
npm run build

# 类型检查 / Lint / 格式化
npm run typecheck
npm run lint
npm run format
```

---

## 项目结构

```
Portfolio/
├── app/                     Next.js App Router 页面
│   ├── layout.tsx           根 layout（字体 / Lenis / Cursor / Nav / Footer）
│   ├── page.tsx             Home（当前为 Stage 1 验证页）
│   ├── not-found.tsx        自定义 404
│   ├── about/ projects/ resume/ contact/
│   └── globals.css          Design Tokens（CSS Variables）
│
├── components/
│   ├── primitives/          Container / Section
│   ├── motion/              RevealText / RevealImage / CountUp / MagneticWrap / SmoothScroll
│   ├── ui/                  Button / Tag / Chip / Card
│   ├── cursor/              CustomCursor
│   ├── nav/                 Nav
│   └── sections/            Footer
│
├── lib/
│   ├── config/              ★ 内容数据（编辑这里，不动代码）
│   │   ├── site.json
│   │   ├── nav.json
│   │   ├── projects.json    项目数据，无限扩展
│   │   └── resume.json
│   ├── config.ts            数据出口 + 派生函数
│   ├── types.ts             TypeScript 类型
│   ├── utils.ts             cn / withBasePath 等工具
│   └── gsap.ts              GSAP 注册
│
├── public/                  静态资源（图片 / 视频 / PDF）
│   ├── images/projects/<slug>/
│   └── videos/
│
├── docs/                    设计 / 规范文档（已固化，不再修改）
│   ├── product.md           创意方案
│   ├── design-system.md     Design System 全 token
│   ├── ui-spec.md           信息架构 + 线框
│   ├── interaction.md       交互规范
│   ├── animation.md         动画规范
│   └── coding-style.md      工程规范
│
├── .github/workflows/
│   └── deploy.yml           GitHub Pages 自动部署
│
├── next.config.mjs          静态导出 + basePath
├── tailwind.config.ts       Tailwind 镜像 Design Token
├── tsconfig.json            strict + @/* 路径别名
└── package.json
```

---

## 替换内容（不用改代码）

| 想改 | 改这里 |
|---|---|
| 姓名 / 邮箱 / 社交 | `lib/config/site.json` |
| 项目数据 | `lib/config/projects.json` |
| 履历 | `lib/config/resume.json` |
| 导航 | `lib/config/nav.json` |
| 项目图片 | 把文件丢到 `public/images/projects/<slug>/` |
| 项目视频 | 把 .webm 丢到 `public/videos/`，把 JSON 里 `video: null` 改成路径 |
| 简历 PDF | 替换 `public/resume.pdf` |

详见 `lib/config/README.md`。

---

## 部署到 GitHub Pages

1. 把项目推到 GitHub 仓库（建议仓库名 = 你想要的子路径，如 `portfolio`）
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 推 `main` 分支即自动部署到 `https://<user>.github.io/<repo>/`
4. 部署到自定义域名或 `<user>.github.io` 根仓库时无需特殊配置

工作流：`.github/workflows/deploy.yml`

---

## Stage 1 完成清单

- [x] Next.js 15 + React 19 + TypeScript strict 项目初始化
- [x] 完整目录结构（app / components / lib / public）
- [x] ESLint + Prettier + .gitignore + .nvmrc
- [x] Design Token 全量落地（dark / light 双主题 CSS Variables）
- [x] Tailwind 镜像所有 token
- [x] 公共组件：Container / Section / RevealText / RevealImage / CountUp / MagneticWrap / SmoothScroll / Button / Tag / Chip / Card / CustomCursor / Nav / Footer
- [x] 配置化数据（JSON，可扩展）
- [x] GitHub Actions 静态导出 + 部署
- [x] `npm run build` 通过，`./out/` 静态产物可用

## Stage 2 待办（需先确认）

- 5 个 IA 决策点（见 `docs/ui-spec.md` §10）
- Home 真正实现（Hero / Manifesto / Index Preview / CTA）
- Projects 页（Filter Bar + Grid）
- Case Study 模板
- About / Resume / Contact 各页

---

## 字体说明

当前 Stage 1 用 Google Fonts 替代商业字体：

| 角色 | 当前 | 目标（你拿到字体后） |
|---|---|---|
| Display | Fraunces（Google） | PP Editorial New |
| Body | Inter（Google） | Geist |
| Mono | JetBrains Mono（Google） | Geist Mono |

替换方法：把商业字体 .woff2 放到 `public/fonts/`，修改 `app/layout.tsx` 中的字体加载（仅此一处）。
