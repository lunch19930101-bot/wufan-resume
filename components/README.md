# components/

UI 组件库。

按 `docs/coding-style.md` §3 目录结构组织：

```
components/
├── ui/          基础 UI（Button, Tag, Card, Chip）
├── nav/         Nav, FilterBar, Breadcrumb
├── sections/    跨页 Section（Hero, Manifesto, Index, etc.）
├── cursor/      CustomCursor
├── motion/      动画封装（RevealText, RevealImage, CountUp, PinnedSection）
└── primitives/  低级原语（Box, Stack, Cluster）
```

## 实现优先级

1. **motion/**（先建）—— RevealText / RevealImage / CountUp / PinnedSection 是所有 Section 的基础
2. **ui/**（次之）—— Button / Tag / Chip / Card，按 design-system.md §11 规格
3. **cursor/** + **nav/**（并行）—— 全局元素
4. **sections/**（最后）—— 按 ui-spec.md 各 Section 实现

## 参考文档

- 视觉规格：`docs/design-system.md` + `docs/ui-spec.md`
- 交互行为：`docs/interaction.md`
- 动画细节：`docs/animation.md`
- 命名与导出：`docs/coding-style.md` §4 / §5
