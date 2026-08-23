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
 *   │ [精选视频] [统信软件] [平安银行] … │  ← 横滑，当前章节高亮
 *   └──────────────────────────────────┘
 *
 * - 仅手机显示（md:hidden）；PC 端保持原样（用户确认 PC 没问题）
 * - sticky 在 58px Nav 之下，同款 dashed 边 + 毛玻璃底
 * - 跳转用 scrollToTarget（Lenis/原生双兼容）+ 104px 头部补偿
 * - IntersectionObserver 高亮当前章节，chip 自动滚入可视
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
      <div className="border-b border-dashed border-border-default bg-bg-canvas/80 backdrop-blur-md">
        <div
          ref={trackRef}
          className={cn(
            'mx-auto flex max-w-xl items-center gap-1.5 overflow-x-auto px-6 py-2',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-nav-id={l.id}
              onClick={() => go(l.id)}
              aria-current={active === l.id ? 'true' : undefined}
              className={cn(
                'shrink-0 rounded-pill border px-3 py-[5px]',
                'font-mono text-[12px] tracking-wider',
                'transition-colors duration-micro ease-out-quart',
                active === l.id
                  ? 'border-border-default bg-bg-surface text-text-primary'
                  : 'border-border-subtle text-text-tertiary',
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
