import { Hero } from '@/components/sections/Hero';
import { HomeMain } from '@/components/sections/HomeMain';

/**
 * 首页 —— 1:1 复刻 atom63.io 长文式叙事
 * Hero 开场 + HomeEssay 主体长文
 * （项目合集 ProjectShowcase 已并入 HomeMain 长文流第 14 节）
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeMain />
    </>
  );
}
