'use client';

import { Fragment, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { site } from '@/lib/config';

/**
 * Footer — atom63.io 风格 colophon
 *
 * 结构：
 *   1. GridRule（full-bleed + 两端菱形）—— /Contact 上沿
 *   2. / Contact          —— 邮箱 + 电话
 *   3. GridRule（full-bleed + 两端菱形）—— Build 上沿 / boundary
 *   4. Build area：3 行 2 列，自包含 max-w-[672px] 区块
 *        Build   | Shipped
 *        Engine  | Viewport
 *        Beijing | Local    ← 看板行：Doto 点阵大数字（天气 + HH∶MM∶SS 时间）
 *      行间用 max-w-[672px] 宽度的 border-top 分隔；中心垂直分隔线贯穿每行
 *   5. GridRule（full-bleed + 两端菱形）—— Build 下沿 / boundary
 *   6. / Copyright
 *
 * 视觉规则（避免"虚线叠层"+ 严格区分通栏/非通栏）：
 *   - section boundary（Contact ↔ Build ↔ Copyright）：full-bleed GridRule + 端点菱形
 *   - Build area 内部：max-w-[672px] 宽度，单一连续 border-top/border-l，无菱形
 *   - cell 无 border（避免相邻 cell 虚线相位错位）
 *   - 所有虚线统一 var(--color-border-default)
 */
export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const [resolution, setResolution] = useState<string>('—');
  const [beijingTime, setBeijingTime] = useState<string>('--:--:--');
  const [beijingDate, setBeijingDate] = useState<string>('');

  // 屏幕分辨率
  useEffect(() => {
    const update = () =>
      setResolution(`${window.innerWidth}×${window.innerHeight}`);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 北京时间（Asia/Shanghai），每秒刷新；同时带上 atom63 看板式日期行
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const dateFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    const tick = () => {
      setBeijingTime(fmt.format(new Date()));
      setBeijingDate(dateFmt.format(new Date()).toUpperCase());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // /resume 路由 chromeless，不显示 Footer
  // 注意：early return 必须在所有 Hooks 之后（React rules-of-hooks）。
  if (pathname.startsWith('/resume')) return null;

  const rows: { left: CellData; right: CellData }[] = [
    {
      left: { label: '/ Build', value: '0b5b534' },
      right: { label: '/ Shipped', value: `Jul ${year}` },
    },
    {
      left: { label: '/ Engine', value: `Chromium ${year}` },
      right: { label: '/ Viewport', value: resolution },
    },
  ];

  /* 看板时间拆组：HH / MM / SS 各一组，冒号用两点（atom63 zoned-clock） */
  const timeParts = beijingTime.split(':');

  return (
    <footer className="relative z-[60] pb-24">
      {/* GridRule 1 —— 贯穿全屏的虚线 + 两端菱形 */}
      <GridRule />

      {/* / Contact —— 邮箱 + 电话（max-w-[672px] 容器内） */}
      <div className="mx-auto max-w-[672px] px-6">
        <section className="py-6">
          <p className="mb-3 font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
            / Contact
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                className="text-lg lowercase text-text-secondary transition-colors duration-micro hover:text-text-primary"
              >
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a
                  href={`tel:${site.phone}`}
                  data-cursor="link"
                  className="text-lg lowercase tabular-nums text-text-secondary transition-colors duration-micro hover:text-text-primary"
                >
                  {site.phone}
                </a>
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* GridRule 2 —— 贯穿全屏（boundary with Contact），两端有菱形 */}
      <GridRule />

      {/* Build area —— 自包含 max-w-[672px] 区块，不通栏，无菱形
          - 顶部/底部由外层 GridRule 提供（full-bleed + 端点菱形）
          - 内部行间分隔：max-w-[672px] 宽度的 border-top（与中心垂直分隔线同宽）
          - 中心垂直分隔线：absolute span，贯穿整行高度
          - 所有线统一用 border-border-default，避免相位错位 */}
      <div className="mx-auto max-w-[672px] px-6">
        <div className="-mx-6">
          {rows.map((row, i) => (
            <Fragment key={row.left.label}>
              <div className="relative grid grid-cols-2">
                <CellContent cell={row.left} />
                <CellContent cell={row.right} />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px border-l border-dashed border-border-default"
                />
              </div>
              {i < rows.length - 1 && (
                <div
                  className="border-t border-dashed border-border-default"
                  aria-hidden
                />
              )}
            </Fragment>
          ))}

          {/* 第 3 行 —— 天气 + 时间 看板（atom63 weather board / zoned-clock 风格）
              Doto 点阵大数字（font-digital）+ 两组数字夹两点冒号 */}
          <div className="border-t border-dashed border-border-default" aria-hidden />
          <div className="relative grid grid-cols-2">
            {/* / Beijing —— 天气看板 */}
            <div className="px-6 py-6">
              <p className="font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                / Beijing
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <SunIcon className="size-[18px] shrink-0 text-text-tertiary" />
                <p className="font-digital text-[40px] font-bold leading-none tabular-nums text-text-primary">
                  28
                  <span className="ml-0.5 font-mono text-[13px] font-semibold tracking-normal text-text-secondary">
                    °C
                  </span>
                </p>
              </div>
              <p className="mt-3 font-mono text-mono-micro tabular-nums text-text-tertiary">
                晴 · H 33° L 24°
              </p>
            </div>

            {/* / Local —— 时间看板（HH∶MM∶SS，冒号 = 两个 3px 点） */}
            <div className="px-6 py-6">
              <p className="font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                / Local
              </p>
              <div
                role="timer"
                aria-label={`北京时间 ${beijingTime}`}
                className="font-digital mt-3 flex items-center gap-[6px] text-[40px] font-bold leading-none tabular-nums text-text-primary"
              >
                <BoardDigits value={timeParts[0] ?? '--'} />
                <BoardColon />
                <BoardDigits value={timeParts[1] ?? '--'} />
                <BoardColon />
                <BoardDigits value={timeParts[2] ?? '--'} />
              </div>
              <p className="mt-3 font-mono text-mono-micro uppercase tabular-nums text-text-tertiary">
                {beijingDate ? `${beijingDate} · ` : ''}GMT+8
              </p>
            </div>

            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px border-l border-dashed border-border-default"
            />
          </div>
        </div>
      </div>

      {/* GridRule 3 —— 贯穿全屏（boundary with Copyright），两端有菱形 */}
      <GridRule />

      {/* / Copyright（max-w-[672px] 容器内） */}
      <div className="mx-auto max-w-[672px] px-6">
        <p className="py-6 text-left font-mono text-mono-micro text-text-tertiary">
          © {year} {site.name} · WF0101
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- */

/**
 * GridRule —— 贯穿整个 viewport 的虚线 + 两端 4px 实心菱形。
 * 直接渲染在 <footer> 子层（不在 max-w-[672px] 容器里），所以 width:100% = viewport 宽。
 * 视觉规则在 globals.css 的 .grid-rule / ::before / ::after。
 *
 * 端点菱形的位置 = viewport 左右边（不在 max-w-[672px] 边）。
 * 仅用于 section boundary（Contact ↔ Build ↔ Copyright）。
 * Build area 内部分隔不走 GridRule，避免通栏 + 避免棱形。
 */
function GridRule() {
  return <div className="grid-rule w-full" aria-hidden />;
}

type CellData = {
  label: string;
  value: string;
  sub?: string;
};

/**
 * BoardDigits —— 看板数字组（时 / 分 / 秒 各一组）
 * 分组渲染让每组宽度稳定，秒跳数时不抖动（atom63 will-change-contents 同思路）
 */
function BoardDigits({ value }: { value: string }) {
  return <div className="will-change-contents">{value}</div>;
}

/**
 * BoardColon —— 看板冒号：两个 3px 方点竖排（1:1 atom63 zoned-clock-separator）
 */
function BoardColon() {
  return (
    <span
      aria-hidden
      data-slot="board-clock-separator"
      className="mr-[2px] flex flex-col gap-[6px] text-text-tertiary opacity-60"
    >
      <span className="block size-[3px] bg-current" />
      <span className="block size-[3px] bg-current" />
    </span>
  );
}

/** SunIcon —— 天气看板小图标（晴天，线条风格与 mono 标签一致） */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/**
 * CellContent —— Build area 单元格。
 * - 不带 border：行间分隔由内层 border-top 提供，中心分隔线由 row 容器的 absolute span 提供
 * - 这样所有水平虚线都是单一连续元素（无相位错位），视觉无"叠层"感
 * - 始终渲染 sub 行（无 sub 时 invisible 占位），保证 3 行高度一致
 */
function CellContent({ cell }: { cell: CellData }) {
  return (
    <div className="px-6 py-6">
      <p className="font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
        {cell.label}
      </p>
      <p className="mt-[8px] font-mono text-[15px] tabular-nums leading-none text-text-primary">
        {cell.value}
      </p>
      <p
        className={
          cell.sub
            ? 'mt-[8px] font-mono text-mono-micro tabular-nums text-text-tertiary'
            : 'mt-[8px] font-mono text-mono-micro tabular-nums invisible'
        }
      >
        {cell.sub ?? '\u00A0'}
      </p>
    </div>
  );
}
