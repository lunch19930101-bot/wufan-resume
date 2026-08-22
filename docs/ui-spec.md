# Make to Think — Wireframes

> 全页面线框图 v1.0
> 基于设计系统 v1.0
> 标注规则：每模块标 **高度 / 内容比例 / 图片比例**
> 日期：2026-06-29

---

## 0. 信息架构总览（IA）

```
                        ┌──────────┐
                        │  Home    │ ←── 入口 / 母题宣告
                        └────┬─────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  About   │  │ Projects │  │  Resume  │
        │ (人/观)  │  │ (索引)   │  │ (履历)   │
        └────┬─────┘  └────┬─────┘  └──────────┘
             │             │
             │             ▼
             │       ┌────────────┐
             │       │ Case Study │ × N
             │       │  (深潜)    │
             │       └────────────┘
             │
             ▼
       ┌────────────┐
       │  Contact   │ ←── 转化点
       └────┬───────┘
            │
            ▼
       ┌──────────┐
       │  Footer  │ ←── 全站底栏（含 Colophon）
       └──────────┘
```

**导航深度**：3 层（Home → Projects → Case Study）
**全站共享**：Sticky Nav（64px）+ Custom Cursor + Footer

---

## 1. 全局共享元素

### 1.1 Sticky Nav（所有页面顶部）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ◆ name.              Home   About   Projects   Resume        Contact → │
└──────────────────────────────────────────────────────────────────────────┘
   ↑ height: 64px
   ↑ bg: glass (blur 24px / opacity 0.60)
   ↑ border-bottom: 1px border-subtle
   ↑ 内容比例: logo 20% | nav center | CTA right
   ↑ 当前页用 lime 下划点标记
```

### 1.2 Custom Cursor（全站叠加）

```
   default         hover-link       hover-button      press
   ┌─┐                                    ╭────╮
   │●│              ╭──╮                 │ ⬬ │           ●
   └─┘              │  │                 ╰────╯          (实心)
   8px lime         32px ring         48px ring         24px
```

### 1.3 Page Shell（每页的外层骨架）

```
   ┌─ viewport (100vw × 100vh) ─────────────────────────────┐
   │ ┌─ Nav 64px ─────────────────────────────────────────┐ │
   │ ├────────────────────────────────────────────────────┤ │
   │ │                                                    │ │
   │ │            PAGE CONTENT                            │ │
   │ │            margin-x: 60px (desktop)                │ │
   │ │            max-width: 1320px (content)             │ │
   │ │            max-width: 860px (long-read)            │ │
   │ │                                                    │ │
   │ ├────────────────────────────────────────────────────┤ │
   │ │ Footer (60vh)                                      │ │
   │ └────────────────────────────────────────────────────┘ │
   └────────────────────────────────────────────────────────┘
```

---

## 2. 首页 Home

### H-01 · Hero（开场帧）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [nav]                                                                   │
│                                                                          │
│                                                                          │
│                                                                          │
│                                                                          │
│        M a k e   t o   T h i n k.                                       │
│                                                                          │
│                                                                          │
│        ────  designer · thinker · maker · since 2018                    │
│                                                                          │
│                                                                          │
│                                                                          │
│                                            scroll ↓                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 100vh (≈ 900px @ desktop)
   ▲ bg: #0B0B0D + grain overlay (opacity 0.04)
   ▲ content ratio: text 70% / whitespace 30%（极简）
   ▲ 主字: display-xl 128px / PP Editorial New / 字重 400
   ▲ 字幕: mono-micro 12px / 字距 +0.04em
   ▲ 无图片（用字本身做视觉）
   ▲ 入场动效: 字形 mask reveal + rendering，1200ms
```

