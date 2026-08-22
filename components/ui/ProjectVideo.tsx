'use client';

import { cn, withBasePath } from '@/lib/utils';

interface ProjectVideoProps {
  /** 视频路径。null = 渲染占位组件 */
  video: string | null;
  /** 视频 poster（一般传项目的 cover）。null 时不显示海报 */
  poster?: string | null;
  className?: string;
  /** 占位组件里显示的项目名 / 标签 */
  label?: string;
  /** 是否自动播放（默认 false，需用户主动点开） */
  autoPlay?: boolean;
  /** 是否循环（autoPlay=true 时建议 true） */
  loop?: boolean;
  /** 是否静音（autoPlay=true 时浏览器强制要求 true） */
  muted?: boolean;
}

/**
 * ProjectVideo —— 自动占位 / 自动播放
 *
 * - `video` 为 null（项目还没有 videos/*.mp4）→ 渲染占位框。
 * - `video` 有值 → 渲染原生 `<video controls>`。
 *
 * 设计：用户只需把 .mp4 丢进 public/projects/<slug>/videos/，
 *      fs 加载器会把 `video` 字段填好，本组件自动切换为真实播放器。
 */
export function ProjectVideo({
  video,
  poster,
  className,
  label = '视频即将上线',
  autoPlay = false,
  loop = false,
  muted = false,
}: ProjectVideoProps) {
  if (!video) {
    return <VideoPlaceholder label={label} className={className} />;
  }

  const src = withBasePath(video);
  const posterSrc = poster ? withBasePath(poster) : undefined;

  return (
    <div className={cn('relative overflow-hidden bg-bg-elevated', className)}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={posterSrc}
        controls
        autoPlay={autoPlay}
        loop={loop}
        muted={muted || autoPlay}
        playsInline
        preload="metadata"
      />
    </div>
  );
}

/**
 * 视频占位组件 —— 印刷感、不显廉价。
 * 默认 16:9；外层用 className 控制 aspect-ratio。
 */
export function VideoPlaceholder({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        'border border-border-subtle bg-bg-elevated',
        className,
      )}
      aria-label={label}
      role="img"
    >
      {/* 网格底纹 */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-border-default) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-default) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      {/* 中心播放符号（虚线圆 + 三角）—— 用 SVG，避免依赖图标库 */}
      <svg
        viewBox="0 0 80 80"
        className="relative h-16 w-16 text-text-tertiary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        <circle cx="40" cy="40" r="30" strokeDasharray="2 6" />
        <polygon points="34,28 34,52 54,40" fill="currentColor" stroke="none" />
      </svg>
      {/* 标签 */}
      <span className="absolute bottom-4 left-4 font-mono text-mono-micro uppercase tracking-[0.18em] text-text-tertiary">
        {label}
      </span>
      <span className="absolute right-4 top-4 font-mono text-mono-micro uppercase tracking-[0.18em] text-text-tertiary">
        mp4 · 自动
      </span>
    </div>
  );
}
