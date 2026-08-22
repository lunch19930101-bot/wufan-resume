# Coding Style — 工程规范

> 实现阶段（写代码时）遵守的工程约定。
> 当前阶段（设计阶段）此文档作为**目标规范**。

---

## 1. 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | **Next.js 14+ (App Router)** | SEO + 路由 + SSR 一体 |
| 语言 | **TypeScript**（strict） | 大型项目必备 |
| 样式 | **Tailwind CSS** + CSS Variables | Token 化 + 工具类速度 |
| 动画 | **GSAP** + **ScrollTrigger** | 工业标准，scrub 精准 |
| 平滑滚动 | **Lenis** | 与 GSAP 同步好 |
| 3D | **Three.js** + **React Three Fiber** | Deep-Dive ② 相机运动 |
| 字体 | **next/font**（self-host） | 避免 CLS |
| 图片 | **next/image** | 自动 WebP/AVIF + srcset |
| 部署 | **Vercel** | Next 原生支持 |

---

## 2. Token 映射（三端同步）

设计 token 必须在 **CSS Variables / Tailwind config / Figma Variables** 三端一致。

### 2.1 命名约定（三段式）

```
category-variant-size
─────────────────────
color-bg-canvas
color-text-primary
color-accent-lime
space-4
radius-md
shadow-elev-2
ease-out-expo
dur-base
text-display-xl
```

### 2.2 CSS Variables（:root）

```css
:root {
  /* colors */
  --color-bg-canvas:    #0B0B0D;
  --color-bg-surface:   #15151A;
  --color-text-primary: #F2F0EA;
  --color-accent-lime:  #D7FF3A;
  --color-accent-vermillion: #FF5C28;

  /* spacing */
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  /* motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-base: 320ms;
}
```

### 2.3 Tailwind config（映射 CSS Variables）

```js
theme: {
  extend: {
    colors: {
      bg:     { canvas: 'var(--color-bg-canvas)', surface: 'var(--color-bg-surface)' },
      text:   { primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)' },
      accent: { lime: 'var(--color-accent-lime)', vermillion: 'var(--color-accent-vermillion)' },
    },
    spacing: { 4: 'var(--space-4)', 5: 'var(--space-5)', 6: 'var(--space-6)' },
    fontSize: {
      'display-xl': ['var(--text-display-xl)', { lineHeight: '1', letterSpacing: '-0.04em' }],
    },
    transitionTimingFunction: { 'out-expo': 'var(--ease-out-expo)' },
    transitionDuration:       { base: 'var(--dur-base)' },
  }
}
```

### 2.4 Figma Variables

命名与上述 token 完全一致，便于用 Tokens Studio / Figma Tokens 插件同步。

---

## 3. 目录结构约定

```
app/
├── layout.tsx                  根 layout（字体、Lenis、Cursor、Nav、Footer 注入）
├── page.tsx                    Home
├── about/page.tsx
├── projects/page.tsx
├── projects/[slug]/page.tsx    Case Study 动态路由
├── resume/page.tsx
├── contact/page.tsx
└── not-found.tsx               自定义 404

components/
├── ui/                         基础 UI（Button, Tag, Card, Chip）
├── nav/                        Nav, FilterBar, Breadcrumb
├── sections/                   跨页 Section（Hero, Manifesto, Index, etc.）
├── cursor/                     CustomCursor
├── motion/                     动画封装（RevealText, RevealImage, CountUp, PinnedSection）
└── primitives/                 低级原语（Box, Stack, Cluster）

assets/
├── fonts/                      PP Editorial New, Geist, Geist Mono（self-host woff2）
├── images/                     全站图片（AVIF/WebP）
├── videos/                     作品演示视频（WebM）
└── icons/                      所有 SVG icon（24×24 viewBox, 1.5px stroke）

lib/
├── gsap.ts                     GSAP 注册 + ScrollTrigger 配置
├── lenis.ts                    Lenis 实例与同步
└── projects.ts                 案例数据（types + content）
```

