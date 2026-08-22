'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * DotMarquee —— atom63.io 点阵跑马灯 1:1 复刻（a63-DotMarquee 逆向）
 *
 * 机制（atom-main.js 逆向确认，非字体非棋盘底纹）：
 *   - LED 点阵板：每个字母由 5×7 点阵组成（EL 字模表原值），
 *     「点亮」的小方块拼成字母，「未点亮」的小方块隐约铺满全板 ——
 *     底色是纯色（浅色主题白），方块是字符像素本身
 *   - 虚拟列序列：文案每字符 5 列 + 1 列空隙，尾部补 24 列空白（循环间隔）
 *   - DOM 只渲染「可见列数」（viewport 宽 / pitch）× 7 个点，
 *     rAF 逐列推进 offset，改写每点 dataset.lit —— 文字横向流过点阵
 *   - 点位 70ms background-color 过渡 = 字母经过时的淡入淡出波
 *   - viewport 两端 16px mask 渐隐；悬停 / 离屏 / 后台标签页暂停
 *   - reduced-motion：静态显示首帧
 *
 * 本站取值：pitch 7px / 点 3.5px（样式在 globals.css .dot-marquee 变量）
 */
export function DotMarquee({
  text,
  durationSec = 32,
  className,
}: {
  text: string;
  /** 文案完整循环一周的秒数（每列步进 ≥40ms） */
  durationSec?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const inViewRef = useRef(true);
  const docVisibleRef = useRef(true);
  const [colCount, setColCount] = useState(0);
  const [hovering, setHovering] = useState(false);

  /* 虚拟列：文案 + 尾部 4 空格（24 列）循环间隔 —— atom63 同款 */
  const columns = useMemo(() => [...textToColumns(text), ...textToColumns('    ')], [text]);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  /* 重绘：可见列 i 显示虚拟列 (offset + i) % total */
  const paint = useCallback(() => {
    const panel = panelRef.current;
    const cols = columnsRef.current;
    if (!panel || cols.length === 0) return;
    const total = cols.length;
    const off = offsetRef.current;
    for (let i = 0; i < panel.children.length; i++) {
      const colEl = panel.children.item(i);
      if (!(colEl instanceof HTMLElement)) continue;
      const virt = cols[(off + i) % total]!;
      for (let r = 0; r < ROWS; r++) {
        const dot = colEl.children.item(r);
        if (!(dot instanceof HTMLElement)) continue;
        if (virt[r]) dot.dataset.lit = '';
        else delete dot.dataset.lit;
      }
    }
  }, []);

  /* 可见列数 = viewport 宽 / pitch（ResizeObserver 跟随）+ 离屏 / 后台检测 */
  useEffect(() => {
    const root = rootRef.current;
    const vp = viewportRef.current;
    if (!root || !vp) return;
    const measure = () => {
      const raw = getComputedStyle(root).getPropertyValue('--dot-pitch').trim();
      const parsed = Number.parseFloat(raw);
      const pitch = Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
      const n = Math.max(1, Math.floor(vp.clientWidth / pitch));
      setColCount((prev) => (prev === n ? prev : n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(root);
    const onVis = () => {
      docVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  /* 列数 / 文案变化 → 回零重绘（reduced-motion 下即静态首帧） */
  useEffect(() => {
    offsetRef.current = 0;
    paint();
  }, [colCount, columns, paint]);

  /* rAF 逐列推进（atom63 同款：≥40ms/列，悬停 / 离屏 / 后台暂停） */
  useEffect(() => {
    if (hovering || columns.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const perCol = Math.max(40, (durationSec * 1000) / columns.length);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (inViewRef.current && docVisibleRef.current) {
        acc += dt;
        if (acc >= perCol) {
          const steps = Math.floor(acc / perCol);
          acc -= steps * perCol;
          offsetRef.current = (offsetRef.current + steps) % columns.length;
          paint();
        }
      } else {
        acc = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationSec, hovering, columns.length, paint]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn('dot-marquee', className)}
      data-paused={hovering ? '' : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div ref={viewportRef} className="dot-marquee-viewport">
        <div ref={panelRef} className="dot-marquee-panel">
          {Array.from({ length: colCount }, (_, c) => (
            <div key={c} className="dot-marquee-col">
              {Array.from({ length: ROWS }, (_, r) => (
                <span key={r} className="dot-marquee-dot" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 5×7 点阵字模 —— atom63 EL 表原值（行字符串，'1' = 点亮）
 * ============================================================ */
const ROWS = 7;

const GLYPHS: Record<string, string[]> = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  '>': ['10000', '01000', '00100', '00010', '00100', '01000', '10000'],
  '·': ['00000', '00000', '00100', '01110', '00100', '00000', '00000'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['01110', '10001', '00001', '00110', '00001', '10001', '01110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01110', '10001', '10000', '01110', '00001', '10001', '01110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

const BLANK_COL: boolean[] = Array.from({ length: ROWS }, () => false);

/* 行字符串 → 5 列布尔矩阵（column-major，与渲染列一一对应） */
function glyphColumns(rows: string[]): boolean[][] {
  const cols: boolean[][] = Array.from({ length: 5 }, () => []);
  for (let r = 0; r < ROWS; r++) {
    const row = rows[r] ?? '00000';
    for (let c = 0; c < 5; c++) cols[c]!.push(row.charAt(c) === '1');
  }
  return cols;
}

/* 文本 → 虚拟列序列：每字符 5 列 + 1 列空隙（atom63 jL 同款） */
function textToColumns(text: string): boolean[][] {
  const cols: boolean[][] = [];
  const chars = Array.from(text.toUpperCase());
  chars.forEach((ch, i) => {
    cols.push(...glyphColumns(GLYPHS[ch] ?? GLYPHS[' ']!));
    if (i < chars.length - 1) cols.push(BLANK_COL);
  });
  return cols;
}