### H-02 · Manifesto（宣言）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│         "I don't design screens.                                         │
│          I design decisions."                                            │
│                                                                          │
│                                                                          │
│         │ // 每一个像素的位置，                                          │
│         │ // 都是一次有理由的选择。                                      │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 60vh
   ▲ padding: 192px top / 192px bottom
   ▲ content ratio: 引言 75% / 边注 25%
   ▲ 引言: display-l 80px / max-width 1200px / 居中偏左
   ▲ 边注: mono caption 14px / 左侧细线引出
   ▲ 无图片
```

### H-03 · Featured Work（精选作品预览）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  SELECTED WORK · 2026                              [ view all → ]       │
│  ──────────────                                                          │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐     │
│  │                             │    │                             │     │
│  │                             │    │                             │     │
│  │      [ 16:9 image ]         │    │      [ 16:9 image ]         │     │
│  │                             │    │                             │     │
│  │                             │    │                             │     │
│  └─────────────────────────────┘    └─────────────────────────────┘     │
│   Project Alpha                       Project Beta                       │
│   Fintech · Lead Designer · 2025      SaaS · Product Designer · 2024     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 80vh
   ▲ padding: 128px top / 128px bottom
   ▲ content ratio: 标题行 15% / 卡片 70% / meta 15%
   ▲ 图片比例: 16:9（每张约 624×351 @ desktop）
   ▲ 卡片 padding: 24px / radius: 20px
   ▲ 网格: 2 列 / gutter: 24px
```

### H-04 · Index Preview（索引预览）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  THE INDEX                                                               │
│  ── 12 projects · 4 dimensions                                          │
│                                                                          │
│  [All 12] [Year] [Industry] [Role] [Type]                               │
│                                                                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│                              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│ │ 1:1│                              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 80vh
   ▲ padding: 128px top / 128px bottom
   ▲ content ratio: 标题 15% / filter 8% / grid 77%
   ▲ cell 图片比例: 1:1（约 200×200）
   ▲ 网格: 6 列 desktop / 4 列 tablet / 2 列 mobile
   ▲ cell gap: 8px / cell radius: 12px
   ▲ hover: scale 1.04 + slogan 浮层
```

### H-05 · CTA Strip（首页转化条）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│         Have something worth making?                                     │
│                              ┌──────────────────────┐                    │
│                              │   Get in touch   →   │                    │
│                              └──────────────────────┘                    │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 40vh
   ▲ padding: 96px top / 96px bottom
   ▲ bg: bg-surface (#15151A)
   ▲ content ratio: 文字 60% / 按钮 40%
   ▲ 文字: display-m 56px
   ▲ 按钮: btn-primary btn-lg / radius-pill / glow-lime on hover
   ▲ 无图片
```

---

## 3. About（人 / 观）

### A-01 · About Hero（编辑式开场）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [nav]                                                                   │
│                                                                          │
│  ┌──────────────┐                                                        │
│  │              │     A field guide to                                   │
│  │              │                                                        │
│  │  [portrait]  │     [Your Name].                                       │
│  │   ratio 3:4  │                                                        │
│  │              │     ── designer · 8 years · Shanghai                   │
│  │              │                                                        │
│  │              │     [bio intro 2 lines]                                │
│  └──────────────┘                                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 80vh
   ▲ padding: 128px top / 64px bottom
   ▲ content ratio: 肖像 40% / 文字 60%（左 4 列 / 右 8 列）
   ▲ 图片比例: 3:4 portrait（约 480×640）
   ▲ 文字: display-l 80px (名字) / mono caption 14px (meta)
   ▲ gutter: 48px
```

### A-02 · Belief（信念长读）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│         What I believe.                                                  │
│         ──────────                                                       │
│                                                                          │
│         [ body-l 20px / line-height 1.5 / max-width 860px ]             │
│                                                                          │
│         第一段：你的设计观，3-4 句。                                      │
│                                                                          │
│         第二段：你相信的方法论，为什么"做以思之"。                         │
│                                                                          │
│         第三段：你的工作标准，什么是"够好"。                              │
│                                                                          │
│         第四段：你拒绝什么，为什么。                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: auto（内容驱动，min 60vh）
   ▲ padding: 128px top / 128px bottom
   ▲ content ratio: 标题 15% / 正文 85%
   ▲ 文字: display-m 56px (标题) / body-l 20px (正文)
   ▲ 阅读宽度: 860px 居中
   ▲ 无图片
```

