'use client';

import { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '@/components/motion';

/**
 * Custom Cursor —— 极简圆点（系统光标隐藏，自定义跟随）
 *
 * 状态：
 *   default  → 8px 实心圆点（自适应主题色 var(--color-text-primary)）
 *   press    → 24px 实心圆点
 *
 * 性能要点（避免视觉延迟）：
 *   1. RAF 节流 mousemove —— mousemove 在 macOS 上 200Hz+，远超 60Hz 刷新，
 *      合并到下一帧 style.transform 写入，避免无谓的 style mutation
 *   2. translate3d —— 强制独立合成层，纯 compositor 路径
 *   3. CSS 不用 mix-blend-mode（强制 blend pass，60fps 下视觉延迟 1 帧）
 *   4. CSS contain: layout style paint —— 隔离 layout/paint
 *   5. visible / state 用闭包标志，避免 mousemove 触发 setState
 *
 * 触屏 / reduced motion：自动关闭（不渲染）。
 */
export function CustomCursor() {
  const reduced = useReducedMotion();

  // mounted gate —— SSR/首次 CSR 都 false，确保 hydration HTML 完全一致
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 检测 pointer: fine 才启用
  useEffect(() => {
    if (reduced || !mounted) return;
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [reduced, mounted]);

  // 跟随 + 状态检测 —— 全 DOM 操作，0 React 重新渲染
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    // 闭包标志：visible / state 只在变化时才写 DOM
    let visible = false;
    let state: 'default' | 'press' = 'default';

    const show = () => {
      if (visible) return;
      visible = true;
      dot.setAttribute('data-shown', 'true');
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      dot.setAttribute('data-shown', 'false');
    };
    const setState = (next: 'default' | 'press') => {
      if (state === next) return;
      state = next;
      dot.setAttribute('data-state', next);
    };

    // RAF 节流 —— mousemove 在 macOS 上可达 200Hz+，远高于显示器刷新率。
    // 用 requestAnimationFrame 合并到下一帧，避免无谓的 style 写入与强制同步布局。
    let pendingX = 0;
    let pendingY = 0;
    let scheduled = false;
    const onMove = (e: MouseEvent) => {
      show();
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        // translate3d —— 强制 GPU 合成层，比 translate() 走更低延迟的合成路径
        dot.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0)`;
        scheduled = false;
      });
    };

    const onDown = () => setState('press');
    const onUp = () => setState('default');
    const onLeave = () => hide();
    const onEnter = () => show();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  // mounted gate —— SSR/首次 CSR 都返回 null
  if (!mounted) return null;

  return (
    <div aria-hidden data-cursor-root className="pointer-events-none fixed inset-0 z-cursor">
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        data-state="default"
        data-shown={enabled ? 'true' : 'false'}
      />
    </div>
  );
}
