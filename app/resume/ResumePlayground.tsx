'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { ResumeEditor } from './ResumeEditor';
import { ResumePreview } from './ResumePreview';
import { ResumeToolbar } from './ResumeToolbar';
import { DEFAULT_TEMPLATE } from './default-template';

/**
 * ResumePlayground —— /resume 状态中枢 + 栅格容器
 *
 *   .live-resume                    (CSS Grid: source | preview，100vh)
 *     .live-source                  (左栏 flex column)
 *       .live-source-toolbar        (mode + 复制 + 重置)
 *       .live-source-input          (textarea)
 *       .live-source-footer         (行/字符统计)
 *     .live-preview                 (右栏 100%)
 *       .resume-viewer              (内嵌在 ResumePreview)
 *
 * 状态：mdx / paper / zoom / mode，localStorage['resume-draft-v2'] 自动持久化。
 */
// 版本号随 DEFAULT_TEMPLATE 内容变更；bump 一次 → 旧草稿作废，强制加载新模板。
// 历史：v1 = 初版吴帆模板；v2 = 1:1 对齐 atom63 上游默认模板（Group / Entry 语法）。
const STORAGE_KEY = 'resume-draft-v2';

type PaperSize = 'letter' | 'a4';
type Mode = 'resume' | 'cv';
/** 手机端（≤820px）分段视图：编辑 / 预览 二选一，桌面端该状态无效（CSS 隐藏 tabs） */
type MobileView = 'edit' | 'preview';

export function ResumePlayground() {
  const [mdx, setMdx] = useState(DEFAULT_TEMPLATE);
  const [paper, setPaper] = useState<PaperSize>('letter');
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState<Mode>('resume');
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [hydrated, setHydrated] = useState(false);

  // Load draft
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) setMdx(saved);
    } catch {
      /* privacy mode */
    }
    setHydrated(true);
  }, []);

  // Auto-save (debounced 400ms)
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, mdx);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [mdx, hydrated]);

  const handleReset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setMdx(DEFAULT_TEMPLATE);
  };

  const stats = useMemo(() => {
    const lines = mdx.split('\n').length;
    const chars = mdx.length;
    return { lines, chars };
  }, [mdx]);

  return (
    <div className="live-resume" data-mobile-view={mobileView}>
      {/* 手机端 编辑/预览 分段（桌面 display:none，样式在 resume.css §7） */}
      <div className="live-mobile-tabs" role="tablist" aria-label="视图切换">
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === 'edit'}
          data-cursor="link"
          onClick={() => setMobileView('edit')}
          className={cn(
            'live-mobile-tab',
            mobileView === 'edit' && 'live-mobile-tab-active',
          )}
        >
          编辑
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === 'preview'}
          data-cursor="link"
          onClick={() => setMobileView('preview')}
          className={cn(
            'live-mobile-tab',
            mobileView === 'preview' && 'live-mobile-tab-active',
          )}
        >
          预览
        </button>
      </div>
      <aside className="live-source">
        <ResumeToolbar
          mode={mode}
          setMode={setMode}
          mdx={mdx}
          onReset={handleReset}
        />
        <ResumeEditor value={mdx} onChange={setMdx} />
        <div className="live-source-footer">
          <span>
            {stats.lines} 行 · {stats.chars} 字符
          </span>
          <span>{hydrated ? '已自动保存' : '加载中…'}</span>
        </div>
      </aside>
      <main className="live-preview">
        <ResumePreview
          mdx={mdx}
          paper={paper}
          setPaper={setPaper}
          zoom={zoom}
          setZoom={setZoom}
          mode={mode}
          mobileView={mobileView}
        />
      </main>
    </div>
  );
}