### A-03 · Trajectory（职业轨迹）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Trajectory                                                              │
│  ──────────                                                              │
│                                                                          │
│  2026  ●──────────  Senior Designer · Studio X                          │
│        │                                                                 │
│        │            [1-line achievement]                                 │
│        │                                                                 │
│  2023  ●──────────  Lead Designer · TechCorp                            │
│        │                                                                 │
│        │            [1-line achievement]                                 │
│        │                                                                 │
│  2020  ●──────────  Product Designer · Startup Y                        │
│        │                                                                 │
│        │            [1-line achievement]                                 │
│        │                                                                 │
│  2018  ●──────────  Junior Designer · Agency Z                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 60vh
   ▲ padding: 96px top / 96px bottom
   ▲ content ratio: 标题 12% / timeline 88%
   ▲ timeline 左侧年份栏: 4 列宽 / mono caption 14px
   ▲ 右侧描述: 8 列宽 / body 16px
   ▲ 节点 ●: 8px lime 实心圆
   ▲ 连线: 1px border-subtle
   ▲ 无图片
```

### A-04 · Dashboard（数字仪表盘）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  By the numbers                                                          │
│  ───────────────                                                         │
│                                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │             │ │             │ │             │ │             │        │
│  │   1,247     │ │     9       │ │     8       │ │    24       │        │
│  │             │ │             │ │             │ │             │        │
│  │  screens    │ │  products   │ │   years     │ │   awards    │        │
│  │  designed   │ │   shipped   │ │   of craft  │ │   & features│        │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 50vh
   ▲ padding: 96px top / 96px bottom
   ▲ content ratio: 标题 15% / 数字网格 85%
   ▲ 网格: 4 列 / gutter: 24px
   ▲ 数字: display-l 80px / count-up 动效 / lime 色
   ▲ 描述: mono caption 14px / secondary 色
   ▲ 无图片
```

### A-05 · Toolbox & Recognition（工具与认可）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐     │
│  │ Toolbox                      │  │ Recognition                  │     │
│  │ ──────                       │  │ ──────────                   │     │
│  │                              │  │                              │     │
│  │ Design                       │  │  "Quote from someone you     │     │
│  │ ▸ Figma  ▸ Framer  ▸ Cursor  │  │   respect about your work."  │     │
│  │                              │  │              — Name, Title   │     │
│  │ Code                         │  │                              │     │
│  │ ▸ React  ▸ GSAP  ▸ Three.js  │  │  Award · 2025                │     │
│  │                              │  │  Award · 2024                │     │
│  │ Craft                        │  │  Feature · 2023              │     │
│  │ ▸ Motion  ▸ Systems  ▸ Type  │  │                              │     │
│  └──────────────────────────────┘  └──────────────────────────────┘     │
│            6 col                              6 col                      │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 40vh
   ▲ padding: 64px top / 96px bottom
   ▲ content ratio: 左右各 50% / gutter 48px
   ▲ Toolbox: caption mono 14px 标签 + body 16px 项
   ▲ Recognition: display-m 28px 引语 / mono caption 来源
   ▲ 无图片
```

---

## 4. Projects（作品索引）

### P-01 · Projects Hero

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [nav]                                                                   │
│                                                                          │
│                                                                          │
│         The Index.                                                       │
│         ── 12 projects · 4 dimensions                                   │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 50vh
   ▲ padding: 96px top / 48px bottom
   ▲ content ratio: 标题 70% / meta 30%
   ▲ 文字: display-l 80px (标题) / mono caption 14px (meta)
   ▲ 无图片
```

