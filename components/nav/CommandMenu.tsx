'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { site } from '@/lib/config';
import { cn, withBasePath } from '@/lib/utils';

/**
 * CommandMenu —— atom63.io Nav 顶部的命令面板风格弹出菜单
 *
 * 1:1 对齐 atom63.io 真实 DOM 结构（base-ui Command 组件）:
 *   <CommandList>
 *     <CommandGroup label="Navigate">
 *       <CommandItem icon>Label</CommandItem>
 *       ...
 *     </CommandGroup>
 *     <CommandSeparator />
 *     <CommandGroup label="Elsewhere">...</CommandGroup>
 *     <CommandSeparator />
 *     <CommandGroup label="Actions">...</CommandGroup>
 *   </CommandList>
 *
 * 三组：
 *   1. Navigate  —— Index / Timeline / Writing / OS63（外链）
 *   2. Elsewhere —— Copy email / Behance / IG / LinkedIn / GitHub / X / ADPList / 小红书
 *   3. Actions   —— Preferences（⌘+,）
 *
 * 单项结构：
 *   icon(size-4) + label(flex-1 truncate) + [external arrow / shortcut kbd]
 *
 * 外部链接项尾部带 size-3.5 external arrow（text-text-tertiary）。
 * Preferences 项尾部带 ⌘+, kbd。
 */
