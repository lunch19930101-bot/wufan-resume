# Product — 创意方案

> "Make to Think" 作品集网站创意方案 v1.0
> 制定日期：2026-06-29

---

## 设计判断

参考的两份作品集（youthce.github.io / atom63.io）本质上仍是"作品罗列 + 个人故事"的旧范式。
真正能拿 Awwwards / FWA 的作品集，必须做到更狠的一件事：

> **作品集本身，就是你最重要的一件作品。**
> 访客还没看到你的项目，就已经被你的设计能力击中。

---

## ① 整体设计理念

### 母题：Make to Think

设计师的本质不是"产出界面"，而是"**通过制作来思考**"。
这个网站不展示你做了什么，而是让访客亲历你如何思考。
每一次滚动、每一次悬停、每一次过渡，本身都是一次设计决策的演示。

### 三个反常识取舍

| 常规作品集 | 本方案 |
|---|---|
| 网站是容器，作品是主角 | 网站本身就是作品，项目案例是它的章节 |
| 介绍自己（About me） | 让思考过程替你说话 |
| 按"项目 1 / 项目 2"罗列 | 多维索引矩阵，按色彩 / 年份 / 行业 / 角色切片 |

### 三层价值锚点（对应两类读者）

- **HR 的 30 秒**：Hero 的视觉冲击 + editorial 气质 + 一个记忆色 → 形成"这个人不一样"的直觉
- **设计负责人的 3 分钟**：决策日志 + 画面演化 + 过程图谱，展示系统性思考与 craft
- **同行的 10 分钟**：colophon、grain texture、自定义光标、字体组合，看到偏执级别的细节

---

## ② 网站故事线

整个网站是一段单线程的滚动叙事，像导演剪辑版的自我介绍：

```
悬念 → 宣言 → 索引 → 深潜① → 过程 → 深潜② → 仪表盘 → 印证 → 邀请 → 署名
 0:00   0:05   0:15    0:30   1:30   2:00    2:30    2:45   3:00   3:15
```

**核心叙事张力**：从「一个像素的微观」开始 → 放大到「一个系统」→ 最终汇聚到「一个人」。
这是 Apple keynote 式的叙事结构。

---

## ③ 页面结构

单页长滚动 + 几个"纵深入口"（点开后是 sub-page，但同域 hash route 实现，不刷新）。

```
00  Preloader            加载页（1.5s，像 Figma 启动）
01  Hero                 开场帧
02  Manifesto            一句宣言
03  The Index            作品索引矩阵 ★ 核心创新
04  Case Deep-Dive #1    旗舰案例 ①（决策日志 + 画面演化）
05  Process Atlas        过程图谱
06  Case Deep-Dive #2    旗舰案例 ②（3D 空间相机运动）
07  The Dashboard        实时仪表盘
08  Recognition          引用与认可
09  The Invitation       邀请（联系）
10  Colophon             署名页
```

**结构上的反常识**：没有 "About me"、没有 "Skills 进度条"、没有 "Testimonials 三连卡"。这三样是作品集的三大俗套，全部砍掉。

---

## ④ 每一屏展示什么

### 00 / Preloader（1.5 秒）
全屏纯色 + 一行 mono 文字流（像 Figma cursor log / Vercel 部署日志）：
`compiling craft…` → `loading 6 case studies…` → `calibrating 60fps…` → `welcome.`
结束时画面"撕开"一道缝，露出 Hero——不是淡入。

### 01 / Hero（开场帧）
- 视觉中心：超大 display serif 字 `Make to Think`，占屏幕 60% 高
- 文字在 **rendering**——像 Figma 打开一个文件，字形从低分辨率逐帧锐化
- 右下角：mono 字幕 `scroll to enter · 2026`
- 背景：纯色 + film grain
- 鼠标移动：文字有极轻微 parallax（max 8px），像有重量
- 一个极小的 lime 色光点跟随光标

### 02 / Manifesto（宣言）
整屏只有一句话，逐字 mask-reveal（从下方推出）：
> **「I don't design screens. I design decisions.」**

右侧用细线引出 editorial 注解（mono 字体）。

### 03 / The Index（作品索引矩阵）★
- 全屏一张多维索引表：每个作品是一个 cell，整齐排列成网格
- 顶部一排筛选维度：`By Year` · `By Industry` · `By Role` · `By Color` · `By Type`
- 点击维度，cell 会重新排列（FLIP 动画）
- Hover → cell 浮起，显示 slogan + 年份 + 客户
- 点击 → 进入案例深潜
- **这是整个网站的设计含量峰值**——把"作品集"重新定义成"一次信息设计"

