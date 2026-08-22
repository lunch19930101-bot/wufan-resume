/**
 * mdx-components —— @atom63/resume 上游 grammar 1:1 复刻
 *
 * 上游源码：packages/resume/src/document/components.tsx（MIT）
 *   ResumeDocument = PaginatedResume（上游有分页引擎）
 *   ↑ 本项目 v1 不做分页，ResumeDocument 简化为 token 作用域容器
 *
 * 视觉规则全部走 .doc-* semantic classes（写在 resume.css），
 * 组件只组合 class，不写死尺寸/颜色/网格宽度——保证简历与履历共享一套样式。
 *
 * MDX 字段映射：
 *   <ResumeDocument>...</ResumeDocument>     最外层
 *   <Header><HeaderLeft/><HeaderRight/></Header>
 *   <Columns><Sidebar/><Main/></Columns>
 *   <Section label="联系方式">...</Section>
 *   <Entry year="2025" role="AI 协作">...</Entry>
 *   <Group>...</Group>  <Links>...</Links>  <Rule/>  <Footer>...</Footer>
 *   # h1 → doc-title  ## h3 → doc-heading  #### h4 → doc-subheading
 *   **strong**  *em*  [link](url)  --- hr
 */

import type { ReactNode } from 'react';

/* ============================================================
 * Document primitives
 * ============================================================ */

/**
 * ResumeDocument —— 最外层容器，作用 [data-resume-document] token scope。
 * v1 不分页：直接渲染子元素，超出由 .resume-paper[overflow:hidden] 裁剪。
 */
function ResumeDocument({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Header({
  children,
  meta = false,
}: {
  children: ReactNode;
  meta?: boolean;
}) {
  return (
    <div className={meta ? 'doc-header doc-meta-grid' : 'doc-header doc-resume-grid'}>
      {children}
    </div>
  );
}

function HeaderLeft({ children }: { children: ReactNode }) {
  return <div className="doc-header-col doc-header-left">{children}</div>;
}

function HeaderRight({ children }: { children: ReactNode }) {
  return <div className="doc-header-col doc-header-right">{children}</div>;
}

function Links({ children }: { children: ReactNode }) {
  return <div className="doc-group doc-links">{children}</div>;
}

function Group({ children }: { children: ReactNode }) {
  return <div className="doc-group">{children}</div>;
}

function Entry({
  year,
  role,
  children,
}: {
  year?: string;
  role?: string;
  children: ReactNode;
}) {
  return (
    <div className="doc-meta-grid">
      <span className="doc-meta">{year}</span>
      <div className="doc-entry-body">
        {role && <p className="doc-subheading">{role}</p>}
        <div className="doc-body">{children}</div>
      </div>
    </div>
  );
}

function Rule() {
  return <div className="doc-rule" />;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="doc-section doc-meta-grid">
      <h3 className="doc-heading">{label}</h3>
      <div className="doc-col">{children}</div>
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div className="doc-footer" data-footer>
      {children}
    </div>
  );
}

function Columns({ children }: { children: ReactNode }) {
  return <div className="doc-resume-grid">{children}</div>;
}

function Sidebar({ children }: { children: ReactNode }) {
  return (
    <div className="doc-col doc-col-sidebar" data-resume-col="sidebar">
      {children}
    </div>
  );
}

function Main({ children }: { children: ReactNode }) {
  return (
    <div className="doc-col doc-col-main" data-resume-col="main">
      {children}
    </div>
  );
}

/* ============================================================
 * Markdown element overrides
 * ============================================================ */

type ElProps<T extends HTMLElement> = React.HTMLAttributes<T>;

const mdElementOverrides = {
  h1: ({ children, ...props }: ElProps<HTMLHeadingElement>) => (
    <h1 className="doc-title" {...props}>
      {children}
    </h1>
  ),
  h3: ({ children, ...props }: ElProps<HTMLHeadingElement>) => (
    <h3 className="doc-section doc-heading" data-resume-keep-with-next {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ElProps<HTMLHeadingElement>) => (
    <h4 className="doc-subheading" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ElProps<HTMLParagraphElement>) => (
    <p className="doc-body" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ElProps<HTMLUListElement>) => (
    <ul className="doc-list" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: ElProps<HTMLLIElement>) => (
    <li className="doc-body" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: ElProps<HTMLElement>) => (
    <strong className="doc-strong" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ElProps<HTMLElement>) => (
    <em className="doc-meta doc-em" {...props}>
      {children}
    </em>
  ),
  a: ({
    children,
    href,
    target,
    rel,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <a
        className="doc-link"
        href={href}
        rel={external ? (rel ?? 'noopener noreferrer') : rel}
        target={external ? (target ?? '_blank') : target}
        {...props}
      >
        {children}
      </a>
    );
  },
  hr: () => <div className="doc-hr" />,
};

/* ============================================================
 * Exported component map for <MDXRemote components={...}>
 * ============================================================ */

export const resumeMdxComponents = {
  ResumeDocument,
  Header,
  HeaderLeft,
  HeaderRight,
  Links,
  Group,
  Entry,
  Rule,
  Section,
  Footer,
  Columns,
  Sidebar,
  Main,
  ...mdElementOverrides,
} as const;

export type ResumeMdxComponents = typeof resumeMdxComponents;
