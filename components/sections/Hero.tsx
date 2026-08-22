'use client';

import { site } from '@/lib/config';
import { withBasePath } from '@/lib/utils';

/**
 * Hero — atom63.io 1:1 复刻开场
 *
 * 结构（完全对齐参考）：
 *   <h1>  三行 inline 文字
 *     行 1:  Hola, 我是 [avatar.png 32×32 inline] 吴帆
 *     行 2:  a.k.a [atom63.png 32×32 inline] ATOM63                (muted/50)
 *     行 3:  设计工程师 (at) [msft.png 32×32 inline] Microsoft      (muted/50)
 *
 * 字号 27px / 行高 37.125px / DINOT + MiSans
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-xl px-6 pt-7 pb-16 md:pt-8">
      <h1 className="text-hero-h1 text-text-primary">
        <span className="block">
          Hola, 我是
          <InlineAvatar />
          {site.name}
        </span>
        <span className="mt-1 block text-text-tertiary">
          {site.role}
        </span>
        <span className="mt-2 block font-sans text-[13px] font-normal leading-relaxed tracking-wide text-text-tertiary">
          3D 视觉设计 · 组件库工程化 · 全端 UI/UX 设计
        </span>
      </h1>

      {/* 个人介绍 —— atom63 开场长文（按 \n\n 分段，**词** 渲染为加粗强调） */}
      {site.intro ? (
        <div className="mt-6 max-w-xl space-y-4 text-essay-p leading-[27.625px] text-text-secondary">
          {site.intro.split('\n\n').map((para, i) => (
            <p key={i}>{renderBold(para)}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/* ---------------------------------------------------------------- */

/**
 * renderBold —— 把 **技能/术语** 片段渲染为 font-medium 强调
 * （与 HomeMain 的 Strong 一致：加粗 + 主文字色）
 */
function renderBold(text: string) {
  return text.split('**').map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-text-primary">
        {chunk}
      </strong>
    ) : (
      chunk
    ),
  );
}

/**
 * Inline 头像 —— atom63 H1 中 32×32 圆形头像
 * 用户 2026-08-20 提供肖像照（398×398 PNG 带透明），
 * 缩至 150×150 自托管（public/images/avatar.png），object-cover 圆形裁剪
 */
function InlineAvatar() {
  return (
    <span
      className="relative mx-[0.4em] inline-flex size-8 align-middle overflow-hidden rounded-full border border-border-subtle bg-bg-elevated"
      aria-hidden
    >
      <img
        src={withBasePath('/images/avatar.png')}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}