### 04 / Case Deep-Dive #1（旗舰案例 ①）
左右分栏叙事：
- 左 1/3：决策日志（mono，像 git log）：`day 03 — killed the hero image, trust the whitespace`
- 右 2/3：同步演化的设计画面（wireframe → mockup → final）
- 滚动时左侧决策逐条 high light，右侧画面同步切换

### 05 / Process Atlas（过程图谱）
横向时间线，把一个真实项目的 6 阶段压缩成可滚动动画：
`Brief → Research → Sketch → Wireframe → Prototype → Ship`
每阶段一个 artifact（草稿照、白板照、Figma 截图、原型 GIF）。
顶部实时数字：`47 sketches · 12 prototypes · 3 rejections · 1 ship`

### 06 / Case Deep-Dive #2（旗舰案例 ②）
完全不同的语法。全屏 3D 产品 mockup，滚动时**相机在 3D 空间里运动**（绕产品旋转、推进、穿过界面），像 Apple 产品页。

### 07 / The Dashboard（仪表盘）
Linear / Vercel 风格 dashboard：`screens designed: 1,247` / `products shipped: 9` / `years of craft: 8`
数字在视野内 count up。

### 08 / Recognition（印证）
极克制：最多 2 条引用 + 1 行媒体 logo（灰度）。引用用 display serif 大字呈现，editorial 感。不做"avatar + 五星"的俗套。

### 09 / The Invitation（邀请）
整屏一句话：`Let's make something that matters.`
邮箱是超大字，hover 时字被 lime 色"刷过"。一个 calendar 链接。

### 10 / Colophon（署名）
像书的版权页：`Set in PP Editorial New & Geist. / Built with Next.js, GSAP, Lenis, Three.js. / Designed and coded by [你]. 2026. / No templates were harmed.`
懂的人会会心一笑。

---

## ⑤ 每一屏滚动节奏

| 屏 | 节奏 | 滚动距离 | 体感 |
|---|---|---|---|
| 00 Preloader | — | 0 | 静止 1.5s 后撕裂转场 |
| 01 Hero | 极慢 | 1.5 屏 | 让人停住，记住 |
| 02 Manifesto | 慢 | 1 屏 | 字字落地 |
| 03 Index | 中 | 2 屏 | 探索感，可交互 |
| 04 Deep-Dive ① | 中慢 | 3 屏 | 沉浸阅读 |
| 05 Process | 中 | 2 屏 | 时间线推进感 |
| 06 Deep-Dive ② | 快 | 2 屏 | 相机运动，刺激 |
| 07 Dashboard | 快 | 0.5 屏 | 一闪而过的数据 |
| 08 Recognition | 慢 | 1 屏 | 回到重量 |
| 09 Invitation | 极慢 | 1 屏 | 邀请要留时间 |
| 10 Colophon | — | 0.5 屏 | 安静收尾 |

节奏曲线：**慢-中-慢-中-快-慢** 的呼吸感，避免匀速长滚动的催眠。

---

## ⑥ 配色方案

### Dark Mode（默认）

```
Background       #0B0B0D   非纯黑，带冷灰
Surface          #15151A   卡片、面板
Border           rgba(255,255,255,0.08)
Text Primary     #F2F0EA   奶白（非纯白）
Text Secondary   #8E8E89
Accent Primary   #D7FF3A   electric lime，signature 色
Accent Secondary #FF5C28   vermillion 朱红
```

### Light Mode

```
Background       #F4F1EA   暖米白（纸感）
Surface          #FFFFFF
Text Primary     #0B0B0D
Accent Primary   #B8E600   lime 加深保证对比度
Accent Secondary #E0451A
```

### 为什么是 lime + vermillion

- **electric lime**：工业感、当代欧洲设计语言，在暗底上极跳，是记忆点
- **vermillion**：editorial 印刷感，与 lime 形成"冷热对比"，避免单色单调
- **奶白文字 + 暖灰底**：避免纯黑纯白的塑料感，制造"印刷物"质感

**铁律**：lime 全屏出现 ≤ 3 处。颜色越省越贵。

---

## ⑦ 字体

弃用 Inter——它已泛滥到失去识别度。用一个有性格的三字族组合：

