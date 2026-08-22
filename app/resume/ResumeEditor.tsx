'use client';

/**
 * ResumeEditor —— MDX textarea（.live-source-input）
 *
 *   1:1 复刻 resume.atom63.io：
 *     - 单 <textarea>，无行号、无外框
 *     - flex:1 1 auto，自动填满左栏剩余高度
 *     - ui-monospace 13px / 1.55
 *     - resize: none
 *     - outline: none
 *
 *   行号留待 v2 + CodeMirror。
 */
export function ResumeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      className="live-source-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      aria-label="MDX source"
      placeholder="在此输入 MDX…"
    />
  );
}
