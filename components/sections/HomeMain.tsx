'use client';

import { type ReactNode } from 'react';

import { withBasePath } from '@/lib/utils';
import { ShowcaseCarousel } from '@/components/sections/ShowcaseCarousel';
import { ShowcaseStacked } from '@/components/sections/ShowcaseStacked';
import { AIProjectEntrance } from '@/components/sections/AIProjectEntrance';
import { ProjectShowcase } from '@/components/sections/ProjectShowcase';

/**
 * HomeMain —— atom63.io 长文式主体（1:1 复刻）
 *
 * 容器：max-w-xl (576px) + px-6 (24px) → 内文 528px
 * 段间距：手机两档制 40px（节间）/ 24px（节内），md space-y-6 (32px)
 * 段落：17px / Geist / #b4b4b4；手机行高 1.85，md 起 1.625
 * 手机端章节导航 MobileQuickNav 已上移至 app/page.tsx 顶层（Hero 之前）
 *
 * 章节顺序（基于吴帆简历重写）：
 *   1. ShowcaseCarousel（统信时期项目横向轮播）
 *   2. 统信软件开篇
 *   3. ShowcaseStacked + 官网改版旗舰
 *   4. 设计系统 / 组件库工程化
 *   5. 平安银行时代
 *   6. 平安时期代表作（精简合并）
 *   7. AI 工具栈
 *   8. AIProjectEntrance（AI 协作三入口，atom63 "I build in public"）
 *   9. 团队管理
 *   10. ProjectShowcase（项目合集 Timeline）
 *   11. 收尾 —— 求职状态
 */
export function HomeMain() {
  return (
    <main className="mx-auto max-w-xl px-6">
      {/* 手机端垂直节奏两档制（用户 2026-08-24）：节间距 40px、节内相关内容 24px。
          手机 pt-0 —— 与 Hero 的 40px 底距合并为单一 40px 节距（原来 64+64=128 过宽）；
          md 维持原值（pt/pb 64px、space-y 32px），scale 阶梯不可用于 px 精确值 */}
      <article className="space-y-[40px] pt-0 pb-[40px] md:space-y-6 md:pt-16 md:pb-16">
        {/* 1. 统信时期项目轮播 —— 横向滑动作品展示。
            PC 副本：手机端轮播已上移到 Hero 第一屏（#showcase 锚点在那边） */}
        <div className="hidden scroll-mt-[104px] md:block">
          <ShowcaseCarousel />
        </div>

        {/* 2. 统信开篇 */}
        <div id="uniontech" className="scroll-mt-[104px]">
          <EssayParagraph>
            曾在
            <Favicon src="/images/clients/uniontech.svg" alt="统信软件" />
            <Strong> 统信软件</Strong>
            担任网页设计组组长与资深
            UI 设计师（武汉，2021–2025）——负责公司官网设计与改版、主页面风格、
            <Strong>3D 视频制作</Strong>、交互梳理，以及<Strong>后台管理端</Strong>界面与
            <Strong>组件库</Strong>建设。
          </EssayParagraph>
        </div>

        {/* 3. ShowcaseStacked —— 1 大 3 小自动轮换（统信时期精选） */}
        <ShowcaseStacked />

        <EssayParagraph>
          <Strong>统信官网改版</Strong>——负责官网整体<Strong>视觉体系重构</Strong>与落地执行，覆盖全站页面与模块；建立覆盖全站的<Strong>组件库</Strong>，输出色彩、字体、图标、组件、模板等规范。C 端与 B 端视觉统一，整体<Strong>布局自适应</Strong>保证各设备阅读性；期间自学 <Strong>C4D</Strong> 投入实战，首页头图以 <Strong>3D 动态效果</Strong>呈现。项目六个月完成上线，设计体系支持后续产品线持续扩展。
        </EssayParagraph>

        <EssayParagraph>
          <Strong>统信生态大会</Strong>——公司年度最高规格的品牌活动。把 2020–2024 五届大会物料统一进<Strong>同一视觉体系</Strong>：抽取五届主视觉的共同基因作为基线，年份主题作为变量嵌入，既保留每届特征、又让品牌识别一以贯之。大会专题与官网改版<Strong>互为延续</Strong>，按访问年份自动匹配对应物料的视觉样式。
        </EssayParagraph>

        {/* 4. 设计系统 / 组件库工程化 */}
        <EssayParagraph>
          在视觉之外，我同时负责<Strong>设计系统</Strong>的工程化落地——与开发团队定制<Strong>设计语言</Strong>、开发周期、<Strong>组件库代码化</Strong>，让<Strong>设计还原走查</Strong>与后续迭代的效率得到极大提升。同时把 <Strong>AI 协作</Strong>引入工作流——从 <Strong>MJ、豆包、即梦</Strong>等 AI 设计工具起步，到现在用 <Strong>Claude Code</Strong> 打通设计与开发的衔接，效率一路提升。
        </EssayParagraph>

        {/* 5. 平安银行时代 */}
        <div id="pingan" className="scroll-mt-[104px]">
          <EssayParagraph>
            更早之前，我在
            <Favicon src="/images/clients/pingan.ico" alt="平安银行" />
            <Strong> 平安银行</Strong>
            度过了四年（深圳，2016–2020）——担任设计组组长与高级
            UI 设计师。从口袋银行家
            UI、主页面风格优化，到<Strong>数字化网点 PC 端</Strong>、<Strong>组件库</Strong>
            建设，这段经历塑造了我对 <Strong>B 端复杂业务系统</Strong>的理解。
          </EssayParagraph>
        </div>

        {/* 6. 平安时期代表作（精简——上一段工作经历） */}
        <EssayParagraph>
          平安时期的代表作——<Strong>网点服务小程序</Strong>把传统门店业务转为清晰、易操作的线上预约办理流程；<Strong>Pocket Banker 2.0</Strong>围绕「高效、简单、数据可视化」重塑；<Strong>传送门</Strong>以悬浮窗加自定义常用入口，解决角色权限切换的高频痛点；<Strong>后台管理系统</Strong>汇集全行大数据，为网点门店、中台数据、人才库三大模块做视觉升级并建立统一组件库。
        </EssayParagraph>

        {/* 7. AI 工具栈 */}
        <EssayParagraph>
          精通 <Strong>Figma、Sketch、C4D、Ps</Strong>
          等设计软件，以及各平台 AI 软件（<Strong>Claude Code、ChatGPT、Codex、HBuilderX</Strong>）等。能够独立完成<Strong>平面视觉设计</Strong>、移动端以及 PC 端 <Strong>UI/UX 设计</Strong>、<Strong>3D 设计</Strong>、<Strong>后台系统设计</Strong>。
        </EssayParagraph>

        {/* 8. AI 协作三入口 —— atom63 "I build in public" 1:1 复刻 */}
        <AIProjectEntrance />

        {/* 9. 团队管理 */}
        <EssayParagraph>
          六年团队管理经验——负责 UI 团队的主视觉提升、工作安排、团队文化建设、周报与线下门店调研。良好的设计能力与沟通协调能力，抗压能力强，具有创新意识。
        </EssayParagraph>

        {/* 10. 项目合集 Timeline —— 原页面底部上移至此 */}
        <ProjectShowcase />

        {/* 11. 收尾 —— 求职状态 */}
        <EssayParagraph>
          我目前在武汉市，求职中随时可入职。
        </EssayParagraph>
      </article>
    </main>
  );
}

