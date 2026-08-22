'use client';

import { useEffect, type RefObject } from 'react';

import { useReducedMotion } from './useReducedMotion';

interface UseMouseParallaxOptions {
  /** 平滑系数（lerp 因子）。越大越跟手，越小越绵。0.08 = 沉静。 */
  lerp?: number;
}

/**
 * 鼠标视差 — animation.md §3.5
 *
 * 监听 window 鼠标位置，归一化到 [-1, 1]，RAF + lerp 平滑跟随，
 * 把结果写到目标元素的四个 CSS 变量上：
 *
 *   --parallax-nx   归一化 x  [-1, 1]
 *   --parallax-ny   归一化 y  [-1, 1]
 *   --parallax-x    归一化 x × 100（便于 calc(var(--parallax-x) * 0.24px) 之类）
 *   --parallax-y    归一化 y × 100
 *
 * 调用方在自己层上写：
 *   transform: translate3d(calc(var(--parallax-nx) * 24px), calc(var(--parallax-ny) * 24px), 0);
 * 不同层取不同系数，即可分出深度。
 *
 * 触屏 / reduced-motion / 无鼠标设备直接 no-op。
 */
export function useMouseParallax(
  ref: RefObject<HTMLElement | null>,
  { lerp = 0.08 }: UseMouseParallaxOptions = {},
): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const el = ref.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let active = false;

    const write = () => {
      el.style.setProperty('--parallax-nx', currentX.toFixed(4));
      el.style.setProperty('--parallax-ny', currentY.toFixed(4));
      el.style.setProperty('--parallax-x', (currentX * 100).toFixed(2));
      el.style.setProperty('--parallax-y', (currentY * 100).toFixed(2));
    };

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!active) {
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      write();

      const dx = Math.abs(targetX - currentX);
      const dy = Math.abs(targetY - currentY);
      if (dx < 0.0005 && dy < 0.0005) {
        active = false;
        // 最后再写一次确保落到目标值
        currentX = targetX;
        currentY = targetY;
        write();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, lerp, reduced]);
}
