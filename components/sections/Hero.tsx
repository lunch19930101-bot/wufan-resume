'use client';

import { site } from '@/lib/config';
import { withBasePath } from '@/lib/utils';
import { ShowcaseCarousel } from '@/components/sections/ShowcaseCarousel';

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
 *
 * 手机端（用户 2026-08-24 指定）：动态作品轮播上移到 h1 之后、介绍长文之前，
 * 第一屏即见作品展示；PC 维持原序（介绍在前，轮播在 HomeMain 首位）。
 * #showcase 锚点随之放在手机副本上（MobileQuickNav「精选视频」跳转目标）。
 */
export function Hero() {
  /* 手机端垂直节奏统一两档（用户 2026-08-24 指定）：24px / 40px。
     注意本项目 spacing scale 已重定义（p-7=48、mt-8=64、mt-10=128），
     必须用任意值写 px，不能用 scale 阶梯。
       Nav→h1 24 · h1→视频 24 · 视频→文案 40
     手机 Hero 底距为 0 —— 与 HomeMain 首节的 40px 节距会叠加成 80，
     由 space-y-[40px] 单独承担；md 维持原值（pt 64 / pb 64） */
  return (
    <section className="mx-auto max-w-[672px] px-6 pt-[24px] pb-0 md:pt-8 md:pb-16 lg:max-w-[864px] xl:max-w-[1088px]">
      <h1 className="text-hero-h1 text-text-primary">
        {/* #213 头像与文字垂直居中对齐（flex items-center 精确居中） */}
        <span className="flex flex-wrap items-center">
          Hola, 我是
          <InlineAvatar />
          {site.name}
        </span>
        <span className="mt-1 block text-text-tertiary">
          {site.role}
        </span>
        <span className="mt-2 block font-sans text-[13px] font-normal leading-relaxed tracking-wide text-text-tertiary">
          视觉设计 · 组件库工程化 · 全端 UI/UX 设计 · 平面设计
        </span>
      </h1>

      {/* 手机端：动态作品轮播上移到第一屏（h1 之后、介绍之前）——
          PC 隐藏（原位副本在 HomeMain，hidden md:block） */}
      <div id="showcase" className="mt-[24px] scroll-mt-[104px] md:hidden">
        <ShowcaseCarousel />
      </div>

      {/* 个人介绍 —— atom63 开场长文（按 \n\n 分段，**词** 渲染为加粗强调）
          #231 用户指定介绍文收窄：lg/xl 不再撑满容器，收到 672px（与下方
          PC 视频轮播同宽，左缘对齐全站内容）；md 及以下容器本就更窄不受影响 */}
      {site.intro ? (
        <div className="mt-[40px] max-w-[672px] space-y-[24px] text-essay-p leading-[27.625px] text-text-secondary md:mt-6 md:space-y-4">
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
 * 用户 2026-08-28 提供头像框图 Frame 2.png（2000×2000 透明底），
 * 等比缩至 100×100 自托管（public/images/avatar.png），object-cover 圆形裁剪
 */
function InlineAvatar() {
  return (
    <span
      className="relative mx-[0.4em] inline-flex size-[48px] flex-none overflow-hidden rounded-full border border-border-subtle bg-bg-elevated"
      aria-hidden
    >
      <img
        src={withBasePath('/images/avatar.png?v=20260829')}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}
