'use client';

import { useEffect, useRef, useState } from 'react';

import { cn, withBasePath } from '@/lib/utils';
import { DotMarquee } from '@/components/motion/DotMarquee';

/**
 * ShowcaseCarousel —— 首页动效视频轮播条（5 个展示位）
 *
 * atom63 ImageCarouselBlock 结构复刻（image-carousel chunk 逆向确认）：
 *   <figure data-media>
 *     <div class="overflow-hidden border border-border rounded-xl">   ← ★ 外框
 *       轮播轨道（Embla align:start）+ 框内两侧 nav + 底部居中 dots
 *     </div>
 *     <Caption>…</Caption>                                            ← 框外 mono 注释
 *   </figure>
 *
 *   - 外框：1px 边框 + 圆角 + overflow-hidden —— 卡片在框内被边缘裁切
 *     不通栏：外框留在内容列内（atom63 图片轮播同为列内盒子），
 *     两侧被边框「限制」住，滑动内容在框缘裁切
 *   - 顶部招牌：atom63 DotMarquee 点阵跑马灯 1:1（白底 LED 点阵大字横滚，
 *     点亮方块成字 / 未点亮方块隐约铺板，两端渐隐）—— 招牌只在视频框顶
 *   - dots 已移除（用户指定）；自动轮播改为 3 组克隆无限循环：
 *     卡片渲染 3 份（A/B/C 组），初始定位 B 组，永远向前滚动，
 *     停稳后越过组边界即静默瞬移回 B 组（同内容无视觉差）——
 *     不再出现"播到第 5 个倒带回第 1 个"的卡顿
 *
 * atom63 lazy-video 机制（lazy-video chunk 逆向确认）：
 *   - IntersectionObserver 驱动播放：进视口才播（muted loop），滑出即暂停
 *   - lightbox 打开时后台卡全部挂起
 *
 * 微细节：底边 2px 循环进度线（accent-lime）· hover scale 1.03（右下时长 chip 已移除，用户指定）
 *
 * 影院式 Lightbox（atom63 figure-lightbox 风，无原生控件）：
 *   播放/暂停 · 点击/拖拽 seek · 时间码 · 前后切换 · Space / ← → / Esc 键盘
 *   maskTop 遮罩与 overlay 文字贴图机制保留（源视频均为 1920×1080 无音轨）
 */

type Item = {
  video: string;
  title: string;
  caption: string;
  /** 透明 PNG 文字贴图，叠在视频上（视频本体无文字版） */
  overlay?: string;
  /** 顶部遮罩：源视频（1920×1080）顶部白色 nav 的像素高，
   *  用 CSS 遮罩隐藏而非重编码 —— 卡预览与 lightbox 同时生效 */
  maskTop?: number;
};

const items: Item[] = [
  { video: '/videos/motion-1.mp4', title: '统信官网改版', caption: 'Banner 动态 · 2024', maskTop: 80 },
  { video: '/videos/motion-2-v2.mp4', title: 'USRC 防护系统', caption: 'Banner 动态', overlay: '/videos/motion-2-text.png' },
  { video: '/videos/motion-3.mp4', title: '官网改版 Demo', caption: '交互演示 · 一' },
  { video: '/videos/motion-4.mp4', title: '官网改版 Demo', caption: '交互演示 · 二' },
  { video: '/videos/motion-5.mp4', title: '官网改版 Demo', caption: '交互演示 · 三' },
];

/* 卡片步长：卡宽 + gap-2 —— 滚动定位共用 */
const GAP = 8;

/* 视频区招牌点阵文案 —— 「动态作品展示」（用户指定，无 CGI；组件内部自动循环 + 尾部间隔） */
const MARQUEE_TEXT = 'MOTION SHOWCASE · ';

