'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import {
  BrandFigmaIcon,
  BrandSketchIcon,
  BrandCinemaIcon,
  BrandClaudeIcon,
  BrandGeminiIcon,
  BrandMidjourneyIcon,
} from '@/components/icons';

/**
 * ToolDeck —— 工具箱卡片网格（首页 AI 工具栈段落的可视化补充）
 *
 * 「文字的排版清晰、简单易读」：段落里的工具名列举保留（叙事），
 * 同一批工具在这里变成可扫读的品牌卡片（查阅）——
 *   品牌 logo 在前（simple-icons 官方 path + 品牌色），
 *   无官方 SVG 的用品牌色字母 chip（Ps / GPT / 豆 / 即 / HX）。
 *
 * 视觉：.tool-card（globals.css）——品牌色 tint 底 tile + hover 流光扫过
 * + 品牌色描边/辉光（color-mix 于 --tc），2026 糖果色渐变趋势的克制版。
 */
type Tool = {
  name: string;
  role: string;
  color: string;
  icon?: ReactNode;
  chip?: string;
};

const TOOLS: Tool[] = [
  { name: 'Figma', role: '界面 · 组件', color: '#F24E1E', icon: <BrandFigmaIcon className="size-[16px]" /> },
  { name: 'Sketch', role: '早期 UI 稿', color: '#F7B500', icon: <BrandSketchIcon className="size-[16px]" /> },
  { name: 'Cinema 4D', role: '3D · 动态', color: '#5A7BFF', icon: <BrandCinemaIcon className="size-[16px]" /> },
  { name: 'Photoshop', role: '图像处理', color: '#31A8FF', chip: 'Ps' },
  { name: 'Midjourney', role: 'AI 绘图', color: '#B9C0CC', icon: <BrandMidjourneyIcon className="size-[15px]" /> },
  { name: 'Claude Code', role: 'AI 结对编程', color: '#D97757', icon: <BrandClaudeIcon className="size-[16px]" /> },
  { name: 'ChatGPT', role: '灵感 · 文案', color: '#10A37F', chip: 'GPT' },
  { name: 'Codex', role: '终端协作', color: '#8B5CF6', chip: 'CX' },
  { name: 'Gemini', role: '多模态草图', color: '#9F86EA', icon: <BrandGeminiIcon className="size-[16px]" /> },
  { name: '豆包', role: '图像生成', color: '#7A93FF', chip: '豆' },
  { name: '即梦', role: '视觉 · 动效', color: '#FF5C8A', chip: '即' },
  { name: 'HBuilderX', role: '多端构建', color: '#2BA245', chip: 'HX' },
];

export function ToolDeck() {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
        / Toolbox · 日常工具箱
      </p>
      <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-3 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <div
            key={t.name}
            style={{ '--tc': t.color } as React.CSSProperties}
            className={cn(
              'tool-card group relative flex items-center gap-[10px] overflow-hidden',
              'rounded-[var(--control-radius)] border border-border-subtle bg-bg-elevated',
              'px-3 py-[10px]',
              'transition-[transform,border-color,box-shadow] duration-micro ease-out-quart',
              'hover:-translate-y-[2px]',
            )}
          >
            {/* 品牌 tile —— 品牌色 12% 底 + 品牌色图标/字母 */}
            <span
              aria-hidden
              style={{ backgroundColor: `color-mix(in srgb, ${t.color} 12%, transparent)`, color: t.color }}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px]"
            >
              {t.icon ?? (
                <span className="font-mono text-[10px] font-semibold tracking-tight">{t.chip}</span>
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-[4px]">
              <span className="truncate text-[13px] leading-none text-text-primary">{t.name}</span>
              <span className="truncate font-mono text-[10px] leading-none text-text-tertiary">
                {t.role}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
