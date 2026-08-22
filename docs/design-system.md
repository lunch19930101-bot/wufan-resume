# Make to Think — Design System

> 作品集网站 UI 规范文档 v1.0
> 母题：Make to Think（造以思之）
> 适配：Awwwards / FWA 评审水准
> 制定日期：2026-06-29

---

## 目录

1. [设计哲学](#1-设计哲学)
2. [Baseline 基线网格](#2-baseline-基线网格)
3. [Grid 栅格系统](#3-grid-栅格系统)
4. [Spacing 间距系统](#4-spacing-间距系统)
5. [Typography 字体系统](#5-typography-字体系统)
6. [Color 颜色系统](#6-color-颜色系统)
7. [Icon 图标系统](#7-icon-图标系统)
8. [Radius 圆角系统](#8-radius-圆角系统)
9. [Shadow 阴影系统](#9-shadow-阴影系统)
10. [Glass 玻璃效果](#10-glass-玻璃效果)
11. [Button 按钮系统](#11-button-按钮系统)
12. [Hover 悬停规范](#12-hover-悬停规范)
13. [Animation 动画规范](#13-animation-动画规范)
14. [Image 图片比例](#14-image-图片比例)
15. [Video 视频比例](#15-video-视频比例)
16. [Whitespace 留白规范](#16-whitespace-留白规范)
17. [Breakpoint 响应式断点](#17-breakpoint-响应式断点)
18. [Do & Don't 总则](#18-do--dont-总则)

---

## 1. 设计哲学

整套 Design System 建立在三套数学约束之上：

| 约束 | 数值 | 作用 |
|---|---|---|
| **Baseline Grid** | 8px | 所有垂直节奏对齐到此网格 |
| **Spacing Base Unit** | 4px | 所有间距是 4 的倍数 |
| **Type Scale Ratio** | 1.25 (Major Third) | 字号阶梯的等比 |

**铁律**：任何元素的位置、尺寸、间距，必须是 4px 的整数倍。不允许出现 13px、17px、22px 这类"野值"。这是 craft 的底层证据。

---

## 2. Baseline 基线网格

```
Baseline unit:    8px
Sub-baseline:     4px   （仅用于极小元素如 icon stroke、border）
Pixel grid:       1px   （仅用于 border / hairline）
```

所有文本的 line-height 必须落到 8px baseline 上。例：16px 字号 → line-height 24px（3 个 baseline）；20px 字号 → line-height 32px（4 个 baseline）。

---

## 3. Grid 栅格系统

### 3.1 Desktop（≥ 1280px）— 主战场

```
Container max-width:   1440px
Content max-width:     1320px   （长读文本 860px）
Columns:               12
Gutter:                24px
Margin (外侧留白):     60px     （1440 视口下）
Vertical bleed:        每节上下 96px～192px（见 §16）
```

### 3.2 Tablet（768px – 1279px）

```
Container max-width:   fluid 100%
Columns:               8
Gutter:                20px
Margin:                32px
```

### 3.3 Mobile（≤ 767px）

```
Container max-width:   fluid 100%
Columns:               4
Gutter:                16px
Margin:                20px
```

### 3.4 特殊网格

| 用途 | 规格 |
|---|---|
| **Editorial 长读**（Manifesto / 引言） | 单栏，max-width 860px，居中 |
| **Index 索引矩阵** | 12 列均分，cell 自适应 4 / 6 / 12 列三种密度 |
| **Deep-Dive 决策日志** | 左 4 列 / 右 8 列的分栏，gutter 48px |
| **Hero 大字** | 突破 container，bleed 到 margin，制造压迫感 |

---

## 4. Spacing 间距系统

基于 4px 的等比+线性混合阶梯。命名采用 `t-shirt size`，便于团队口头沟通。

| Token | 值 | 用途 |
|---|---|---|
| `space-0` | 0 | — |
| `space-1` | 4px | icon 与文字间距、hairline 间隙 |
| `space-2` | 8px | 紧密元素间距、tag 内边距垂直 |
| `space-3` | 12px | 小组件内边距、列表项间距 |
| `space-4` | 16px | **基准间距**，正文行间、卡片内边距 |
| `space-5` | 24px | 段落间距、卡片之间 |
| `space-6` | 32px | 子章节间距 |
| `space-7` | 48px | 组件群之间 |
| `space-8` | 64px | 章节内大段落之间 |
| `space-9` | 96px | 章节顶部留白（移动端） |
| `space-10` | 128px | 章节顶部留白（桌面端） |
| `space-11` | 192px | Hero / 高潮章节留白 |
| `space-12` | 256px | 极少数情况，强调用 |

### 关键组件内边距

```
Card padding:        24px (space-5)
Panel padding:       32px (space-6)
Modal padding:       48px (space-7)
Button padding-y:    SM 8 / MD 12 / LG 16
Button padding-x:    SM 16 / MD 20 / LG 28
Input padding:       12px 16px
```

---

## 5. Typography 字体系统

### 5.1 字族

| 角色 | 字体 | 备选（CDN fallback） |
|---|---|---|
| **Display** | PP Editorial New | Fraunces (Google Fonts) |
| **Body / UI** | Geist | Inter |
| **Mono** | Geist Mono | JetBrains Mono |

### 5.2 字号阶梯（Desktop）

| Token | 字号 | Line-height | Letter-spacing | Weight | 用途 |
|---|---|---|---|---|---|
| `display-xl` | 128px | 1.00 | -0.04em | 400 | Hero 主字 |
| `display-l` | 80px | 1.05 | -0.03em | 400 | 章节标题、宣言 |
| `display-m` | 56px | 1.10 | -0.02em | 500 | 案例标题 |
| `heading-l` | 40px | 1.15 | -0.02em | 600 | 大标题 |
| `heading-m` | 28px | 1.20 | -0.01em | 600 | 子标题 |
| `heading-s` | 20px | 1.30 | -0.01em | 600 | 小标题 |
| `body-l` | 20px | 1.50 | 0 | 400 | 正文（强调） |
| `body` | 16px | 1.55 | 0 | 400 | 正文 |
| `caption` | 14px | 1.45 | +0.01em | 500 | 注解、标签 |
| `mono-micro` | 12px | 1.40 | +0.04em | 500 | 字幕、代码、log |

### 5.3 字号阶梯（Mobile）

| Token | Mobile 值 | clamp() 表达式 |
|---|---|---|
| `display-xl` | 56px | `clamp(2.75rem, 12vw + 1rem, 8rem)` |
| `display-l` | 40px | `clamp(2.25rem, 6vw + 1rem, 5rem)` |
| `display-m` | 32px | `clamp(2rem, 4vw + 0.5rem, 3.5rem)` |
| `heading-l` | 28px | `clamp(1.75rem, 2vw + 1rem, 2.5rem)` |
| `body` | 16px | 固定，不缩放 |

### 5.4 字重使用规则

```
PP Editorial New  仅用 400（依靠字形本身的笔形张力，不加粗）
Geist             400 / 500 / 600 三档
Geist Mono        400 / 500 两档
```

**铁律**：标题不使用 700+。粗体只在正文中的"关键名词"做 600 微强调。

### 5.5 字距与对齐

- 大标题（≥ 40px）：letter-spacing **负值**（-0.02em ~ -0.04em），收紧，避免松散。
- 小字 mono（≤ 14px）：letter-spacing **正值**（+0.04em），打开，增加呼吸感。
- 所有 Display 字体默认垂直对齐到 baseline。
- 中文混排：中文字号 = 英文字号 × 1.0，但 letter-spacing 调整为 0.02em。

---

## 6. Color 颜色系统

### 6.1 Dark Mode（默认）

#### 基础层

| Token | Hex | RGB | 用途 |
|---|---|---|---|
| `bg-canvas` | `#0B0B0D` | 11,11,13 | 页面底色 |
| `bg-surface` | `#15151A` | 21,21,26 | 卡片、面板 |
| `bg-elevated` | `#1F1F26` | 31,31,38 | 弹层、悬浮元素 |
| `bg-overlay` | `rgba(11,11,13,0.80)` | — | Modal 遮罩 |

#### 边框层

| Token | 值 | 用途 |
|---|---|---|
| `border-subtle` | `rgba(255,255,255,0.06)` | 分割线、弱边框 |
| `border-default` | `rgba(255,255,255,0.08)` | 卡片边框 |
| `border-strong` | `rgba(255,255,255,0.14)` | Hover / 聚焦边框 |

#### 文字层

| Token | Hex | 用途 |
|---|---|---|
| `text-primary` | `#F2F0EA` | 主文字（奶白，非纯白） |
| `text-secondary` | `#8E8E89` | 次文字 |
| `text-tertiary` | `#5A5A55` | 弱文字、placeholder |
| `text-inverse` | `#0B0B0D` | 反色（用于 lime 底） |

#### 强调色（Signature）

| Token | Hex | RGB | 用途 |
|---|---|---|---|
| `accent-lime` | `#D7FF3A` | 215,255,58 | 主强调，光标 / 关键数字 / CTA |
| `accent-lime-dim` | `rgba(215,255,58,0.16)` | — | lime 光晕、底色 |
| `accent-vermillion` | `#FF5C28` | 255,92,40 | 次强调，警示 / 高潮数字 |

### 6.2 Light Mode

| Token | Hex | 用途 |
|---|---|---|
| `bg-canvas` | `#F4F1EA` | 页面底色（暖米白） |
| `bg-surface` | `#FFFFFF` | 卡片 |
| `bg-elevated` | `#FFFFFF` | 弹层 |
| `border-subtle` | `rgba(0,0,0,0.06)` | 弱分割 |
| `border-default` | `rgba(0,0,0,0.10)` | 默认边框 |
| `text-primary` | `#0B0B0D` | 主文字 |
| `text-secondary` | `#5A5A55` | 次文字 |
| `text-tertiary` | `#9A9A95` | 弱文字 |
| `accent-lime` | `#B8E600` | 主强调（加深保证对比度） |
| `accent-vermillion` | `#E0451A` | 次强调 |

### 6.3 颜色使用铁律

1. **lime 全屏出现不超过 3 处**。颜色越省越贵。
2. **lime 永远不用于大面积底色**——只用于 ≤ 12% 屏幕面积的点缀。
3. **正文永远不用强调色**。强调色只用于：光标、关键数字、CTA、hover 反馈。
4. **暗色背景禁止使用纯黑 `#000`**，永远用 `#0B0B0D`。
5. **文字永远不用纯白 `#FFF`**，永远用 `#F2F0EA`（editorial 奶白）。
6. **不引入第三个强调色**。整套配色只有 1 个主色 + 1 个辅色。

### 6.4 透明度阶梯（用于 glass、grain、overlay）

```
opacity-04   0.04   grain texture
opacity-08   0.08   border default
opacity-16   0.16   lime dim / hover glow
opacity-40   0.40   disabled text
opacity-60   0.60   glass surface
opacity-80   0.80   modal overlay
```

---

## 7. Icon 图标系统

### 7.1 风格

- **线性图标（outline）**，单色，1.5px stroke。
- 风格参考：**Lucide / Phosphor Light**，圆角端点（stroke-linecap: round）。
- 禁止使用：彩色 icon、3D icon、emoji。

### 7.2 尺寸阶梯

| Token | px | 用途 |
|---|---|---|
| `icon-xs` | 16 | inline 小图标、tag 内 |
| `icon-sm` | 20 | 按钮 / 输入框内 |
| `icon-md` | 24 | 默认、导航 |
| `icon-lg` | 32 | 特殊强调（极少） |

### 7.3 规格

```
Viewbox:        24 × 24
Stroke width:   1.5px
Corner radius:  2px (icon 内圆角)
Padding:        icon 内部 2px safe area
```

### 7.4 Icon 颜色规则

- 默认继承当前文字颜色 `currentColor`。
- Hover 时 icon 颜色 → `accent-lime`。
- 禁止给 icon 单独着色，除非是功能图标（如 error → vermillion）。

---

## 8. Radius 圆角系统

| Token | 值 | 用途 |
|---|---|---|
| `radius-none` | 0 | 照片、视频、editorial 图片 |
| `radius-xs` | 4px | Tag、Chip、小徽标 |
| `radius-sm` | 8px | Input、小按钮 |
| `radius-md` | 12px | 卡片默认 |
| `radius-lg` | 20px | 大面板、Modal |
| `radius-xl` | 28px | Hero 大卡片、案例卡 |
| `radius-pill` | 999px | 按钮、Chip、Avatar |

### 圆角铁律

- **图片 / 视频永远直角（`radius-none`）**。这是 editorial 质感的关键——影像不该被圆角"软化"。
- **卡片使用 `radius-md` (12px) 或 `radius-lg` (20px)**，根据卡片大小选择，面积越大圆角越大。
- **按钮永远 `radius-pill`**（胶囊形），与卡片的几何圆角形成对比，制造层次。
- **同一视图内不超过 3 种圆角**。

---

## 9. Shadow 阴影系统

### 9.1 Dark Mode（暗色背景下阴影改为"高度感"+ 微光）

| Token | 值 | 用途 |
|---|---|---|
| `elev-1` | `inset 0 1px 0 rgba(255,255,255,0.04)` | 卡片顶部高光线 |
| `elev-2` | `0 8px 24px -8px rgba(0,0,0,0.50)` | 悬浮卡片 |
| `elev-3` | `0 24px 60px -12px rgba(0,0,0,0.70)` | Modal、Popover |
| `elev-4` | `0 40px 120px -24px rgba(0,0,0,0.80)` | Hero 元素 |
| `glow-lime` | `0 0 40px rgba(215,255,58,0.16)` | lime 元素的氛围光 |
| `glow-vermillion` | `0 0 32px rgba(255,92,40,0.20)` | vermillion 元素的氛围光 |

### 9.2 Light Mode

| Token | 值 | 用途 |
|---|---|---|
| `elev-1` | `0 1px 2px rgba(0,0,0,0.04)` | 卡片轻浮起 |
| `elev-2` | `0 8px 24px -8px rgba(0,0,0,0.10)` | 悬浮卡片 |
| `elev-3` | `0 24px 60px -12px rgba(0,0,0,0.16)` | Modal |
| `elev-4` | `0 40px 120px -24px rgba(0,0,0,0.20)` | Hero |

### 阴影铁律

- **暗色模式阴影的黑色透明度永远 ≤ 0.80**，避免"剪贴画"式死黑阴影。
- **永远使用多层阴影**（至少 2 层：近阴影 + 远氛围），制造真实的漫射。
- **阴影偏移永远向下**（y 为正），光线统一从顶部来。
- **禁止彩色阴影**（除 glow 强调光外）。

---

## 10. Glass 玻璃效果

用于：sticky nav、悬浮工具栏、案例详情的浮动信息卡。

### 10.1 Dark Mode Glass

```
background:        rgba(21, 21, 26, 0.60)
backdrop-filter:   blur(24px) saturate(180%)
border:            1px solid rgba(255,255,255,0.08)
border-top:        1px solid rgba(255,255,255,0.14)   （顶部高光）
box-shadow:        elev-2
```

### 10.2 Light Mode Glass

```
background:        rgba(255, 255, 255, 0.70)
backdrop-filter:   blur(24px) saturate(180%)
border:            1px solid rgba(0,0,0,0.06)
box-shadow:        elev-2
```

### Glass 铁律

- **blur 永远是 24px**。低于 16px 像 bug，高于 32px 像塑料。
- **必须加 saturate(180%)**，否则颜色会发灰。
- **必须加顶部 1px 高光边**，模拟玻璃边缘的反光。
- **页面同时存在的 glass 元素不超过 2 个**。它会抢视觉焦点。

---

## 11. Button 按钮系统

### 11.1 变体（Variants）

| Variant | 背景 | 文字 | 边框 | 用途 |
|---|---|---|---|---|
| **Primary** | `accent-lime` | `text-inverse` (深色) | 无 | 主 CTA，每屏 ≤ 1 个 |
| **Secondary** | transparent | `text-primary` | `1px border-default` | 次操作 |
| **Ghost** | transparent | `text-primary` | 无 | 第三操作、关闭 |
| **Mono** | transparent | `mono` 字体 lime 色 | 无 | Index 标签、技术感操作 |

### 11.2 尺寸

| Size | padding-y | padding-x | font | icon | height |
|---|---|---|---|---|---|
| `btn-sm` | 8px | 16px | caption 14px | 16px | 36px |
| `btn-md` | 12px | 20px | body 16px | 20px | 44px |
| `btn-lg` | 16px | 28px | body-l 20px | 20px | 56px |

### 11.3 形态

- 圆角：**全部 `radius-pill`（胶囊）**。
- 字重：500（Geist）/ 500（Mono）。
- 字距：默认 0，Mono 变体 +0.04em。

### 11.4 状态

| 状态 | 变化 |
|---|---|
| **Default** | 如上 |
| **Hover** | 见 §12；Primary 加 `glow-lime` 阴影 |
| **Active** | scale(0.97)，阴影消失 |
| **Focus** | 2px lime outline，offset 2px（无障碍） |
| **Disabled** | opacity 0.40，cursor not-allowed |
| **Loading** | 文字替换为 16px 旋转 ring（lime） |

### 11.5 Button 铁律

- **每屏 Primary 按钮只有 1 个**。它是该屏的视觉锚点。
- **永远 icon + text 组合，不裸 icon**（除导航外）。
- **Mono 变体仅用于 Index、Dashboard 等技术感场景**——它是最有识别度的细节。

---

## 12. Hover 悬停规范

### 12.1 全局 Hover 原则

| 元素类型 | Hover 行为 | 时长 |
|---|---|---|
| **Link / Text** | 下划线从左到右"刷过"（lime 色） | 240ms |
| **Button Primary** | 加 `glow-lime` 阴影 + scale(1.02) | 200ms |
| **Button Secondary / Ghost** | 背景填充 `bg-elevated` + 边框 → `border-strong` | 200ms |
| **Card** | 边框 → lime，轻微 elevate (translateY -4px)，阴影 elev-2 → elev-3 | 280ms |
| **Index Cell** | 从网格浮起，scale(1.04)，z-index 提升，显示 slogan | 320ms |
| **Image** | 内部图片 scale(1.04)，外框不变 | 600ms |
| **Icon Button** | 背景 → lime dim，icon → lime | 160ms |

### 12.2 自定义光标（贯穿全站的签名细节）

```
默认态:    8px lime 实心圆点（精确点）
悬停可交互: 圆点消失，32px 透明环（带 1px lime 边）放大
悬停文字:   48px 透明环（更柔）
按下:      环缩到 24px，lime 实心
```

光标永远使用 `mix-blend-mode: difference`，在任意背景下都可见。

### 12.3 Magnetic Hover（按钮 / 主链接）

- 元素被光标"吸引"，最大偏移 12px。
- 偏移方向 = 光标位置到元素中心的向量 × 0.2。
- 回弹用 ease-out-expo，时长 480ms。

---

## 13. Animation 动画规范

### 13.1 Easing 曲线（永不使用 linear / bounce）

| Token | cubic-bezier | 用途 |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | **主用**，90% 场景 |
| `ease-out-quart` | `cubic-bezier(0.22, 1, 0.36, 1)` | 次用，状态切换 |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 双向过渡 |
| `ease-emphasis` | `cubic-bezier(0.7, 0, 0.15, 1)` | Hero 大字、长入场 |

### 13.2 Duration 阶梯

| Token | 时长 | 用途 |
|---|---|---|
| `dur-instant` | 80ms | 颜色变化、光标响应 |
| `dur-micro` | 120ms | hover、tap 反馈 |
| `dur-fast` | 200ms | 小元素显隐、状态切换 |
| `dur-base` | 320ms | **默认**，组件过渡 |
| `dur-slow` | 480ms | 章节内过渡 |
| `dur-cinematic` | 800ms | 章节转场、share transition |
| `dur-hero` | 1200ms | Hero 字揭示、Preloader |

### 13.3 标准入场动画

**文字 Mask Reveal**（从下方推出，永不淡入）：
```
初始:   transform: translateY(110%); opacity: 0
结束:   transform: translateY(0);    opacity: 1
曲线:   ease-out-expo
时长:   800ms
stagger: 子元素错峰 60ms
```

**图片 Clip Reveal**（从一边拉开）：
```
初始:   clip-path: inset(0 100% 0 0)
结束:   clip-path: inset(0 0 0 0)
曲线:   ease-emphasis
时长:   1000ms
```

**数字 Count Up**：
```
触发:   IntersectionObserver，元素 30% 进入视口
时长:   1600ms
曲线:   ease-out-quart
格式:   每 16ms 更新一次，千分位逗号
```

### 13.4 Scroll 行为

- 全局使用 **Lenis smooth scroll**，lerp = 0.08（比默认更"重"）。
- 视差（Parallax）分 3 层：背景 0.3 / 中景 0.6 / 前景 1.0，速度比恒定。
- 章节锚点跳转：duration 1200ms，ease-out-expo。

### 13.5 Stagger（错峰）规则

- 列表 / 网格入场：每项延迟 **60ms**，最多 8 项后并行。
- 文字行入场：每行延迟 **80ms**。
- 数字 count up：每个数字延迟 **120ms**。

### 13.6 动画铁律

1. **永远不 linear**——linear 是动效的最大耻辱。
2. **永远不 bounce**——除非刻意强调物理感（极少）。
3. **元素入场必带位移**（translateY 8-16px），纯 opacity 淡入禁止。
4. **离开动画时长 = 进入时长的 0.6**——离开要比进入快。
5. **同屏同时运行的动画 ≤ 5 个**——超过会让浏览器掉帧且视觉混乱。

---

## 14. Image 图片比例

### 14.1 标准比例库

| Token | 比例 | 用途 |
|---|---|---|
| `ratio-cinematic` | 21:9 | Hero 背景、章节横幅 |
| `ratio-standard` | 16:9 | 案例 cover、视频封面 |
| `ratio-editorial` | 3:2 | 案例内文配图、editorial |
| `ratio-classic` | 4:3 | 产品截图、UI 展示 |
| `ratio-square` | 1:1 | Avatar、缩略图、Icon 占位 |
| `ratio-portrait` | 3:4 | 人物照、移动端竖屏混合 |
| `ratio-mobile` | 9:16 | 手机截图、移动端 UI |

### 14.2 使用规则

- **同一案例内最多 2 种比例**，避免视觉碎片化。
- **Hero 永远 21:9 或满屏**，制造电影感。
- **案例封面统一 16:9**，保证 Index 矩阵的网格整齐。
- **手机截图永远 9:16**，且带设备外框（device frame）。

### 14.3 处理规范

```
格式:    WebP / AVIF（照片），SVG（图形、icon）
质量:    ≥ 80（WebP）
尺寸:    1x / 2x / 3x 三套，srcset 提供
最大:    单图 ≤ 200KB（移动端）/ 400KB（桌面端）
filter:  暗色模式下所有照片叠加 opacity-04 grain
```

---

## 15. Video 视频比例

### 15.1 标准比例

| Token | 比例 | 用途 |
|---|---|---|
| `video-hero` | 21:9 | Hero 背景视频（自动循环） |
| `video-standard` | 16:9 | 案例原型演示 |
| `video-square` | 1:1 | UI 细节 loop（极短） |
| `video-mobile` | 9:16 | 移动端原型 |

### 15.2 播放规范

- **永远 muted + autoplay + loop**——作品集的视频不该要求用户点击。
- **永远不显示原生 controls**——自定义控件在 hover 时浮现。
- **首帧海报图（poster）必须独立设计**——不能是视频第一帧截图。
- **视频时长 ≤ 15 秒**（loop 不可见接缝）。
- **文件大小 ≤ 2MB（移动）/ 5MB（桌面）**。

### 15.3 格式

```
优先:    WebM (VP9) — 体积小、质量好
备选:    MP4 (H.264) — 兼容性
禁用:    GIF — 体积过大、色彩差
```

---

## 16. Whitespace 留白规范

留白是这套设计系统的**主角之一**。它不是"空"，是"呼吸"。

### 16.1 章节垂直留白（Section Padding）

| 章节类型 | 桌面 (上下) | 移动 (上下) |
|---|---|---|
| Hero / 高潮章节 | 192px | 96px |
| 普通章节 | 128px | 64px |
| 过渡小节 | 64px | 32px |
| Footer / Colophon | 96px | 48px |

### 16.2 章节内层级留白

```
章节标题 → 正文:       48px (space-7)
段落与段落之间:         32px (space-6)
标题与其描述:           16px (space-4)
正文与下一子组件:       48px (space-7)
```

### 16.3 水平留白（阅读宽度）

| 内容类型 | max-width | 理由 |
|---|---|---|
| Hero 大字 | 不限（bleed） | 制造压迫感 |
| 章节标题 | 1320px (container) | 与网格对齐 |
| 正文长读 | 860px | 最佳阅读行宽（约 65 字符） |
| Manifesto 宣言 | 1200px | 让大字有施展空间 |
| Caption / 注解 | 480px | 窄，制造"边注"感 |

### 16.4 留白铁律

- **留白比内容更贵**——宁可砍内容，不可压缩留白。
- **章节之间的留白必须大于章节内的留白**——这是节奏感的来源。
- **重要元素的留白 = 该元素高度的 0.5～1.0 倍**——视觉重心。
- **永远不为"填满屏幕"而牺牲留白**。

---

## 17. Breakpoint 响应式断点

```
mobile:     ≤ 767px        (默认 mobile-first)
tablet:     768px – 1279px
desktop:    1280px – 1919px
wide:       ≥ 1920px       （容器仍 max 1440，居中）
```

| 行为 | mobile | tablet | desktop |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| display-xl | 56px | 96px | 128px |
| Section padding-y | 64px | 96px | 128px |
| 自定义光标 | 关闭（用系统） | 开启 | 开启 |
| Parallax | 关闭 | 开启 | 开启 |
| 3D 相机运动 | 改为 device tilt | 开启 | 开启 |
| Index 矩阵 | 纵向列表 | 4 列 | 6/12 列 |
| Smooth scroll | 关闭（原生） | 开启 | 开启 |

---

## 18. Do & Don't 总则

### Do ✓

- 所有数值是 4 的倍数
- Display 字体用 PP Editorial New，字重 400
- 文字用 mask reveal，不用淡入
- 图片用直角，按钮用胶囊
- lime 全屏 ≤ 3 处
- 每屏 Primary 按钮只有 1 个
- 留白优先于内容
- 自定义光标 + magnetic hover

### Don't ✗

- 出现 13px / 17px / 22px 等"野值"
- 用 Inter 做标题
- 用纯黑 `#000` 或纯白 `#FFF`
- 用 linear 或 bounce 缓动
- 给图片加圆角
- 用 emoji 或彩色 icon
- 一屏出现 2 个 Primary 按钮
- 用 GIF 展示动效

---

## 附录：Token 命名约定

所有 token 遵循 `category-variant-size` 三段式：

```
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

这套命名直接映射 CSS 变量 / Tailwind config / Figma Variables，三端同步。

---

> **这份文档不是约束，是契约。**
> 它存在的意义不是限制创意，而是确保每一个落地的像素，都对得起"Make to Think"这个母题。
> 当你犹豫一个决策时，回到这份文档。当文档与你直觉冲突时，相信直觉，然后更新文档。
>
> — Design System v1.0
