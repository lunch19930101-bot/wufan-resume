'use client';

import Link from 'next/link';

import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { MagneticWrap } from '@/components/motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'mono';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Magnetic hover 效果（仅 primary 推荐） */
  magnetic?: boolean;
  /** 鼠标光标的悬停语义（传递给 CustomCursor） */
  cursor?: 'button' | 'link';
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-caption gap-1.5',
  md: 'h-11 px-5 text-body gap-2',
  lg: 'h-14 px-7 text-body-l gap-2',
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-lime text-text-inverse border border-transparent hover:shadow-glow-lime hover:scale-[1.02]',
  secondary:
    'bg-transparent text-text-primary border border-border-default hover:bg-bg-elevated hover:border-border-strong',
  ghost:
    'bg-transparent text-text-primary border border-transparent hover:bg-bg-elevated',
  mono: 'bg-transparent text-accent-lime border border-transparent font-mono uppercase tracking-[0.04em] hover:bg-accent-lime-dim',
};

const baseClass =
  'group relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-fast ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg-canvas active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none';

function renderContent(children: ReactNode) {
  return <span className="relative z-10 inline-flex items-center">{children}</span>;
}

/** 用 <a> 渲染的外部 / 内部链接 */
interface LinkButtonProps extends BaseProps {
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  magnetic = false,
  href,
  external = false,
  ariaLabel,
}: LinkButtonProps & { href: string; external?: boolean; ariaLabel?: string }) {
  const cls = cn(baseClass, sizeMap[size], variantMap[variant], className);
  const inner = renderContent(children);

  const linkContent = external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cls}
      data-cursor="button"
    >
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={ariaLabel} className={cls} data-cursor="button">
      {inner}
    </Link>
  );

  if (magnetic) {
    return <MagneticWrap>{linkContent}</MagneticWrap>;
  }
  return linkContent;
}

/** 用 <button> 渲染（表单 / 交互动作） */
interface ActionButtonProps
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  type?: 'button' | 'submit' | 'reset';
}

export function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  magnetic = false,
  type = 'button',
  ...rest
}: ActionButtonProps) {
  const cls = cn(baseClass, sizeMap[size], variantMap[variant], className);
  const btn = (
    <button type={type} className={cls} data-cursor="button" {...rest}>
      {renderContent(children)}
    </button>
  );
  if (magnetic) {
    return <MagneticWrap>{btn}</MagneticWrap>;
  }
  return btn;
}
