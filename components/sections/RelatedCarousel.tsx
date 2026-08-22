'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';
import { WorkCard } from './ProjectShowcase';

/**
 * RelatedCarousel —— 作品详情页「More work」横向滑动 carousel
 *
 * 卡片 1:1 复用首页 Timeline 的 WorkCard（3:4 真实封面 + 年份/标题/描述），
 * 数据也同源（lib/projects.ts getVisibleProjects）—— 首页与详情页看到同一套作品。
 *
 *   - 溢出 section 内容列，扩展到 article 外宽 576px
 *   - 左右 chevron（仅 md+）
 *   - hide-scrollbar + scroll-smooth
 */
export function RelatedCarousel({ projects }: { projects: Project[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + 8 : 280;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <figure className="relative w-full">
      {/* bleed wrapper —— 溢出 section 内容列，扩展到 article 外宽 576px */}
      <div
        className="relative -mx-6 w-[calc(100%+4rem)]"
        style={{ containerType: 'inline-size' }}
      >
        {/* 左 chevron —— 仅 md+ 显示 */}
        <button
          type="button"
          aria-label="Previous projects"
          data-cursor="link"
          onClick={() => scrollByCard(-1)}
          className={cn(
            'absolute left-3 top-1/2 z-20 hidden -translate-y-1/2',
            'inline-flex size-[32px] items-center justify-center',
            'rounded-[var(--control-radius)]',
            'border border-black/5 dark:border-white/10',
            'bg-white/75 dark:bg-white/10',
            'backdrop-blur-md',
            'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
            'text-black/70 dark:text-text-primary',
            'transition-colors duration-micro ease-out-quart',
            'hover:bg-white/85 dark:hover:bg-white/15',
            'md:inline-flex',
          )}
        >
          <ChevronLeftIcon className="size-[14px]" />
        </button>
        {/* 右 chevron —— 仅 md+ 显示 */}
        <button
          type="button"
          aria-label="Next projects"
          data-cursor="link"
          onClick={() => scrollByCard(1)}
          className={cn(
            'absolute right-3 top-1/2 z-20 hidden -translate-y-1/2',
            'inline-flex size-[32px] items-center justify-center',
            'rounded-[var(--control-radius)]',
            'border border-black/5 dark:border-white/10',
            'bg-white/75 dark:bg-white/10',
            'backdrop-blur-md',
            'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
            'text-black/70 dark:text-text-primary',
            'transition-colors duration-micro ease-out-quart',
            'hover:bg-white/85 dark:hover:bg-white/15',
            'md:inline-flex',
          )}
        >
          <ChevronRightIcon className="size-[14px]" />
        </button>

        {/* 横向滑动轨道 */}
        <div
          ref={scrollRef}
          className={cn(
            'hide-scrollbar flex gap-2',
            'overflow-x-auto scroll-smooth',
            'py-1',
          )}
          style={{ paddingInline: '1.5rem' }}
        >
          {projects.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </div>

      {/* figcaption —— 回到 section 内容列对齐 */}
      <figcaption className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">[ 横向滑动 ]</span>
        <span>more-work</span>
      </figcaption>
    </figure>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
