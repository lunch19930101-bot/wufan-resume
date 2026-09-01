'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { cn, withBasePath } from '@/lib/utils';
import { getVisibleProjects, type Project } from '@/lib/projects';

/**
 * ProjectShowcase —— atom63.io /timeline 路由的 Rich Card 复刻
 *
 * 1:1 对齐 atom63.io Style C rich cover card:
 *   - aspect-[3/4] 竖图卡片
 *   - bg-muted 实色占位（无图）
 *   - rounded-2xl + 无 border
 *   - hover: scale-[1.03] / 500ms ease-out
 *   - 顶部渐变 overlay: from-black/75 via-black/25 to-transparent
 *   - 右上角 icon badge: size-4 rounded-full 玻璃底(bg-background/10 backdrop-blur-sm)
 *     + 箭头随封面深浅自适应（深底白 / 浅底黑，见 project.coverTone）
 *   - 底部 caption: p-3.5 pt-10
 *   - 容器: max-w-[672px] px-6, container-type:inline-size 横向滚动
 *   - 左右 chevron 玻璃感按钮控制水平滚动
 *
 * 卡片点击 → 跳转 /projects/<slug> 详情页
 *
 * Section heading（1:1 atom63 /timeline）:
 *   title:        "Timeline"
 *   description:  "Everything — work, writing, awards, and the road here."
 */

