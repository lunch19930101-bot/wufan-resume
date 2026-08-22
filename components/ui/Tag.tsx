import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TagProps {
  children: ReactNode;
  className?: string;
  /** 是否高亮 */
  active?: boolean;
  /** 色调 */
  tone?: 'default' | 'lime' | 'vermillion';
}

const toneMap = {
  default: 'text-text-secondary border-border-default',
  lime: 'text-accent-lime border-accent-lime/40',
  vermillion: 'text-accent-vermillion border-accent-vermillion/40',
};

/**
 * Tag — 静态标签（用于 meta 信息、年份、客户）。
 * Chip（可交互）见 Chip.tsx。
 */
export function Tag({ children, className, active = false, tone = 'default' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 font-mono text-mono-micro uppercase tracking-[0.04em]',
        toneMap[tone],
        active && 'bg-bg-elevated',
        className,
      )}
    >
      {children}
    </span>
  );
}
