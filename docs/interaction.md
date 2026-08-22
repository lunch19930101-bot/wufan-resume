# Interaction — 交互规范

> 基于 design-system.md 与 ui-spec.md，定义所有交互行为。
> 目标：每一次交互都有反馈，每一次反馈都有重量。

---

## 1. 自定义光标（Custom Cursor）

贯穿全站的签名细节。**触屏设备关闭**，使用系统光标。

### 1.1 状态机

| 状态 | 触发 | 视觉 |
|---|---|---|
| default | 默认 | 8px lime 实心圆点 |
| hover-text | 悬停纯文字 | 48px 透明环（1px lime 边） |
| hover-link | 悬停链接 | 32px 透明环 |
| hover-button | 悬停按钮 | 32px 环 + lime 半透明填充 |
| press | 按下 | 环缩到 24px + lime 实心 |
| drag | 拖拽 | 24px 实心 + 抓手 icon |
| hidden | 离开窗口 | opacity 0 |

### 1.2 实现要点

- `mix-blend-mode: difference`——在任意背景下可见
- 跟随：requestAnimationFrame + lerp **0.18** 平滑
- 状态切换：dur-micro (120ms)，ease-out-quart
- `cursor: none` 隐藏系统光标（仅 pointer: fine 设备）
- 触屏检测：`@media (pointer: coarse)` 关闭整套

---

## 2. 通用 Hover 规范

### 2.1 元素行为表

| 元素 | Hover 行为 | 时长 | Easing |
|---|---|---|---|
| Link / Text | 下划线从左到右刷过（lime） | 240ms | ease-out-quart |
| Button Primary | + glow-lime 阴影 + scale(1.02) | 200ms | ease-out-expo |
| Button Secondary | 背景 → bg-elevated + 边框 → border-strong | 200ms | ease-out-quart |
| Button Ghost | 背景 → bg-elevated（极淡） | 160ms | ease-out-quart |
| Button Mono | 文字 → lime + 字距 +0.02em | 160ms | ease-out-quart |
| Card | 边框 → lime + translateY(-4px) + elev-2 → elev-3 | 280ms | ease-out-expo |
| Index Cell | scale(1.04) + slogan 浮层 + lime 边框 + z 提升 | 320ms | ease-out-expo |
| Image | 内部图片 scale(1.04)，外框不变 | 600ms | ease-out-quart |
| Icon Button | 背景 → lime-dim + icon → lime | 160ms | ease-out-quart |

### 2.2 Magnetic Hover（磁吸）

应用于：Primary 按钮、主 CTA 链接、Next Case 文字、Nav 上的 Contact。

- 元素被光标"吸引"，最大偏移 **12px**
- 偏移向量 = `(光标位置 − 元素中心) × 0.20`
- 回弹：dur-slow (480ms)，ease-out-expo
- 触屏关闭

---

## 3. 滚动行为

### 3.1 Smooth Scroll

- 库：**Lenis**
- lerp：**0.08**（比默认更"重"，有物理感）
- 锚点跳转：dur-cinematic (1200ms)，ease-out-expo
- 与 GSAP 同步：`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(time => lenis.raf(time*1000))`

### 3.2 视差（Parallax）

三层视差，速度比恒定：

| 层 | 速度 | 元素 |
|---|---|---|
| 背景 | 0.3× | 大图、grain、glow |
| 中景 | 0.6× | 卡片、插画 |
| 前景 | 1.0× | 文字、UI |

**触屏关闭**视差。

### 3.3 Scroll-Snap

**不使用**。作品集追求连贯叙事，scroll-snap 会打断叙事节奏。

---

## 4. 关键交互模块

### 4.1 Sticky Nav 滚动响应

| 滚动位置 | Nav 状态 |
|---|---|
| 0 (Hero 内) | 透明背景，仅文字 |
| > 100vh | glass 背景（blur 24px）+ 底部 1px border |
| 滚动方向向上 | 显示 |
| 滚动方向向下 | 隐藏（translateY -100%） |

状态切换：dur-fast (200ms)，ease-out-quart。

### 4.2 Filter Bar（Projects 页）

#### Chips 行为
- 默认：radius-pill，bg 透明，border-subtle
- Hover：border → lime
- Active：bg → lime-dim，文字 → lime
- 切换：dur-micro (120ms)

#### 筛选变化时（FLIP）
1. **第一阶段（200ms）**：未选中项 fade out + scale 0.95
2. **第二阶段（320ms）**：剩余项 FLIP 移动到新位置
3. **第三阶段（200ms）**：新匹配项 fade in + scale 1
- 全程 ease-out-expo

