/**
 * 配置数据统一出口（浏览器安全部分）。
 *
 * 此文件只导出可安全打包进 client bundle 的纯 JSON 配置。
 *
 * 修改内容：
 *   - 姓名 / 邮箱 / 社交 → lib/config/site.json
 *   - 导航（已废弃，Nav 不再渲染链接） → lib/config/nav.json
 */
import navConfig from './config/nav.json';
import siteConfig from './config/site.json';

import type { NavItem, SiteConfig } from './types';

export const site = siteConfig as SiteConfig;
export const nav = navConfig as NavItem[];
