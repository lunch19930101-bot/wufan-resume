'use client';

import { useEffect, useMemo, useState } from 'react';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

import { cn } from '@/lib/utils';
import { resumeMdxComponents } from './mdx-components';

/**
 * ResumePreview —— 右栏 .resume-viewer（chrome + 纸张）
 *
 *   .resume-viewer
 *     .resume-viewer-toolbar             (paper / 单页 / 缩放 / 保存为 PDF)
 *       .resume-viewer-controls (left)
 *       .resume-viewer-controls (right)
 *     .resume-viewer-scroll
 *       .resume-viewer-stage
 *         .resume-viewer-page-box
 *           .resume-viewer-scale-root    (zoom 在此)
 *             .doc-page.resume-viewer-content [data-resume-document]
 *
 * 字体、间距、oklch token 全部 1:1 复刻 resume.atom63.io。
 */
type PaperSize = 'letter' | 'a4';
type Mode = 'resume' | 'cv';
type MobileView = 'edit' | 'preview';

const ZOOM_OPTIONS = [50, 75, 100, 125, 150] as const;
/** 纸张未缩放布局宽（96dpi）：letter 8.5in=816px；a4 210mm≈794px */
const PAPER_LAYOUT_W: Record<PaperSize, number> = { letter: 816, a4: 794 };

export function ResumePreview({
  mdx,
  paper,
  setPaper,
  zoom,
  setZoom,
  mode,
  mobileView,
}: {
  mdx: string;
  paper: PaperSize;
  setPaper: (p: PaperSize) => void;
  zoom: number;
  setZoom: (z: number) => void;
  mode: Mode;
  mobileView: MobileView;
}) {
  const [compiled, setCompiled] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  // fit 模式：手机端纸张自动缩放到满宽可读；手动 cycleZoom 后本轮退出 fit
  const [fitMode, setFitMode] = useState(true);

  const components = useMemo(
    () => resumeMdxComponents as Record<string, React.ComponentType<unknown>>,
    [],
  );

  // Compile MDX whenever source changes
  useEffect(() => {
    let cancelled = false;
    serialize(mdx)
      .then((result) => {
        if (cancelled) return;
        setCompiled(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setCompiled(null);
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [mdx]);

  const handlePrint = () => window.print();

  // 手机端（≤820px）fit-to-width：纸张缩放到视口满宽（扣掉 stage 左右 1rem）。
  // 桌面端不介入；回到桌面时若仍处于 fit 模式则恢复 100%。
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const apply = () => {
      if (!mq.matches || !fitMode) return;
      const avail = window.innerWidth - 32;
      const fit = Math.min(
        100,
        Math.max(25, Math.round((avail / PAPER_LAYOUT_W[paper]) * 100)),
      );
      setZoom(fit);
    };
    apply();
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        if (fitMode) setZoom(100);
        return;
      }
      apply();
    };
    mq.addEventListener('change', onChange);
    window.addEventListener('resize', apply);
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('resize', apply);
    };
  }, [paper, fitMode, setZoom]);

  const cycleZoom = () => {
    setFitMode(false); // 用户接管缩放，停止自动适配
    const idx = ZOOM_OPTIONS.indexOf(zoom as (typeof ZOOM_OPTIONS)[number]);
    const next = idx === -1 ? 2 : (idx + 1) % ZOOM_OPTIONS.length;
    setZoom(ZOOM_OPTIONS[next] ?? 100);
  };

  return (
    <div className="resume-viewer">
      <div className="resume-viewer-toolbar">
        {/* Left: page size / single / zoom */}
        <div className="resume-viewer-controls">
          <div
            className="live-page-size resume-viewer-btn-group"
            role="radiogroup"
            aria-label="纸张大小"
          >
            <button
              type="button"
              role="radio"
              aria-checked={paper === 'letter'}
              data-cursor="link"
              onClick={() => setPaper('letter')}
              className={cn(
                'resume-viewer-btn',
                paper === 'letter' && 'resume-viewer-btn-active',
              )}
            >
              letter
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={paper === 'a4'}
              data-cursor="link"
              onClick={() => setPaper('a4')}
              className={cn(
                'resume-viewer-btn',
                paper === 'a4' && 'resume-viewer-btn-active',
              )}
            >
              a4
            </button>
          </div>

          <button
            type="button"
            disabled
            title="v1 仅支持单页"
            aria-pressed="true"
            className="resume-viewer-btn resume-viewer-btn-active live-single-toggle"
          >
            单页
          </button>

          <button
            type="button"
            data-cursor="link"
            onClick={cycleZoom}
            aria-label="切换缩放"
            className="resume-viewer-zoom-label"
          >
            {zoom}%
          </button>
        </div>

        {/* Right: save pdf */}
        <div className="resume-viewer-controls">
          <button
            type="button"
            onClick={handlePrint}
            data-cursor="link"
            className="resume-viewer-btn resume-viewer-btn-primary"
          >
            保存为 PDF
          </button>
        </div>
      </div>

      <div className="resume-viewer-scroll">
        <div className="resume-viewer-stage">
          <div className="resume-viewer-page-box">
            <div
              className="resume-viewer-scale-root"
              style={{ zoom: `${zoom}%` }}
            >
              <div
                data-resume-document
                data-paper={paper}
                data-mode={mode}
                data-page-mode="single"
                data-resume-scale-root
                className="doc-page resume-viewer-content"
              >
                {error ? (
                  <div className="live-error" role="alert">
                    MDX 编译错误：{error}
                  </div>
                ) : compiled ? (
                  <MDXRemote {...compiled} components={components} />
                ) : (
                  <div
                    style={{
                      padding: '2rem',
                      color: 'var(--rv-ink-muted)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    编译中…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
