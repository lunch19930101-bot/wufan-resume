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
      {/* 手机端章节索引带 —— 放在页面流最前（通知条之下、Hero 之上）。
          之前渲染在 HomeMain 文章流里，轮播上移首屏后被压到长文之后，
          要滚很久才出现；提到顶层后自然位置就在首屏内，轻微下滚即吸附 Nav 下方。
          sticky 容器是 MainArea 的 <main>，贯穿全页，可一路吸附到底。 */}
      <MobileQuickNav />
      <Hero />
      <HomeMain />
    </>
  );
}
