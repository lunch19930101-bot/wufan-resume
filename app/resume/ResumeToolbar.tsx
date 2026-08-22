'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * ResumeToolbar —— 左栏顶部 .live-source-toolbar
 *
 *   左：.live-doc-segment (简历 / 履历 segmented)
 *   右：.live-source-actions (复制模板 / 重置)
 *
 * 样式 1:1 复刻 resume.atom63.io：
 *   .resume-viewer-btn / .resume-viewer-btn-group
 *   oklch() token 来自 .live-resume → .resume-viewer 父级
 */
type Mode = 'resume' | 'cv';

export function ResumeToolbar({
  mode,
  setMode,
  mdx,
  onReset,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  mdx: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mdx);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="live-source-toolbar">
      {/* 简历 / 履历 segmented */}
      <div className="live-doc-segment resume-viewer-btn-group" role="radiogroup" aria-label="文档模式">
        <SegmentedButton
          active={mode === 'resume'}
          onClick={() => setMode('resume')}
          ariaLabel="简历"
        >
          简历
        </SegmentedButton>
        <SegmentedButton
          active={mode === 'cv'}
          onClick={() => setMode('cv')}
          ariaLabel="履历"
        >
          履历
        </SegmentedButton>
      </div>

      <div className="live-source-actions">
        <button
          type="button"
          onClick={handleCopy}
          data-cursor="link"
          className="resume-viewer-btn live-source-btn"
        >
          {copied ? (
            <CheckIcon />
          ) : (
            <CopyIcon />
          )}
          <span>{copied ? '已复制' : '复制模板'}</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          data-cursor="link"
          className="resume-viewer-btn live-source-btn"
        >
          <ResetIcon />
          <span>重置</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Sub-components
 * ============================================================ */

function SegmentedButton({
  active,
  onClick,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={ariaLabel}
      data-cursor="link"
      onClick={onClick}
      className={cn(
        'resume-viewer-btn',
        active && 'resume-viewer-btn-active',
      )}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="live-btn-icon"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="live-btn-icon live-btn-icon-check"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="live-btn-icon"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
