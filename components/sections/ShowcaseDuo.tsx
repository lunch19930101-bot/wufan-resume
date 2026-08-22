'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * ShowcaseDuo —— atom63 主页"日常生活"段下方 2 张并排卡片
 *
 * 布局：
 *   ┌──────────────┬──────────────┐
 *   │   卡片 1     │   卡片 2     │
 *   └──────────────┴──────────────┘
 *
 *   - 不滑动（静态 grid-cols-2）
 *   - 卡片风格：atom63 rich cover（rounded-2xl + overlay + caption + hover scale）
 *   - 大小：aspect-[4/3] 横图，2 列等分，gap-3
 *   - 可选 href：传则渲染 <Link>，不传保持 <article>
 */

type Item = {
  slug: string;
  title: string;
  caption: string;
  href?: string;
};

const defaultItems: [Item, Item] = [
  {
    slug: 'everyday-sci-fi',
    title: 'Atmospheric Sci-Fi',
    caption: 'Blade Runner · Alien — mood boards',
  },
  {
    slug: 'everyday-pixel',
    title: 'Cozy Pixel Art',
    caption: 'Stardew Valley · Dave the Diver',
  },
];

export function ShowcaseDuo({
  items,
  label = 'home-everyday-duo',
  captionLabel = '[ 双联展示 ]',
}: {
  items?: [Item, Item];
  label?: string;
  captionLabel?: string;
}) {
  const displayItems = items ?? defaultItems;
  return (
    <figure className="relative w-full space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {displayItems.map((it) => (
          <DuoCard key={it.slug} item={it} />
        ))}
      </div>

      <figcaption className="flex items-baseline justify-between gap-2 pt-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">{captionLabel}</span>
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}

/* ============================================================
 * DuoCard —— 单张占位卡片（atom63 rich cover 风格）
 * 有 href → <Link>；无 href → <article>
 * ============================================================ */
function DuoCard({ item }: { item: Item }) {
  const className = cn(
    'group relative aspect-[4/3] overflow-hidden bg-bg-muted',
    'rounded-[var(--showcase-radius)]',
  );

  const inner = (
    <>
      {/* INNER 缩放层 */}
      <div
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-out',
          'group-hover:scale-[1.03]',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100',
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-bg-muted" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5" />
      </div>

      {/* 顶部渐变 overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
        aria-hidden
      />

      {/* 右上角 icon badge */}
      <div
        className={cn(
          'absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full',
          'bg-background/10 backdrop-blur-sm',
        )}
        aria-hidden
      >
        <ExternalArrowIcon className="size-4 opacity-70 transition-opacity duration-micro ease-out-quart group-hover:opacity-100" />
      </div>

      {/* 左下角 caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-0.5 p-3.5">
        <h3 className="text-balance text-base leading-snug font-medium text-white">
          {item.title}
        </h3>
        <p className="text-pretty text-xs leading-snug text-white/65">
          {item.caption}
        </p>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} data-cursor="link" aria-label={item.title} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <article data-cursor="link" aria-label={item.title} className={className}>
      {inner}
    </article>
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
