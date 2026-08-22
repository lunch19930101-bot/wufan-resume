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

const ZOOM_OPTIONS = [50, 75, 100, 125, 150] as const;

export function ResumePreview({
  mdx,
  paper,
  setPaper,
  zoom,
  setZoom,
  mode,
}: {
  mdx: string;
  paper: PaperSize;
  setPaper: (p: PaperSize) => void;
  zoom: number;
  setZoom: (z: number) => void;
  mode: Mode;
}) {
  const [compiled, setCompiled] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const cycleZoom = () => {
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
            className="resume-viewer-btn resume-viewer-btn-active"
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
