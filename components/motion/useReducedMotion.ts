'use client';

import { useEffect, useState } from 'react';

/**
 * 检测用户是否偏好减少动画。
 * 用于在所有 motion 组件中关闭视差 / scrub / magnetic 等强烈动效。
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
