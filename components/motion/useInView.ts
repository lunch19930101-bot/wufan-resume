'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** 元素进入视口的阈值比例 */
  threshold?: number;
  /** 是否只触发一次（默认 true） */
  once?: boolean;
  /** rootMargin，例如 '0px 0px -10% 0px' 提前触发 */
  rootMargin?: string;
}

/**
 * IntersectionObserver 封装。
 * 用于所有 reveal / count-up 组件的触发。
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.3,
  once = true,
  rootMargin = '0px 0px -10% 0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, inView };
}
