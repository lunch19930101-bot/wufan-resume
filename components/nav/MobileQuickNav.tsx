'use client';

import { useEffect, useRef, useState } from 'react';

import { scrollToTarget } from '@/components/motion/SmoothScroll';

import { cn } from '@/lib/utils';

/**
 * MobileQuickNav —— 手机端快捷章节导航
 *
 * 首页长文流在手机上段落多、缺乏结构感（用户反馈「阅读性差」）。
 * 这条 sticky chip 导航让用户一眼看到章节骨架、一键直达：
 *
 *   ┌──────────────────────────────────┐
 *   │ 精选视频  统信软件 ▍平安银行 …   │  ← 横滑，当前章节反色高亮
 *   └──────────────────────────────────┘
 *
 * 样式（v2 —— 用户反馈首版「不好看」后重构）：
 *   - 与 Nav 的层次区分：Nav 用 dashed 主分隔，本条降为 border-subtle
 *     细实线 + 更实的底（/90），叠在一起不再出现「双虚线」的厚重感
 *   - chip 去边框化：未选中 = 纯文字（tertiary），不再描边；
 *     选中 = 反色墨点 pill（bg-text-primary + inverse 文字）——
 *     与 Nav 右侧 Menu 实底按钮同一对比档位，选中态一眼可辨
 *   - 轨道左右 24px 渐隐 mask，暗示可横滑
 *
 * 行为不变：
 *   - 仅手机显示（md:hidden）；sticky 在 58px Nav 之下
 *   - 跳转 scrollToTarget（Lenis/原生双兼容）+ 104px 头部补偿
 *   - IntersectionObserver 高亮当前章节，chip 自动滚入可视
 *   - 条高锁 46px —— HEADER_OFFSET / 各锚点 scroll-mt-[104px] 依赖此值
 */
const LINKS = [
  { id: 'showcase', label: '精选视频' },
  { id: 'uniontech', label: '统信软件' },
  { id: 'pingan', label: '平安银行' },
  { id: 'ai-projects', label: 'AI 项目' },
  { id: 'timeline', label: '项目合集' },
] as const;

/** Nav 58px + 本条 46px —— 锚点落点补偿 */
const HEADER_OFFSET = -(58 + 46);

export function MobileQuickNav() {
  const [active, setActive] = useState<string>(LINKS[0].id);
  const trackRef = useRef<HTMLDivElement>(null);

  /* 高亮当前章节 —— 视口上部 30%–40% 带内取最靠上的锚点 */
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* 高亮变化时把对应 chip 滚入可视（只横滚，不动页面竖滚） */
  useEffect(() => {
    const track = trackRef.current;
    const chip = track?.querySelector<HTMLButtonElement>(
      `[data-nav-id="${active}"]`,
    );
    chip?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    scrollToTarget(Math.max(0, top));
  };

  return (
    <div className="sticky top-[58px] z-40 -mx-6 md:hidden">
      {/* 底衬：细实线（subtle）+ 更实的毛玻璃 —— 刻意比 Nav 的 dashed 轻一档 */}
      <div className="h-[46px] border-b border-border-subtle bg-bg-canvas/90 backdrop-blur-md">
        <div
          ref={trackRef}
          className={cn(
            'mx-auto flex h-full max-w-xl items-center gap-2 overflow-x-auto px-6',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            // 左右渐隐，暗示可横滑；静止时渐隐区正好落在 24px 内边距上
            '[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
            '[-webkit-mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
          )}
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-nav-id={l.id}
              onClick={() => go(l.id)}
              aria-current={active === l.id ? 'true' : undefined}
              className={cn(
                'shrink-0 rounded-pill px-3 py-[6px]',
                'font-mono text-[11px] leading-4 tracking-wider',
                'transition-colors duration-micro ease-out-quart',
                active === l.id
                  ? 'bg-text-primary text-text-inverse'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