/* ============================================================
 * EssayParagraph —— atom63 长文段落
 *   17px / Geist 400 / #b4b4b4
 *   手机端行高放宽到 1.85（中文排版比拉丁需要更松的节奏，
 *   1.625 在小屏上显得密），md 起恢复 atom63 原版 1.625
 * ============================================================ */
function EssayParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-pretty text-essay-p leading-[1.85] text-text-secondary md:leading-[1.625]">
      {children}
    </p>
  );
}

/* ============================================================
 * Strong —— 段内强调词（接近 primary）
 * ============================================================ */
function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-text-primary">{children}</span>;
}

/* ============================================================
 * Favicon —— inline 小图标，紧跟提到的品牌名
 *   15×15px（即 size-[1em]），align baseline
 *
 * 全部本地化（public/images/clients/），零外链 —— GitHub Pages 可用。
 *   - uniontech.svg / pingan.ico ：彩色品牌 logo，直接展示
 *   - midjourney.svg：单色 currentColor 图形，<img> 上下文里渲染为黑色，
 *     加 mono 白底 chip 让它在深色主题下也可见
 * ============================================================ */
function Favicon({ src, alt = '', mono = false }: { src: string; alt?: string; mono?: boolean }) {
  return (
    <span className="mx-[0.2em] inline-flex size-[1em] align-baseline">
      <img
        src={withBasePath(src)}
        alt={alt}
        loading="lazy"
        className={
          mono
            ? 'size-full rounded-[2px] bg-white/90 object-contain p-[1px]'
            : 'size-full object-contain'
        }
      />
    </span>
  );
}

/* ============================================================
 * ShowcaseDuo / LogoGrid 已移除 —— 品牌探索入口下线，
 * 首页改由 AIProjectEntrance（11）+ ProjectShowcase（14）承担
 * ============================================================ */