### P-02 · Filter Bar（粘性筛选条）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [All 12]  [Year ▾]  [Industry ▾]  [Role ▾]  [Type ▾]      sort: recent ▾│
│  ────────────────────────────────────────────────────────────────────    │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 56px
   ▲ sticky: top 64px（贴在 nav 下）
   ▲ bg: glass
   ▲ content ratio: filter chips 80% / sort 20%
   ▲ chips: radius-pill / 选中态 lime 边框
   ▲ 无图片
```

### P-03 · Project Grid（作品矩阵）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                                 │
│  │          │ │          │ │          │                                 │
│  │  [1:1]   │ │  [1:1]   │ │  [1:1]   │   ← desktop: 3 列               │
│  │  image   │ │  image   │ │  image   │     tablet: 2 列                │
│  │          │ │          │ │          │     mobile: 1 列                │
│  └──────────┘ └──────────┘ └──────────┘                                 │
│   Alpha        Beta         Gamma                                       │
│   Fintech·25   SaaS·24      AI·24                                       │
│                                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                                 │
│  │  [1:1]   │ │  [1:1]   │ │  [1:1]   │                                 │
│  │          │ │          │ │          │                                 │
│  └──────────┘ └──────────┘ └──────────┘                                 │
│   Delta        Epsilon      Zeta                                        │
│                                                                          │
│  ... (12 cells 共 4 行)                                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: auto（内容驱动，约 320vh）
   ▲ padding: 96px top / 128px bottom
   ▲ content ratio: 全部为 grid
   ▲ cell 图片比例: 1:1（约 400×400 @ desktop）
   ▲ 网格: 3 列 / gutter: 24px
   ▲ cell: radius 12px / padding 0（图占满）/ 标题区 padding 16px
   ▲ cell 标题: heading-s 20px / meta: mono caption 14px
   ▲ hover: scale 1.04 + slogan 浮层 + lime 边框
```

---

## 5. Case Study（案例深潜）

> 通用模板，每个项目案例复用此结构。

### C-01 · Case Hero（案例头）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to Projects                                       [nav]          │
│                                                                          │
│                                                                          │
│  Project Alpha                                              2025         │
│  ── Fintech · Lead Designer · 6 months                                  │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 60vh
   ▲ padding: 96px top / 64px bottom
   ▲ content ratio: 返回 8% / 标题 70% / meta 22%
   ▲ 文字: display-l 80px (标题) / mono caption 14px (meta)
   ▲ 无图片
```

### C-02 · Cover（封面大图）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                                                                          │
│                     [ 21:9 cinematic cover ]                            │
│                                                                          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 按 21:9 比例（@ 1320 宽 ≈ 565px）
   ▲ padding: 0（full-bleed）或 64px（contain）
   ▲ content ratio: 100% image
   ▲ 图片比例: 21:9
   ▲ 处理: 叠加 grain + 暗角
```

### C-03 · Brief（项目简介）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   01 / Brief                                                             │
│   ──────                                                                  │
│                                                                          │
│   [ body-l 20px / max-width 860px ]                                     │
│                                                                          │
│   问题是什么。                                                            │
│   谁是用户。                                                              │
│   约束是什么。                                                            │
│   成功长什么样。                                                          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: auto（min 50vh）
   ▲ padding: 128px top / 96px bottom
   ▲ content ratio: 标签 12% / 正文 88%
   ▲ 标签: mono caption 14px / lime 色
   ▲ 正文: body-l 20px / 阅读宽度 860px
   ▲ 无图片