---

## 4. 组件命名

- **PascalCase**：`Button.tsx`, `IndexCell.tsx`
- **复合组件**：通过 `<Button variant="primary">` API，而非 `Button.Primary` 子组件
- **Section 组件**：`HeroSection`, `ManifestoSection`，文件加 `Section` 后缀
- **动画包装**：`RevealText`, `RevealImage`, `CountUp`，加行为前缀
- **目录索引**：每个目录有 `index.ts` 统一导出
- **页面组件**：`page.tsx`（Next.js 约定）

---

## 5. 动画封装约定

所有动画必须通过统一的 motion 原语，**禁止散落的 `gsap.to`**。

### 用法约定

```tsx
<RevealText as="h1" variant="display-xl" stagger={80}>
  Make to Think.
</RevealText>

<RevealImage src={cover} ratio="21/9" direction="up" delay={200} />

<CountUp to={1247} duration={1600} />

<PinnedSection end="+=300%">
  {/* scroll-scrubbed 内容 */}
</PinnedSection>
```

### 约定规则
- 所有 reveal 组件内部用 IntersectionObserver 触发
- 所有 reveal 组件支持 `delay` / `stagger` prop
- 所有动画组件响应 `prefers-reduced-motion`
- ScrollTrigger 用统一的 `<PinnedSection>` 包装，禁止散落 pin

---

## 6. 字体加载

```ts
// next/font self-host，避免 FOIT/FOUT
import localFont from 'next/font/local'

const display = localFont({
  src: './fonts/PP-Editorial-New.woff2',
  variable: '--font-display',
  display: 'swap',
  preload: true,
})
// Geist / Geist Mono 同理
```

- `font-display: swap`（避免 FOIT）
- preload 关键字体（display + body）
- 字体子集化（latin + 中文字符按需）
- CSS 中 `font-family` 引用 CSS Variables，便于全局切换

---

## 7. 图片与视频

### 7.1 图片

- 一律 `next/image`
- 提供 `srcset`（1x / 2x / 3x）—— next/image 自动
- 格式优先级：**AVIF > WebP > JPG**（fallback）
- 占位：`blurDataURL`（blur placeholder）
- `loading="lazy"`（非首屏）+ `priority`（首屏）
- 尺寸：见 ui-spec.md 各模块
- 暗色模式：所有照片叠加 grain overlay

### 7.2 视频

- 一律 `<video>` 自定义包装（不用 next/image 风格）
- 属性：`muted autoplay loop playsInline`
- `preload="metadata"`
- **poster 必填**，且独立设计（不是首帧截图）
- 格式：**WebM (VP9) > MP4 (H.264)**
- 视口外暂停（IntersectionObserver）

---

## 8. 可访问性（A11y）必须项

| 项 | 要求 |
|---|---|
| 语义 HTML | `<nav>` `<main>` `<section>` `<article>` `<footer>` |
| Heading 顺序 | 不跳级（h1 → h2 → h3） |
| Alt 文本 | 所有 `<img>` 有意义的 alt（装饰图 alt=""） |
| Focus 顺序 | 与视觉顺序一致 |
| Focus 可见 | 2px lime outline，offset 2px |
| 色彩对比 | AA 起步，关键文字 AAA |
| Reduced motion | 全站支持（见 animation.md §13） |
| 触屏 | 自定义光标 / magnetic 关闭 |
| Skip link | "Skip to content" 第一个 Tab |
| ARIA | 仅在语义不足时用，不滥用 |
| 视频 | 提供字幕 / transcript（如适用） |

---

## 9. SEO

