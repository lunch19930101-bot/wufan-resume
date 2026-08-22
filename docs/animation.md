# Animation — 动画规范

> 所有动效的"语法规则"。Apple 官网 + Linear 官网完成度。
> **铁律**：永不 linear / 永不 bounce / 元素入场必带位移。

---

## 1. Easing 曲线（Token 化）

| Token | cubic-bezier | 用途 |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | **主用**，90% 场景 |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | 状态切换、hover |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 双向过渡 |
| `ease-emphasis` | `cubic-bezier(0.7, 0, 0.15, 1)` | Hero 大字、长入场 |

**禁用**：`linear`、`ease`、`ease-in`、`bounce`、`elastic`（除非刻意，需 review）。

---

## 2. Duration 阶梯

| Token | 时长 | 用途 |
|---|---|---|
| `dur-instant` | 80ms | 颜色变化、光标响应 |
| `dur-micro` | 120ms | hover、tap |
| `dur-fast` | 200ms | 小元素显隐 |
| `dur-base` | 320ms | **默认**，组件过渡 |
| `dur-slow` | 480ms | 章节内过渡 |
| `dur-cinematic` | 800ms | 章节转场、share transition |
| `dur-hero` | 1200ms | Hero 字揭示、Preloader |

**规则**：离开时长 = 进入时长 × 0.6。

---

## 3. 通用入场模式（Reveal Patterns）

### 3.1 文字 Mask Reveal（默认，永不淡入）

```
初始:    transform: translateY(110%)
结束:    transform: translateY(0)
曲线:    ease-out-expo
时长:    800ms
stagger: 行间 80ms / 列项 60ms
overflow: hidden（外层做遮罩）
```

### 3.2 图片 Clip Reveal

```
初始:    clip-path: inset(0 100% 0 0)   /* 从右往左揭示 */
结束:    clip-path: inset(0 0 0 0)
曲线:    ease-emphasis
时长:    1000ms
```

**方向规则**：根据图片在屏幕的位置选边——左图从右揭、右图从左揭、上图从下揭、下图从上揭。

### 3.3 数字 Count Up

```
触发:    IntersectionObserver（30% in view）
时长:    1600ms
曲线:    ease-out-quart
更新:    每 16ms（60fps）
格式:    千分位逗号
```

### 3.4 Scale + Fade（次要元素）

```
初始:    transform: scale(0.96); opacity: 0
结束:    transform: scale(1);    opacity: 1
曲线:    ease-out-expo
时长:    600ms
```

### 3.5 字 Rendering（Hero 专用）

主字 `Make to Think` 的"渲染"效果：
- 多层文字叠加：1 层低分辨率模糊 + 1 层清晰
- 模糊层 opacity 1→0，清晰层 opacity 0→1
- 同步 scale 1.04→1.0
- 时长 1200ms，ease-emphasis

---

## 4. 通用出场模式（Exit Patterns）

### 4.1 Parallax Fade（默认）
元素随滚动向上离开视口时：
- 元素本身 translateY 跟随滚动（视差 0.5–0.8×）
- opacity 在视口上 30% 区域渐变到 0.3（不全隐）

### 4.2 Scale Down
- transform: scale(0.95) + opacity 0
- 时长 = 进入时长 × 0.6
- ease-out-quart

### 4.3 Clip Close（图片专用）
- clip-path: inset(0 0 0 0) → inset(0 0 100% 0)
- 从下往上"擦掉"

---

## 5. Stagger（错峰）规则

| 场景 | 每项延迟 | 最大并行 |
|---|---|---|
| 列表 / 网格 | 60ms | 8 项后并行 |
| 文字行 | 80ms | 全部 |
| 数字 | 120ms | 全部 |
| Filter 重排 | 40ms | 全部 |

**铁律**：同屏同时运行的动画 ≤ 5 个。

---

## 6. Scroll-Scrubbed 动画

用于：Hero 视差、Process 决策日志、Case Cover Ken Burns。

### 通用配置

```js
// 配置示意（非实际代码）
gsap.to(target, {
  scrollTrigger: {
    trigger: el,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,            // 1 秒滞后，丝滑
    pin: false           // 视差不 pin
  }
})
```

### Process 章节专用

```
pin:            true
start:          'top top'
end:            '+=N00%'   // N = 决策项数 × 100
scrub:          1
anticipatePin:  1
```

---

## 7. 章节过渡（Section Transitions）

章节之间触发"视觉呼吸"：

