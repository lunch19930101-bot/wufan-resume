'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn, withBasePath } from '@/lib/utils';

/**
 * PdfViewer —— 作品集 PDF 在线查看器
 *
 * 参考 AI 简历项目的编辑器布局语言，整体氛围取自 PDF 本身的深蓝科技风：
 *   深海军蓝底 + 蓝色网格经纬 + 玻璃浮层 + 等宽数字
 *
 * 结构：
 *   ┌────────────────────────────────────────────────┐
 *   │ ▮ 吴帆作品集 · 2025    PAGE 07/49 · 章节   下载 ↗│ ← 顶栏 h-14
 *   ├──────┬─────────────────────────────────────────┤
 *   │ 缩略 │                                         │
 *   │ 图轨 │        主舞台（16:9 大图 + 四角框）        │
 *   │ +页码│                                         │
 *   ├──────┴─────────────────────────────────────────┤
 *   │ (移动端)  ▁▁▁▂▁▁▁▁ 页码指示条                    │
 *   └────────────────────────────────────────────────┘
 *
 * - fixed inset-0 全屏 —— 独立于正文 zoom 缩放体系（type-scale 不影响本页）
 * - 键盘 ←→/PgUp/PgDn/Home/End 翻页，Esc 返回站点
 * - 滚轮翻页（350ms 节流）、触屏横滑翻页
 * - 自动预加载当前页 ±2，翻页零等待
 */

const PAGE_COUNT = 49;
const PDF_HREF = '/resumes/wufan-resume.pdf';

const SECTIONS = [
  { from: 1, to: 4, label: '封面 · 简介 · 工作经历' },
  { from: 5, to: 10, label: '统信软件 2021–2025' },
  { from: 11, to: 20, label: '网点服务小程序' },
  { from: 21, to: 37, label: '口袋银行家 2.0' },
  { from: 38, to: 49, label: '后台 · 人才库 · 规范' },
] as const;