#### 排序
- 自定义下拉菜单（不用原生 select）
- 排序维度：Recent / Oldest / A–Z

### 4.3 Process 决策日志（Scroll-Pinned）

Case Study 的 Process 章节是**滚动钉扎 + 同步演化**：

- 章节进入视口后 **pin**，时长 = 决策项数 × 100vh
- 滚动驱动：
  - 左侧决策日志：当前条目 active（lime 文字 + 左侧 2px lime 标记线）
  - 右侧视觉：随滚动条目同步换帧（wireframe → mockup → final）
- 滚动进度 0–100% 映射到决策条目 0–N
- `scrub: 1`（与滚动 1:1 绑定，可反向）
- 章节结束 → unpin → 恢复正常滚动
- 触屏：取消 pin，改为正常滚动 + IntersectionObserver 高亮

### 4.4 Index Cell → Case Study（Share Transition）

- 点击 cell 触发 FLIP：
  - **First**：记录 cell 的 rect
  - **Last**：cell 放大至全屏（cover 21:9 区域）
  - **Invert + Play**：dur-cinematic (800ms)，ease-out-expo
- 切换路由到 Case Study 页
- 进入后 Case Hero 的 Cover 大图接管该位置（无缝接续）
- 返回时反向播放

### 4.5 Number Count Up

应用于：Dashboard、Outcomes、About 数字。

- 触发：IntersectionObserver，元素 30% 进入视口
- 时长：1600ms
- Easing：ease-out-quart
- 格式：每 16ms 更新一次，千分位逗号
- 多个数字 stagger 120ms
- 触屏 / reduced-motion：直接显示最终值

### 4.6 Back to Top（Footer）

- 点击 → Lenis 平滑滚回顶部（1200ms）
- Hover：箭头 icon 向上平移 -4px + lime
- Magnetic

---

## 5. 表单与输入

**设计原则：不使用表单。**

Contact 页直接给邮箱 + Calendar link：
- 邮箱：`mailto:` 链接
- Calendar：外链 Calendly / Cal.com

理由：表单是作品集转化率最低的方式。直接给邮箱更人性。

---

## 6. 焦点与可访问性

### 6.1 键盘焦点
- 所有交互元素必须可 Tab 到达
- Focus 样式：2px lime outline，offset 2px
- 使用 `:focus-visible` 区分鼠标与键盘
- 提供 "Skip to content" 链接（Tab 第一个焦点）

### 6.2 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* 关闭：视差、scrub、magnetic、cursor 跟随、grain 动 */
  /* 保留：颜色 hover、focus 样式 */
  /* 入场动效：直接显示，dur 缩短到 1ms */
}
```

### 6.3 触屏适配
- `@media (pointer: coarse)` 检测
- **关闭**：自定义光标、magnetic、视差、scrub 动画
- **保留**：tap 反馈、长按、滑动
- Tap 反馈：scale(0.97) + lime flash，120ms

---

## 7. 页面过渡（Route Transitions）

### 7.1 进入页面
- Preloader 风格的 mini-loading：3 行 mono 文字流，800ms
- 或：当前页 fade + 下一页 mask reveal

### 7.2 离开页面
- 当前页内容 translateY(-20px) + opacity 0
- 时长 dur-slow (480ms)

### 7.3 Home 内部锚点跳转
- 不刷新页面
- `lenis.scrollTo(target, { duration: 1.2 })`

---

## 8. 微交互细节（craft 党会注意到）

| 细节 | 行为 |
|---|---|
| 链接外部 | 自动加 ↗ icon |
| 邮箱链接 | hover 时显示 "copy" icon |
| 时间戳 | 相对时间（"2 days ago"） |
| 复制成功 | toast 右下角，2s 自动消失 |
| 404 页 | 自定义，lime 大字 "404"，配 "lost in the index" 文案 |
| 加载 | skeleton 用 grain + lime pulse，不用 spinner |
| 空状态 | 不存在（作品集永远有内容） |
| Selection | 文字选中色：lime-dim 背景 + 深色文字 |
| 视口外暂停 | 视频 / Three.js 场景不在视口时暂停 |

---

## 9. 交互禁忌（Don't）

| ✗ 不要 | 理由 |
|---|---|
| 用原生 `cursor` | 全站自定义光标，原生会冲突 |
| 用原生 `<select>` | 与设计系统不协调 |
| 用 `alert / confirm` | 用自定义 modal / toast |
| 用骨架屏 spinner | 用 grain + lime pulse |
| 表单字段 | 不用表单 |
| 自动播放音频 | 永远静音 |
| 拦截右键 | 破坏体验 |
| 强制横屏 | 适配竖屏 |