```

### C-04 · Process · Decision Log（决策日志 + 同步画面）

```
┌──────────────────────────────────────────────────────────────────────────┐
│   02 / Process                                                           │
│   ─────────                                                              │
│                                                                          │
│   ┌──────────────────────┐   ┌────────────────────────────────────┐     │
│   │ day 03               │   │                                    │     │
│   │ killed the hero.     │   │                                    │     │
│   │ trust the whitespace │   │      [ 4:3 synced visual ]         │     │
│   │                      │   │      (随滚动切换 wireframe          │     │
│   │ day 11               │   │       → mockup → final)            │     │
│   │ moved CTA 8px down.  │   │                                    │     │
│   │ conversion +14%      │   │                                    │     │
│   │                      │   │                                    │     │
│   │ day 24               │   │                                    │     │
│   │ killed the gradient. │   │                                    │     │
│   │ shipped flat.        │   │                                    │     │
│   └──────────────────────┘   └────────────────────────────────────┘     │
│         4 col                              8 col                         │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 100vh+（滚动驱动，画面同步切换）
   ▲ padding: 96px top / 96px bottom
   ▲ content ratio: 决策日志 33% / 画面 67%
   ▲ 左侧: mono caption 14px / 行高 1.6 / gutter 48px
   ▲ 右侧 图片比例: 4:3（约 720×540）
   ▲ 滚动联动: 左侧决策逐条 high light，右侧画面同步换帧
```

### C-05 · Gallery（视觉画廊）

```
┌──────────────────────────────────────────────────────────────────────────┐
│   03 / Gallery                                                           │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │                                                                  │   │
│   │                  [ 16:9 full-width visual ]                      │   │
│   │                                                                  │   │
│   └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌────────────────────────┐   ┌────────────────────────┐               │
│   │                        │   │                        │               │
│   │       [ 4:3 ]          │   │       [ 4:3 ]          │               │
│   │                        │   │                        │               │
│   └────────────────────────┘   └────────────────────────┘               │
│                                                                          │
│   ┌────────────────────────┐   ┌────────────────────────┐               │
│   │       [ 4:3 ]          │   │       [ 4:3 ]          │               │
│   └────────────────────────┘   └────────────────────────┘               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: auto（内容驱动，约 200vh）
   ▲ padding: 96px top / 96px bottom
   ▲ content ratio: 标签 5% / gallery 95%
   ▲ 图片比例: 1×(16:9) + 4×(4:3)
   ▲ 16:9: full container width（约 1320×743）
   ▲ 4:3: 2 列网格 / gutter 24px（每张约 648×486）
   ▲ 全部直角 radius-none
```

### C-06 · Outcomes（数据成果）

```
┌──────────────────────────────────────────────────────────────────────────┐
│   04 / Outcomes                                                          │
│                                                                          │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │              │ │              │ │              │                    │
│   │    +42%      │ │   1.2M       │ │    4.8★      │                    │
│   │              │ │              │ │              │                    │
│   │ conversion   │ │  users       │ │  app rating  │                    │
│   │              │ │              │ │              │                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 50vh
   ▲ padding: 96px top / 96px bottom
   ▲ content ratio: 标签 15% / 数字网格 85%
   ▲ 网格: 3 列 / gutter: 24px
   ▲ 数字: display-l 80px / count-up / lime 色
   ▲ 描述: mono caption 14px
   ▲ 无图片
```

### C-07 · Next Case（下一案例）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│         Next:  Project Beta                                  →          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 40vh
   ▲ padding: 96px top / 96px bottom
   ▲ bg: bg-surface
   ▲ content ratio: 100% 文字
   ▲ 文字: display-m 56px / magnetic hover
   ▲ 整行可点击 → share transition 到下一个 Case
   ▲ 无图片
```

---

## 6. Resume（履历）

### R-01 · Resume Hero

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [nav]                                                                   │
│                                                                          │
│                                                                          │
│         [Your Name]                                       [ ↓ PDF ]     │
│         Curriculum Vitae                                                 │
│         ── 2026                                                          │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 40vh
   ▲ padding: 96px top / 48px bottom
   ▲ content ratio: 标题 70% / 按钮 30%
   ▲ 文字: display-l 80px
   ▲ 按钮: btn-secondary btn-md（下载 PDF）
   ▲ 无图片
