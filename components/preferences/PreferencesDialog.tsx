'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { usePreferences } from '@/lib/preferences';

import { PreferencesPanel } from './sections';

/**
 * PreferencesDialog —— atom63.io SiteConfigDialog 1:1 复刻
 *
 * 实测结构（atom63.io JS bundle）:
 *   - 位置：right-3 bottom-3（sm: right-4 bottom-4）右下角浮窗
 *   - 宽度：min(24rem, calc(100vw - 1.5rem)) → sm 起 384px
 *   - 圆角：var(--showcase-radius)（16px，随 Radius 偏好联动）
 *   - 双层毛玻璃：
 *       外层 Card bg-muted/78 backdrop-blur-2xl
 *       内层 CardContent bg-background/84 backdrop-blur-xl
 *   - max-height: min(86svh, 42rem)
 *   - 滚动区: min(60svh, 32rem)
 *   - z-index: 200
 *   - 动画：opacity + transform 180ms ease-out
 *
 * 关闭机制：
 *   - Esc 键
 *   - 外部 pointerdown（不在 dialog 子树内）
 */
export function PreferencesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const { prefs, update, reset } = usePreferences();
  const containerRef = useRef<HTMLDivElement>(null);

  // mounted gate —— SSR 安全
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 动画：open=true 进入动画；open=false 退出动画后再卸载
  const [visible, setVisible] = useState(open);
  const [animating, setAnimating] = useState(open);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReducedMotion(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const raf = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(raf);
    }
    setAnimating(false);
    if (reducedMotion) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => setVisible(false), 180);
    return () => window.clearTimeout(t);
  }, [open, reducedMotion]);

  // Esc 关闭
  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  // 外部 click 关闭
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const handler = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      // 触发器（带 data-site-config-trigger）不算外部
      if (target instanceof Element && target.closest('[data-site-config-trigger]')) return;
      onOpenChange(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open, onOpenChange]);

  if (!mounted || !visible) return null;

  return createPortal(
    // === 外框 === fafafa 底 + 阴影 + 内含两张独立卡片（Preferences + Reset all）
    <div
      ref={containerRef}
      role="dialog"
      aria-labelledby={`${id}-title`}
      data-slot="site-config-popover"
      data-state={animating ? 'open' : 'closed'}
      className={cn(
        'fixed right-3 bottom-3 z-[200]',
        'w-[min(24rem,calc(100vw-1.5rem))]',
        'sm:right-4 sm:bottom-4 sm:w-96',
        // === 外框：fafafa 底 + 阴影，圆角跟随 Radius 偏好，无边框 ===
        'rounded-[var(--showcase-radius)] bg-[#fafafa] dark:bg-[#1a1a1a]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]',
        'flex flex-col gap-[8px] p-[8px] pb-[64px]',
        'mb-[env(safe-area-inset-bottom)]',
      )}
      style={{
        opacity: animating ? 1 : 0,
        transform: animating ? 'translate3d(0, 0, 0)' : 'translate3d(0, 12px, 0)',
        transition: reducedMotion
          ? 'none'
          : ['transform 180ms cubic-bezier(0.16, 1, 0.3, 1)', 'opacity 180ms cubic-bezier(0.16, 1, 0.3, 1)'].join(', '),
        willChange: 'transform, opacity',
        maxHeight: 'min(86svh, 42rem)',
      }}
    >
      {/* === 卡片 1：Preferences panel === */}
      <div
        className={cn(
          'flex min-h-0 flex-col overflow-hidden',
          'rounded-[var(--panel-radius)] border border-[#EEEEEE] dark:border-[#2a2a2a]',
          'bg-[#ffffff] dark:bg-[#161616] backdrop-blur-2xl',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        )}
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="text-sm font-semibold text-text-primary">
              偏好设置
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              调整网站表面、强调色、字体与交互手感。
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="关闭偏好设置"
            data-cursor="link"
            className={cn(
              '-me-1 -mt-1 inline-flex size-[28px] shrink-0 items-center justify-center',
              'rounded-[var(--control-radius)] text-text-secondary',
              'transition-colors duration-micro ease-out-quart',
              'hover:bg-white/5 hover:text-text-primary',
            )}
          >
            <CloseIcon className="size-[16px]" />
          </button>
        </header>

        {/* Body —— 滚动区 */}
        <div
          className="min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4"
          style={{ height: 'min(60svh, 32rem)' }}
        >
          <PreferencesPanel prefs={prefs} update={update} />
        </div>
      </div>

      {/* === Reset all —— 直接坐外框底部，无独立卡片 === */}
      <button
        type="button"
        onClick={reset}
        data-cursor="link"
        className={cn(
          'absolute bottom-[24px] right-[24px] z-10',
          'inline-flex h-[32px] items-center gap-[8px] px-[12px]',
          'rounded-[var(--control-radius)]',
          'font-mono text-[11px] uppercase tracking-wider',
          'text-text-tertiary',
          'transition-colors duration-micro ease-out-quart',
          'hover:bg-black/5 hover:text-text-primary dark:hover:bg-white/5',
        )}
      >
        <RotateIcon className="size-[14px]" />
        全部重置
      </button>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function RotateIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
