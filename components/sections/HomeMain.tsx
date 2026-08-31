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
 * 容器（#228 统一宽，用户指定）：max-w-[672px] lg:max-w-[864px] xl:max-w-[1088px]
 *   —— 文字与卡片同宽，不再分层破格；px-6 (32px) → 内文 608 / 800 / 1024px
 *   —— globals.css 的 body::after 竖线与 .grid-rule 菱形用同档媒体查询联动（54rem / 68rem）
 * 段间距：节间 40px（#230 全断点统一）；手机节内相关内容 24px
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
    <main className="mx-auto max-w-[672px] px-6 lg:max-w-[864px] xl:max-w-[1088px]">
      {/* 手机端垂直节奏两档制（用户 2026-08-24）：节间距 40px、节内相关内容 24px。
          手机 pt-0 —— 与 Hero 的 40px 底距合并为单一 40px 节距（原来 64+64=128 过宽）；
          #230 节间距统一 40px（md+ 原为 32px），页边留白 md pb-64px 不变。
          #232 md:pt-0 —— PC 同理：Hero md:pb-[40px] + 这里 pt-0 = 40px 节距
          （原 md:pt-16=64 与 Hero pb-16=64 叠成 128px 空带） */}
      <article className="space-y-[40px] pt-0 pb-[40px] md:pt-0 md:pb-16">
        {/* 1. 统信时期项目轮播 —— 横向滑动作品展示。
            PC 副本：手机端轮播已上移到 Hero 第一屏（#showcase 锚点在那边）。
            #231 曾与 Hero 介绍文一起收到 672px；#232 用户反馈右侧大片空白怪，
            定稿：视频恢复撑满容器（md 608 / lg 800 / xl 1024），仅介绍文保持
            672px 阅读行宽（编辑式「文字窄、媒体宽」层次） */}
        <div className="hidden scroll-mt-[calc(104px+env(safe-area-inset-top,0px))] md:block">
          <ShowcaseCarousel />
        </div>

        {/* 2. 统信开篇 */}
        <div id="uniontech" className="scroll-mt-[calc(104px+env(safe-area-inset-top,0px))]">
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
        <div>
          <ShowcaseStacked />
        </div>

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
        <div id="pingan" className="scroll-mt-[calc(104px+env(safe-area-inset-top,0px))]">
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
        <div>
          <AIProjectEntrance />
        </div>

        {/* 9. 团队管理 */}
        <EssayParagraph>
          <Strong>六年团队管理</Strong>经验——负责 UI 团队的<Strong>主视觉提升</Strong>、工作安排与<Strong>团队文化建设</Strong>。管理之外，我始终守在视觉一线——工具的每一次迁移都是一条学习曲线：从 <Strong>PS、Sketch</Strong> 到 <Strong>Figma</Strong>，再到 AI 工具的持续跟进，从<Strong>豆包、即梦</Strong>到 <Strong>Gemini</Strong>，再到如今日常使用的 <Strong>ChatGPT 与 Claude Code</Strong>。良好的设计能力与沟通协调能力，抗压能力强，持续学习，保持创新。
        </EssayParagraph>

        {/* 10. 项目合集 Timeline —— 原页面底部上移至此 */}
        <div>
          <ProjectShowcase />
        </div>

        {/* 11. 收尾 —— 求职状态 + 简历直达（#235 走查：核心转化动作不能只藏在 Menu 里） */}
        <EssayParagraph>
          我目前在武汉市，求职中随时可入职。
          <a
            href={withBasePath('/pdf-viewer/')}
            data-cursor="link"
            className="ml-2 text-text-primary underline decoration-text-tertiary underline-offset-[6px] transition-colors hover:decoration-text-primary"
          >
            查看简历 / 作品集 PDF
          </a>
          <a
            href={withBasePath('/resumes/wufan-resume.docx')}
            data-cursor="link"
            className="ml-3 text-text-primary underline decoration-text-tertiary underline-offset-[6px] transition-colors hover:decoration-text-primary"
          >
            下载 Word 版
          </a>
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
 *   #236 宽度走查：去掉 measure-max（44em=748px 限宽）——
 *   首页文案与虚线/展示图片/Hero 同宽（608/800/1024），
 *   限宽只保留在详情页 Prose（阅读场景不同）
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
  return <span className="font-[550] text-text-primary">{children}</span>;
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
