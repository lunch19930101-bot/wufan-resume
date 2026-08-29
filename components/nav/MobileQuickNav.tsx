'use client';

import { useEffect, useRef, useState } from 'react';

import { scrollToTarget } from '@/components/motion/scroll';
import { cn } from '@/lib/utils';

/**
 * MobileQuickNav —— v4「滚动唤起章节条」
 *
 * 行为（v4，用户反馈三连改）：
 *   - 默认不显示、不占文档流：fixed 挂在 Nav 下方，首屏内容无它占位
 *   - 往下滑动越过首屏标题区（scrollY > 140，即条自然位置恰好越过 Nav
 *     的瞬间）滑入；滚回顶部滑出隐藏
 *   - 选中态胶囊改为声明式 per-chip 渲染：v3 的 JS 测量滑块在真机上会因
 *     字体替换 / 布局时机错位而落不到 chip 后面，选中文字（text-inverse）
 *     叠在同色画布上「隐形」。per-chip absolute inset-0 零测量，永不失配
 *   - 胶囊圆角走 var(--control-radius)：跟随 html[data-a63-radius] 主题偏好
 *     （none / subtle / default / round → 0 / 4 / 10 / 9999px）
 *
 * 视觉语言延续：mono 双位序号 01—05、墨色胶囊、dashed 底边框（与 58px
 * Nav 同母题）、滚动轨道两端 24px mask 渐隐。
 *
 * 几何锁：条高 46px —— HEADER_OFFSET / 各锚点 scroll-mt-[104px] 依赖此值。
 * 挂载位置：app/page.tsx 顶层（fixed，不占 HomeMain 文章流）。
 */
const LINKS = [
  { id: 'showcase', label: '精选视频' },
  { id: 'uniontech', label: '统信软件' },
  { id: 'pingan', label: '平安银行' },
  { id: 'ai-projects', label: 'AI 项目' },
  { id: 'timeline', label: '项目合集' },
] as const;

const HEADER_OFFSET = -(58 + 46);

/* 滑入阈值：条原先自然位置 151–197px，滚到其顶部触 Nav（151 - 58 ≈ 140）
   的那一刻唤起——恰好是「该出现的时候」 */
const SHOW_AFTER = 140;

export function MobileQuickNav() {
  const [active, setActive] = useState<string>(LINKS[0].id);
  const [shown, setShown] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* 唤起/收起：越过阈值滑入，回到顶部滑出（passive，不阻塞滚动） */
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* 滚动侦测：视口中上部命中的最靠上锚点获胜 */
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

  /* 激活项变化：激活 chip 在轨道内横向居中。
     （只滚轨道自身 scrollLeft —— scrollIntoView 在条不在视口内时会
      拖动整页滚动） */
  useEffect(() => {
    const idx = LINKS.findIndex((l) => l.id === active);
    const track = trackRef.current;
    const chip = chipRefs.current[idx];
    if (track && chip) {
      const target = chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2;
      track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
  }, [active]);

  const go = (id: string) => {
    scrollToTarget(`#${id}`, HEADER_OFFSET);
  };

  return (
    /* fixed 挂 Nav 之下：默认 -translate-y-full + opacity-0 收起，
       唤起时滑入。隐藏态切断交互与焦点，避免「看不见但可点」 */
    <div
      aria-hidden={!shown}
      className={cn(
        'fixed inset-x-0 top-[58px] z-40 md:hidden',
        'transition-[transform,opacity] duration-base ease-out-quart',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className="h-[46px] border-b border-dashed border-border-default bg-bg-canvas/90 backdrop-blur-md">
        <div
          ref={trackRef}
          className={cn(
            'mx-auto flex h-full max-w-[672px] items-center gap-1 overflow-x-auto px-6 lg:max-w-[864px] xl:max-w-[1088px]',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            '[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
            '[-webkit-mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%_-_24px),transparent)]',
          )}
        >
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
                tabIndex={shown ? 0 : -1}
                className={cn(
                  'relative flex h-[30px] shrink-0 items-center gap-1.5 px-3',
                )}
              >
                {/* 墨色胶囊 —— 声明式渲染在激活 chip 内，零测量；
                    圆角跟随主题 --control-radius */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[var(--control-radius)] bg-text-primary"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    'relative font-mono text-[10px] leading-none tracking-wider tabular-nums transition-colors duration-fast ease-out-quart',
                    // opacity 属性而非 /60 修饰符 —— token 色上的透明度
                    // 修饰符不生效，会回退继承 text-primary 与胶囊同色隐形
                    isActive ? 'text-text-inverse opacity-60' : 'text-text-tertiary',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'relative text-[12px] leading-none transition-colors duration-fast ease-out-quart',
                    isActive ? 'font-medium text-text-inverse' : 'text-text-secondary',
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
