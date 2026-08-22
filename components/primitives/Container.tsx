import { type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** 内容最大宽度档位。content = 1320 默认；read = 860 长读；manifesto = 1200 */
  width?: 'content' | 'read' | 'manifesto' | 'caption' | 'full';
  as?: ElementType;
}

const widthMap: Record<NonNullable<ContainerProps['width']>, string> = {
  content: 'max-w-content',
  read: 'max-w-read',
  manifesto: 'max-w-manifesto',
  caption: 'max-w-caption',
  full: 'max-w-none',
};

/**
 * 通用容器。
 * - 桌面 margin-x: 60px
 * - 平板 margin-x: 32px
 * - 移动 margin-x: 20px
 * 见 design-system.md §3 Grid。
 */
export function Container({
  children,
  className,
  width = 'content',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        'px-5 md:px-8 lg:px-[60px]',
        widthMap[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
