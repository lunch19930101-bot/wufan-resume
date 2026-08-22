'use client';

import { type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';

import { cn } from '@/lib/utils';

import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  /** 透传到根标签的 style（用于 fontStyle / fontSize 等不进 className 的属性） */
  style?: CSSProperties;
  /** stagger 错峰延迟（ms） */
  delay?: number;
  /** 入场时长（ms） */
  duration?: number;
  /** 渲染的语义标签 */
  as?: ElementType;
  /** 按词拆分（适用于多词大标题） */
  splitWords?: boolean;
}

/**
 * 文字 Mask Reveal — animation.md §3.1
 * 从下方 110% 推出，永不淡入。
 *
 * @example
 * <RevealText as="h1" className="text-display-xl">Make to Think.</RevealText>
 */
export function RevealText({
  children,
  className,
  style,
  delay = 0,
  duration = 720,
  as,
  splitWords = false,
}: RevealTextProps) {
  const Tag = (as ?? 'div') as ElementType;
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const shown = reduced ? true : inView;

  // 多词拆分：每个词独立 mask reveal，stagger 80ms
  if (splitWords && typeof children === 'string') {
    const words = children.split(' ');
    return (
      <Tag className={cn('inline-block', className)} style={style}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className="inline-block"
              style={
                reduced
                  ? { transform: 'translateY(0)', opacity: 1 }
                  : {
                      transform: shown ? 'translateY(0)' : 'translateY(110%)',
                      opacity: shown ? 1 : 0,
                      transition: `transform ${duration}ms var(--ease-out-expo) ${delay + i * 80}ms, opacity ${duration}ms var(--ease-out-expo) ${delay + i * 80}ms`,
                    }
              }
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        ))}
        {/* 触发用哨兵 */}
        <span ref={ref as RefObject<HTMLSpanElement>} className="sr-only" aria-hidden />
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as RefObject<HTMLElement>}
      className={cn('inline-block overflow-hidden', className)}
      style={
        reduced
          ? { transform: 'translateY(0)', opacity: 1, ...style }
          : {
              transform: shown ? 'translateY(0)' : 'translateY(110%)',
              opacity: shown ? 1 : 0,
              transition: `transform ${duration}ms var(--ease-out-expo) ${delay}ms, opacity ${duration}ms var(--ease-out-expo) ${delay}ms`,
              ...style,
            }
      }
    >
      {children}
    </Tag>
  );
}
