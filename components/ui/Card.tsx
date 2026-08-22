import { type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** 交互态（hover 抬升 + lime 边框） */
  interactive?: boolean;
  /** 内边距档位 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 圆角档位 */
  radius?: 'md' | 'lg' | 'xl';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
};

const radiusMap = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

/**
 * Card — design-system.md §11
 * 默认 md 圆角 + md padding。
 * interactive=true 时 hover 抬升 4px + lime 边框。
 */
export function Card({
  children,
  className,
  as: Tag = 'div',
  interactive = false,
  padding = 'md',
  radius = 'md',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'relative border border-border-default bg-bg-surface shadow-elev-1 transition-all duration-base ease-out-expo',
        radiusMap[radius],
        paddingMap[padding],
        interactive &&
          'hover:-translate-y-1 hover:border-accent-lime hover:shadow-elev-3 cursor-none',
        className,
      )}
      data-cursor={interactive ? 'button' : undefined}
    >
      {children}
    </Tag>
  );
}
