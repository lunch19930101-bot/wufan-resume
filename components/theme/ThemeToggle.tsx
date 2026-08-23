'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { setMode } from '@/lib/preferences';

type Theme = 'dark' | 'light';

/**
 * ThemeToggle —— atom63.io 风格的暗 / 亮主题切换
 *
 * 工作机制：
 *   1. layout.tsx 的内联脚本在 paint 之前从 localStorage / prefers-color-scheme
 *      决定初始主题，写入 <html data-theme="...">。本组件只需读取当前 data-theme。
 *   2. 点击时经 setMode() 写偏好存储并全量应用（data-theme + data-a63-mode
 *      同步翻转，刷新后由 no-flash 脚本读回同一份偏好）。
 *   3. SSR 安全：服务端不渲染具体状态，只渲染骨架；客户端首帧 useEffect 同步状态。
 *
 * 可访问性：
 *   - button 带 aria-label 与 aria-pressed
 *   - 键盘可用（原生 button）
 *   - 不依赖颜色表达状态（含 ☾ / ☉ 图标）
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 首帧：从 <html data-theme> 读真实状态（由 no-flash 脚本设好）
    const current = (document.documentElement.getAttribute('data-theme') as Theme | null) ?? 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    // 走偏好存储 + applyPreferences：同步 data-theme 与 data-a63-mode，
    // 并持久化到 personalization-settings（刷新后 no-flash 脚本读同一份）
    setMode(next);
    // 同步主题色 meta（如果有）
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#111111' : '#fafafa');
    setTheme(next);
  };

  // 服务端首帧：渲染一个透明占位，避免 hydration 不匹配
  if (!mounted) {
    return <span className={cn('inline-block h-9 w-9', className)} aria-hidden />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? '切换到亮色主题' : '切换到暗色主题'}
      aria-pressed={!isDark}
      data-cursor="link"
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden border border-border-default bg-bg-surface text-text-secondary transition-colors duration-base ease-out-quart hover:text-text-primary hover:border-border-strong',
        className,
      )}
    >
      {/* 同时渲染两枚图标，靠 opacity / translate 切换 */}
      <SunIcon
        className={cn(
          'absolute h-4 w-4 transition-all duration-base ease-out-quart',
          isDark ? 'translate-y-0 opacity-0 rotate-0' : 'translate-y-0 opacity-100 rotate-0',
        )}
        aria-hidden
      />
      <MoonIcon
        className={cn(
          'absolute h-4 w-4 transition-all duration-base ease-out-quart',
          isDark ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden
      />
      <span className="sr-only">
        {isDark ? '亮色' : '暗色'}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------- */

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
