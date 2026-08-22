# Portfolio — "Make to Think"

> 个人 UI / 产品设计作品集网站
> 设计目标：Awwwards / FWA 水准，超越 youthce.github.io / atom63.io

---

## 项目母题

**Make to Think（造以思之）**——作品集本身即作品。
访客不"看作品"，而是亲历设计师如何思考。

---

## 文档索引

| 文档 | 内容 | 阅读优先级 |
|---|---|---|
| [product.md](product.md) | 创意方案：母题、故事线、页面结构、设计哲学 | ★★★ 先读 |
| [design-system.md](design-system.md) | 设计系统：Grid / Spacing / Typography / Color 全 token | ★★★ |
| [ui-spec.md](ui-spec.md) | UI 规格：信息架构、各页面线框、模块尺寸 | ★★★ |
| [interaction.md](interaction.md) | 交互规范：光标、Hover、滚动、过渡 | ★★ |
| [animation.md](animation.md) | 动画规范：Easing / Duration / 入场出场 | ★★ |
| [coding-style.md](coding-style.md) | 工程规范：技术栈、命名、性能、可访问性 | ★ 实现阶段 |

---

## 阅读路径

- **想理解项目**：product.md → design-system.md → ui-spec.md
- **想实现页面**：ui-spec.md → interaction.md → animation.md → coding-style.md
- **想扩展设计**：design-system.md

---

## 目录结构

```
Portfolio/
├── docs/         # 所有设计 / 规范文档（当前阶段产出）
├── assets/       # 字体、图片、视频、icon 资源（未来）
├── components/   # UI 组件库（未来）
└── app/          # 页面与路由（未来）
```

---

## 版本

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0 | 2026-06-29 | 创意方案 / 设计系统 / 线框 / 交互与动画规范 / 工程规范 |

---

## 设计参考基准

Apple · Linear · Raycast · Figma · Stripe · Vercel · Framer · Craft · Notion

---

## 核心设计决策（速查）

- **母题**：Make to Think
- **配色**：Dark mode 默认；bg `#0B0B0D` / text `#F2F0EA` / 主强调 electric lime `#D7FF3A` / 次强调 vermillion `#FF5C28`
- **字体**：PP Editorial New（display）+ Geist（body）+ Geist Mono（mono）。**弃用 Inter**。
- **数学约束**：8px baseline / 4px spacing unit / 1.25 type ratio
- **铁律**：图片永远直角，按钮永远胶囊；lime 全屏 ≤ 3 处；每屏 Primary 按钮 ≤ 1 个
