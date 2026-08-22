'use client';

import { type ReactNode, useEffect } from 'react';

import Lenis from 'lenis';

import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';

import { useReducedMotion } from './useReducedMotion';

/**
 * Lenis 平滑滚动 Provider — interaction.md §3.1
 *
 * 关键点：
 * 1. 用 gsap.ticker 驱动 lenis.raf —— 与 GSAP 时间轴同帧，
 *    再无滚动/ScrollTrigger 错拍导致的 jank。
 * 2. lenis.on('scroll', ScrollTrigger.update) —— ScrollTrigger
 *    在 Lenis 插值过程中实时同步位置。
 * 3. 只用 lerp（不传 duration）—— duration 在 lerp 模式下会被忽略，
 *    二者并存会让行为不可预期。
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // 触屏检测 —— 触屏走原生滚动
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      // lerp 0.1 —— 比 0.08 更跟手，仍保留物理感
      lerp: 0.1,
      // wheel 单次滚动距离的阻尼曲线
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // 让 <button> 等可聚焦元素在滚动时仍可达
      prevent: (node) => {
        const el = node as HTMLElement;
        return el.tagName === 'BUTTON' || el.dataset.preventScroll === 'true';
      },
    });

    // 与 ScrollTrigger 同步
    lenis.on('scroll', ScrollTrigger.update);

    // 用 GSAP ticker 驱动 —— 同帧调度
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 暴露给全局，便于锚点跳转
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // 刷新一次，避免首屏 ScrollTrigger 位置漂移
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduced]);

  return <>{children}</>;
}

/**
 * 平滑滚动到目标。无 Lenis 时回退到原生。
 * 用 easeOutCubic + 1.4s —— 比 lerp 默认更干脆，避免「无止境」感。
 */
export function scrollToTarget(target: string | number) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(target, {
      // Lenis 在 lerp 模式下，传 duration 会临时切换为 duration 模式
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      force: true,
    });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'smooth' });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}
