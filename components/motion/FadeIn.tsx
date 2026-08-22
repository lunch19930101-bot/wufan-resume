'use client';

import { type ElementType, type ReactNode, type RefObject } from 'react';

import { cn } from '@/lib/utils';

import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** stagger 错峰延迟（ms） */
  delay?: number;
  /** 入场时长（ms） */
  duration?: number;
  /** translateY 起始位移（px） */
  y?: number;
  /** 渲染的语义标签 */
  as?: ElementType;
  /** 视口进入阈值 */
  threshold?: number;
}

/**
 * 通用 Fade-In-Up —— 任意 JSX 入场动效。
 * 与 RevealText 不同，它不做 mask reveal，只做 opacity + translateY，
 * 因此适合段落、卡片、列表等富内容。
 *
 * 进入视口触发一次；reduced motion 时仍走同一段 JSX（避免 hydration
 * mismatch），但 transition 置零，样式直接到终态。
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 560,
  y = 20,
  as,
  threshold = 0.15,
}: FadeInProps) {
  const Tag = (as ?? 'div') as ElementType;
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });
  const shown = reduced ? true : inView;

  return (
    <Tag
      ref={ref as RefObject<HTMLElement>}
      className={cn('will-change-transform', className)}
      style={
        reduced
          ? { opacity: 1, transform: 'translateY(0)' }
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
              transition: `opacity ${duration}ms var(--ease-out-expo) ${delay}ms, transform ${duration}ms var(--ease-out-expo) ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  );
}