1. 当前章节内容 clip-path 收起（幕布感）
2. **1px lime 线从底部扫到顶部**（700ms，ease-out-expo）
3. 下一章节内容从下方 mask reveal
4. 背景色相 ±2% 微调（几乎察觉不到，但大脑会"换景"）

---

## 8. 各 Section 入场 / 出场规范

> 每节按「入场触发点 / 入场动画 / 出场动画」标注。
> Section 编号对应 ui-spec.md。

### Home

#### H-01 Hero
- **入场**：Preloader 结束后，主字 `Make to Think` 用**字 rendering 动画**（1200ms，ease-emphasis）。字幕后浮 800ms。
- **出场**：滚动后，主字 translateY up 速度 0.5×（视差），opacity → 0.3，scale 0.98。scroll ↓ 提示先消失。

#### H-02 Manifesto
- **入场**：进入视口 70% 时，每个词 stagger 80ms mask reveal。
- **出场**：滚动到上 30% 时，opacity → 0.4，不位移（保持位置感）。

#### H-03 Featured Work
- **入场**：标题 mask reveal → 卡片 stagger（左卡 0ms / 右卡 120ms）clip reveal（从下往上揭）。
- **出场**：两张图视差 0.6× / 0.8×（不同速制造层次）。

#### H-04 Index Preview
- **入场**：标题 + chips reveal → 12 个 cell 按**行** stagger（行间 120ms，行内 60ms）scale + fade。
- **出场**：cell 略微 translateX（按列索引 ±4px）+ opacity 0.5，制造"散开"感。

#### H-05 CTA Strip
- **入场**：标题 mask reveal + 按钮 scale + fade，标题完成后按钮跟 200ms。
- **出场**：简单 fade。

### About

#### A-01 About Hero
- **入场**：portrait 从左 clip reveal（inset 右→左），右侧文字 mask reveal stagger。
- **出场**：portrait scale 0.98 + 视差 0.7×，文字 fade。

#### A-02 Belief
- **入场**：标题 mask reveal → 段落 stagger 120ms fade。
- **出场**：每段进入视口上 30% 时 opacity → 0.5（连续阅读感）。

#### A-03 Trajectory
- **入场**：scroll-scrubbed——连接线随滚动"绘制"（stroke-dashoffset 动画），节点 ● 按进入视口顺序 light up（scale 0→1 + lime 色）。
- **出场**：当前节点离开视口时颜色稍暗，连线保留。

#### A-04 Dashboard
- **入场**：数字 count up + lime glow 出现。4 个数字 stagger 120ms。
- **出场**：fade。

#### A-05 Toolbox & Recognition
- **入场**：**双向 clip reveal**——左栏从左揭、右栏从右揭，同步 1000ms。
- **出场**：双向 fade。

### Projects

#### P-01 Projects Hero
- **入场**：主字 mask reveal，副字跟进 200ms。
- **出场**：视差 fade。

#### P-02 Filter Bar
- **入场**：chips stagger 60ms scale + fade。
- **Sticky 切换**：滚动到 sticky 位置时切换为 glass 背景（200ms）。

#### P-03 Project Grid
- **入场**：cells 按**行** stagger（行间 100ms，行内 50ms）scale + fade。
- **Filter 切换**：FLIP 动画（见 interaction.md §4.2）。
- **出场**：cells 散开视差。

### Case Study

#### C-01 Case Hero
- **入场**：通过 share transition 进入——前一个 Index cell 放大到 Cover 位置。Case 文字 mask reveal 跟进。
- **出场**：Cover 接管视觉。

#### C-02 Cover
- **入场**：clip reveal 从上到下（inset 下→上），完成后 Ken Burns 启动：scale 1→1.06，8s infinite alternate。
- **出场**：滚动时图片继续 scale up（1.06→1.12），暗角加深，营造"穿过去"感。

#### C-03 Brief
- **入场**：标签 fade + 正文 mask reveal（按段 stagger 120ms）。
- **出场**：每段 fade（连续阅读）。

#### C-04 Process（核心）
- **入场**：章节进入后 pin，左侧决策日志首项 active，右侧首帧出现。
- **滚动中**：scrub 驱动，左 log 项逐条 active（lime 文字 + 2px lime 标记线扫入），右侧画面同步换帧（crossfade 200ms）。
- **出场**：决策末项 active 后，章节 unpin，整体 fade。

