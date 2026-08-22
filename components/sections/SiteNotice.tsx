'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

/**
 * SiteNotice —— 顶部 Design-system 提示条
 *
 * 跟随两个 Preferences：
 *   - Primary（品牌色）→ bg 用 var(--a63-brand-current)，border 用 32% 透明同色
 *   - Radius          → 用 var(--a63-radius-actual)
 *
 * 切 Primary 时颜色变（蓝/橙/绿/粉/紫/红），
 * 切 Radius 时圆角变（0/2/12/28 px）。
 *
 * /resume 路由 chromeless，不显示 SiteNotice。
 */
export function SiteNotice() {
  const pathname = usePathname();
  if (pathname.startsWith('/resume')) return null;

  return (
    <section aria-label="Site notice" className="bg-bg-canvas">
      <div className="mx-auto max-w-xl px-6 py-4">
        <p
          role="status"
          className={cn(
            'w-full border px-4 py-2.5',
            'text-left font-medium text-sm leading-snug',
            'shadow-sm text-pretty',
          )}
          style={{
            backgroundColor: 'var(--notice-bg)',
            borderColor: 'var(--notice-border)',
            color: 'var(--notice-fg)',
            borderRadius: 'var(--notice-radius)',
          }}
        >
          Design system working in progress — you may experience issues.
        </p>
      </div>
    </section>
  );
}
