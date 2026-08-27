'use client';

import { useEffect, useRef, useState } from 'react';

import { cn, withBasePath } from '@/lib/utils';

/**
 * ProjectGallery —— 作品详情页截图展示（缩略图 + 主图切换）
 *
 * 结构：
 *   ┌──────────────────────────────────────────┐
 *   │  主图舞台（横图按真实比例 / 长图窗口内滚）  │
 *   ├──────────────────────────────────────────┤
 *   │ 01 / 05 · 现状 · 统信官网（目前线上）      │ ← 注释条
 *   ├──────────────────────────────────────────┤
 *   │ [缩1] [缩2] [缩3] [缩4] [缩5] …           │ ← 缩略图横滑切换
 *   └──────────────────────────────────────────┘
 *
 * - 横图：舞台按图片真实比例出形（aspect-ratio），铺满内容列、无留白无底色
 * - 长图：通栏宽度铺满舞台，在舞台内下滑细读
 * - 不做点击放大（无 lightbox）—— 舞台即阅读面，切换靠舞台两侧箭头 + 缩略图
 *
 * 数据格式：gallery 支持 { src, ratio, label, maxW }
 *   ratio  图片真实宽高比（w/h）—— 缩略图定宽按比例出形
 *   label  中文标注（如「现状 · 目前官网」）
 *   maxW   舞台最大显示宽度（px）—— 手机截图类窄图限制显示尺寸并居中，
 *          切换按钮挂舞台外层，跟随收窄后的舞台
 *
 * 宽度：内容列内展示（与正文对齐，不出血通栏）；直角无圆角
 */
export type GalleryEntry =
  | string
  | {
      src: string;
      ratio?: number;
      label?: string;
      /** 舞台最大显示宽度（px）—— 手机截图类窄图限制显示尺寸、居中 */
      maxW?: number;
    };

interface GalleryItem {
  src: string;
  ratio: number;
  label?: string;
  maxW?: number;
}

function normalizeGallery(gallery?: GalleryEntry[]): GalleryItem[] {
  return (gallery ?? []).map((g) => {
    const obj = typeof g === 'string' ? { src: g } : g;
    return {
      src: obj.src,
      ratio: obj.ratio ?? 16 / 10,
      label: obj.label,
      maxW: obj.maxW,
    };
  });
}

export function ProjectGallery({
  gallery,
  title,
}: {
  gallery?: GalleryEntry[];
  title: string;
}) {
  const items = normalizeGallery(gallery);
  const [index, setIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /* 切换时缩略图轨道横向滚到可见（只滚轨道自身，绝不动页面滚动）+ 长图舞台回到顶部 */
  useEffect(() => {
    const track = thumbRef.current;
    const thumb = track?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (track && thumb) {
      const left = thumb.offsetLeft - (track.clientWidth - thumb.clientWidth) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
    stageRef.current?.scrollTo({ top: 0 });
  }, [index]);

  // 1. 空状态 —— 无图项目不画灰色占位框，只留一行提示
  if (items.length === 0) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        [ images coming soon ]
      </p>
    );
  }

  const current = items[Math.min(index, items.length - 1)]!;
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <figure className="relative w-full">
      {/* maxW —— 手机截图类窄图：舞台（含两侧切换按钮）限制最大宽度并居中 */}
      <div
        className={cn('relative', current.maxW && 'mx-auto')}
        style={current.maxW ? { maxWidth: current.maxW } : undefined}
      >
        {/* 主图舞台 —— 横图按真实比例出形铺满内容列；长图固定高度图内下滑（无底色、无点击放大） */}
        <div
          ref={stageRef}
          className={cn(
            'relative w-full overflow-hidden border border-border-subtle',
            // 长图：舞台即滚动容器，图片铺满内容列、自然高度
            current.ratio < 0.9 && 'h-[60vh] overflow-y-auto overscroll-contain md:h-[72vh]',
          )}
          style={
            current.ratio < 0.9 ? undefined : { aspectRatio: String(current.ratio) }
          }
        >
          <img
            key={current.src}
            src={withBasePath(current.src)}
            alt={current.label ?? `${title} — image ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'tile-fade',
              current.ratio < 0.9
                ? 'block h-auto w-full' // 长图：铺满内容列，无两侧留白
                : 'absolute inset-0 size-full object-cover', // 横图：舞台比例=图片比例，满铺无留白
            )}
          />
        </div>

        {/* 左右切换 —— 挂在舞台外层（长图滚动时不跟随），只切换不放大 */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="上一张"
              data-cursor="link"
              onClick={() => go(-1)}
              className={cn(
                'absolute left-3 top-1/2 z-20 inline-flex size-[32px] -translate-y-1/2',
                'items-center justify-center rounded-[var(--control-radius)]',
                'border border-black/5 dark:border-white/20',
                'bg-white/75 dark:bg-black/55 backdrop-blur-md',
                'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
                'text-black/70 dark:text-white',
                'transition-colors duration-micro ease-out-quart',
                'hover:bg-white/85 dark:hover:bg-black/70',
              )}
            >
              <ChevronLeftIcon className="size-[14px]" />
            </button>
            <button
              type="button"
              aria-label="下一张"
              data-cursor="link"
              onClick={() => go(1)}
              className={cn(
                'absolute right-3 top-1/2 z-20 inline-flex size-[32px] -translate-y-1/2',
                'items-center justify-center rounded-[var(--control-radius)]',
                'border border-black/5 dark:border-white/20',
                'bg-white/75 dark:bg-black/55 backdrop-blur-md',
                'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
                'text-black/70 dark:text-white',
                'transition-colors duration-micro ease-out-quart',
                'hover:bg-white/85 dark:hover:bg-black/70',
              )}
            >
              <ChevronRightIcon className="size-[14px]" />
            </button>
          </>
        )}
      </div>

      {/* 注释条 —— 在页面上，永远清晰可读 */}
      <div className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[11px] tracking-wide">
        <span className="text-text-secondary tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          {current.label && (
            <span className="ml-2 not-italic text-text-primary">{current.label}</span>
          )}
        </span>
        {current.ratio < 0.9 && <span className="text-text-tertiary">图内下滑</span>}
      </div>

      {/* 缩略图轨道 —— 高度统一 56px，宽度按真实比例 */}
      {items.length > 1 && (
        <div
          ref={thumbRef}
          className={cn(
            'hide-scrollbar mt-2 flex gap-1.5 overflow-x-auto',
            'scroll-smooth pb-1',
          )}
        >
          {items.map((it, i) => (
            <button
              key={it.src + i}
              type="button"
              data-thumb={i}
              data-cursor="link"
              aria-label={`切换到 ${it.label ?? `第 ${i + 1} 张`}`}
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-14 shrink-0 overflow-hidden rounded-[var(--control-radius)] border border-border-subtle',
                'transition-opacity duration-micro ease-out-quart',
                i === index
                  ? 'opacity-100 ring-2 ring-accent-lime/80 ring-offset-2 ring-offset-bg-base'
                  : 'opacity-45 hover:opacity-90',
              )}
              style={{ aspectRatio: String(it.ratio), minWidth: 28 }}
            >
              <img
                src={withBasePath(it.src)}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* figcaption */}
      <figcaption className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">[ {items.length} 张项目设计图 ]</span>
        <span>project-gallery</span>
      </figcaption>
    </figure>
  );
}

/* ============================================================
 * ChevronIcon —— 舞台两侧上一张 / 下一张
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
