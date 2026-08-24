import { Hero } from '@/components/sections/Hero';
import { HomeMain } from '@/components/sections/HomeMain';
import { MobileQuickNav } from '@/components/nav/MobileQuickNav';

/**
 * 首页 —— 1:1 复刻 atom63.io 长文式叙事
 * Hero 开场 + HomeEssay 主体长文
 * （项目合集 ProjectShowcase 已并入 HomeMain 长文流第 14 节）
 */
export default function HomePage() {
  return (
    <>
      {/* 手机端章节索引带 —— fixed 挂在 Nav 下方：默认不显示、不占文档流，
          下滚越过首屏标题区（scrollY > 140）滑入，滚回顶部滑出。 */}
      <MobileQuickNav />
      <Hero />
      <HomeMain />
    </>
  );
}
