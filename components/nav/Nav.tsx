'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { site } from '@/lib/config';
import { usePreferencesOpen } from '@/lib/preferences';

import { CommandMenu } from '@/components/nav/CommandMenu';
import { PreferencesDialog } from '@/components/preferences/PreferencesDialog';
import { PreferencesTrigger } from '@/components/preferences/PreferencesTrigger';

/**
 * Nav —— atom63.io 极简风格
 *
 * 1:1 对齐 atom63.io 真实结构（JS bundle 实测）:
 *   - 58px 高 sticky header
 *   - bg-background/80 + backdrop-blur-md
 *   - 左：logo link（带 . 句点强调色） + / + 当前页面 mono 标签
 *   - 右：单一 Menu 按钮（点击展开 CommandMenu 命令面板）
 *
 * X / GitHub / Email / Behance / IG / LinkedIn / ADPList / 小红书 全部
 * 收纳到 CommandMenu 的 Elsewhere 分组里；Preferences 在 Actions 分组。
 */
export function Nav() {
  const pathname = usePathname();
  const { open, setOpen, toggle } = usePreferencesOpen();

  // /resume 路由是独立全屏编辑器（参考 resume.atom63.io 子站）——
  // 不显示 Nav / Back / CommandMenu，完全 chromeless。
  // 注意：early return 必须在所有 Hooks 之后（React rules-of-hooks）。
  if (pathname.startsWith('/resume')) return null;

  const pageTitle = pathname === '/' ? 'Index' : pathname.split('/').filter(Boolean).pop() ?? '';
  const isProjectPage = pathname.startsWith('/projects/');

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[58px] border-b border-dashed border-border-default bg-bg-canvas/80 backdrop-blur-md">
        <nav className="mx-auto flex h-full max-w-xl items-center justify-between px-6">
          {/* 左：详情页显示 Back 按钮，其他页面显示 logo + / + pageTitle */}
          {isProjectPage ? (
            <Link
              href="/#timeline"
              data-cursor="link"
              aria-label="Back to timeline"
              className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors duration-micro ease-out-quart hover:text-text-primary"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-[14px] transition-transform duration-micro ease-out-quart group-hover:-translate-x-0.5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Back</span>
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-2.5">
              <Link
                href="/"
                aria-label={`${site.nameEn} home`}
                className="shrink-0 text-text-primary outline-none transition-opacity duration-micro hover:opacity-70"
              >
                {site.nameEn}
                <span className="text-[var(--a63-brand-current)]">.</span>
              </Link>
              <span aria-hidden className="select-none text-sm text-text-tertiary">
                /
              </span>
              <span className="truncate font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                {pageTitle}
              </span>
            </div>
          )}

          {/* 右：Menu 按钮 + ⚛️ Preferences 按钮 */}
          <div className="flex shrink-0 items-center gap-2">
            <CommandMenu onOpenPreferences={() => setOpen(true)} />
            <PreferencesTrigger onClick={toggle} aria-expanded={open} />
          </div>
        </nav>
      </header>

      {/* Preferences Dialog —— open state 由 Nav 管理，CommandMenu 通过 onOpenPreferences 触发 */}
      <PreferencesDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
