# app/

Next.js App Router 页面。

## 路由（参考 `docs/ui-spec.md` §0 信息架构）

```
app/
├── layout.tsx                  根 layout（字体 / Lenis / Cursor / Nav / Footer 注入）
├── page.tsx                    Home
├── about/page.tsx              About
├── projects/page.tsx           Projects (Index)
├── projects/[slug]/page.tsx    Case Study（动态，按 project.slug）
├── resume/page.tsx             Resume
├── contact/page.tsx            Contact
└── not-found.tsx               自定义 404
```

## layout.tsx 注入清单

- 字体（PP Editorial New + Geist + Geist Mono，via next/font）
- Lenis smooth scroll 实例
- CustomCursor（pointer: fine 时启用）
- Sticky Nav
- Footer（含 Colophon）
- `<SkipToContent />` 链接
- Meta tags（title / description / OG）默认值

## 数据来源

- 案例数据：`lib/projects.ts`（见 coding-style.md §16）
- Projects 页 + Case Study 页共享同一数据源

## 待确认的 IA 决策

参考 `docs/ui-spec.md` §10，5 个决策点（单页 / 多页 / 混合；About 是否保留；Resume 形态；Case 模板复用；Index 维度）实现前必须先拍板。
