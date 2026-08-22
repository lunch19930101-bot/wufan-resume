'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  BRAND_COLORS,
  type Brand,
  type Font,
  type Mode,
  type Preferences,
  type Radius,
  type Surface,
  type Theme,
  type TypeScale,
} from '@/lib/preferences';

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

export const MODE_OPTIONS: { id: Mode; name: string }[] = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'system', name: 'Auto' },
];

export const THEME_OPTIONS: { id: Theme; name: string }[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'aqua', name: 'Aqua' },
  { id: 'retro', name: 'Y2K' },
  { id: 'terminal', name: 'Terminal' },
];

export const BRAND_OPTIONS: { id: Brand; name: string }[] = [
  { id: 'auto', name: 'Auto' },
  { id: 'b1', name: 'b1' },
  { id: 'b2', name: 'b2' },
  { id: 'b3', name: 'b3' },
  { id: 'b4', name: 'b4' },
  { id: 'b5', name: 'b5' },
  { id: 'b6', name: 'b6' },
];

export const SURFACE_OPTIONS: { id: Surface; name: string }[] = [
  { id: 'n1', name: 'n1' },
  { id: 'n2', name: 'n2' },
  { id: 'n3', name: 'n3' },
  { id: 'n4', name: 'n4' },
  { id: 'n5', name: 'n5' },
  { id: 'n6', name: 'n6' },
];

export const TYPE_SCALE_OPTIONS: { id: TypeScale; name: string }[] = [
  { id: 'compact', name: 'Compact' },
  { id: 'normal', name: 'Normal' },
  { id: 'comfortable', name: 'Comfortable' },
  { id: 'large', name: 'Large' },
];

export const RADIUS_OPTIONS: { id: Radius; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'subtle', name: 'Subtle' },
  { id: 'default', name: 'Default' },
  { id: 'round', name: 'Round' },
];

export const FONT_OPTIONS: { id: Font; name: string }[] = [
  { id: 'sans', name: 'Sans' },
  { id: 'serif', name: 'Serif' },
  { id: 'mono', name: 'Mono' },
  { id: 'pixel', name: 'Pixel' },
];

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2" data-slot="appearance-section">
      <span className="block text-sm font-medium text-text-primary">{title}</span>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Visual cards grid —— Mode / Type scale / Radius / Font             */
/*                                                                    */
/*  参考 atom63.io visual-choice-option:                                */
/*    min-h-[5.5rem] + hover -translate-y-px + shadow-sm +              */
/*    selected border + bg brand/8% + shadow ring                        */
/*    （圆角跟 Radius 偏好走 var(--control-radius)，随选择联动）          */
/* ------------------------------------------------------------------ */

const CARD_BASE = cn(
  'group relative flex flex-col items-center justify-center gap-2 overflow-hidden',
  'rounded-[var(--control-radius)]',
  'border px-3 py-2 text-center',
  'transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out',
  'motion-reduce:transition-none',
  'hover:-translate-y-px motion-reduce:hover:translate-y-0',
  'hover:shadow-sm',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a63-brand-current)]',
  'active:translate-y-0 active:scale-[0.99] motion-reduce:active:scale-100',
  'cursor-pointer',
);

const CARD_LG = 'min-h-[5.5rem]';
const CARD_SM = 'min-h-[3.75rem]';

const CARD_UNSELECTED = cn(
  'border-border-subtle bg-border-subtle text-text-secondary',
  'hover:border-border-default hover:bg-border-default/40 hover:text-text-primary',
);

const CARD_SELECTED = cn(
  'border-[var(--a63-brand-current)]',
  'bg-[var(--a63-brand-current-dim)]',
  'text-text-primary',
  'shadow-[0_0_0_1px_var(--a63-brand-current)]',
);

