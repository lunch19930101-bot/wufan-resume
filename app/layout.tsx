import { type ReactNode } from 'react';

import './globals.css';

import { site } from '@/lib/config';
import { withBasePath } from '@/lib/utils';

import { MainArea } from '@/components/layout/MainArea';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/sections/Footer';

/**
 * No-flash theme script —— 在首帧 paint 之前应用 Preferences。
 *
 * atom63.io 真实机制：读 localStorage['personalization-settings'] → 应用
 * data-theme + data-a63-* 属性到 <html>。这一步阻塞执行，避免首帧闪默认主题。
 *
 * 优先级：
 *   1. localStorage['personalization-settings']  ← 用户 Preferences
 *   2. prefers-color-scheme                       ← 系统偏好
 *   3. site.theme.default                         ← 配置默认值
 */
const noFlashThemeScript = `(function(){try{var d=document.documentElement;var p={};try{var s=localStorage.getItem('personalization-settings');if(s)p=JSON.parse(s)||{};}catch(e){}var m=p.mode||'system';var dark;if(m==='dark')dark=true;else if(m==='light')dark=false;else dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var mode=dark?'dark':'light';d.setAttribute('data-theme',mode);d.setAttribute('data-a63-mode',mode);function attr(k,v){if(typeof v==='string')d.setAttribute('data-a63-'+k,v);}attr('theme',p.theme||'modern');attr('brand',p.brand||'auto');attr('surface',p.surface||'n1');attr('type-scale',p.typeScale||'normal');attr('radius',p.radius||'default');attr('font',p.font||'sans');attr('os',p.os||'macos');attr('icon-theme',p.iconTheme||'realistic');if(typeof p.surfaceTint==='number')d.style.setProperty('--a63-surface-tint',Math.max(0,Math.min(100,p.surfaceTint))+'%');var bc={'b1':'#2c7fff','b2':'#f7670d','b3':'#2aaf76','b4':'#e6438d','b5':'#7836f2','b6':'#fd3f5c'}[p.brand]||'#2c7fff';d.style.setProperty('--a63-brand-current',bc);var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',dark?'#111111':'#fafafa');}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.setAttribute('data-a63-mode','light');}})();`;

/**
 * 字体加载 —— 自托管（public/fonts/fonts.css + woff2）
 *   DINOT（拉丁 400/500/700）+ MiSans VF（CJK 可变 150–700）+ Geist Mono
 *   全部 woff2 随仓库分发，零外链 CDN（GitHub Pages 可用）。
 */

export const metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.tagline} ${site.role}，所在地 ${site.location}。`,
  charSet: 'utf-8',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: 'website',
  },
  other: {
    // 禁用 Google 翻译 / 第三方翻译扩展 —— 它们会在 React hydration 前修改 DOM，
    // 给元素注入 inline style / <font> 标签，触发 hydration mismatch error。
    google: 'notranslate',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      data-theme="light"
      data-a63-mode="light"
      data-a63-theme="modern"
      data-a63-brand="auto"
      data-a63-surface="n1"
      data-a63-type-scale="normal"
      data-a63-radius="default"
      data-a63-font="sans"
      data-a63-os="macos"
      data-a63-icon-theme="realistic"
      translate="no"
      suppressHydrationWarning
    >
      <head>
        {/* 阻塞执行：在 paint 前确定主题，避免闪一下默认主题再翻转 */}
        <meta name="theme-color" content="#fafafa" />
        {/* 自托管字体 —— DINOT（拉丁）+ MiSans VF（CJK），public/fonts/，零外链 */}
        <link rel="stylesheet" href={withBasePath('/fonts/fonts.css')} />
        {/* TEMP DISABLED for hydration debugging
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: noFlashThemeScript }}
        />
        */}
      </head>
      <body
        className="min-h-screen bg-bg-canvas text-text-primary antialiased"
        suppressHydrationWarning
      >
        <SkipLink />
        <Nav />
        <MainArea>{children}</MainArea>
        <Footer />
      </body>
    </html>
  );
}

function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-overlay focus:rounded-pill focus:bg-accent-lime focus:px-4 focus:py-2 focus:font-mono focus:text-mono-micro focus:uppercase focus:text-text-inverse"
    >
      跳转到内容
    </a>
  );
}