export function ProjectShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Timeline 中不展示的项目 —— 见 lib/projects.ts getVisibleProjects */
  const visibleProjects = getVisibleProjects();  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 280;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <section
      id="timeline"
      aria-label="Project showcase"
      className="relative w-full"
    >
      {/* Carousel —— 1:1 atom63 bleed 模式
          （与 ShowcaseCarousel 相同的破容器手法，可嵌入 HomeMain 长文流）
          - 滑出 max-w-[672px] px-6 内容列，扩展到完整 672px 外宽（手机端全宽出血）
          - lg 起 HomeMain 的破格 wrapper 已给出 864/1088px 宽，出血归零（lg:mx-0 lg:w-full）
          - container-type:inline-size 让 100cqw = 出血层实际宽度
          - track padding-inline:1.5rem 在两端自然形成 24px gutter
            · scrollLeft=0 时左侧 24px 空白可见
            · 滑动后 padding 随内容滑出，卡片贴 viewport 边缘
            · 滑到最右时右侧 24px 空白再现
          - 不使用 scroll-snap（atom63 完全不用 snap） */}
      <div
        className="-mx-6 w-[calc(100%+4rem)] lg:mx-0 lg:w-full"
        style={{ containerType: 'inline-size' }}
      >
        <div className="relative">
          <button
            type="button"
            aria-label="Previous"
            data-cursor="link"
            onClick={() => scrollByCards(-1)}
            className={cn(
              'absolute left-3 top-1/2 z-20 hidden -translate-y-1/2',
              'inline-flex size-[32px] items-center justify-center',
              'rounded-[var(--control-radius)]',
              'border border-black/5 dark:border-white/20',
              'bg-white/75 dark:bg-black/55',
              'backdrop-blur-md',
              'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
              'text-black/70 dark:text-white',
              'transition-colors duration-micro ease-out-quart',
              'hover:bg-white/85 dark:hover:bg-black/70',
              'md:inline-flex',
            )}
          >
            <ChevronLeftIcon className="size-[14px]" />
          </button>
          <button
            type="button"
            aria-label="Next"
            data-cursor="link"
            onClick={() => scrollByCards(1)}
            className={cn(
              'absolute right-3 top-1/2 z-20 hidden -translate-y-1/2',
              'inline-flex size-[32px] items-center justify-center',
              'rounded-[var(--control-radius)]',
              'border border-black/5 dark:border-white/20',
              'bg-white/75 dark:bg-black/55',
              'backdrop-blur-md',
              'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
              'text-black/70 dark:text-white',
              'transition-colors duration-micro ease-out-quart',
              'hover:bg-white/85 dark:hover:bg-black/70',
              'md:inline-flex',
            )}
          >
            <ChevronRightIcon className="size-[14px]" />
          </button>

          {/* 横向滚动轨道 —— padding-inline 是 endpoint gutter 的核心
              padding 是 scrollable 区域一部分：scrollLeft=0 时左侧 24px 空白，
              滑到最右时右侧 24px 空白，滑动中段 padding 滑出可见区外 */}
          <div
            ref={scrollRef}
            className={cn(
              'hide-scrollbar rail-fade flex gap-3',
              'overflow-x-auto scroll-smooth',
              'py-1',
            )}
            style={{ paddingInline: '1.5rem' }}
          >
            {visibleProjects.map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * WorkCard —— 1:1 atom63 Style C rich cover card
 * 整张卡片是 <Link>，点击跳转 /projects/<slug>
 * （首页 Timeline 与详情页 More work 共用）
 * ============================================================ */
export function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.directUrl ?? `/projects/${project.slug}`}
      data-card
      data-cursor="link"
      aria-label={project.title}
      className={cn(
        'group relative block shrink-0 overflow-hidden bg-bg-muted',
        'rounded-[var(--showcase-radius)]',
        // 卡片宽度 —— 1:1 atom63 ScrollableList 公式
        //   100cqw = bleed wrapper 实际宽（手机全宽出血 / lg 864 / xl 1088，
        //   随 HomeMain #227 破格 wrapper 联动）
        //   2.5 张可见 (2 全显 + 0.5 peek)，公式直接复刻 atom63：
        //     w-[calc((100cqw-2.5rem)/2.5)]
        //   xl 1440 屏：(1088 - 40) / 2.5 ≈ 419px / 卡片
        'w-[calc((100cqw-2.5rem)/2.5)]',
        'aspect-[3/4]',
        // #237 hover 势能 —— 卡片层浮起 3px + 投影（内部图缩放原本就有）
        'transition-all duration-[200ms] ease-out-quart',
        'hover:-translate-y-[3px] hover:shadow-[var(--shadow-elev-3)]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      {/* INNER 缩放层 */}
      <div
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-out',
          'group-hover:scale-[1.03]',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100',
        )}
        aria-hidden
      >
        {project.cover ? (
          <img
            src={withBasePath(project.cover)}
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-bg-muted" />
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5" />
          </>
        )}
      </div>

      {/* 顶部渐变 overlay —— 弱化中部，避免压暗图片上半内容 */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        aria-hidden
      />

      {/* 极光描边 —— hover 时 1px 五色 conic 环沿卡片缓慢旋转
          （globals.css .aurora-ring；group:hover 驱动，静息不可见） */}
      <span aria-hidden className="aurora-ring" />

      {/* 右上角 icon badge —— 圆形玻璃感；箭头颜色随封面深浅（深白 / 浅黑）
          #237：16→28px + 箭头 8→14px（远低于触控标准的装饰小角标放大到可识别） */}
      <div
        className={cn(
          'absolute right-3 top-3 z-10 flex size-[28px] items-center justify-center rounded-full',
          'bg-background/10 backdrop-blur-sm',
        )}
        aria-hidden
      >
        <ExternalArrowIcon
          className={cn(
            'size-3.5 opacity-70 transition-opacity duration-micro ease-out-quart group-hover:opacity-100',
            project.coverTone === 'light' ? 'text-black' : 'text-white',
          )}
        />
      </div>

      {/* 底部 caption —— 年份 + 标题 + 一句话价值主张（#237）+ 类型 */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-3.5 pt-10">
        <span className="font-mono text-sm tracking-wide text-white/70 tabular-nums">
          {project.year}
        </span>
        <h3 className="line-clamp-2 text-balance text-base leading-snug font-[550] text-white">
          {project.title}
        </h3>
        <p className="line-clamp-1 text-[11px] leading-[1.6] text-white/55">
          {project.description}
        </p>
        {project.type && (
          <span className="mt-1 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/75 backdrop-blur-sm">
            {project.type}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ============================================================
 * Icons
 * ============================================================ */
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

function ExternalArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
