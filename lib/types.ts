/**
 * 全局 TypeScript 类型 — 与 lib/config/*.json 一一对应。
 * 修改 JSON 时，同步更新此处类型。
 */

export interface SiteConfig {
  name: string;
  nameEn: string;
  /** 花名 / 英文 alias（Hero 第二行） */
  codename?: string;
  role: string;
  tagline: string;
  /** Hero 简短介绍（一句话定位 + 引导滚动） */
  intro?: string;
  location: string;
  email: string;
  /** 联系电话（可选，Footer/CommandMenu 暴露） */
  phone?: string;
  /** 微信号（可选，与电话同号时也单独存） */
  wechat?: string;
  calendarUrl: string;
  availableForWork: boolean;
  social: {
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
    github?: string;
  };
  theme: {
    default: 'dark' | 'light';
    toggleable: boolean;
  };
}

export interface NavItem {
  label: string;
  href: string;
}
