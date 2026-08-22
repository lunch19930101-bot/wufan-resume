import { type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  /** 章节垂直留白档位（design-system.md §16） */
  padding?: 'none' | 'tight' | 'normal' | 'hero' | 'footer';
  as?: ElementType;
  id?: string;
  /** 章节背景色 */
  background?: 'canvas' | 'surface' | 'elevated' | 'transparent';
}

const paddingMap: Record<NonNullable<SectionProps['padding']>, string> = {
  none: '',
  tight: 'py-8 md:py-10',
  normal: 'py-12 md:py-20',
  hero: 'py-16 md:py-24',
  footer: 'pt-16 pb-10 md:pt-20 md:pb-12',
};

const bgMap: Record<NonNullable<SectionProps['background']>, string> = {
  canvas: 'bg-bg-canvas',
  surface: 'bg-bg-surface',
  elevated: 'bg-bg-elevated',
  transparent: '',
};

/**
 * 章节级容器。统一垂直留白节奏。
 */
export function Section({
  children,
  className,
  padding = 'normal',
  as: Tag = 'section',
  id,
  background = 'transparent',
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn('relative w-full', paddingMap[padding], bgMap[background], className)}
    >
      {children}
    </Tag>
  );
}
