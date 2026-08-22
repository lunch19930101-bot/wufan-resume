'use client';

import { usePreferencesOpen } from '@/lib/preferences';

import { PreferencesDialog } from './PreferencesDialog';
import { PreferencesTrigger } from './PreferencesTrigger';

/**
 * Preferences —— 顶部导航右侧的组合：
 *   ⚛️ 原子图标按钮（trigger） + 右下角 Preferences Popover
 *
 * 触发：
 *   - 点击原子按钮
 *   - 快捷键 ⌘+, / Ctrl+,（在 usePreferencesOpen 内监听）
 */
export function Preferences() {
  const { open, setOpen, toggle } = usePreferencesOpen();
  return (
    <>
      <PreferencesTrigger onClick={toggle} aria-expanded={open} />
      <PreferencesDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