```

### R-02 · Resume Body（双栏履历）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐  ┌──────────────────┐       │
│  │ Experience                              │  │ Skills           │       │
│  │ ──────────                              │  │ ──────           │       │
│  │                                         │  │                  │       │
│  │ 2023–now   Senior Designer              │  │ Design           │       │
│  │             Studio X                    │  │ ▸ UX / UI        │       │
│  │             [2-line summary]            │  │ ▸ Design Systems │       │
│  │                                         │  │ ▸ Motion         │       │
│  │ 2020–23    Lead Designer                │  │                  │       │
│  │             TechCorp                    │  │ Code             │       │
│  │             [2-line summary]            │  │ ▸ React / Next   │       │
│  │                                         │  │ ▸ GSAP / Three   │       │
│  │ 2018–20    Product Designer             │  │                  │       │
│  │             Startup Y                   │  │ Tools            │       │
│  │             [2-line summary]            │  │ ▸ Figma · Framer │       │
│  │                                         │  │ ▸ Cursor · VSCode│       │
│  │ Education                               │  │                  │       │
│  │ ──────────                              │  │ Languages        │       │
│  │ 2014–18    B.Des, University            │  │ 中文 · English   │       │
│  │                                         │  │                  │       │
│  └────────────────────────────────────────┘  └──────────────────┘       │
│              8 col                                 4 col                 │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: auto（内容驱动，约 150vh）
   ▲ padding: 96px top / 128px bottom
   ▲ content ratio: 左栏 67% / 右栏 33% / gutter 48px
   ▲ 左栏 body: body 16px / 行高 1.55
   ▲ 年份: mono caption 14px / secondary 色
   ▲ 右栏: caption mono 14px (分类) + body 16px (项目)
   ▲ 无图片
```

---

## 7. Contact（邀请）

### CT-01 · Contact（全屏邀请）

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [nav]                                                                   │
│                                                                          │
│                                                                          │
│                                                                          │
│                                                                          │
│         Let's make something                                             │
│         that matters.                                                    │
│                                                                          │
│                                                                          │
│         hello@yourname.com                                               │
│                                                                          │
│         ┌──────────────────────┐                                         │
│         │  Book a 30-min call →│                                         │
│         └──────────────────────┘                                         │
│                                                                          │
│         Twitter   ·   LinkedIn   ·   Dribbble                           │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 100vh
   ▲ padding: 192px top / 192px bottom
   ▲ bg: bg-canvas
   ▲ content ratio: 标题 40% / email 20% / CTA 20% / social 20%
   ▲ 标题: display-xl 128px / PP Editorial New
   ▲ email: display-m 56px / hover 时 lime 下划线刷过
   ▲ CTA: btn-primary btn-lg
   ▲ social: mono caption 14px / 分隔符 ·
   ▲ 无图片
```

---

## 8. Footer（署名 / 全站底栏）

### F-01 · Footer + Colophon

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ◆ name.                                    Home  About  Projects       │
│  designer · maker                           Resume  Contact              │
│                                                                          │
│  ────────────────────────────────────────────────────────────────────    │
│                                                                          │
│  Colophon                              Social              Status        │
│  ────────                              ──────              ──────        │
│  Set in PP Editorial New               Twitter             ● available   │
│  & Geist.                              LinkedIn              for work   │
│  Built with Next.js,                   Dribbble                          │
│  GSAP, Lenis, Three.js.                Email                             │
│  Designed & coded by you.                                                │
│  No templates were harmed.             ↑ Back to top                     │
│                                                                          │
│  ────────────────────────────────────────────────────────────────────    │
│                                                                          │
│  © 2026 [Your Name]. All rights reserved.       v1.0 · made with care   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ height: 60vh
   ▲ padding: 96px top / 48px bottom
   ▲ bg: bg-surface (#15151A)
   ▲ content ratio: brand 20% / nav 20% / 3 列 meta 50% / copyright 10%
   ▲ brand: heading-m 28px (logo) + mono caption 14px (tagline)
   ▲ 3 列: caption mono 14px (标题) + body 16px (内容)
   ▲ 状态点: 8px lime 实心圆 + pulse 动效
   ▲ 无图片
```