| 角色 | 字体 | 用途 |
|---|---|---|
| Display | **PP Editorial New**（衬线 variable） | Hero 大字、宣言、引用、数字 |
| Body / UI | **Geist** | 正文、按钮、导航 |
| Mono | **Geist Mono** | 决策日志、注解、标签、字幕 |

**为什么这样选**：
- PP Editorial New 有 editorial 杂志级别的高级感，variable 可以做 optical size 动画
- Geist 现代、干净、技术感，中和衬线的"文艺"
- 三角组合：反差大但和谐，每类信息有自己的"声音"

---

## ⑧ 动效语言

### 核心 Easing（永不使用 linear）

```
Primary   cubic-bezier(0.22, 1, 0.36, 1)   ease-out-expo，主用
Secondary cubic-bezier(0.65, 0, 0.35, 1)   in-out，状态切换
Emphasis  cubic-bezier(0.16, 1, 0.3, 1)    极慢出，Hero
```

### 七条动效铁律

1. **永远不 bounce**——除非刻意强调物理感（极少）
2. **永远有重量**——元素进出带轻微 scale（0.98 ↔ 1），模拟惯性
3. **文字用 mask reveal**——从下方幕布推出，永远不淡入
4. **图片用 clip-path 揭示**——从一边像幕布拉开
5. **数字在视野内 count up**——IntersectionObserver 触发
6. **自定义光标**——8px lime 圆点 + 32px 透明环
7. **Magnetic hover**——按钮被光标"吸引"，max 12px 偏移

### 全局氛围层

- **Film grain**：永远覆盖 3% 不透明度的颗粒
- **Smooth scroll**：Lenis，lerp 0.08（比默认更"重"，有物理感）
- **章节转场**：1px lime 线扫过画面，像翻页

---

## ⑨ 页面之间如何过渡

### A. 章节滚动转场
1. 当前章节内容向上"幕布收起"（clip-path）
2. 一道 1px lime 线从屏幕底部扫到顶部（700ms）
3. 下一章节内容从下方 mask-reveal
4. 背景色相 ±2% 微调

### B. 案例深潜进/出（Share Transition）
点 Index 的 cell → 该 cell 放大铺满全屏（FLIP，800ms，ease-out-expo）→ 无刷新进入案例。返回时反向播放。iOS 章节切换级别。

### C. Preloader → Hero
Preloader 文字流跑完后，画面从中间**撕开一道缝**（两张色块向两侧拉开），露出 Hero。第一秒就建立"这不是普通网站"的认知。

---

## ⑩ 为什么这样设计

### 对应 HR 的 30 秒
Hero 必须一眼不同。靠四件事叠加：
- editorial serif 大字
- electric lime 记忆色
- film grain 质感
- 文字 rendering 动画

### 对应设计负责人的 3 分钟
- The Index 证明"信息层面的系统思考"
- 决策日志证明"每一个设计选择都有理由"
- Process Atlas 证明"有完整方法论，不靠灵感"

### 对应 Awwwards/FWA 评审标准

| 维度 | 本方案如何命中 |
|---|---|
| Design | editorial 字体 + lime/vermillion + grain，视觉有独立人格 |
| Usability | Index 可切片、smooth scroll、magnetic 反馈 |
| Creativity | 作品索引化、决策日志+画面演化是原创叙事 |
| Technology | GSAP + Lenis + Three.js + shader text reveal |

### 为什么不模仿参考站

- youthce 的局限：标准"项目罗列 + 个人简介"，叙事被动
- atom63 的局限：视觉好，但仍是"作品 gallery + 故事"的旧骨架
- 本方案的突破：把作品集本身做成一件作品，通过 **① 索引化（信息设计）② 过程化（决策可视化）③ editorial 化（印刷品质感）** 三个维度跳出"作品罗列"范式

### 最深的"为什么"

> 因为你卖的不是"我做过的项目"，而是"我做决策的方式"。
> 项目会过时，决策方式不会。
> 这个网站的真正主题，是你这个人的**判断力**。
> 所以连网站本身，都是一次判断力的公开展演。

---

## 附录：母题可衍生表达

- 中文版母题：**造以思之**（用得极少，仅 colophon 等场景作签名）
- 衍生 tagline：
  - `Make to Think.`
  - `I don't design screens. I design decisions.`
  - `The index of one.`
  - `No templates were harmed.`
