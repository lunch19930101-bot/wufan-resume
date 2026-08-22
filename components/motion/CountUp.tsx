'use client';

import { useEffect, useState } from 'react';

import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface CountUpProps {
  /** 目标数值 */
  to: number;
  /** 起始数值 */
  from?: number;
  /** 动画时长 ms */
  duration?: number;
  /** 是否显示千分位逗号 */
  format?: boolean;
  /** 数字前缀，如 "+" */
  prefix?: string;
  /** 数字后缀，如 "%" */
  suffix?: string;
  className?: string;
}

/**
 * Number Count Up — animation.md §3.3
 * 进入视口后从 from 计数到 to，每 16ms 更新一次。
 */
export function CountUp({
  to,
  from = 0,
  duration = 1600,
  format = true,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, from, duration]);

  const display = format ? value.toLocaleString('en-US') : String(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
