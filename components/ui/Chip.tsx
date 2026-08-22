'use client';

import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ChipProps {
  children: ReactNode;
  /** 选中态 */
  active?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  className?: string;
  /** 数量徽章，如 "All 12" */
  count?: number;
}

/**
 * Chip — 可交互筛选片（用于 Filter Bar / Index 维度切片）。
 * design-system.md §11 + interaction.md §4.2
 */
export function Chip({ children, active = false, onClick, className, count }: ChipProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      data-cursor={onClick ? 'button' : undefined}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-4 py-2 font-mono text-mono-micro uppercase tracking-[0.04em] transition-all duration-micro ease-out-quart',
        active
          ? 'border-accent-lime bg-accent-lime-dim text-accent-lime'
          : 'border-border-default text-text-secondary hover:border-accent-lime hover:text-text-primary',
        onClick && 'cursor-none',
        className,
      )}
    >
      <span>{children}</span>
      {typeof count === 'number' && (
        <span className={cn('tabular-nums', active ? 'text-accent-lime' : 'text-text-tertiary')}>
          {count}
        </span>
      )}
    </Component>
  );
}
