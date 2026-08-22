'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * AIProjectEntrance —— atom63 风格 "I build in public" 三入口
 *
 * 布局（1:1 复刻 atom63.io）：
 *   ┌──────────────────────────────────────────┐
 *   │   01  AI 简历编辑器   [live]    [↗] [⌥]   │  ← FeaturedCard（占满顶部）
 *   │   描述……                                  │
 *   └──────────────────────────────────────────┘
 *   ┌────────────────────┐ ┌────────────────────┐
 *   │ 02 AI 项目二 [soon]│ │ 03 AI 项目三 [soon]│  ← MiniCard（并排）
 *   │ 描述…… [↗] [⌥]    │ │ 描述…… [↗] [⌥]    │
 *   └────────────────────┘ └────────────────────┘
 *
 * - grid-cols-2 gap-3（同 ShowcaseDuo）
 * - 第一张 col-span-2（占满顶部）
 * - 卡片视觉：border + bg-bg-elevated，rounded-[var(--showcase-radius)]
 * - 按钮风格：atom63 outline variant，h-[30px]，rounded-lg
 */
type AIProject = {
  id: string;
  index: string;
  title: string;
  description: string;
  year: string;
  tryLiveHref?: string;
  githubHref?: string;
  status: 'live' | 'soon';
  featured?: boolean;
  /** 浅色渐变底 —— 叠在 bg-bg-elevated 之上，随明暗主题自适应 */
  accent: string;
};

const projects: AIProject[] = [
  {
    id: 'enterprise-asset-mgmt',
    index: '01',
    title: '企业级资产管理系统',
    description:
      '企业级资产管理后台高保真可交互原型——覆盖资产台账、入库、盘点、维保、经营租赁、产权股权、资产地图、竞价与驾驶舱 10 大模块。',
    year: '2026',
    tryLiveHref: 'https://lunch19930101-bot.github.io/enterprise-asset-management/',
    githubHref: 'https://github.com/lunch19930101-bot/enterprise-asset-management',
    status: 'live',
    featured: true,
    /* 企业蓝 —— 双角辉光，呼应数据驾驶舱 */
    accent:
      'radial-gradient(110% 90% at 0% 0%, rgba(44,127,255,0.16) 0%, rgba(44,127,255,0) 58%), radial-gradient(80% 70% at 100% 100%, rgba(44,127,255,0.08) 0%, rgba(44,127,255,0) 55%)',
  },
  {
    id: 'resume-playground',
    index: '02',
    title: 'AI 简历编辑器',
    description: 'MDX 简历游乐场——左侧编辑右侧实时预览，一键保存为 PDF。',
    year: '2026',
    tryLiveHref: '/resume',
    githubHref: 'https://github.com/wufan-example/resume-playground',
    status: 'live',
    /* 纸墨暖光 —— 右上角纸色渐染，呼应文档/纸面 */
    accent:
      'radial-gradient(110% 90% at 100% 0%, rgba(251,191,36,0.13) 0%, rgba(251,191,36,0) 60%)',
  },
  {
    id: 'ai-guozi-analytics',
    index: '03',
    title: 'AI资产管家系统',
    description: 'AI 工具数据分析平台——员工使用趋势与效率提升，可视化驱动管理决策。',
    year: '2026',
    tryLiveHref: 'https://lunch19930101-bot.github.io/ai-usage-analytics/',
    githubHref: 'https://github.com/lunch19930101-bot/ai-usage-analytics',
    status: 'live',
    /* 紫绿双色 —— 顶部紫辉 + 右下数据绿，呼应可视化图表 */
    accent:
      'radial-gradient(110% 90% at 50% 0%, rgba(120,54,242,0.15) 0%, rgba(120,54,242,0) 62%), radial-gradient(70% 60% at 100% 100%, rgba(42,175,118,0.09) 0%, rgba(42,175,118,0) 55%)',
  },
];