const pad = (n: number) => String(n).padStart(2, '0');
const pageSrc = (n: number) => withBasePath(`/resumes/pages/p${pad(n)}.jpg`);
const thumbSrc = (n: number) => withBasePath(`/resumes/thumbs/t${pad(n)}.jpg`);
const sectionOf = (n: number) => SECTIONS.find((s) => n >= s.from && n <= s.to);
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function PdfViewer() {
  const [page, setPage] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const railRef = useRef<HTMLDivElement>(null);
  const wheelAt = useRef(0);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setPage((p) => {
      const clamped = Math.min(PAGE_COUNT, Math.max(1, next));
      setDir(clamped >= p ? 1 : -1);
      return clamped;
    });
  }, []);

  /* 键盘：←→ / PgUp PgDn / Home End / Esc */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(page + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(page - 1);
      else if (e.key === 'Home') go(1);
      else if (e.key === 'End') go(PAGE_COUNT);
      else if (e.key === 'Escape') window.location.href = withBasePath('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, go]);

  /* 当前页缩略图滚进轨道视野（只滚轨道自身）+ 预加载 ±2 */
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.querySelector<HTMLElement>(`[data-p="${page}"]`);
    if (rail && thumb) {
      const top = thumb.offsetTop - (rail.clientHeight - thumb.clientHeight) / 2;
      rail.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    for (const n of [page - 2, page - 1, page + 1, page + 2]) {
      if (n >= 1 && n <= PAGE_COUNT) {
        const img = new Image();
        img.src = pageSrc(n);
      }
    }
  }, [page]);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelAt.current < 350 || Math.abs(e.deltaY) < 12) return;
    wheelAt.current = now;
    go(page + (e.deltaY > 0 ? 1 : -1));
  };

  const section = sectionOf(page);

  return (
    <div
      className="fixed inset-0 z-[9990] flex flex-col overflow-hidden bg-[#0A0F1E] text-[#E8EEF9]"
      onWheel={onWheel}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(dx) > 42) go(page + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <style>{`@keyframes pv-fade-in{from{opacity:0;transform:translateX(var(--pv-slide,10px))}to{opacity:1;transform:none}}`}</style>

      {/* 顶部进度条 */}
      <div className="absolute inset-x-0 top-0 z-20 h-[2px] bg-[#69ACF9]/10">
        <div
          className="h-full bg-gradient-to-r from-[#366FF9] to-[#69ACF9] transition-[width] duration-300 ease-out"
          style={{ width: `${(page / PAGE_COUNT) * 100}%` }}
        />
      </div>

      {/* ── 顶栏 ─────────────────────────────────────── */}
      <header className="relative z-10 flex h-14 shrink-0 items-center gap-3 border-b border-[#69ACF9]/15 bg-[#0A0F1E]/90 px-4 backdrop-blur-sm md:px-6">
        <a
          href={withBasePath('/')}
          data-cursor="link"
          className="flex items-center gap-2.5"
          aria-label="返回站点首页"
        >
          <span className="flex size-[26px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#366FF9] to-[#1B3B8F] font-mono text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(54,111,249,0.45)]">
            W
          </span>
          {/* #走查修复（375px）：顶栏 logo 文字（~160px）把「返回站点」挤成两行 ——
              <sm 只留 W 标（aria-label 仍在），按钮组 shrink-0 防压缩 */}
          <span className="hidden leading-tight sm:block">
            <span className="block text-[13px] font-medium tracking-wide">吴帆 · 作品集 2025</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-[#5E6F92]">
              Portfolio / PDF Viewer
            </span>
          </span>
        </a>

        {/* 居中页码 + 章节（桌面） */}
        <div className="mx-auto hidden items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-[#9FB0CE] md:flex">
          <span className="text-[#5E6F92]">PAGE</span>
          <span className="tabular-nums text-[#E8EEF9]">{pad(page)}</span>
          <span className="text-[#5E6F92]">/ {PAGE_COUNT}</span>
          <span className="h-3 w-px bg-[#69ACF9]/25" />
          <span className="tracking-[0.08em]">{section?.label}</span>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={withBasePath(PDF_HREF)}
            download
            data-cursor="link"
            className="inline-flex h-[34px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] bg-[#366FF9] px-3.5 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(54,111,249,0.35)] transition-colors hover:bg-[#2C5BE0]"
          >
            <DownloadIcon className="size-[14px]" />
            下载 PDF
          </a>
          <a
            href={withBasePath('/')}
            data-cursor="link"
            className="inline-flex h-[34px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] border border-[#69ACF9]/25 px-3.5 text-[13px] text-[#9FB0CE] transition-colors hover:border-[#69ACF9]/60 hover:text-[#E8EEF9]"
          >
            返回站点
          </a>
        </div>
      </header>

      {/* ── 主体：左轨道 + 右舞台 ─────────────────────── */}
      <div className="relative flex min-h-0 flex-1">
        {/* 背景经纬网格 + 辉光 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(105,172,249,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(105,172,249,0.05) 1px, transparent 1px), radial-gradient(ellipse 70% 55% at 50% 0%, rgba(54,111,249,0.14), transparent 70%)',
            backgroundSize: '48px 48px, 48px 48px, 100% 100%',
          }}
        />

        {/* 左：缩略图轨道（桌面） */}
        <nav
          ref={railRef}
          aria-label="页面导航"
          className="relative z-10 hidden w-[168px] shrink-0 overflow-y-auto border-r border-[#69ACF9]/10 bg-[#0D1526]/60 p-3 md:block"
        >
          {SECTIONS.map((sec) => (
            <div key={sec.from} className="mb-5 last:mb-1">
              <p className="mb-2 flex items-baseline justify-between px-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#5E6F92]">
                <span className="truncate">{sec.label}</span>
                <span className="ml-1 shrink-0 tabular-nums opacity-70">
                  {pad(sec.from)}–{pad(sec.to)}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {range(sec.from, sec.to).map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-p={n}
                    data-cursor="link"
                    aria-label={`第 ${n} 页`}
                    aria-current={n === page}
                    onClick={() => go(n)}
                    className={cn(
                      'relative overflow-hidden rounded-[6px] border transition-all duration-150',
                      n === page
                        ? 'border-[#366FF9] opacity-100 shadow-[0_0_12px_rgba(54,111,249,0.5)] ring-1 ring-[#366FF9]/60'
                        : 'border-white/10 opacity-50 hover:opacity-95',
                    )}
                  >
                    <img
                      src={thumbSrc(n)}
                      alt=""
                      loading={n <= 8 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="block w-full"
                    />
                    <span
                      className={cn(
                        'absolute bottom-1 left-1 rounded-[3px] px-1 font-mono text-[9px] tabular-nums',
                        n === page ? 'bg-[#366FF9] text-white' : 'bg-[#0A0F1E]/85 text-[#9FB0CE]',
                      )}
                    >
                      {pad(n)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 右：主舞台 */}
        <main className="relative z-10 flex min-w-0 flex-1 flex-col">
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 pb-16 md:p-10">
            {/* 幽灵页码 */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-2 right-4 select-none font-mono text-[110px] font-semibold leading-none tracking-tighter text-white/[0.05] md:text-[150px]"
            >
              {pad(page)}
            </span>

            {/* 四角取景框 */}
            <div className="relative flex max-h-full max-w-full items-center justify-center">
              <span className="pointer-events-none absolute -left-3 -top-3 size-5 border-l-2 border-t-2 border-[#69ACF9]/50" />
              <span className="pointer-events-none absolute -right-3 -top-3 size-5 border-r-2 border-t-2 border-[#69ACF9]/50" />
              <span className="pointer-events-none absolute -bottom-3 -left-3 size-5 border-b-2 border-l-2 border-[#69ACF9]/50" />
              <span className="pointer-events-none absolute -bottom-3 -right-3 size-5 border-b-2 border-r-2 border-[#69ACF9]/50" />

              <img
                key={page}
                src={pageSrc(page)}
                alt={`作品集 第 ${page} 页`}
                decoding="async"
                className="max-h-full max-w-full animate-[pv-fade-in_0.3s_cubic-bezier(0.22,1,0.36,1)] rounded-[6px] object-contain shadow-[0_28px_90px_-18px_rgba(0,0,0,0.85)]"
                style={{ ['--pv-slide' as string]: `${dir * 12}px` }}
              />
            </div>

            {/* 左右翻页 */}
            <button
              type="button"
              data-cursor="link"
              aria-label="上一页"
              onClick={() => go(page - 1)}
              disabled={page === 1}
              className={cn(
                'absolute left-3 top-1/2 z-10 inline-flex size-[38px] -translate-y-1/2 items-center justify-center',
                'rounded-[10px] border border-[#69ACF9]/25 bg-[#0D1526]/80 text-[#E8EEF9] backdrop-blur-md',
                'transition-all duration-150 hover:border-[#366FF9] hover:bg-[#111A30]',
                page === 1 && 'pointer-events-none opacity-25',
              )}
            >
              <ChevronLeftIcon className="size-[15px]" />
            </button>
            <button
              type="button"
              data-cursor="link"
              aria-label="下一页"
              onClick={() => go(page + 1)}
              disabled={page === PAGE_COUNT}
              className={cn(
                'absolute right-3 top-1/2 z-10 inline-flex size-[38px] -translate-y-1/2 items-center justify-center',
                'rounded-[10px] border border-[#69ACF9]/25 bg-[#0D1526]/80 text-[#E8EEF9] backdrop-blur-md',
                'transition-all duration-150 hover:border-[#366FF9] hover:bg-[#111A30]',
                page === PAGE_COUNT && 'pointer-events-none opacity-25',
              )}
            >
              <ChevronRightIcon className="size-[15px]" />
            </button>
          </div>

          {/* 底部：移动端页码刻度条 / 桌面端翻页提示 */}
          <div className="flex h-12 shrink-0 items-center justify-center gap-2 border-t border-[#69ACF9]/10 bg-[#0A0F1E]/80 px-4">
            <div className="flex items-end gap-[3px] overflow-hidden">
              {range(1, PAGE_COUNT).map((n) => (
                <button
                  key={n}
                  type="button"
                  data-cursor="link"
                  aria-label={`第 ${n} 页`}
                  onClick={() => go(n)}
                  className="group flex h-8 w-[7px] items-end justify-center"
                >
                  <span
                    className={cn(
                      'w-[3px] rounded-full transition-all duration-200',
                      n === page
                        ? 'h-4 bg-[#366FF9] shadow-[0_0_8px_rgba(54,111,249,0.8)]'
                        : 'h-1.5 bg-white/15 group-hover:bg-white/35',
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="ml-2 hidden font-mono text-[10px] tracking-[0.18em] text-[#5E6F92] lg:inline">
              ←→ 翻页 · 滚轮 · ESC 返回
            </span>
            <span className="ml-2 font-mono text-[10px] tabular-nums tracking-[0.14em] text-[#9FB0CE] md:hidden">
              {pad(page)}/{PAGE_COUNT}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── 图标 ──────────────────────────────────────────── */

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M12 15V3" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