export function ShowcaseCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  /* 用户交互后暂停自动轮播到此刻（程序滚动不受影响） */
  const pauseUntil = useRef(0);

  /* 真瞬移 —— 直接赋值 scrollLeft。轨道曾带 scroll-smooth：赋值会继承 CSS
     变成动画，必须内联关掉 scrollBehavior（不依赖 'instant' 枚举兼容性） */
  const jumpTo = (el: HTMLElement, left: number) => {
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = left;
    el.style.scrollBehavior = prev;
  };

  /* 初始定位到中组（B 组）起点 —— 无限循环基准位 */
  useEffect(() => {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (!el || !card) return;
    jumpTo(el, (card.offsetWidth + GAP) * items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 停稳归位 —— 用户拖出 B 组范围（进 A 组）且停止滚动 150ms 后，
     瞬移回 B 组同内容位（内容像素级相同，无视觉差） */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const card = el.querySelector<HTMLElement>('[data-card]');
        if (!card) return;
        const s = card.offsetWidth + GAP;
        const physical = Math.round(el.scrollLeft / s);
        if (physical >= items.length * 2) jumpTo(el, (physical - items.length) * s);
        else if (physical < items.length) jumpTo(el, (physical + items.length) * s);
      }, 150);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 自动轮播 —— 每 tick 直接读实时 scrollLeft 推进（不依赖事件回写状态，
     永不卡死）：目标触底前先瞬移回 B 组等效位再前进（逻辑序无缝衔接）。
     悬停 / 用户刚交互 / lightbox 打开 / 减少动态偏好 时暂停 */
  useEffect(() => {
    if (openIndex !== null || hovering) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      const el = scrollRef.current;
      const card = el?.querySelector<HTMLElement>('[data-card]');
      if (!el || !card) return;
      const s = card.offsetWidth + GAP;
      const maxScroll = el.scrollWidth - el.clientWidth;
      let physical = Math.round(el.scrollLeft / s);
      if ((physical + 1) * s > maxScroll) {
        /* 即将触底 → 瞬移回 B 组前一个等效位（视觉无差），再平滑前进 */
        physical -= items.length;
        jumpTo(el, physical * s);
      }
      el.scrollTo({ left: (physical + 1) * s, behavior: 'smooth' });
    }, 4000);
    return () => window.clearInterval(id);
  }, [openIndex, hovering]);

  /* 用户直接触碰轨道（拖动 / 滚轮）→ 暂停自动轮播 6s */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const userTouch = () => {
      pauseUntil.current = Date.now() + 6000;
    };
    el.addEventListener('pointerdown', userTouch);
    el.addEventListener('wheel', userTouch, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', userTouch);
      el.removeEventListener('wheel', userTouch);
    };
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('[data-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + GAP : 480;
    pauseUntil.current = Date.now() + 6000;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <figure className="relative w-full">
      {/* ★ 外框 —— atom63 ImageCarouselBlock：不通栏，留在内容列内。
          整块白底（用户指定）：顶部点阵招牌 + 视频区（左右下 20px padding）。
          containerType 让卡宽 cqw 相对外框宽；白底内联写死 */}
      <div
        style={{ containerType: 'inline-size', backgroundColor: '#ffffff' }}
        className={cn(
          'relative overflow-hidden rounded-[var(--showcase-radius)]',
          'border border-black/10',
        )}
      >
        {/* ★ 视频区顶部招牌 —— atom63 DotMarquee 点阵跑马灯 1:1 复刻：
            字母由点亮的小方块组成、未点亮的隐约铺板，
            rAF 逐列推进 + 70ms 点位渐变，两端 16px 渐隐 */}
        <DotMarquee text={MARQUEE_TEXT} durationSec={20} />

        {/* 左右 chevron —— 框内悬浮（本站玻璃样式），仅 md+ */}
        <button
          type="button"
          aria-label="Previous"
          data-cursor="link"
          onClick={() => scrollByCard(-1)}
          className={cn(
            'absolute left-[20px] top-1/2 z-30 hidden -translate-y-1/2',
            'inline-flex size-[32px] items-center justify-center',
            'rounded-full',
            'border border-black/5 dark:border-white/10',
            'bg-white/75 dark:bg-white/10',
            'backdrop-blur-md',
            'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
            'text-black/70 dark:text-text-primary',
            'transition-colors duration-micro ease-out-quart',
            'hover:bg-white/85 dark:hover:bg-white/15',
            'md:inline-flex',
          )}
        >
          <ChevronLeftIcon className="size-[14px]" />
        </button>
        <button
          type="button"
          aria-label="Next"
          data-cursor="link"
          onClick={() => scrollByCard(1)}
          className={cn(
            'absolute right-[20px] top-1/2 z-30 hidden -translate-y-1/2',
            'inline-flex size-[32px] items-center justify-center',
            'rounded-full',
            'border border-black/5 dark:border-white/10',
            'bg-white/75 dark:bg-white/10',
            'backdrop-blur-md',
            'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
            'text-black/70 dark:text-text-primary',
            'transition-colors duration-micro ease-out-quart',
            'hover:bg-white/85 dark:hover:bg-white/15',
            'md:inline-flex',
          )}
        >
          <ChevronRightIcon className="size-[14px]" />
        </button>

        {/* 横滑轨道 —— 白底内左右下 20px padding（用户指定，atom63 同款留白），
            卡片在 gutter 内缘裁切滑动；悬停时暂停自动轮播。
            3 组克隆（A/B/C）无限循环：初始定位 B 组，永远向前，
            停稳后越组静默瞬移回 B 组 —— 5 个视频无限循环播放 */}
        <div className="px-[20px] pb-[20px]">
          <div
            ref={scrollRef}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            className={cn(
              'hide-scrollbar flex gap-2',
              'overflow-x-auto',
            )}
          >
            {Array.from({ length: items.length * 3 }, (_, i) => {
              const it = items[i % items.length]!;
              return (
                <SlideCard
                  key={`${it.video}-${i}`}
                  item={it}
                  index={i % items.length}
                  total={items.length}
                  suspended={openIndex !== null}
                  onOpen={() => setOpenIndex(i % items.length)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* figcaption —— atom63 media-caption：外框下方，回到内容列对齐 */}
      <figcaption className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span className="text-text-secondary">[ Motion ]</span>
        <span>showcase-carousel</span>
      </figcaption>

      {/* 影院式 Lightbox —— 自定义控制条，键盘导航 */}
      {openIndex !== null && (
        <CinemaLightbox
          items={items}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </figure>
  );
}

/* ============================================================
 * SlideCard —— 16:10 横版视频卡（直角，靠外框圆角裁切）
 *   IO 门控静音循环预览 + 底边进度线
 * ============================================================ */
function SlideCard({
  item,
  index,
  total,
  suspended,
  onOpen,
}: {
  item: Item;
  index: number;
  total: number;
  suspended: boolean;
  onOpen: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  /* IntersectionObserver 播放门控 —— atom63 lazy-video 同款行为。
     观察目标用按钮（永不缺席）：首次进视口才挂载 <video>（懒加载，
     页面上存在隐藏副本时零请求），此后可见播放 / 离屏暂停 */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    if (suspended) {
      inViewRef.current = false;
      videoRef.current?.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setLoaded(true);
          const v = videoRef.current;
          if (v && v.paused) {
            /* 显式补设 muted —— 同 Lightbox：部分内核不认 React 的 muted prop，
               按「有声」拒绝 play()，视频冻结 */
            v.muted = true;
            v.play().catch(() => {});
          }
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(btn);
    return () => io.disconnect();
  }, [suspended]);

  /* 视频挂载当帧补一次播放 —— IO 回调触发 setLoaded 时 videoRef 还没就位 */
  useEffect(() => {
    if (!loaded || !inViewRef.current) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [loaded]);

  /* maskTop=0 → 16/9；源视频均为 1920×1080 */
  const masked = item.maskTop ?? 0;

  return (
    <button
      ref={btnRef}
      type="button"
      data-card
      data-cursor="link"
      aria-label={`查看视频 — ${item.title}`}
      onClick={onOpen}
      className={cn(
        'group relative shrink-0 overflow-hidden bg-black text-left',
        // 直角 —— 由外框圆角统一裁切（atom63 slide 无自身圆角）
        // 卡片宽度：100cqw = 外框宽（内容列宽），1.2 张可见（1 全显 + peek）
        'w-[calc(100cqw/1.2)]',
        'aspect-[16/10]',
      )}
    >
      {/* INNER 缩放层 —— 静音循环预览（IO 门控），object-cover 填满。
          video 首次进视口才挂载（懒加载，隐藏副本零请求） */}
      <div
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-out',
          'group-hover:scale-[1.03]',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100',
        )}
        aria-hidden
      >
        {loaded && (
          <>
            <video
              ref={videoRef}
              src={withBasePath(item.video)}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (Number.isFinite(v.duration) && v.duration > 0)
                  setProgress(v.currentTime / v.duration);
              }}
              className={
                masked
                  ? // 遮罩版（1920×1080 源）：可视带 = 1920×(1080-nav)
                    // 视频放大到带高=卡高 → h 108%，上移 nav/1000=8%，左右溢出裁切
                    'absolute left-1/2 top-[-8%] h-[108%] w-auto -translate-x-1/2 object-cover'
                  : 'absolute inset-0 size-full object-cover'
              }
            />
            {/* 文字贴图 —— 透明 PNG 居中叠加 */}
            {item.overlay && (
              <img
                src={withBasePath(item.overlay)}
                alt=""
                className="absolute inset-0 size-full object-contain"
              />
            )}
          </>
        )}
      </div>

      {/* 顶部渐变 overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        aria-hidden
      />

      {/* 右上角 icon badge —— 放大播放（16px 玻璃底衬） */}
      <div
        className={cn(
          'absolute right-2 top-2 z-10 flex size-4 items-center justify-center rounded-full',
          'bg-background/10 backdrop-blur-sm',
        )}
        aria-hidden
      >
        <PlayIcon className="size-2 text-white opacity-70 transition-opacity duration-micro ease-out-quart group-hover:opacity-100" />
      </div>

      {/* 左下角 caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-0.5 p-3">
        <span className="font-mono text-[10px] tracking-wide text-white/50 tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <h3 className="text-balance text-[13px] leading-snug font-medium text-white">
          {item.title}
        </h3>
        <p className="text-pretty text-[10px] leading-snug text-white/65">
          {item.caption}
        </p>
      </div>

      {/* 底边循环进度线 —— 2px accent-lime，随 timeupdate 走 */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/10" aria-hidden>
        <div
          className="h-full bg-accent-lime/80"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </button>
  );
}

/* ============================================================
 * CinemaLightbox —— 影院式全屏播放
 *   自定义控制条（播放/seek/时间码/切换/关闭），无原生控件
 *   键盘：Space 播放/暂停 · ← → 切换 · Esc 关闭
 *   maskTop 遮罩 / overlay 贴图与卡预览同一套几何
 * ============================================================ */
function CinemaLightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Item[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const total = items.length;
  const item = items[index]!;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  /* maskTop=0 时即 16/9 —— 源视频均为 1920×1080 */
  const masked = item.maskTop ?? 0;
  const frameRatio = `1920 / ${1080 - masked}`;
  const frameWidth = `min(100%, calc(78vh * 1920 / ${1080 - masked}))`;

  const go = (dir: 1 | -1) => onIndex((index + dir + total) % total);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  /* 点击/拖拽进度条 seek（h-6 热区，3px 视觉条） */
  const seekTo = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setCurrent(ratio * v.duration);
  };

  /* 键盘导航 + 锁背景滚动 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'BUTTON' && tag !== 'INPUT') {
          e.preventDefault();
          togglePlay();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  /* 自动播放兜底 —— autoPlay 属性在部分移动内核（尤其 iOS）上被拦截：
     React 的 muted prop 不一定落成 attribute，视频被按「有声」判定拒绝
     自动播放 → 无 poster 黑屏。这里显式补设 muted 后用 play() 发起
     （真静音视频不受手势限制）；仍被拦截则亮出中央播放键，点击即播。
     切换视频（key 重挂载）时重跑 */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setPlaying(false));
  }, [item.video]);

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center gap-4 bg-bg-overlay p-6"
    >
      {/* 内容列 —— 宽度与画面框同宽，头部信息 / 画面 / 控制条三段对齐 */}
      <div
        className="flex flex-col items-center gap-4"
        style={{ width: frameWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 —— 序号 + 标题 / caption */}
        <div className="flex w-full items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-text-secondary">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="ml-3 text-text-primary">{item.title}</span>
          </span>
          <span className="text-text-tertiary">{item.caption}</span>
        </div>

        {/* 画面 —— 点击播放/暂停；暂停时中央玻璃播放键 */}
        <div
          className="relative w-full overflow-hidden rounded-[var(--showcase-radius)] bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: frameRatio }}
        >
          <video
            key={item.video}
            ref={videoRef}
            src={withBasePath(item.video)}
            autoPlay
            loop
            playsInline
            muted
            preload="auto"
            onClick={togglePlay}
            data-cursor="link"
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              setCurrent(0);
            }}
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={
              masked
                ? // 遮罩版：视频整体上移 maskTop 带，高度放大补齐
                  'absolute left-0 w-full object-cover'
                : 'absolute inset-0 size-full object-cover'
            }
            style={
              masked
                ? {
                    top: `${(-masked / (1080 - masked)) * 100}%`,
                    height: `${(1080 / (1080 - masked)) * 100}%`,
                  }
                : undefined
            }
          />
          {/* 文字贴图 —— 与卡预览一致叠加 */}
          {item.overlay && (
            <img
              src={withBasePath(item.overlay)}
              alt=""
              className="pointer-events-none absolute inset-0 size-full object-contain"
            />
          )}
          {/* 暂停态 —— 中央玻璃播放键 */}
          {!playing && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <div
                className={cn(
                  'flex size-[40px] items-center justify-center rounded-full',
                  'border border-white/20 bg-black/40 text-white backdrop-blur-md',
                )}
              >
                <PlayIcon className="size-[20px] translate-x-[1px]" />
              </div>
            </div>
          )}
        </div>

        {/* 控制条 —— 播放/暂停 · seek 进度 · 时间码 · 前后切换 · 关闭 */}
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            aria-label={playing ? '暂停' : '播放'}
            data-cursor="link"
            onClick={togglePlay}
            className={cn(
              'inline-flex size-[32px] shrink-0 items-center justify-center rounded-full',
              'border border-white/15 bg-white/10 text-white backdrop-blur-md',
              'transition-colors duration-micro ease-out-quart hover:bg-white/20',
            )}
          >
            {playing ? (
              <PauseIcon className="size-[13px]" />
            ) : (
              <PlayIcon className="size-[13px] translate-x-[1px]" />
            )}
          </button>

          {/* seek —— 点击 / 按住拖拽 */}
          <div
            data-cursor="link"
            aria-label="播放进度"
            className="relative h-6 flex-1 cursor-pointer"
            onPointerDown={(e) => {
              seekTo(e);
              e.currentTarget.setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) seekTo(e);
            }}
          >
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/15">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent-lime"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/70">
            {fmtTime(current)} / {fmtTime(duration)}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="上一个视频"
              data-cursor="link"
              onClick={() => go(-1)}
              className={cn(
                'inline-flex size-[32px] items-center justify-center rounded-full',
                'border border-white/15 bg-white/10 text-white backdrop-blur-md',
                'transition-colors duration-micro ease-out-quart hover:bg-white/20',
              )}
            >
              <ChevronLeftIcon className="size-[14px]" />
            </button>
            <button
              type="button"
              aria-label="下一个视频"
              data-cursor="link"
              onClick={() => go(1)}
              className={cn(
                'inline-flex size-[32px] items-center justify-center rounded-full',
                'border border-white/15 bg-white/10 text-white backdrop-blur-md',
                'transition-colors duration-micro ease-out-quart hover:bg-white/20',
              )}
            >
              <ChevronRightIcon className="size-[14px]" />
            </button>
            <button
              type="button"
              aria-label="关闭"
              data-cursor="link"
              onClick={onClose}
              className={cn(
                'inline-flex size-[32px] items-center justify-center rounded-full',
                'border border-white/15 bg-white/10 text-white backdrop-blur-md',
                'transition-colors duration-micro ease-out-quart hover:bg-white/20',
              )}
            >
              <CloseIcon className="size-[13px]" />
            </button>
          </div>
        </div>

        {/* 键盘提示 */}
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          Space 播放/暂停 · ← → 切换 · Esc 关闭
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * Helpers & Icons
 * ============================================================ */
function fmtTime(s: number) {
  if (!Number.isFinite(s) || s <= 0) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </svg>
  );
}
