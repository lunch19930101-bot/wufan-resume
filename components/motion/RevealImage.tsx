'use client';

import { type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface RevealImageProps {
  children: ReactNode;
  className?: string;
  /** 揭示方向 */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** 入场时长 */
  duration?: number;
  /** 延迟 */
  delay?: number;
  /** 内层图片额外的缩放动画（Ken Burns 入场） */
  withScale?: boolean;
}

const clipStart: Record<NonNullable<RevealImageProps['direction']>, string> = {
  up: 'inset(0 0 100% 0)',
  down: 'inset(100% 0 0 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
};

const clipEnd = 'inset(0 0 0 0)';

/**
 * 图片 Clip Reveal — animation.md §3.2
 * 从一边像幕布拉开。
 * 外层做 clip-path，内层图片可配 scale 入场。
 *
 * 注意：reduced motion 时**不**走早期 return —— 那会改变 JSX 结构，
 * 与 SSR 输出不一致触发 hydration mismatch。改为落到同一段 JSX，
 * 只把 transition 置零，让样式直接到终态。
 */
export function RevealImage({
  children,
  className,
  direction = 'up',
  duration = 880,
  delay = 0,
  withScale = true,
}: RevealImageProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
  });

  // reduced 时直接视为 inView，跳过动画但仍走同一段 JSX
  const shown = reduced ? true : inView;

  const wrapperStyle: CSSProperties = reduced
    ? { clipPath: clipEnd }
    : {
        clipPath: shown ? clipEnd : clipStart[direction],
        transition: `clip-path ${duration}ms var(--ease-out-expo) ${delay}ms`,
      };

  const innerStyle: CSSProperties = withScale
    ? reduced
      ? { transform: 'scale(1)' }
      : {
          transform: shown ? 'scale(1)' : 'scale(1.04)',
          transition: `transform ${duration + 200}ms var(--ease-out-quart) ${delay}ms`,
        }
    : {};

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} style={wrapperStyle}>
      <div className="h-full w-full" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
