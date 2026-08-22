/**
 * Next.js Config — Static Export for GitHub Pages
 *
 * 部署到 https://<user>.github.io/<repo>/ 时，需要在 GitHub Actions 中
 * 设置 env NEXT_PUBLIC_BASE_PATH='/<repo>'。
 * 部署到自定义域名或 user.github.io 根域名时，留空即可。
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,

  // 静态导出必须禁用图片优化（GitHub Pages 无服务端）
  images: {
    unoptimized: true,
  },

  // 静态导出不允许 trailing slash 自动重定向冲突
  trailingSlash: true,

  // 让 [slug] 动态路由被 generateStaticParams 枚举
  experimental: {
    optimizePackageImports: ['gsap'],
  },
};

export default nextConfig;