export function AIProjectEntrance() {
  const [featured, ...rest] = projects;

  return (
    <section aria-label="AI 协作项目" className="w-full">
      {/* Grid: 1 top (col-span-2) + 2 bottom */}
      <div className="grid grid-cols-2 gap-3">
        {featured && <FeaturedCard project={featured} />}
        {rest.map((p) => (
          <MiniCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * FeaturedCard —— 顶部大卡片，占满两列
 * ============================================================ */
function FeaturedCard({ project }: { project: AIProject }) {
  const isSoon = project.status === 'soon';

  return (
    <article
      style={{ backgroundImage: project.accent }}
      className={cn(
        'col-span-2 flex flex-col gap-4 p-5 md:p-6',
        'rounded-[var(--showcase-radius)]',
        'border border-border-subtle bg-bg-elevated',
        'transition-colors duration-micro ease-out-quart',
      )}
    >
      {/* 头部：index + status + year */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary tabular-nums">
            {project.index}
          </span>
          <StatusPill status={project.status} />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary tabular-nums">
          {project.year}
        </span>
      </div>

      {/* 标题 */}
      <h3 className="text-balance text-xl font-medium tracking-tight text-text-primary md:text-2xl">
        {project.title}
      </h3>

      {/* 描述 */}
      <p className="text-pretty text-sm leading-relaxed text-text-secondary">
        {project.description}
      </p>

      {/* 按钮组 */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <ActionButton
          href={project.tryLiveHref}
          icon={<ExternalLinkIcon className="size-[14px]" />}
          label="try live"
          disabled={isSoon}
          primary
          newTab
        />
        <ActionButton
          href={project.githubHref}
          icon={<GithubIcon className="size-[14px]" />}
          label="github"
          disabled={isSoon}
        />
      </div>
    </article>
  );
}

/* ============================================================
 * MiniCard —— 底部小卡片
 * ============================================================ */
function MiniCard({ project }: { project: AIProject }) {
  const isSoon = project.status === 'soon';

  return (
    <article
      style={{ backgroundImage: project.accent }}
      className={cn(
        'col-span-1 flex flex-col gap-3 p-4 md:p-5',
        'rounded-[var(--showcase-radius)]',
        'border border-border-subtle bg-bg-elevated',
        'transition-colors duration-micro ease-out-quart',
      )}
    >
      {/* 头部：index + status */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary tabular-nums">
          {project.index}
        </span>
        <StatusPill status={project.status} />
      </div>

      {/* 标题 */}
      <h3 className="text-balance text-base font-medium tracking-tight text-text-primary">
        {project.title}
      </h3>

      {/* 描述 —— 钳制 2 行，入口高度随 2 行文案对齐 */}
      <p className="line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
        {project.description}
      </p>

      {/* 按钮组 */}
      <div className="mt-auto flex items-center gap-1.5 pt-1">
        <ActionButton
          href={project.tryLiveHref}
          icon={<ExternalLinkIcon className="size-[12px]" />}
          label="try live"
          disabled={isSoon}
          primary
          compact
          newTab
        />
        <ActionButton
          href={project.githubHref}
          icon={<GithubIcon className="size-[12px]" />}
          label="github"
          disabled={isSoon}
          compact
        />
      </div>
    </article>
  );
}

/* ============================================================
 * StatusPill —— live / soon 状态徽章
 * ============================================================ */
function StatusPill({ status }: { status: 'live' | 'soon' }) {
  if (status === 'live') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full',
          'px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
          'border border-accent-lime/30 bg-accent-lime/10 text-accent-lime',
        )}
      >
        <span className="size-1 rounded-full bg-accent-lime" />
        live
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border-subtle',
        'px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary',
      )}
    >
      soon
    </span>
  );
}

/* ============================================================
 * ActionButton —— atom63 outline variant 风格
 *   - primary（try live）：bg-bg-surface 强调
 *   - secondary（github）：bg-transparent
 *   - disabled：opacity 50%，cursor default
 *   - h-[30px]（featured）/ h-[26px]（compact）
 * ============================================================ */
function ActionButton({
  href,
  icon,
  label,
  disabled,
  primary,
  compact,
  newTab,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  primary?: boolean;
  compact?: boolean;
  newTab?: boolean;
}) {
  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-[var(--control-radius)]',
    'font-mono text-[11px] uppercase tracking-wider',
    'transition-colors duration-micro ease-out-quart',
    compact ? 'h-[26px] px-2' : 'h-[30px] px-2.5',
    disabled
      ? 'border border-border-subtle bg-transparent text-text-tertiary opacity-50'
      : primary
        ? 'border border-border-subtle bg-bg-surface text-text-primary hover:border-border-default'
        : 'border border-border-subtle bg-transparent text-text-secondary hover:text-text-primary hover:border-border-default',
  );

  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  );

  if (disabled || !href) {
    return (
      <span aria-disabled="true" className={cls}>
        {content}
      </span>
    );
  }

  const isInternal = href.startsWith('/');
  const isExternal = href.startsWith('http');

  // newTab 强制外部锚点行为：内部路径也用 <a target="_blank">
  if (isInternal && !newTab) {
    return (
      <Link href={href} data-cursor="link" className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={isExternal || newTab ? '_blank' : undefined}
      rel={isExternal || newTab ? 'noopener noreferrer' : undefined}
      data-cursor="link"
      className={cls}
    >
      {content}
    </a>
  );
}

/* ============================================================
 * Icons
 * ============================================================ */
function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.42.36.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
