'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * MainArea —— <main> 的客户端包装器
 *
 * 根据当前 pathname 决定是否加 pt-[58px]：
 *   - 普通页面：加 pt-[58px] 给 fixed Nav 让位
 *   - /resume*：Nav 已隐藏，去掉 pt 让编辑器真正通栏顶到 viewport 顶
 *
 * 这是 layout.tsx（Server Component）无法直接读 pathname 的折中方案。
 */
export function MainArea({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const standalone = pathname.startsWith('/resume');
  return (
    <main id="main" className={standalone ? '' : 'pt-[58px]'}>
      {children}
    </main>
  );
}
