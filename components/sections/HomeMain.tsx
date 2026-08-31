'use client';

import { type ReactNode } from 'react';

import { cn, withBasePath } from '@/lib/utils';
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

        {/* 2. 统信开篇（#237 加粗收敛：每段 ≤2 处成果词，工具名走 Tool 亮色不加粗） */}
        <div id="uniontech" className="scroll-mt-[calc(104px+env(safe-area-inset-top,0px))]">
          <EssayParagraph>
            曾在
            <Favicon src="/images/clients/uniontech.svg" alt="统信软件" />
            <Strong> 统信软件</Strong>
            担任网页设计组组长与资深
            UI 设计师（武汉，2021–2025）——负责公司官网设计与改版、主页面风格、3D
            视频制作、交互梳理，以及后台管理端界面与<Strong>组件库</Strong>建设。
          </EssayParagraph>
        </div>

        {/* 3. ShowcaseStacked —— 1 大 3 小自动轮换（统信时期精选） */}
        <div>
          <ShowcaseStacked />
        </div>

        <EssayParagraph>
          <Strong>统信官网改版</Strong>——负责官网整体<Strong>视觉体系重构</Strong>与落地执行，覆盖全站页面与模块；建立覆盖全站的组件库，输出色彩、字体、图标、组件、模板等规范。C 端与 B 端视觉统一，整体布局自适应保证各设备阅读性；期间自学 <Tool>C4D</Tool> 投入实战，首页头图以 3D 动态效果呈现。项目六个月完成上线，设计体系支持后续产品线持续扩展。
        </EssayParagraph>

        <EssayParagraph>
          <Strong>统信生态大会</Strong>——公司年度最高规格的品牌活动。把 2020–2024 五届大会物料统一进<Strong>同一视觉体系</Strong>：抽取五届主视觉的共同基因作为基线，年份主题作为变量嵌入，既保留每届特征、又让品牌识别一以贯之。大会专题与官网改版互为延续，按访问年份自动匹配对应物料的视觉样式。
        </EssayParagraph>

        {/* 4. 设计系统 / 组件库工程化 */}
        <EssayParagraph>
          在视觉之外，我同时负责<Strong>设计系统</Strong>的工程化落地——与开发团队定制设计语言、开发周期、<Strong>组件库代码化</Strong>，让设计还原走查与后续迭代的效率得到极大提升。同时把 AI 协作引入工作流——从 <Tool>MJ、豆包、即梦</Tool>等 AI 设计工具起步，到现在用 <Tool>Claude Code</Tool> 打通设计与开发的衔接，效率一路提升。
        </EssayParagraph>

        {/* 5. 平安银行时代 */}
        <div id="pingan" className="scroll-mt-[calc(104px+env(safe-area-inset-top,0px))]">
          <EssayParagraph>
            更早之前，我在
            <Favicon src="/images/clients/pingan.ico" alt="平安银行" />
            <Strong> 平安银行</Strong>
            度过了四年（深圳，2016–2020）——担任设计组组长与高级
            UI 设计师。从口袋银行家
            UI、主页面风格优化，到数字化网点 PC
            端、组件库建设，这段经历塑造了我对 <Strong>B 端复杂业务系统</Strong>的理解。
          </EssayParagraph>
        </div>

        {/* 6. 平安时期代表作（#237：列表段零加粗——项目名走 Tool 亮色分层） */}
        <EssayParagraph>
          平安时期的代表作——<Tool>网点服务小程序</Tool>把传统门店业务转为清晰、易操作的线上预约办理流程；<Tool>Pocket Banker 2.0</Tool>围绕「高效、简单、数据可视化」重塑；<Tool>传送门</Tool>以悬浮窗加自定义常用入口，解决角色权限切换的高频痛点；<Tool>后台管理系统</Tool>汇集全行大数据，为网点门店、中台数据、人才库三大模块做视觉升级并建立统一组件库。
        </EssayParagraph>

        {/* 7. AI 工具栈（#237：纯列举段零加粗，全部 Tool 亮色） */}
        <EssayParagraph>
          精通 <Tool>Figma、Sketch、C4D、Ps</Tool> 等设计软件，以及各平台 AI 软件（<Tool>Claude Code、ChatGPT、Codex、HBuilderX</Tool>）等。能够独立完成平面视觉设计、移动端以及 PC 端 UI/UX 设计、3D 设计、后台系统设计。
        </EssayParagraph>

        {/* 8. AI 协作三入口 —— atom63 "I build in public" 1:1 复刻 */}
        <div>
          <AIProjectEntrance />
        </div>

        {/* 9. 团队管理 */}
        <EssayParagraph>
          <Strong>六年团队管理</Strong>经验——负责 UI 团队的主视觉提升、工作安排与团队文化建设。管理之外，我始终守在视觉一线——工具的每一次迁移都是一条学习曲线：从 <Tool>PS、Sketch</Tool> 到 <Tool>Figma</Tool>，再到 AI 工具的持续跟进，从<Tool>豆包、即梦</Tool>到 <Tool>Gemini</Tool>，再到如今日常使用的 <Tool>ChatGPT 与 Claude Code</Tool>。良好的设计能力与沟通协调能力，抗压能力强，持续学习，保持创新。
        </EssayParagraph>

        {/* 10. 项目合集 Timeline —— 原页面底部上移至此 */}
        <div>
          <ProjectShowcase />
        </div>

        {/* 11. 收尾 —— 求职状态 + 简历直达（#237 走查：核心转化按钮化，
            主次分明 + OPEN TO WORK 呼吸状态灯；移动端 48px 触控档全宽堆叠） */}
        <div className="flex flex-col gap-5">
          <EssayParagraph>我目前在武汉市，求职中随时可入职。</EssayParagraph>
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            <span
              aria-hidden
              className="dot-breathe dot-ping size-[6px] shrink-0 rounded-full bg-accent-lime text-accent-lime"
            />
            Open to work · 随时入职
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={withBasePath('/pdf-viewer/')}
              data-cursor="link"
              className={cn(
                'inline-flex h-[48px] items-center justify-center gap-2 rounded-[var(--control-radius)]',
                'bg-text-primary px-6 text-sm font-[550] tracking-tight text-text-inverse',
                'transition-all duration-micro ease-out-quart',
                'hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev-2)]',
                'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
              )}
            >
              <DocumentTextIcon className="size-4" />
              查看简历 / 作品集 PDF
            </a>
            <a
              href={withBasePath('/resumes/wufan-resume.docx')}
              data-cursor="link"
              className={cn(
                'inline-flex h-[48px] items-center justify-center gap-2 rounded-[var(--control-radius)]',
                'border border-border-default bg-bg-elevated px-6 text-sm text-text-primary',
                'transition-all duration-micro ease-out-quart',
                'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-elev-1)]',
                'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
              )}
            >
              <DownloadIcon className="size-4" />
              下载 Word 版
            </a>
          </div>
        </div>
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
 * Tool —— #237 加粗收敛引入：工具名 / 项目名的中性强调。
 *   亮色但不加粗（颜色分层替代字重分层），把 Strong 留给
 *   每段 ≤2 处真正的成果词；纯列举段（工具栈、代表作清单）
 *   零 Strong、全部 Tool。
 * ============================================================ */
function Tool({ children }: { children: ReactNode }) {
  return <span className="text-text-primary/90">{children}</span>;
}

/* ============================================================
 * Icons —— 简历 CTA 按钮（#237 按钮化）
 * ============================================================ */
function DocumentTextIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
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