function VisualCardGrid<T extends string>({
  size = 'lg',
  columns,
  options,
  value,
  onChange,
  ariaLabel,
  renderVisual,
}: {
  size?: 'lg' | 'sm';
  columns: 3 | 4;
  options: { id: T; name: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  renderVisual: (id: T, selected: boolean) => React.ReactNode;
}) {
  return (
    <fieldset
      className={cn('grid gap-2 border-0 p-0', columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}
      data-slot="visual-choice-control"
    >
      <legend className="sr-only">{ariaLabel}</legend>
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            data-slot="visual-choice-option"
            data-state={selected ? 'checked' : 'unchecked'}
            data-cursor="link"
            onClick={() => onChange(opt.id)}
            className={cn(CARD_BASE, size === 'lg' ? CARD_LG : CARD_SM, selected ? CARD_SELECTED : CARD_UNSELECTED)}
          >
            {renderVisual(opt.id, selected)}
            <span className="max-w-full truncate text-xs leading-none font-medium">
              {opt.name}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  SegmentedControl —— Theme / Primary / Surface                      */
/*                                                                    */
/*  atom63.io 实现：track 是 muted 容器，active item 有 sliding         */
/*  indicator 背景滑块。我们用简化版：track 浅底，active item 白底凸起。 */
/* ------------------------------------------------------------------ */

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  renderContent,
}: {
  options: { id: T; name: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  renderContent: (id: T) => React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const updateIndicator = () => {
    const idx = options.findIndex((o) => o.id === value);
    const item = itemRefs.current[idx];
    const track = trackRef.current;
    if (!item || !track) return;
    const itemRect = item.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - trackRect.left,
      width: itemRect.width,
    });
  };

  useEffect(() => {
    updateIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    // 等字体加载、布局稳定后再测一次
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateIndicator);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-slot="segmented-control"
      className={cn(
        'relative flex w-full items-center gap-1',
        'rounded-[calc(var(--control-radius)+2px)] p-1',
        'bg-border-subtle',
      )}
    >
      <div
        ref={trackRef}
        role="tablist"
        aria-label={ariaLabel}
        data-slot="segmented-control-track"
        className="relative flex w-full items-center gap-1"
      >
        {indicator && (
          <span
            aria-hidden
            data-slot="segmented-control-indicator"
            className="absolute top-0 bottom-0 rounded-[var(--control-radius)] bg-bg-surface shadow-sm pointer-events-none"
            style={{
              left: indicator.left,
              width: indicator.width,
              transition: 'left 200ms cubic-bezier(0.16,1,0.3,1), width 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        )}
        {options.map((opt, idx) => {
          const selected = opt.id === value;
          return (
            <button
              key={opt.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={opt.name}
              title={opt.name}
              data-cursor="link"
              onClick={() => onChange(opt.id)}
              className={cn(
                'relative z-[1] flex h-7 flex-1 items-center justify-center gap-1.5',
                'rounded-[var(--control-radius)]',
                'font-mono text-[11px] uppercase tracking-wider',
                'transition-colors duration-micro ease-out-quart',
                selected
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {renderContent(opt.id)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Range slider —— Surface tint                                       */
/* ------------------------------------------------------------------ */

function RangeControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const display = value === 0 ? 'Off' : `${value}%`;
  return (
    <div className="grid gap-2.5" data-slot="range-token-control">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="min-w-10 text-right text-xs font-medium tabular-nums text-text-secondary">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={cn(
          'h-1.5 w-full cursor-pointer appearance-none rounded-full',
          'bg-border-subtle outline-none',
          '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--a63-brand-current)]',
          '[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40',
          '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:bg-[var(--a63-brand-current)]',
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Visuals —— Mode 卡片内的 SVG 预览                                  */
/* ------------------------------------------------------------------ */

function ModePreview({ mode, selected }: { mode: Mode; selected: boolean }) {
  // light / dark / auto 各一张迷你"窗口"预览
  if (mode === 'system') {
    return (
      <svg
        aria-hidden
        className="h-[4.25rem] w-full shrink-0 px-2 drop-shadow-sm"
        viewBox="0 0 112 80"
        fill="none"
      >
        <defs>
          <clipPath id="auto-window">
            <rect x="5" y="5" width="102" height="70" rx="10" />
          </clipPath>
          <clipPath id="auto-left">
            <rect x="5" y="5" width="51" height="70" />
          </clipPath>
          <clipPath id="auto-right">
            <rect x="56" y="5" width="51" height="70" />
          </clipPath>
        </defs>
        <g clipPath="url(#auto-window)">
          <g clipPath="url(#auto-left)">
            <WindowContent variant="light" />
          </g>
          <g clipPath="url(#auto-right)">
            <WindowContent variant="dark" />
          </g>
          <line
            x1="56"
            y1="8"
            x2="56"
            y2="72"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />
        </g>
        <rect
          x="5"
          y="5"
          width="102"
          height="70"
          rx="10"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      className="h-[4.25rem] w-full shrink-0 px-2 drop-shadow-sm"
      viewBox="0 0 112 80"
      fill="none"
    >
      <defs>
        <clipPath id={`mode-${mode}-window`}>
          <rect x="5" y="5" width="102" height="70" rx="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#mode-${mode}-window)`}>
        <WindowContent variant={mode} />
      </g>
      <rect
        x="5"
        y="5"
        width="102"
        height="70"
        rx="10"
        fill="none"
        stroke={selected ? 'var(--a63-brand-current)' : 'currentColor'}
        strokeOpacity={selected ? 0.8 : 0.18}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function WindowContent({ variant }: { variant: 'light' | 'dark' }) {
  // 简化版的窗口预览：背景 + 顶栏 + 两行文字 + 主按钮
  const isDark = variant === 'dark';
  const bg = isDark ? '#1c1c1c' : '#f4f4f5';
  const topbar = isDark ? '#262626' : '#ececee';
  const dot = isDark ? '#3a3a3a' : '#d4d4d8';
  const line1 = isDark ? '#444' : '#c4c4c8';
  const line2 = isDark ? '#333' : '#d4d4d8';
  return (
    <>
      <rect x="5" y="5" width="102" height="70" fill={bg} />
      <rect x="5" y="5" width="102" height="18" fill={topbar} />
      <circle cx="17" cy="14" r="3" fill={dot} />
      <circle cx="28" cy="14" r="3" fill={dot} />
      <rect x="18" y="34" width="42" height="5" rx="2.5" fill={line1} />
      <rect x="18" y="47" width="62" height="5" rx="2.5" fill={line2} />
      <rect
        x="18"
        y="59"
        width="30"
        height="9"
        rx="4.5"
        fill="var(--a63-brand-current)"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Visuals —— Type scale / Radius / Font                              */
/* ------------------------------------------------------------------ */

function TypeScalePreview({ scale, selected }: { scale: TypeScale; selected: boolean }) {
  const textCls =
    scale === 'compact'
      ? 'text-sm'
      : scale === 'normal'
        ? 'text-base'
        : scale === 'comfortable'
          ? 'text-lg'
          : 'text-xl';
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-7 w-full items-center justify-center gap-1',
        selected ? 'text-[var(--a63-brand-current)]' : 'text-text-primary',
      )}
      data-slot="appearance-type-scale-preview"
    >
      <span className={cn('font-semibold leading-none', textCls)}>Aa</span>
      <span className="grid gap-0.5">
        <span className="block h-0.5 w-4 rounded-full bg-current opacity-50" />
        <span className="block h-0.5 w-2.5 rounded-full bg-current opacity-30" />
      </span>
    </span>
  );
}

function RadiusPreview({ radius, selected }: { radius: Radius; selected: boolean }) {
  const r =
    radius === 'none' ? 0 : radius === 'subtle' ? 3 : radius === 'default' ? 6 : 9999;
  return (
    <span
      className={cn(
        'flex h-7 w-full items-center justify-center',
        selected ? 'text-[var(--a63-brand-current)]' : 'text-text-primary',
      )}
      data-slot="appearance-radius-preview"
    >
      <span
        className="block h-3.5 w-9"
        style={{
          border: '2px solid currentColor',
          borderRadius: r,
        }}
      />
    </span>
  );
}

function FontPreview({ font, selected }: { font: Font; selected: boolean }) {
  const family =
    font === 'sans'
      ? 'DINOT, MiSans, sans-serif'
      : font === 'serif'
        ? 'Georgia, serif'
        : font === 'mono'
          ? '"Geist Mono", monospace'
          : '"Doto", monospace';
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-7 w-full items-center justify-center text-xl leading-none transition-colors',
        selected ? 'text-[var(--a63-brand-current)]' : 'text-text-primary',
      )}
      style={{ fontFamily: family }}
      data-slot="appearance-font-preview"
    >
      Aa
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Swatch content —— Primary / Surface（圆形 swatch 嵌入 SegmentedControl） */
/* ------------------------------------------------------------------ */

const BRAND_HEX: Record<Brand, string> = {
  auto: 'linear-gradient(135deg,#2c7fff,#7836f2,#fd3f5c)',
  b1: BRAND_COLORS.b1,
  b2: BRAND_COLORS.b2,
  b3: BRAND_COLORS.b3,
  b4: BRAND_COLORS.b4,
  b5: BRAND_COLORS.b5,
  b6: BRAND_COLORS.b6,
};

function BrandSwatchContent({ brand }: { brand: Brand }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block size-4 rounded-full',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.28)]',
        'ring-1 ring-black/10 ring-inset',
      )}
      style={{ background: BRAND_HEX[brand] }}
    />
  );
}

const SURFACE_HEX: Record<Surface, string> = {
  n1: '#fafafa',
  n2: '#e5e5e5',
  n3: '#cccccc',
  n4: '#999999',
  n5: '#444444',
  n6: '#0a0a0a',
};

function SurfaceSwatchContent({ surface }: { surface: Surface }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block size-4 rounded-full',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.28)]',
        'ring-1 ring-black/10 ring-inset',
      )}
      style={{ background: SURFACE_HEX[surface] }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export function PreferencesPanel({
  prefs,
  update,
}: {
  prefs: Preferences;
  update: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}) {
  return (
    <div className="grid gap-5" data-slot="appearance-panel">
      <Section title="Mode">
        <VisualCardGrid
          ariaLabel="Mode"
          columns={3}
          options={MODE_OPTIONS}
          value={prefs.mode}
          onChange={(v) => update('mode', v)}
          renderVisual={(id, sel) => <ModePreview mode={id} selected={sel} />}
        />
      </Section>

      <Section title="Theme">
        <SegmentedControl
          ariaLabel="Theme"
          options={THEME_OPTIONS}
          value={prefs.theme}
          onChange={(v) => update('theme', v)}
          renderContent={(id) => {
            const opt = THEME_OPTIONS.find((o) => o.id === id);
            return (
              <span className="text-[11px] uppercase tracking-wider font-mono">
                {opt?.name}
              </span>
            );
          }}
        />
      </Section>

      <Section title="Primary">
        <SegmentedControl
          ariaLabel="Primary"
          options={BRAND_OPTIONS}
          value={prefs.brand}
          onChange={(v) => update('brand', v)}
          renderContent={(id) => <BrandSwatchContent brand={id} />}
        />
      </Section>

      <Section title="Surface">
        <SegmentedControl
          ariaLabel="Surface"
          options={SURFACE_OPTIONS}
          value={prefs.surface}
          onChange={(v) => update('surface', v)}
          renderContent={(id) => <SurfaceSwatchContent surface={id} />}
        />
      </Section>

      <Section title="Type scale">
        <VisualCardGrid
          ariaLabel="Type scale"
          size="sm"
          columns={4}
          options={TYPE_SCALE_OPTIONS}
          value={prefs.typeScale}
          onChange={(v) => update('typeScale', v)}
          renderVisual={(id, sel) => <TypeScalePreview scale={id} selected={sel} />}
        />
      </Section>

      <Section title="Radius">
        <VisualCardGrid
          ariaLabel="Radius"
          size="sm"
          columns={4}
          options={RADIUS_OPTIONS}
          value={prefs.radius}
          onChange={(v) => update('radius', v)}
          renderVisual={(id, sel) => <RadiusPreview radius={id} selected={sel} />}
        />
      </Section>

      <Section title="Font">
        <VisualCardGrid
          ariaLabel="Font"
          size="sm"
          columns={4}
          options={FONT_OPTIONS}
          value={prefs.font}
          onChange={(v) => update('font', v)}
          renderVisual={(id, sel) => <FontPreview font={id} selected={sel} />}
        />
      </Section>
    </div>
  );
}
