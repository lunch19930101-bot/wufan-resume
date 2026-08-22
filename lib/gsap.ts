/**
 * GSAP 注册与 ScrollTrigger 配置。
 * 仅在客户端执行（被 'use client' 组件 import）。
 */
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册插件（一次性，模块级执行）
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
