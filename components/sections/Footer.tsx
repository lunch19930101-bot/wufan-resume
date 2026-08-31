'use client';

import { Fragment, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { site } from '@/lib/config';
import { cn } from '@/lib/utils';

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
type WeatherData = {
  temp: number;
  code: number;
  isDay: boolean;
  high: number;
  low: number;
};

/* 武汉（30.59°N 114.31°E）—— 正文写「人在武汉」，看板城市与之一致 */
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=30.5928&longitude=114.3055' +
  '&current=temperature_2m,weather_code,is_day' +
  '&daily=temperature_2m_max,temperature_2m_min' +
  '&timezone=Asia%2FShanghai&forecast_days=1';

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const [resolution, setResolution] = useState<string>('—');
  const [beijingTime, setBeijingTime] = useState<string>('--:--:--');
  const [beijingDate, setBeijingDate] = useState<string>('');
  const [cnHour, setCnHour] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // 屏幕分辨率
  useEffect(() => {
    const update = () =>
      setResolution(`${window.innerWidth}×${window.innerHeight}`);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 北京时间（Asia/Shanghai），每秒刷新；同时带上 atom63 看板式日期行
  // cnHour —— 昼夜情景（6–18 白天）与时段问候语的依据
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
    const hourFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      hour: 'numeric',
      hour12: false,
    });
    const tick = () => {
      const now = new Date();
      setBeijingTime(fmt.format(now));
      setBeijingDate(dateFmt.format(now).toUpperCase());
      setCnHour(Number(hourFmt.format(now).replace(/\D/g, '')) || 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // 实时天气（open-meteo，免 key）—— 30 分钟 localStorage 缓存；
  // 失败静默降级为「离线」文案（看板不空、不报错，静态站零依赖）
  useEffect(() => {
    const KEY = 'wf-weather-v1';
    const TTL = 30 * 60 * 1000;
    let cancelled = false;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { t: number; d: WeatherData };
        if (Date.now() - parsed.t < TTL) {
          setWeather(parsed.d);
          return;
        }
      }
    } catch {
      /* 缓存损坏当没有 */
    }
    fetch(WEATHER_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('weather'))))
      .then((j) => {
        const d: WeatherData = {
          temp: Math.round(j.current.temperature_2m),
          code: j.current.weather_code,
          isDay: j.current.is_day === 1,
          high: Math.round(j.daily.temperature_2m_max[0]),
          low: Math.round(j.daily.temperature_2m_min[0]),
        };
        if (!cancelled) setWeather(d);
        try {
          localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d }));
        } catch {
          /* 隐私模式写不进就算了 */
        }
      })
      .catch(() => {
        /* 离线降级由渲染层处理 */
      });
    return () => {
      cancelled = true;
    };
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
      <div className="mx-auto max-w-[672px] px-6 lg:max-w-[864px] xl:max-w-[1088px]">
        <section className="py-6">
          <p className="mb-3 font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
            / Contact
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                /* #Phase1 M2 —— 正文文字链接：下划线从左生长（globals.css .link-grow）。
                   按 M2 语法文字链接只走下划线，不再叠加颜色 hover */
                className="link-grow text-lg lowercase text-text-secondary"
              >
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a
                  href={`tel:${site.phone}`}
                  data-cursor="link"
                  className="link-grow text-lg lowercase tabular-nums text-text-secondary"
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
      <div className="mx-auto max-w-[672px] px-6 lg:max-w-[864px] xl:max-w-[1088px]">
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
              Doto 点阵大数字（font-digital）+ 两组数字夹两点冒号
              #237 情景化：武汉实时天气（open-meteo）+ 昼夜图标 + 时段问候语 */}
          <div className="border-t border-dashed border-border-default" aria-hidden />
          {/* #走查适配修复：<412px 手机上两列各只剩 ~120px 内容区，40px 数字
              时钟（~174px）溢出屏幕右缘被裁 —— 手机改单列堆叠，md 起恢复两列 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2">
            {/* / 武汉 —— 天气看板（实时；图标随昼夜与天气现象切换） */}
            <div className="px-6 py-6">
              <p className="font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                / 武汉 · Wuhan
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {weather ? (
                  <WeatherIcon
                    code={weather.code}
                    isDay={weather.isDay}
                    className="size-[18px] shrink-0 text-text-tertiary"
                  />
                ) : (
                  <SignalLostIcon className="size-[18px] shrink-0 text-text-tertiary opacity-60" />
                )}
                <p className="font-digital text-[40px] font-bold leading-none tabular-nums text-text-primary">
                  {weather ? weather.temp : '--'}
                  <span className="ml-0.5 font-mono text-[13px] font-semibold tracking-normal text-text-secondary">
                    °C
                  </span>
                </p>
              </div>
              <p className="mt-3 font-mono text-mono-micro tabular-nums text-text-tertiary">
                {weather
                  ? `${WMO_LABEL[weather.code] ?? '—'} · H ${weather.high}° L ${weather.low}°`
                  : 'offline · 收不到武汉的云'}
              </p>
            </div>

            {/* / Local —— 时间看板（HH∶MM∶SS，冒号 = 两个 3px 点） */}
            <div className="border-t border-dashed border-border-default px-6 py-6 md:border-t-0">
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
              className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px hidden border-l border-dashed border-border-default md:block"
            />
          </div>

          {/* 情景条 —— 随武汉时间变化的时段问候（看板的「人在」信号） */}
          <div className="border-t border-dashed border-border-default" aria-hidden />
          <div className="flex items-center gap-2.5 px-6 py-4">
            <span
              aria-hidden
              className="dot-breathe dot-ping size-[5px] shrink-0 rounded-full bg-accent-lime text-accent-lime"
            />
            <p className="font-mono text-mono-micro tracking-wide text-text-tertiary">
              {cnHour === null ? '···' : greet(cnHour)}
            </p>
          </div>
        </div>
      </div>

      {/* GridRule 3 —— 贯穿全屏（boundary with Copyright），两端有菱形 */}
      <GridRule />

      {/* / Copyright（max-w-[672px] 容器内）—— 终点锚：落款 + 回到顶部，
          让长滚动的结尾有一个明确的「句号」（#237 走查） */}
      <div className="mx-auto max-w-[672px] px-6 lg:max-w-[864px] xl:max-w-[1088px]">
        <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-mono-micro text-text-tertiary">
            © {year} {site.name} · Designed & built with Claude Code · WF0101
          </p>
          <button
            type="button"
            data-cursor="link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              'inline-flex w-fit items-center gap-1.5',
              'font-mono text-mono-micro uppercase tracking-wider text-text-tertiary',
              'transition-colors duration-micro ease-out-quart hover:text-text-primary',
            )}
          >
            Back to top
            <ArrowUpIcon className="size-3" />
          </button>
        </div>
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