#### C-05 Gallery
- **入场**：每张图进入视口 60% 时 clip reveal（方向交替）。
- **出场**：每张图视差（速度按位置不同，0.5/0.7/0.9）。

#### C-06 Outcomes
- **入场**：3 个数字 count up + lime glow，stagger 120ms。
- **出场**：fade。

#### C-07 Next Case
- **入场**：标题从右滑入（translateX 40→0），dur-slow，ease-emphasis。
- **出场**：点击触发 share transition 到下一案例。

### Resume

#### R-01 Resume Hero
- **入场**：名字 mask reveal + PDF 按钮 scale + fade。
- **出场**：fade。

#### R-02 Resume Body
- **入场**：左栏条目 stagger 80ms reveal，右栏跟进 200ms。
- **出场**：连续阅读 fade。

### Contact

#### CT-01 Contact
- **入场**：标题分两行 mask reveal（行间 200ms），email scale + fade，按钮 + socials stagger。
- **背景**：底部中心一个 lime 径向 glow，scroll 时微微移动（10s 循环）。
- **出场**：路由跳转时，标题 scale up 到 1.1 + opacity 0（"爆开"感），dur-cinematic。

### Footer

#### F-01 Footer
- **入场**：brand + nav fade，3 列 meta stagger 120ms，状态点 ● pulse 启动。
- **出场**：footer 是页面结尾，不出场。

---

## 9. Preloader 完整规格

```
0.0s   黑屏
0.1s   mono 文字流第 1 行出现: "compiling craft…"
0.4s   第 2 行: "loading 6 case studies…"
0.7s   第 3 行: "calibrating 60fps…"
1.1s   第 4 行: "ready."  (lime 色)
1.3s   画面从中间横向撕开（两张色块向左右拉开，500ms）
1.5s   露出 Hero，Preloader 元素全清
```

文字流位置：**左下角**，mono-micro 12px，左对齐。

---

## 10. 自定义光标动画

参见 interaction.md §1。状态切换：
- 圆点 ↔ 环：dur-micro (120ms)，ease-out-quart
- 大小变化：scale transition
- 跟随：lerp 0.18，60fps

---

## 11. Continuous（常驻）动画

| 元素 | 动画 |
|---|---|
| Film grain | 0.04 opacity，每帧 noise 重新生成（或 sprite 切换 8 帧） |
| Status dot（Footer） | pulse，scale 1→1.3→1，2s infinite，lime |
| Cover Ken Burns | scale 1→1.06，8s alternate infinite |
| Background glow（Contact） | 径向 glow 位置缓慢偏移，10s 循环 |
| Lime accent dot（光标） | 永远跟随 |
| Logo（Nav 左上） | hover 时 scale 1.05 + 旋转 2°，瞬时 |

---

## 12. 性能预算

| 指标 | 目标 |
|---|---|
| 60fps | 所有动画 |
| LCP | < 2.5s |
| 总 JS（gzip） | < 200KB |
| 单图 | < 200KB（mobile）/ 400KB（desktop） |
| 同时动画 | ≤ 5 |
| 动画属性 | 只用 `transform` / `opacity` |

### 实现要点
- 只动画 `transform` 和 `opacity`（绝不动画 width/height/top/left）
- 用 `will-change` 提示，用完即清
- ScrollTrigger pin 时给 `anticipatePin: 1`
- 大图用 `loading="lazy"` + IntersectionObserver
- 视频用 `preload="metadata"`
- Three.js 场景在视口外暂停 (`isVisible` 检测)

---

## 13. Reduced Motion 处理

### CSS 层
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

### JS 层
```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion) {
  // 关闭 Lenis smooth scroll（用原生）
  // 关闭 ScrollTrigger scrub / pin
  // 关闭 magnetic / parallax
  // 数字直接显示最终值
  // 入场动画改为简单 fade
  // 关闭 grain 动 / Ken Burns / glow 偏移
}
```

---

## 14. 动效禁忌（Don't）

| ✗ 不要 | 理由 |
|---|---|
| linear 缓动 | 没有物理感 |
| bounce / elastic | 廉价感（除非刻意） |
| 纯 opacity 淡入 | 没有方向感，永远配位移 |
| 动画 width/height/top/left | 触发 layout，掉帧 |
| 同屏 > 5 动画 | 视觉混乱 + 掉帧 |
| 自动播放视频有声音 | 突兀 |
| 入场时长 > 1500ms | 太慢，用户离开 |
| 持续闪烁 / 抖动 | 干扰阅读 |
