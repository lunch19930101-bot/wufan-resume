'use client';

import { useEffect } from 'react';

/**
 * #197 — 进入/刷新永远从顶部开始。
 *
 * 背景：iOS Safari / 桌面 Chrome 的「滚动恢复」会把刷新前的位置
 * （常常是页面底部）带回来，造成「一进来就在底部」的错位。
 *
 * 做法：关掉 history.scrollRestoration，并在 pageshow / load 时回到 0。
 * bfcache 返回（persisted）时保留原位置 —— 只有全新加载/刷新才复位。
 * 触屏、桌面、reduced-motion 一视同仁（不依赖 Lenis）。
 */
export function ScrollTopOnLoad() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const toTop = () => window.scrollTo(0, 0);
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) toTop();
    };

    window.addEventListener('pageshow', onShow);
    window.addEventListener('load', toTop);

    return () => {
      window.removeEventListener('pageshow', onShow);
      window.removeEventListener('load', toTop);
    };
  }, []);

  return null;
}
