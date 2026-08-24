'use client';

import { useEffect, useRef, useState } from 'react';

import { scrollToTarget } from '@/components/motion/SmoothScroll';
import { cn } from '@/lib/utils';

/**
 * MobileQuickNav —— v3「章节索引带」
 *
 * 设计意图（对齐 atom63 式编辑感 chrome）：
 *   - 每项带 mono 双位序号（01—05），与 Nav 的 mono 微标签同语言
 *   - 选中态是一枚墨色胶囊「滑块」，随激活项平移 + 伸缩（非静态换底）
 *   - 底边框用虚线，与 58px Nav 的 dashed 主分隔同母题
 *   - 滑块位于滚动轨道内容坐标系内，随轨道横向滚动同步移动
 *
 * 几何锁：条高 46px —— HEADER_OFFSET / 各锚点 scroll-mt-[104px] 依赖此值，
 * 只做视觉重塑，不改高度与吸附/滚动侦测逻辑。
 */
const LINKS = [
  { id: 'showcase', label: '精选视频' },
  { id: 'uniontech', label: '统信软件' },
  { id: 'pingan', label: '平安银行' },
  { id: 'ai-projects', label: 'AI 项目' },
  { id: 'timeline', label: '项目合集' },
] as const;

const HEADER_OFFSET = -(58 + 46);

export function MobileQuickNav() {
  const [active, setActive] = useState<string>(LINKS[0].id);
  const trackRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  /* 滑块定位：内容坐标系 x = chip 相对轨道 border-box 左缘 + scrollLeft。
     （left:0 锚在 padding-box 缘 = border 0 时的 border-box 缘，padding 无需扣除；
      各 rect 均为 zoom 后 CSS px，坐标自洽，不手动乘 type-scale。） */
  const moveIndicator = () => {
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    const idx = LINKS.findIndex((l) => l.id === active);
    const chip = chipRefs.current[idx];
    if (!track || !indicator || !chip) return;
    const trackRect = track.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const x = chipRect.left - trackRect.left + track.scrollLeft;
    indicator.style.width = `${chipRect.width}px`;
    indicator.style.transform = `translate3d(${x}px, -50%, 0)`;
    indicator.style.opacity = '1';
  };

  /* 滚动侦测：视口中上部命中的最靠上锚点获胜（与 v2 一致） */
  useEffect(() => {
    const IO = window.IntersectionObserver;
    if (!IO) return;
    const visible = new Set<string>();
    const observer = new IO(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute('id') ?? '';
          if (e.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const topmost = LINKS.find((l) => visible.has(l.id));
        if (topmost) setActive(topmost.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const l of LINKS) {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  /* 激活项变化：滑块跟随 + 激活 chip 在轨道内横向居中；字体就绪/旋转后复测。
     （只滚轨道自身 scrollLeft —— scrollIntoView 在章节条不在视口内时会
      拖动整页滚动，轮播上移首屏后曾致加载即跳滚 397px） */
  useEffect(() => {
    const idx = LINKS.findIndex((l) => l.id === active);
    const track = trackRef.current;
    const chip = chipRefs.current[idx];
    if (track && chip) {
      const target = chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2;
      track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
    const raf = requestAnimationFrame(moveIndicator);
    const onResize = () => moveIndicator();
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(moveIndicator).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);

  const go = (id: string) => {
    scrollToTarget(`#${id}`, HEADER_OFFSET);
  };

  return (
    <div className="sticky top-[58px] z-40 -mx-6 md:hidden">
      <div className="h-[46px] border-b border-dashed border-border-default bg-bg-canvas/90 backdrop-blur-md">
        <div
          ref={trackRef}
          className={cn(
            'relative mx-auto flex h-full max-w-xl items-center gap-1 overflow-x-auto px-6',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            '[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
            '[-webkit-mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
          )}
        >
          {/* 墨色滑块 —— 内容坐标系内绝对定位，随轨道滚动同步平移 */}
          <span
            ref={indicatorRef}
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-0 top-1/2 h-[30px] rounded-pill bg-text-primary',
              'opacity-0 transition-[width,transform,opacity] duration-base ease-out-quart',
            )}
            style={{ width: 0, transform: 'translate3d(0, -50%, 0)' }}
          />

          {LINKS.map((l, i) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                data-nav-id={l.id}
                onClick={() => go(l.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative z-10 flex h-[30px] shrink-0 items-center gap-1.5 rounded-pill px-3',
                  'transition-colors duration-fast ease-out-quart',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'font-mono text-[10px] leading-none tracking-wider tabular-nums transition-colors duration-fast ease-out-quart',
                    isActive ? 'text-text-inverse/60' : 'text-text-tertiary',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-[12px] leading-none transition-colors duration-fast ease-out-quart',
                    isActive
                      ? 'font-medium text-text-inverse'
                      : 'text-text-secondary',
                  )}
                >
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