/* ============================================================
 * #237 情景化 —— WMO 天气码 → 中文现象 / 图标分组 / 时段问候
 * ============================================================ */

const WMO_LABEL: Record<number, string> = {
  0: '晴', 1: '少云', 2: '多云', 3: '阴',
  45: '雾', 48: '雾凇',
  51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨',
  61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '冻雨',
  71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
  80: '阵雨', 81: '阵雨', 82: '强阵雨', 85: '阵雪', 86: '阵雪',
  95: '雷雨', 96: '雷雨冰雹', 99: '雷雨冰雹',
};

type WeatherGroup = 'clear' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';

function wmoGroup(code: number): WeatherGroup {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  return 'storm';
}

/** 时段问候 —— 武汉本地（Asia/Shanghai）小时 → 一句有性格的短话 */
function greet(h: number): string {
  if (h < 5) return '凌晨 · 灵感最安静的时刻';
  if (h < 9) return '早安 · 新的一版从今天开始';
  if (h < 12) return '上午好 · 网格已就位';
  if (h < 14) return '午后 · 光标在慢慢闪';
  if (h < 18) return '下午好 · 排版的黄金时段';
  return '晚安 · 今天也认真收了尾';
}

/** WeatherIcon —— 线条风格与 mono 标签一致；晴/多云分昼夜（太阳 / 月亮） */
function WeatherIcon({
  code,
  isDay,
  className,
}: {
  code: number;
  isDay: boolean;
  className?: string;
}) {
  const g = wmoGroup(code);
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };

  if (g === 'clear') {
    return isDay ? <SunIcon {...props} /> : <MoonIcon {...props} />;
  }
  if (g === 'partly') {
    return (
      <svg {...props}>
        {isDay ? (
          <circle cx="8" cy="8" r="3" />
        ) : (
          <path d="M10 4.5A5.5 5.5 0 1 0 15.5 10 4 4 0 0 1 10 4.5Z" />
        )}
        <path d="M17.5 19a3.5 3.5 0 1 0-1.6-6.62A5 5 0 0 0 6.3 13.2 3.5 3.5 0 0 0 7 19h10.5Z" />
      </svg>
    );
  }
  if (g === 'cloud') {
    return (
      <svg {...props}>
        <path d="M17.5 19a4.5 4.5 0 1 0-1.96-8.55A6 6 0 1 0 6 19h11.5Z" />
      </svg>
    );
  }
  if (g === 'fog') {
    return (
      <svg {...props}>
        <path d="M17.5 15a4.5 4.5 0 1 0-1.96-8.55A6 6 0 1 0 6 15h11.5Z" />
        <path d="M5 19h14M7 22h10" />
      </svg>
    );
  }
  if (g === 'rain') {
    return (
      <svg {...props}>
        <path d="M17.5 14a4.5 4.5 0 1 0-1.96-8.55A6 6 0 1 0 6 14h11.5Z" />
        <path d="M8 17v3M12 17v3M16 17v3" />
      </svg>
    );
  }
  if (g === 'snow') {
    return (
      <svg {...props}>
        <path d="M17.5 14a4.5 4.5 0 1 0-1.96-8.55A6 6 0 1 0 6 14h11.5Z" />
        <path d="M8 17.5v.01M12 19v.01M16 17.5v.01M10 21v.01M14 21.5v.01" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M17.5 13a4.5 4.5 0 1 0-1.96-8.55A6 6 0 1 0 6 13h11.5Z" />
      <path d="m13 12-2 5h3l-2 5" />
    </svg>
  );
}

/** SignalLostIcon —— 离线占位（天线断线） */
function SignalLostIcon({ className }: { className?: string }) {
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
      <path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01" />
      <path d="m3 3 18 18" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

/** SunIcon —— 晴天（白天），线条风格与 mono 标签一致 */
function SunIcon({
  className,
  ...rest
}: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/** MoonIcon —— 晴夜（夜间） */
function MoonIcon({ className }: { className?: string }) {
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
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
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
