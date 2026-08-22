'use client';

import { useEffect, useState } from 'react';

import { cn, withBasePath } from '@/lib/utils';

/**
 * ShowcaseStacked —— 统信生态大会 2020–2024 年度 KV 组合（1 大 + 3 小，自动轮流播放）
 *
 * 位置：长文中「统信开篇」段落之后（最初位置）
 *
 * 布局：
 *   ┌──────────────────────────────────────────┐
 *   │      当前轮到的大图（通栏 16:9）          │
 *   ├────────────┬────────────┬───────────────┤
 *   │   小图 1    │   小图 2   │    小图 3     │
 *   └────────────┴────────────┴───────────────┘
 *
 * - 5 张年度 KV 轮播，但版式保持 1 大 + 3 小（不扩成 1 大 4 小）：
 *   小图只显示轮换顺序中当前大图之后的 3 张
 * - 每 4s 自动轮换：下一张成为大图，其余按序排小图
 * - hover / lightbox 打开 / prefers-reduced-motion 时暂停轮换
 * - 点击任意卡片 → lightbox 查看完整大图（点击任意处 / Esc 关闭）
 *
 * 图片后续更换：只改下面 tiles 数组的 image 路径。
 */

type Tile = {
  image: string;
  year: string;
  title: string;
  caption: string;
};

const tiles: Tile[] = [
  {
    image: '/images/projects/ecosystem-summit/02.jpg',
    year: '2020',
    title: '开放 · 成长',
    caption: '2020 统信生态大会 · 年度主视觉',
  },
  {
    image: '/images/projects/ecosystem-summit/03.jpg',
    year: '2021',
    title: '为未来而同心',
    caption: '2021 统信生态大会 · 年度主视觉',
  },
  {
    image: '/images/projects/ecosystem-summit/04.jpg',
    year: '2022',
    title: '三生万物 · 共筑山海',
    caption: '2022 统信生态大会 · 年度主视觉',
  },
  {
    image: '/images/projects/ecosystem-summit/05.jpg',
    year: '2023',
    title: '进化 · 向未来',
    caption: '2023 统信生态大会 · 年度主视觉',
  },
  {
    image: '/images/projects/ecosystem-summit/06.jpg',
    year: '2024',
    title: '智启 · 无界',
    caption: '2024 统信生态大会 · 年度主视觉',
  },
];

const ROTATE_MS = 4000;

export function ShowcaseStacked() {
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);

  /* 自动轮流 —— hover / lightbox 打开 / 减少动态偏好时暂停 */
  useEffect(() => {
    if (hovered || openIndex !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(
      () => setActive((a) => (a + 1) % tiles.length),
      ROTATE_MS,
    );
    return () => clearInterval(t);
  }, [hovered, openIndex]);

  /* Esc 关闭 lightbox */
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex]);

  const featured = tiles[active]!;
  /* 保持 1 大 + 3 小：5 张轮播，小图只取大图之后顺时针的 3 张 */
  const smalls = [1, 2, 3].map((k) => {
    const i = (active + k) % tiles.length;
    return { tile: tiles[i]!, i };
  });
  const openTile = openIndex !== null ? tiles[openIndex] : null;

  return (
    <figure
      className="relative w-full space-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 上：通栏主图（当前轮到的大图） */}
      <button
        type="button"
        data-cursor="link"
        aria-label={`查看大图 — ${featured.title}`}
        onClick={() => setOpenIndex(active)}
        className="block w-full text-left"
      >
        <Tile tile={featured} variant="banner" />
      </button>

      {/* 下：3 小图（非当前大图的其余三张） */}
      <div className="grid grid-cols-3 gap-3">
        {smalls.map(({ tile, i }) => (
          <button
            key={i}
            type="button"
            data-cursor="link"
            aria-label={`查看大图 — ${tile.title}`}
            onClick={() => setOpenIndex(i)}
            className="block w-full text-left"
          >
            <Tile tile={tile} variant="sub" />
          </button>
        ))}
      </div>

      {/* figcaption —— label + 轮换进度 */}
      <figcaption className="flex items-baseline justify-between gap-2 pt-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">[ 统信生态大会 · 2020–2024 主视觉 ]</span>
        <span className="tabular-nums">
          {String(active + 1).padStart(2, '0')} / {String(tiles.length).padStart(2, '0')}
        </span>
      </figcaption>

      {/* Lightbox —— 点击任意处关闭 */}
      {openTile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openTile.title}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center gap-3 bg-bg-overlay p-6"
        >
          <img
            src={withBasePath(openTile.image)}
            alt={openTile.title}
            className="max-h-[85vh] w-auto max-w-full rounded-[var(--showcase-radius)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
          />
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
            {openTile.title} — {openTile.caption} · 点击任意处关闭
          </p>
        </div>
      )}
    </figure>
  );
}

/* ============================================================
 * Tile —— 项目封面卡片（点击查看大图，不跳转）
 *   图片切换时通过 key 重挂载触发 tile-fade 淡入
 * ============================================================ */
function Tile({
  tile,
  variant,
  className,
}: {
  tile: Tile;
  variant: 'banner' | 'sub';
  className?: string;
}) {
  const isBanner = variant === 'banner';
  return (
    <div
      className={cn(
        'group relative h-full w-full overflow-hidden bg-bg-muted',
        'rounded-[var(--showcase-radius)]',
        /* 五张 KV 均原生 1920×1080（16:9）：大图零裁切；
           小图 16:10 只裁左右各 ~5%，主视觉内容基本完整 */
        isBanner ? 'aspect-[16/9]' : 'aspect-[16/10]',
        className,
      )}
    >
      {/* 图片缩放层 */}
      <div
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-out',
          'group-hover:scale-[1.03]',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100',
        )}
        aria-hidden
      >
        <img
          key={tile.image}
          src={withBasePath(tile.image)}
          alt=""
          loading="lazy"
          className="tile-fade absolute inset-0 size-full object-cover"
        />
      </div>

      {/* 顶部渐变 overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
        aria-hidden
      />

      {/* 右上角 icon badge —— 放大查看（缩小 50%：16px 底衬 + 8px 图标） */}
      <div
        className={cn(
          'absolute right-2 top-2 z-10 flex size-4 items-center justify-center rounded-full',
          'bg-background/10 backdrop-blur-sm',
        )}
        aria-hidden
      >
        <ExpandIcon className="size-2 opacity-70 transition-opacity duration-micro ease-out-quart group-hover:opacity-100" />
      </div>

      {/* 左下角文字 —— 大图：标题 + 副标题；小图：只留极小年份标签，不挡画面 */}
      {isBanner ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-0.5 p-3.5">
          <h3 className="text-balance text-lg leading-snug font-medium text-white">
            {tile.title}
          </h3>
          <p className="text-pretty text-xs leading-snug text-white/65">
            {tile.caption}
          </p>
        </div>
      ) : (
        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-[var(--control-radius)] bg-black/35 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-white/80 backdrop-blur-sm">
          {tile.year}
        </span>
      )}
    </div>
  );
}

function ExpandIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}
