'use client';

import { Fragment, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { site } from '@/lib/config';
import { cn, withBasePath } from '@/lib/utils';
import {
  TDSunnyIcon,
  TDPartlyIcon,
  TDCloudIcon,
  TDFogIcon,
  TDRainIcon,
  TDSnowIcon,
  TDStormIcon,
} from '@/components/icons';

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
 *        Beijing | 北京时区 ← 看板行：Doto 点阵大数字（天气 + HH∶MM∶SS 时间）
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

  /* 昼夜状态 —— 按武汉本地小时 06–18 判定（不依赖天气 API 是否成功，
     时钟/看板/问候条共用同一状态，三处联动） */
  const isDay = cnHour !== null && cnHour >= 6 && cnHour < 18;

  /* 看板底色 —— 随实况天气换浅色径向渐变（右上，贴片落点处的光晕）；
     拿不到天气时退回 #237 昼夜暖/冷光，看板永不空场 */
  const boardBg = (() => {
    if (!weather) {
      return isDay
        ? 'radial-gradient(120% 100% at 100% 0%, rgba(255,190,90,0.05) 0%, rgba(255,190,90,0) 55%)'
        : 'radial-gradient(120% 100% at 100% 0%, rgba(96,140,255,0.08) 0%, rgba(96,140,255,0) 55%)';
    }
    const [r, g, b, a] = weatherTint(weather.code);
    return `linear-gradient(225deg, rgba(${r},${g},${b},${a}) 0%, rgba(${r},${g},${b},${Math.round(a * 0.28 * 1000) / 1000}) 45%, rgba(${r},${g},${b},0) 78%)`;
  })();

  return (
    /* z-30 —— 必须低于 Nav (z-50) 与 MobileQuickNav (z-40)：手机滚到底时
       footer 内容会滚到 fixed Nav 底下，footer 层级更高会盖住 Nav 的
       backdrop-blur（#走查修复：手机端底部 Nav 失去模糊） */
    <footer className="relative z-30 pb-24">
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
          <div
            className="relative grid grid-cols-1 md:grid-cols-2"
            style={{
              /* 底色 = 当前天气的浅色渐变（boardBg）；天气元素纹理（雨丝/雪粒/
                 光芒/星点/云雾/雷闪）由下方 .wx-fx 覆盖层叠加 */
              backgroundImage: boardBg,
            }}
          >
            {/* 天气元素纹理层 —— globals.css .wx-*，随实况切换，压在底色之上、
                文字之下（两侧 cell 均 relative，DOM 顺序在其后） */}
            {weather && (
              <span aria-hidden className={cn('wx-fx', weatherFx(weather.code, weather.isDay))} />
            )}

            {/* / 武汉 —— 天气看板（实时；右上角贴片图标随昼夜与天气现象切换） */}
            <div className="relative px-6 py-6">
              <p className="inline-flex items-center gap-[6px] font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                / 武汉 · Wuhan
                {/* 现象小图标 —— TDesign 线性天气字素，色相与贴片投影同源
                    （weatherShadow 特征色），标签即读出当前天气现象 */}
                <WeatherGlyph code={weather?.code} />
              </p>
              {weather && (
                /* v7 用户参考图直切贴片（透明底，无昼夜分版）—— 落在天气光晕处；
                    同色双层投影（贴身 + 大晕）把贴片从浅色天气底上托出来，
                    色相取自该贴片自身的实测特征色，不用黑 */
                <img
                  src={weatherTileSrc(weather.code)}
                  alt=""
                  aria-hidden
                  className="absolute right-6 top-6 size-[100px]"
                  style={{ filter: weatherShadow(weather.code) }}
                />
              )}
              <div className="mt-3 flex items-center gap-2.5">
                {!weather && (
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

            {/* / 北京时区 —— 时间看板（HH∶MM∶SS，冒号 = 两个 3px 点）
                标签写明时区（钟面为北京 GMT+8，与下方日期行呼应）
                #237 昼夜：标签行右侧挂 昼/夜 徽标，随时可见当前状态
                relative —— 抬到 .wx-fx 纹理层之上（文字不吃雨丝/雪粒） */}
            <div className="relative border-t border-dashed border-border-default px-6 py-6 md:border-t-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                  / 北京时区
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-mono-micro uppercase tracking-wide text-text-tertiary">
                  {isDay ? (
                    <SunIcon className="size-3" />
                  ) : (
                    <MoonIcon className="size-3" />
                  )}
                  {isDay ? '白天' : '夜间'}
                </span>
              </div>
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

          {/* 昼夜情景条 —— 状态（白天/夜间）+ 时段问候，
              与天气图标、时钟徽标、看板色温共用同一昼夜判定 */}
          <div className="border-t border-dashed border-border-default" aria-hidden />
          <div className="flex items-center gap-2 px-6 py-4">
            {isDay ? (
              <SunIcon className="size-3 shrink-0 text-text-tertiary" />
            ) : (
              <MoonIcon className="size-3 shrink-0 text-text-tertiary" />
            )}
            <p className="font-mono text-mono-micro tracking-wide text-text-tertiary">
              {cnHour === null
                ? '···'
                : `${isDay ? '白天' : '夜间'} — ${greet(cnHour)}`}
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
          {/* 回到顶部 —— 胶囊按钮：自绘「to-top」字形（顶栏 + 箭头），
              悬停箭头上升够到顶栏，active 把顶栏顶得微弹、右箭头上跳 */}
          <button
            type="button"
            data-cursor="link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              'group inline-flex w-fit items-center gap-2',
              'rounded-full border border-border-default bg-bg-surface px-4 py-[7px]',
              'font-mono text-mono-micro uppercase tracking-wider text-text-secondary',
              'transition-all duration-micro ease-out-quart',
              'hover:border-text-primary hover:text-text-primary active:scale-95',
            )}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-[15px] shrink-0"
            >
              {/* 顶栏 —— 被箭头撞到时微微上弹 */}
              <path
                d="M3.25 2.75h9.5"
                className="transition-transform duration-micro ease-out-quart group-active:-translate-y-[1px]"
              />
              {/* 箭头 —— 悬停上升去够顶栏，active 顶上去 */}
              <path
                d="M8 13.25V6.25M4.9 9.35 8 6.25l3.1 3.1"
                className="transition-transform duration-micro ease-out-quart group-hover:-translate-y-[2px] group-active:-translate-y-[3px]"
              />
            </svg>
            Back to top
            <ArrowUpIcon className="size-3 transition-transform duration-micro ease-out-quart group-hover:-translate-y-[2px] group-active:-translate-y-[4px]" />
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

/* 分组规则（v7：贴片 = 用户 6 张参考图一一对应，无昼夜分版）：
   晴=太阳 / 少云·多云=云+太阳 / 阴·雾=云朵 / 雨=云+雨滴 / 雪=云+雪花 / 雷=云+闪电 */
function wmoGroup(code: number): WeatherGroup {
  if (code === 0) return 'clear';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  return 'cloud';
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

/** 天气图标贴片 —— v7：用户提供的 6 张 3D 参考图直切（make_weather9 to_tile，
 *  bbox 裁切 + 等比缩放，绝不拉伸），256px 方形透明 PNG（public/weather/*.png），
 *  显示 100px → 2.56x 视网膜密度。
 *  按天气分组取图，不分昼夜；雾与阴共用云朵贴片。
 *  ?v=8 —— cloud.png 等文件名与旧版相同，强刷缓存 */
function weatherTileSrc(code: number): string {
  const g = wmoGroup(code);
  if (g === 'fog') return withBasePath('/weather/cloud.png?v=8');
  return withBasePath(`/weather/${g}.png?v=8`);
}

/** 天气现象小图标 —— 标签行内用（TDesign 线性字素 + 贴片同源特征色）；
 *  拿不到天气时不渲染（标签保持纯文字，不挂占位） */
function WeatherGlyph({ code }: { code?: number }) {
  if (code === undefined) return null;
  const g = wmoGroup(code);
  const cls = 'size-[12px] shrink-0 opacity-90';
  if (g === 'clear') return <TDSunnyIcon className={cn(cls, 'text-[#FCBA4A]')} />;
  if (g === 'partly') return <TDPartlyIcon className={cn(cls, 'text-[#FDC359]')} />;
  if (g === 'fog') return <TDFogIcon className={cn(cls, 'text-[#B4C2DE]')} />;
  if (g === 'rain') return <TDRainIcon className={cn(cls, 'text-[#99B8DC]')} />;
  if (g === 'snow') return <TDSnowIcon className={cn(cls, 'text-[#B2C2DA]')} />;
  if (g === 'storm') return <TDStormIcon className={cn(cls, 'text-[#B072FA]')} />;
  return <TDCloudIcon className={cn(cls, 'text-[#B4C2DE]')} />; // cloud 及兜底
}

/** 贴片同色投影 —— 色相取自该贴片参考图的实测特征色（饱和像素均值，
 *  淡蓝系压暗 12% 保证可读）：金阳 #FCBA4A / 暖阳 #FDC359 / 云影 #B4C2DE /
 *  雨蓝 #99B8DC / 雪蓝 #B2C2DA / 雷紫 #B072FA，不用黑。
 *  双层：贴身小阴影 + 大半径同色光晕，浅色天气底上把贴片托醒目 */
function weatherShadow(code: number): string {
  const g = wmoGroup(code);
  const hue =
    g === 'clear'
      ? '#FCBA4A'
      : g === 'partly'
        ? '#FDC359'
        : g === 'cloud' || g === 'fog'
          ? '#B4C2DE'
          : g === 'rain'
            ? '#99B8DC'
            : g === 'snow'
              ? '#B2C2DA'
              : '#B072FA'; // storm
  return `drop-shadow(0 3px 8px ${hue}66) drop-shadow(0 12px 28px ${hue}59)`;
}

/** 看板底色 —— 当前天气 → 该贴片主色系的浅色渐变（用户定调）：
 *  晴=橙 / 雨=蓝 / 雷=紫 / 阴(含风感)=灰 / 雪=蓝白；
 *  多云=暖杏（比晴浅一档）、雾=灰白（比阴浅一档），各自区分。
 *  225° 对角渐变：贴片所在的右上角最浓，向左下渐隐，文字区保持可读 */
function weatherTint(code: number): [number, number, number, number] {
  const g = wmoGroup(code);
  if (g === 'clear') return [252, 190, 90, 0.42]; // 橙
  if (g === 'partly') return [251, 217, 164, 0.4]; // 暖杏
  if (g === 'cloud') return [198, 203, 213, 0.42]; // 灰
  if (g === 'fog') return [217, 221, 229, 0.4]; // 灰白
  if (g === 'rain') return [166, 198, 240, 0.42]; // 蓝
  if (g === 'snow') return [211, 227, 248, 0.45]; // 蓝白
  return [199, 178, 245, 0.42]; // 紫（雷）
}

/** 看板纹理层 —— 当前天气 → globals.css .wx-* 类（雨丝/雪粒/光芒/星点/云雾/雷闪）。
 *  贴片虽不分昼夜，纹理层保留昼夜区分（光芒 vs 星点） */
function weatherFx(code: number, isDay: boolean): string {
  const g = wmoGroup(code);
  if (g === 'clear') return isDay ? 'wx-clear-day' : 'wx-clear-night';
  if (g === 'partly') return isDay ? 'wx-partly-day' : 'wx-partly-night';
  if (g === 'cloud') return 'wx-cloud';
  if (g === 'fog') return 'wx-fog';
  if (g === 'rain') return 'wx-rain';
  if (g === 'snow') return 'wx-snow';
  return 'wx-storm';
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
