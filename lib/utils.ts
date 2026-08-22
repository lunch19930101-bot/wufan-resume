import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * className 合并工具：clsx + tailwind-merge。
 * 解决 Tailwind class 冲突。
 *
 * @example
 * cn('px-4', condition && 'bg-lime', 'px-8')  // → 'bg-lime px-8'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 给静态资源路径加上 basePath 前缀。
 * 用于从 JSON 读取的图片 / 视频 / PDF 路径。
 *
 * 部署到 https://<user>.github.io/<repo>/ 时，next.config.mjs 的 basePath
 * 会自动处理 <Image /> 和 <Link />，但 raw <img> / <video> / CSS url() 不会。
 * 此函数统一处理。
 */
export function withBasePath(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * 年份降序排序辅助。
 */
export function byYearDesc<T extends { year: number }>(a: T, b: T): number {
  return b.year - a.year;
}

/**
 * 提取不重复的维度值（用于 Index 筛选 chips）。
 */
export function uniqueValues<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
