import { notFound } from 'next/navigation';
import Link from 'next/link';

import {
  getAllProjectSlugs,
  getProjectBySlug,
  getVisibleProjects,
  type Project,
  type ProjectType,
} from '@/lib/projects';
import { site } from '@/lib/config';
import { cn } from '@/lib/utils';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { RelatedCarousel } from '@/components/sections/RelatedCarousel';

/**
 * 静态导出（output: 'export'）必需 —— 枚举所有 slug
 */
export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

/**
 * metadata —— 浏览器 tab 标题
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Not found' };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  /* More work 与首页 Timeline 同源同卡（getVisibleProjects），
     隐藏项目直接访问时 currentIndex = -1 → 不显示计数 */
  const visible = getVisibleProjects();
  const related = visible.filter((p) => p.slug !== slug);
  const currentIndex = visible.findIndex((p) => p.slug === slug);
  const content = getProjectContent(project);

  return (
    <article className="mx-auto max-w-[672px] px-6 pb-24 pt-8">
      {/* Header */}
      <header className="flex flex-col gap-3 pb-8">
        <h1
          className={cn(
            'text-balance text-3xl tracking-tight text-text-primary',
            'md:text-4xl',
          )}
        >
          {project.title}
        </h1>
        <p className="text-pretty text-base text-text-secondary">{project.description}</p>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
          <span className="tabular-nums">{project.year}</span>
          {project.type && (
            <>
              <span className="opacity-50">·</span>
              <span>{project.type}</span>
            </>
          )}
          {project.client && (
            <>
              <span className="opacity-50">·</span>
              <span>Client · {project.client}</span>
            </>
          )}
          {project.role && (
            <>
              <span className="opacity-50">·</span>
              <span>Role · {project.role}</span>
            </>
          )}
          {project.featured && (
            <>
              <span className="opacity-50">·</span>
              <span className="text-accent-lime">★ Featured</span>
            </>
          )}
        </div>
      </header>

      {/* 01 · 项目背景 */}
      <DetailSection index={1} title="项目背景" label="Background">
        <Prose text={content.background} />
      </DetailSection>

      {/* 02 · 设计过程 */}
      <DetailSection index={2} title="设计过程" label="Process">
        <Prose text={content.process} />
      </DetailSection>

      {/* 03 · 项目设计图 */}
      <DetailSection index={3} title="项目设计图" label="Design Images">
        <ProjectGallery gallery={project.gallery} title={project.title} />
      </DetailSection>

      {/* 外链 CTA（可选） */}
      {project.externalUrl && (
        <section className="border-t border-dashed border-border-subtle pt-8 pb-8">
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className={cn(
              'group inline-flex items-center gap-2 rounded-full',
              'border border-border-default bg-bg-elevated px-5 py-2.5',
              'text-sm text-text-primary transition-all duration-micro ease-out-quart',
              'hover:border-border-strong hover:bg-bg-overlay',
            )}
          >
            <span>View on external site</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-3.5 transition-transform duration-micro ease-out-quart group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </section>
      )}

      {/* 相关作品 —— 横向滑动 carousel */}
      {related.length > 0 && (
        <section className="border-t border-dashed border-border-subtle pt-8 pb-8">
          <header className="mb-5 flex items-baseline justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
              More work
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary tabular-nums">
              {currentIndex >= 0 &&
                `${String(currentIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`}
            </span>
          </header>
          <RelatedCarousel projects={related} />
        </section>
      )}

      {/* 底部联系 */}
      <section className="border-t border-border-subtle pt-8">
        <p className="text-essay-p text-text-secondary">
          想要了解更多这个项目的过程，或者聊类似的工作？写信到{' '}
          <a
            href={`mailto:${site.email}`}
            data-cursor="link"
            className="text-text-primary underline decoration-border-strong decoration-1 underline-offset-4 transition-colors duration-micro ease-out-quart hover:decoration-accent-lime"
          >
            {site.email}
          </a>
          。
        </p>
      </section>
    </article>
  );
}

/* ============================================================
 * DetailSection —— 详情页通用章节壳
 * ============================================================ */
function DetailSection({
  index,
  title,
  label,
  children,
}: {
  index: number;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-dashed border-border-subtle pt-8 pb-8">
      <header className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-[11px] tabular-nums text-text-tertiary">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-xl text-text-primary">{title}</h2>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-text-tertiary opacity-60">
          {label}
        </span>
      </header>
      {children}
    </section>
  );
}