---

## 9. 模块尺寸速查表

| 模块 | 高度 | 主要图片比例 | 主要文字规格 |
|---|---|---|---|
| Sticky Nav | 64px | — | heading-s 20px |
| Hero (Home) | 100vh | 无 | display-xl 128px |
| Manifesto | 60vh | 无 | display-l 80px |
| Featured Work | 80vh | 16:9 ×2 | heading-s 20px |
| Index Preview | 80vh | 1:1 ×12 | caption mono |
| CTA Strip | 40vh | 无 | display-m 56px |
| About Hero | 80vh | 3:4 ×1 | display-l 80px |
| Belief | auto (min 60vh) | 无 | body-l 20px |
| Trajectory | 60vh | 无 | body 16px |
| Dashboard | 50vh | 无 | display-l 80px |
| Toolbox & Recog. | 40vh | 无 | body 16px |
| Projects Hero | 50vh | 无 | display-l 80px |
| Filter Bar | 56px (sticky) | — | caption mono |
| Project Grid | auto (~320vh) | 1:1 ×12 | heading-s 20px |
| Case Hero | 60vh | 无 | display-l 80px |
| Cover | 21:9 ratio | 21:9 ×1 | — |
| Brief | auto (min 50vh) | 无 | body-l 20px |
| Process / Log | 100vh+ | 4:3 ×1 (synced) | mono caption |
| Gallery | auto (~200vh) | 16:9 ×1 + 4:3 ×4 | — |
| Outcomes | 50vh | 无 | display-l 80px |
| Next Case | 40vh | 无 | display-m 56px |
| Resume Hero | 40vh | 无 | display-l 80px |
| Resume Body | auto (~150vh) | 无 | body 16px |
| Contact | 100vh | 无 | display-xl 128px |
| Footer | 60vh | 无 | heading-m 28px |

---

## 10. 待确认的 IA 决策点

下面 5 个问题需要你拍板，会影响后续高保真：

### 决策 1 · 单页 vs 多页

当前线框是**多页面路由**结构。但原 "Make to Think" 概念是**单页长滚动叙事**。

| 方案 | 优点 | 缺点 |
|---|---|---|
| **A. 多页面**（当前线框） | IA 清晰、SEO 友好、Resume 可独立分享 | 首屏冲击被分散，少了一点"作品即作品"的整体感 |
| **B. 单页长滚动** | 叙事一气呵成、Awwwards 评审偏好 | Resume/Contact 不便独立链接 |
| **C. 混合**：Home 单页长滚 + Projects/Case/Resume 独立页 | 兼顾叙事与实用 | 实现复杂度高 |

### 决策 2 · About 页是否保留

原概念砍掉了 About（认为是俗套）。你现在加回来了。两种处理：

- **A. 独立 About 页**：编辑式人物特写（如当前线框）
- **B. 折叠进 Home**：在 Hero 后插一段 "About" 模块
- **C. 不要 About**：让作品本身说话（原概念）

### 决策 3 · Resume 形态

- **A. 网页版履历**（当前线框）+ PDF 下载
- **B. 仅 PDF 下载按钮**（不在网页展示履历）
- **C. LinkedIn 外链**

### 决策 4 · Case Study 模板复用

所有案例是否都用 **C-01 ~ C-07 同一套模板**？

- **A. 统一模板**（一致性高，省事）
- **B. 旗舰案例用完整模板，其他案例用精简版**（推荐——避免每个 case 都很长）

### 决策 5 · Index 维度

Projects 页的 4 个筛选维度具体是什么？需要你确认：

- **By Year**（年份）
- **By Industry**（行业）
- **By Role**（你的角色）
- **By Type**（项目类型：Product / Brand / Motion / System）

是否需要增减？

---

> **下一步**：等你确认以上 5 个决策点后，我会据此进入高保真阶段——
> 建议从 **Home 首页的 Hero + Index Preview** 开始，因为这两块是整站设计含量的峰值。
