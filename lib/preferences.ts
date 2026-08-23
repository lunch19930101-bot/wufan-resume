'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  1:1 复刻 atom63.io SiteConfigDialog                                */
/*    - localStorage key: personalization-settings                     */
/*    - 应用方式：data-a63-* 属性 + CSS 变量                           */
/* ------------------------------------------------------------------ */

export type Mode = 'light' | 'dark' | 'system';
export type Theme = 'modern' | 'aqua' | 'retro' | 'terminal';
export type Brand = 'auto' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6';
export type Surface = 'n1' | 'n2' | 'n3' | 'n4' | 'n5' | 'n6';
export type TypeScale = 'compact' | 'normal' | 'comfortable' | 'large';
export type Radius = 'none' | 'subtle' | 'default' | 'round';
export type Font = 'sans' | 'serif' | 'mono' | 'pixel';
export type OS = 'macos' | 'windows';
export type IconTheme = 'realistic' | 'color' | 'neutral' | 'primary';

export interface Preferences {
  mode: Mode;
  theme: Theme;
  brand: Brand;
  surface: Surface;
  surfaceTint: number; // 0-100
  typeScale: TypeScale;
  radius: Radius;
  font: Font;
  os: OS;
  iconTheme: IconTheme;
}

export const PREFERENCES_DEFAULT: Preferences = {
  mode: 'system',
  theme: 'modern',
  brand: 'auto',
  surface: 'n1',
  surfaceTint: 0,
  typeScale: 'normal',
  radius: 'default',
  font: 'sans',
  os: 'macos',
  iconTheme: 'realistic',
};

const STORAGE_KEY = 'personalization-settings';

/** atom63 实测的 6 个品牌色（来自 CSS：--color-b1-500 ~ b6-500） */
export const BRAND_COLORS: Record<Exclude<Brand, 'auto'>, string> = {
  b1: '#2c7fff',
  b2: '#f7670d',
  b3: '#2aaf76',
  b4: '#e6438d',
  b5: '#7836f2',
  b6: '#fd3f5c',
};

/* ------------------------------------------------------------------ */
/*  applyPreferences —— 把 state 写进 <html> 的 data-a63-* 属性        */
/*    这一步是真正驱动主题视觉的关键。                                 */
/* ------------------------------------------------------------------ */

export function resolveDark(mode: Mode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyPreferences(p: Preferences): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark = resolveDark(p.mode);

  // data-theme（兼容现有的 token 系统 —— light / dark 切换整组颜色）
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // atom63.io 真实属性
  root.setAttribute('data-a63-mode', isDark ? 'dark' : 'light');
  root.setAttribute('data-a63-theme', p.theme);
  root.setAttribute('data-a63-brand', p.brand);
  root.setAttribute('data-a63-surface', p.surface);
  root.setAttribute('data-a63-type-scale', p.typeScale);
  root.setAttribute('data-a63-radius', p.radius);
  root.setAttribute('data-a63-font', p.font);
  root.setAttribute('data-a63-os', p.os);
  root.setAttribute('data-a63-icon-theme', p.iconTheme);

  // CSS 变量
  root.style.setProperty('--a63-surface-tint', `${Math.max(0, Math.min(100, p.surfaceTint))}%`);
  const brandHex = p.brand === 'auto' ? BRAND_COLORS.b1 : BRAND_COLORS[p.brand];
  root.style.setProperty('--a63-brand-current', brandHex);
}

/* ------------------------------------------------------------------ */
/*  setMode —— 供 ThemeToggle 等入口切换明暗                            */
/*    必须走偏好存储 + applyPreferences（同时写 data-theme 与           */
/*    data-a63-mode），只翻 data-theme 会导致 a63 规则错档、刷新即丢。  */
/* ------------------------------------------------------------------ */
export function setMode(mode: Exclude<Mode, 'system'>): void {
  if (typeof document === 'undefined') return;
  let prefs = { ...PREFERENCES_DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) prefs = { ...prefs, ...(JSON.parse(raw) as Partial<Preferences>) };
  } catch {
    /* 存储损坏 —— 用默认值 */
  }
  prefs.mode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* 隐私模式 —— 忽略 */
  }
  applyPreferences(prefs);
}

/* ------------------------------------------------------------------ */
/*  usePreferences —— state + 持久化 + 自动 apply                      */
/* ------------------------------------------------------------------ */

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(PREFERENCES_DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  const skipNextApply = useRef(false);

  // 首帧：从 localStorage 读
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Preferences>;
        setPrefs({ ...PREFERENCES_DEFAULT, ...parsed });
      }
    } catch {
      /* 隐私模式或 JSON 损坏 —— 用默认值 */
    }
    setHydrated(true);
  }, []);

  // prefs 变更 → apply + 持久化
  useEffect(() => {
    if (!hydrated) return;
    applyPreferences(prefs);
    if (skipNextApply.current) {
      skipNextApply.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* 隐私模式 —— 忽略 */
    }
  }, [prefs, hydrated]);

  // 监听 prefers-color-scheme 变化（仅当 mode === 'system'）
  useEffect(() => {
    if (!hydrated || prefs.mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyPreferences(prefs);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [prefs, hydrated]);

  // 监听跨页签同步
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as Partial<Preferences>;
        skipNextApply.current = true;
        setPrefs((prev) => ({ ...prev, ...parsed }));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const update = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setPrefs(PREFERENCES_DEFAULT);
  }, []);

  return { prefs, update, reset, hydrated };
}

/* ------------------------------------------------------------------ */
/*  usePreferencesOpen —— popover 开关（含 ⌘+, 快捷键）                */
/* ------------------------------------------------------------------ */

export function usePreferencesOpen() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { open, setOpen, toggle };
}