/* ============================================================
 * Prose —— 段落渲染，\n\n 分段
 * ============================================================ */
function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-essay-p leading-[1.75] text-text-secondary">
      {text.split('\n\n').map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

/* ============================================================
 * 文案生成 —— 按 type 产出默认的项目背景 / 设计过程
 * 用户可在 lib/projects.ts 中给单个项目写 background / process
 * 字段覆盖默认模板。
 * ============================================================ */
const TYPE_LABEL: Record<ProjectType, string> = {
  product: '产品',
  brand: '品牌',
  motion: '动态视觉',
  wallpaper: '视觉',
};

function getProjectContent(project: Project) {
  const typeLabel = TYPE_LABEL[project.type as ProjectType] || '设计';
  return {
    background: project.background ?? generateBackground(project, typeLabel),
    process: project.process ?? generateProcess(project),
  };
}

function generateBackground(p: Project, typeLabel: string): string {
  const challenge: Record<ProjectType, string> = {
    product:
      '核心挑战在于平衡功能密度与视觉克制——让信息层次清晰、可读，同时保留产品应有的呼吸感与温度，不让界面被功能塞满。',
    brand:
      '品牌需要在保持核心辨识度的同时适应多场景应用——从数字界面到实体物料，视觉语言要具备足够的延展性与一致性，在不同载体上都能被一眼认出。',
    motion:
      '动态设计的重心是节奏与叙事——在有限的时间内把核心信息讲清楚，让每一帧都服务于整体节奏，同时经得起暂停凝视。',
    wallpaper:
      '壁纸是用户每天反复看到的视觉元素，要在美学表达与视觉舒适度之间找到一个长期可耐受的平衡，不抢戏、不腻味。',
  };

  const parts: string[] = [
    `${p.title} 是 ${p.year} 年的${typeLabel}项目。${p.description}。`,
    challenge[p.type as ProjectType] || challenge.product,
  ];

  if (p.client || p.role) {
    const meta: string[] = [];
    if (p.client) meta.push(`客户为 ${p.client}`);
    if (p.role) meta.push(`担任${p.role}角色`);
    parts.push(meta.join('，') + '。');
  }

  return parts.join('\n\n');
}

function generateProcess(p: Project): string {
  const steps: Record<ProjectType, string[]> = {
    product: [
      '从需求梳理与竞品研究入手，明确产品的核心使用场景与受众画像，收敛出功能优先级与信息架构。',
      '进入概念阶段，通过多轮草图、流程图与低保真原型探索布局与导航逻辑，确定关键路径的交互方式。',
      '视觉执行沉淀为一套系统化的设计规范——色彩、字体、间距、组件 token——并通过高保真原型反复验证细节。',
      '最终交付完整的设计文件、可复用组件库与标注规范，与工程团队紧密协作确保还原度。',
    ],
    brand: [
      '从品牌审计与关键词提取开始，建立品牌的核心调性、价值主张与差异化定位。',
      '通过多轮情绪板与概念探索收敛视觉方向——标识、色彩、字体与辅助图形语言——在每个方向上做深度推演。',
      '将视觉系统延展为完整的应用规范，覆盖数字界面、印刷物料、空间展陈等多种触点。',
      '最终交付品牌手册、可复用的设计资产与动态标识规范，确保品牌在后续运营中保持一致。',
    ],
    motion: [
      '从故事板与节奏设计开始，确定影片的整体结构、情绪曲线与关键画面，反复打磨叙事节奏。',
      '进入制作阶段，通过关键帧与样片逐步确立镜头语言、转场方式与视觉风格。',
      '三维场景的建模、材质、灯光逐镜头调优，渲染测试与正式渲染交替推进，确保画面质量。',
      '后期合成与调色统一整体氛围，最终输出多个版本以适配不同平台与播放场景的裁切需要。',
    ],
    wallpaper: [
      '从情绪板与色彩研究开始，确定画面的整体氛围、色温与视觉方向。',
      '通过多轮渲染迭代收敛构图、光影与材质细节，确保画面在不同尺寸下都成立。',
      '最终输出多分辨率、多比例的版本，适配桌面、移动端与平板等不同设备。',
    ],
  };

  return (steps[p.type as ProjectType] || steps.product).join('\n\n');
}
