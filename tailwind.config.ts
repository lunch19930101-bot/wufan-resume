import type { Config } from 'tailwindcss';

/**
 * Tailwind 配置 — 镜像 design-system.md 的全部 token
 * 所有颜色 / 间距 / 字号 / 圆角 / 阴影 / 缓动 / 时长都用 CSS Variables，
 * 这样 dark / light 主题切换无需 Tailwind 介入。
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: 'var(--color-bg-canvas)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          overlay: 'var(--color-bg-overlay)',
          muted: 'var(--color-bg-muted)',
          card: 'var(--color-bg-card)',
          accent: 'var(--color-bg-accent)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          default: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        accent: {
          lime: 'var(--color-accent-lime)',
          'lime-dim': 'var(--color-accent-lime-dim)',
          vermillion: 'var(--color-accent-vermillion)',
          'vermillion-dim': 'var(--color-accent-vermillion-dim)',
        },
        // atom63 logo 渐变品牌色
        b1: {
          400: 'var(--color-b1-400)',
          500: 'var(--color-b1-500)',
          700: 'var(--color-b1-700)',
          950: 'var(--color-b1-950)',
        },
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
        11: 'var(--space-11)',
        12: 'var(--space-12)',
      },
      fontSize: {
        'display-xl': ['var(--text-display-xl)', { lineHeight: '1', letterSpacing: 'var(--tracking-display-xl)' }],
        'display-l': ['var(--text-display-l)', { lineHeight: '1.05', letterSpacing: 'var(--tracking-display-l)' }],
        'display-m': ['var(--text-display-m)', { lineHeight: '1.1', letterSpacing: 'var(--tracking-display-m)' }],
        'heading-l': ['var(--text-heading-l)', { lineHeight: '1.15', letterSpacing: 'var(--tracking-heading-l)' }],
        'heading-m': ['var(--text-heading-m)', { lineHeight: '1.2', letterSpacing: 'var(--tracking-heading-m)' }],
        'heading-s': ['var(--text-heading-s)', { lineHeight: '1.3', letterSpacing: 'var(--tracking-heading-s)' }],
        'body-l': ['var(--text-body-l)', { lineHeight: '1.6' }],
        body: ['var(--text-body)', { lineHeight: '1.5' }],
        'body-s': ['var(--text-body-s)', { lineHeight: '1.55' }],
        // atom63.io 真实规格
        'hero-h1': [
          'var(--text-hero-h1)',
          { lineHeight: 'var(--leading-hero-h1)', letterSpacing: 'var(--tracking-hero-h1)' },
        ],
        'essay-p': ['var(--text-essay-p)', { lineHeight: 'var(--leading-essay-p)' }],
        irvine: ['var(--text-irvine)', { lineHeight: '1' }],
        // 兼容旧引用
        essay: ['var(--text-essay)', { lineHeight: '1.7' }],
        caption: ['var(--text-caption)', { lineHeight: '1.45', letterSpacing: '0.01em' }],
        'mono-micro': ['var(--text-mono-micro)', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        none: '0',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: '999px',
      },
      boxShadow: {
        'elev-1': 'var(--shadow-elev-1)',
        'elev-2': 'var(--shadow-elev-2)',
        'elev-3': 'var(--shadow-elev-3)',
        'elev-4': 'var(--shadow-elev-4)',
        'glow-lime': 'var(--shadow-glow-lime)',
        'glow-vermillion': 'var(--shadow-glow-vermillion)',
      },
      fontFamily: {
        // 站点字体栈（2026-08-19 起：DINOT 拉丁 + MiSans CJK，自托管）
        // - sans/body: DINOT —— 正文 / UI / 标题（MiSans 兜 CJK）
        // - serif: Georgia 系统衬线 —— font-serif 位置（essay / 项目标题）
        // - mono: Geist Mono —— 标签 / 数据
        serif: ['Georgia', '"MiSans"', '"Times New Roman"', 'serif'],
        sans: [
          'DINOT',
          '"MiSans"',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Source Han Sans SC',
          'Noto Sans CJK SC',
          'system-ui',
          'sans-serif',
        ],
        body: [
          'DINOT',
          '"MiSans"',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Source Han Sans SC',
          'Noto Sans CJK SC',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"Geist Mono"',
          '"MiSans"',
          'ui-monospace',
          'SF Mono',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-quart': 'var(--ease-out-quart)',
        'in-out': 'var(--ease-in-out)',
        emphasis: 'var(--ease-emphasis)',
      },
      transitionDuration: {
        instant: 'var(--dur-instant)',
        micro: 'var(--dur-micro)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        cinematic: 'var(--dur-cinematic)',
        hero: 'var(--dur-hero)',
      },
      maxWidth: {
        content: '1200px',
        read: '680px',
        manifesto: '1040px',
        caption: '420px',
        // atom63.io 实测宽度
        xl: '576px',
        essay: '528px',
      },
      zIndex: {
        cursor: '9999',
        nav: '100',
        overlay: '200',
      },
    },
  },
  plugins: [],
};

export default config;