export function CommandMenu({
  onOpenPreferences,
}: {
  onOpenPreferences: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 开关 + 动画
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      setVisible(true);
      return;
    }
    // 关闭：等动画结束再卸载
    const t = window.setTimeout(() => setVisible(false), 140);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // 外部 click 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (containerRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  if (!mounted) {
    return (
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        data-site-menu-trigger=""
        data-cursor="link"
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-[var(--control-radius)]',
          'bg-bg-elevated text-text-primary',
          'border border-border-subtle',
          'transition-colors duration-micro ease-out-quart',
          'hover:border-border-default hover:bg-bg-surface',
        )}
      >
        <MenuIcon className="size-[14px]" />
      </button>
    );
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const copyWechat = async () => {
    if (!site.wechat) return;
    try {
      await navigator.clipboard.writeText(site.wechat);
      setWechatCopied(true);
      window.setTimeout(() => setWechatCopied(false), 1400);
    } catch {
      /* ignore —— clipboard may be blocked, no graceful fallback for WeChat id */
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="listbox"
        data-site-menu-trigger=""
        data-cursor="link"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-7 items-center gap-1.5 rounded-[var(--control-radius)] px-2.5',
          'bg-bg-elevated text-text-primary',
          'border border-border-subtle',
          'transition-colors duration-micro ease-out-quart',
          'hover:border-border-default hover:bg-bg-surface',
          open && 'border-border-default bg-bg-surface',
        )}
      >
        <MenuIcon className="size-[14px]" />
        <span className="text-[11px] font-medium leading-none">Menu</span>
      </button>

      {visible && createPortal(
        <>
          {/* 背景 overlay —— 点击关闭 + 模糊页面其他内容 */}
          <div
            aria-hidden
            data-slot="command-backdrop"
            onPointerDown={() => setOpen(false)}
            className={cn(
              'fixed inset-0 z-overlay',
              'bg-black/20',
              'transition-opacity duration-140 ease-out-quart',
            )}
            style={{
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
            }}
          />
          <div
            ref={containerRef}
            role="dialog"
            aria-label="Site menu"
            data-slot="command-root"
            data-state={open ? 'open' : 'closed'}
            className={cn(
              'fixed z-overlay left-1/2 top-[66px]',
              'w-[min(24rem,calc(100vw-1.5rem))]',
              'shadow-[var(--shadow-elev-3)]',
            )}
            style={{
              opacity: open ? 1 : 0,
              transform: open
                ? 'translate3d(-50%, 0, 0)'
                : 'translate3d(-50%, -8px, 0)',
              transition: 'transform 140ms cubic-bezier(0.16,1,0.3,1), opacity 140ms cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'top center',
            }}
          >
            {/* 外层 popup —— 1:1 atom63 .a63-Command-popup
                surface-overlay #2a2a2a(dark)/#fcfcfc(light) + 1px 扫描线纹理
                border 1px subtle, radius 18px (--radius-2xl) */}
            <div
              className="relative overflow-hidden rounded-[var(--showcase-radius)] border border-border-subtle bg-[#fafafa] dark:bg-[#1a1a1a]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, var(--menu-scanline) 0px, var(--menu-scanline) 1px, transparent 1px, transparent 2px)',
                boxShadow: 'var(--shadow-elev-3)',
              }}
            >
              {/* 内层 panel —— 1:1 atom63 .a63-Command-panel
                  surface-page #111(dark)/canvas(light), margin 8px, radius 14px
                  border 1px subtle-24% */}
              <div
                className="relative m-2 overflow-hidden rounded-[var(--panel-radius)] border border-[#EEEEEE] bg-[#ffffff] dark:border-[#2a2a2a] dark:bg-[#161616]"
              >
                <div
                  tabIndex={-1}
                  role="listbox"
                  aria-label="Site menu"
                  data-slot="command-list"
                  className="a63-Command-list py-4 px-2"
                >
            {/* Navigate */}
            <Group label="Navigate">
              <Item
                icon={<HomeIcon />}
                label="Index"
                onClick={() => goTo('/')}>
              </Item>
              <Item
                icon={<TimelineIcon />}
                label="Timeline"
                onClick={() => goTo('/#timeline')}
              />
            </Group>

            {/* Resume —— Word / PDF 双版本下载 */}
            <Group label="简历">
              <DownloadItem
                icon={<FileTextIcon />}
                label="Word 简历"
                description="可编辑版本——完整工作经历与项目细节，便于按岗位定制修改"
                href="/resumes/wufan-resume.docx"
                size="16 KB"
                onNavigate={() => setOpen(false)}
              />
              <DownloadItem
                icon={<FileTextIcon />}
                label="PDF 作品集 · 在线查看"
                description="49 页完整版——缩略图导航 + 键盘翻页，页内可下载 PDF"
                href="/pdf-viewer/"
                size="查看"
                mode="view"
                onNavigate={() => setOpen(false)}
              />
            </Group>

            <Separator />

            {/* Contact —— 邮箱 + 电话 + 微信（替代原 Elsewhere 社交链接） */}
            <Group label="Contact">
              <Item
                icon={<MailIcon />}
                label={copied ? 'Email copied' : `Copy email · ${site.email}`}
                onClick={copyEmail}
              />
              {site.phone && (
                <Item
                  icon={<PhoneIcon />}
                  label={site.phone}
                  external
                  onClick={() => openExternal(`tel:${site.phone}`)}
                />
              )}
              {site.wechat && (
                <Item
                  icon={<ChatIcon />}
                  label={wechatCopied ? 'WeChat copied' : `Copy WeChat · ${site.wechat}`}
                  onClick={copyWechat}
                />
              )}
            </Group>

            <Separator />

            {/* Actions */}
            <Group label="Actions">
              <Item
                icon={<GearIcon />}
                label="Preferences"
                shortcut="⌘+,"
                onClick={() => {
                  setOpen(false);
                  onOpenPreferences();
                }}
              />
            </Group>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

/* ============================================================ */
/*  Helpers                                                     */
/* ============================================================ */

function goTo(href: string) {
  if (window.location.pathname !== '/' || !href.includes('#')) {
    window.location.href = href;
    return;
  }
  // 同页 anchor 滚动
  const id = href.split('#')[1] || '';
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openExternal(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer');
}

/* ============================================================ */
/*  Sub-components                                              */
/* ============================================================ */

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" data-slot="command-group" className="a63-Command-group">
      <div
        data-slot="command-group-label"
        className="a63-Command-group-label px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary"
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Item({
  icon,
  label,
  shortcut,
  external,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  external?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      role="option"
      data-slot="command-item"
      data-cursor="link"
      onClick={onClick}
      className={cn(
        'a63-Command-item group relative flex cursor-pointer items-center gap-2.5',
        'px-3 py-1.5 text-[13px]',
        'text-text-secondary transition-colors duration-micro ease-out-quart',
        'hover:bg-bg-elevated hover:text-text-primary',
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-current">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {shortcut && (
        <kbd
          data-slot="command-shortcut"
          className="a63-Command-shortcut ml-auto shrink-0 font-mono text-[10px] text-text-tertiary"
        >
          {shortcut}
        </kbd>
      )}
      {external && (
        <span className="ml-auto flex size-3.5 shrink-0 items-center justify-center text-text-tertiary/70 transition-colors group-hover:text-text-secondary">
          <ExternalArrowIcon />
        </span>
      )}
    </div>
  );
}

function Separator() {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="command-separator"
      className="a63-Command-separator my-1 h-px bg-border-subtle"
    />
  );
}

