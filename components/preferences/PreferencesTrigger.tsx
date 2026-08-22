'use client';

import { cn } from '@/lib/utils';

/**
 * PreferencesTrigger —— atom63.io 顶部 Menu 按钮左边的 ⚛️ 原子图标按钮
 *
 * 实测参数（atom63.io bundle）:
 *   - size: 36×36 (size-9)
 *   - shape: rounded-full
 *   - bg: bg-muted (semi-transparent grey)
 *   - 图标: Lucide `atom`（两条轨道 + 中心点）
 *   - aria-label: "Open preferences"
 *   - data-site-config-trigger: ""
 *
 * 点击行为：toggle Preferences Popover（由父组件传入 onClick）
 * 快捷键：⌘+, / Ctrl+,（在 usePreferencesOpen 里实现）
 */
export function PreferencesTrigger({
  onClick,
  'aria-expanded': expanded,
  className,
}: {
  onClick: () => void;
  'aria-expanded'?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open preferences"
      aria-expanded={expanded}
      aria-haspopup="dialog"
      data-site-config-trigger=""
      data-cursor="link"
      className={cn(
        'group inline-flex size-7 items-center justify-center rounded-[var(--control-radius)]',
        'bg-bg-elevated text-text-primary',
        'border border-border-subtle',
        'shadow-none transition-colors duration-micro ease-out-quart',
        'hover:border-border-default hover:bg-bg-surface',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-[var(--a63-brand-current)] focus-visible:ring-offset-[var(--color-bg-canvas)]',
        className,
      )}
    >
      <AtomIcon className="size-[14px]" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Atom 图标 —— Lucide `atom`                                         */
/*    circle cx=12 cy=12 r=1                                           */
/*    path: 倾斜椭圆 1                                                 */
/*    path: 倾斜椭圆 2                                                 */
/* ------------------------------------------------------------------ */

function AtomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  );
}
