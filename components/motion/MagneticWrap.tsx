'use client';

import { type ReactNode, useRef } from 'react';

import { cn } from '@/lib/utils';

import { useReducedMotion } from './useReducedMotion';

interface MagneticWrapProps {
  children: ReactNode;
  className?: string;
  /** 最大偏移 px */
  strength?: number;
  /** 跟随系数（0-1） */
  pull?: number;
}

/**
 * Magnetic Hover — interaction.md §2.2
 * 元素被光标"吸引"，最大偏移 12px。
 * 触屏 / reduced motion 自动关闭。
 */
export function MagneticWrap({
  children,
  className,
  strength = 12,
  pull = 0.2,
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * pull;
    const dy = (e.clientY - cy) * pull;

    const clampedDx = Math.max(-strength, Math.min(strength, dx));
    const clampedDy = Math.max(-strength, Math.min(strength, dy));

    el.style.transform = `translate(${clampedDx}px, ${clampedDy}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className={cn('inline-block will-change-transform', className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        transition: 'transform 480ms var(--ease-out-expo)',
      }}
    >
      {children}
    </div>
  );
}