/* DownloadItem —— 双行简历项：标题 + 说明 + 尾部按钮。
   mode='download'（默认）：尾部下载按钮（含文件大小）；
   mode='view'：整行可点，尾部「查看 ↗」——新窗口打开在线查看器 */
function DownloadItem({
  icon,
  label,
  description,
  href,
  size,
  onNavigate,
  mode = 'download',
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  size: string;
  onNavigate: () => void;
  mode?: 'download' | 'view';
}) {
  const openViewer = () => {
    window.open(withBasePath(href), '_blank', 'noopener');
    onNavigate();
  };
  return (
    <div
      role="option"
      data-slot="command-item"
      data-cursor="link"
      onClick={mode === 'view' ? openViewer : undefined}
      className={cn(
        'a63-Command-item group relative flex cursor-pointer items-center gap-2.5',
        'px-3 py-1.5 text-[13px]',
        'text-text-secondary transition-colors duration-micro ease-out-quart',
        'hover:bg-bg-elevated hover:text-text-primary',
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-current">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{label}</span>
        <span className="block truncate text-[11px] leading-snug text-text-tertiary">
          {description}
        </span>
      </span>
      <a
        href={withBasePath(href)}
        {...(mode === 'view'
          ? { target: '_blank', rel: 'noopener' }
          : { download: true })}
        data-cursor="link"
        onClick={(e) => {
          e.stopPropagation();
          if (mode === 'download') onNavigate();
        }}
        className={cn(
          'ml-auto inline-flex h-[24px] shrink-0 items-center gap-1 rounded-[var(--control-radius)]',
          'border border-border-subtle bg-bg-elevated px-2',
          'font-mono text-[10px] tracking-wide text-text-secondary',
          'transition-colors duration-micro ease-out-quart',
          'hover:border-border-default hover:text-text-primary',
          mode === 'view' && 'border-[#366FF9]/40 text-text-primary',
        )}
      >
        {mode === 'view' ? <ArrowUpRightIcon /> : <DownloadIcon />}
        {mode === 'view' ? '查看' : size}
      </a>
    </div>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/* ============================================================ */
/*  Icons —— 全部 1:1 提取自 atom63.io bundle (iconify 路径)    */
/* ============================================================ */

function MenuIcon({ className }: { className?: string }) {
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
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M3 18q-.825 0-1.412-.587T1 16t.588-1.412T3 14h.263q.112 0 .237.05L8.05 9.5Q8 9.375 8 9.262V9q0-.825.588-1.412T10 7t1.413.588T12 9q0 .05-.05.5l2.55 2.55q.125-.05.238-.05h.525q.112 0 .237.05l3.55-3.55Q19 8.375 19 8.262V8q0-.825.588-1.412T21 6t1.413.588T23 8t-.587 1.413T21 10h-.262q-.113 0-.238-.05l-3.55 3.55q.05.125.05.238V14q0 .825-.587 1.413T15 16t-1.412-.587T13 14v-.262q0-.113.05-.238l-2.55-2.55q-.125.05-.238.05H10q-.05 0-.5-.05L4.95 15.5q.05.125.05.238V16q0 .825-.587 1.413T3 18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[11px]" fill="currentColor">
      <path d="M12 16q-.425 0-.712-.288T11 15V7.825L8.4 10.4q-.275.275-.7.275T7 10.4q-.275-.275-.275-.7T7 9l5-5l5 5q.275.275.275.7T17 10.4q-.275.275-.7.275t-.7-.275L13 7.825V15q0 .425-.288.713T12 16m-6 4q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288t.287.712v2q0 .825-.587 1.413T18 20z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zM6 20V4h7v5h5v11zm2-7h8v1.5H8zm0 3.5h8V20H8zM8 9h3v1.5H8z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 9h12v2H6zm8 5H6v-2h8zm4-6H6V6h12z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill="currentColor">
      <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413T19 21zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4z" />
    </svg>
  );
}