| 项 | 要求 |
|---|---|
| Title | 每页独立，格式："页面名 — [Your Name]" |
| Description | 每页独立，120–160 字符 |
| OG image | 每页独立 1200×630，dark mode 风格 |
| Twitter card | summary_large_image |
| Sitemap | next-sitemap 自动生成 |
| Robots | 允许全站 |
| Schema.org | Person（首页）、CreativeWork（Case Study） |
| Canonical | 每页必须 |
| 性能 | LCP < 2.5s，CLS < 0.1，INP < 200ms |

---

## 10. 性能预算

| 指标 | 目标 |
|---|---|
| Total JS（gzip） | < 200KB |
| Total CSS（gzip） | < 30KB |
| 单页图片总量 | < 1.5MB（desktop） |
| 字体（子集化后） | < 250KB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| 60fps | 所有交互 |

### 实现要点
- 路由级 code splitting（自动）
- 大组件 `dynamic(() => ..., { ssr: false })`（如 Three.js 场景）
- 图片 lazy + 占位
- 动画只用 transform / opacity
- `will-change` 临时使用，用完移除

---

## 11. 浏览器支持

| 浏览器 | 版本 |
|---|---|
| Safari | 最近 2 个版本 |
| Chrome | 最近 2 个版本 |
| Firefox | 最近 2 个版本 |
| Edge | 最近 2 个版本 |
| iOS Safari | ≥ 15 |
| Android Chrome | ≥ 100 |

**不支持**：IE、旧版浏览器。

---

## 12. 提交规范（Git）

### 12.1 Commit Message

```
<type>: <subject>

types: feat / fix / design / docs / refactor / perf / chore
```

例：`design: refine hero text rendering animation`

### 12.2 Branch

- `main` — 生产
- `dev` — 开发主干
- `feat/<scope>` — 新功能
- `fix/<scope>` — 修复
- `design/<scope>` — 设计调整

---

## 13. 代码风格（lint）

- **ESLint** + **Prettier**
- TypeScript strict mode
- 禁止 `any`（必要时 `unknown` + 类型守卫）
- Import 顺序：`react` → 第三方 → `@/` → 相对
- 单引号，分号，2 空格缩进
- 命名：
  - 组件：PascalCase
  - 变量 / 函数：camelCase
  - 常量：UPPER_SNAKE
  - 类型 / 接口：PascalCase
  - CSS class：kebab-case（或 Tailwind utility）
- 文件名：组件 PascalCase，工具 camelCase

---

## 14. 环境变量

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=...
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourname.com
NEXT_PUBLIC_CALENDAR_URL=https://cal.com/...
NEXT_PUBLIC_SOCIAL_TWITTER=...
NEXT_PUBLIC_SOCIAL_LINKEDIN=...
NEXT_PUBLIC_SOCIAL_DRIBBLE=...
```

---

## 15. 部署

- **Vercel** 自动部署 main 分支
- Preview deployments 每个分支 / PR
- 环境变量在 Vercel Dashboard 配置
- 域名 + HTTPS（Vercel 自动）
- 分析：Vercel Analytics + Speed Insights

---

## 16. 数据结构（TypeScript 约定）

案例数据统一通过类型定义，便于 Index 与 Case Study 共享：

```ts
type Project = {
  slug: string
  title: string
  slogan: string
  year: number
  industry: 'Fintech' | 'SaaS' | 'AI' | 'Consumer' | '...'
  role: 'Lead' | 'Product' | 'Senior' | 'Solo'
  type: 'Product' | 'Brand' | 'Motion' | 'System'
  cover: string          // 21:9
  thumb: string          // 1:1
  accentColor?: string   // 该案例的主色（用于 Index cell 的 hover）
  case: {
    brief: string
    decisions: { day: number; log: string }[]
    visuals: string[]    // 4:3 同步画面
    gallery: { src: string; ratio: '16/9' | '4/3' }[]
    outcomes: { value: string; label: string }[]
  }
}
```

所有数据集中在 `lib/projects.ts`，便于维护。

---

> 此文档为**目标规范**。实现过程中如有调整，更新此文档，**保持文档与代码同步**。
