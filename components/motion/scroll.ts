/**
 * 平滑锚点滚动 —— 原生实现
 *
 * 历史：这里曾借 Lenis + GSAP ScrollTrigger 做插值平滑，但
 * <SmoothScroll> Provider 从未在任意布局挂载过——线上一直是
 * 原生滚动 + 本函数的原生回退路径。2026-08-29 为国内访问
 * 提速删除 GSAP(60KB)+Lenis(10KB) 死代码，行为与线上完全一致。
 */
export function scrollToTarget(target: string | number, offset = 0) {
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  } else {
    window.scrollTo({ top: target + offset, behavior: 'smooth' });
  }
}
