/**
 * 作品数据层 —— 12 个项目的 source of truth
 *
 * 字段说明：
 *   slug              URL 路径标识（/projects/<slug>）
 *   title             卡片标题
 *   description       卡片短描述（≤60 字）
 *   year              年份字符串
 *   type              分类：product / brand / motion / wallpaper
 *   featured          是否精选（首页 ShowcaseDuo 等会优先取 featured）
 *   companyLocation   公司所在地（武汉 / 深圳，用于详情页背景文案）
 *
 *   详情页文案（每个项目定制，覆盖默认模板）：
 *   background        项目背景
 *   process           设计过程
 *
 *   其他可选字段：
 *   cover             封面图 /images/projects/<slug>/cover.jpg
 *   gallery           详情页图集
 *   pdf               原始 PDF 路径
 *   body              长文描述
 *   externalUrl       外链
 *   client            客户/品牌
 *   role              担任角色
 */

export type ProjectType = 'product' | 'brand' | 'motion' | 'wallpaper';

export interface Project {
  slug: string;
  title: string;
  description: string;
  year: string;
  type: ProjectType | '';
  featured?: boolean;
  companyLocation?: string;
  cover?: string;
  /** 封面右上（badge 区域）明暗 —— PIL 实测亮度；深底白箭头 / 浅底黑箭头（WorkCard 玻璃 badge 用） */
  coverTone?: 'dark' | 'light';
  /** 详情页图集。ratio = 图片真实宽高比（w/h），用于 1:1 无裁切展示；字符串 = 默认 16:10；maxW = 舞台最大显示宽度（手机截图限宽居中） */
  gallery?: (string | { src: string; ratio?: number; label?: string; layout?: 'stack' | 'grid'; maxW?: number })[];
  pdf?: string;
  background?: string;
  process?: string;
  body?: string;
  externalUrl?: string;
  client?: string;
  role?: string;
  /**
   * 卡片直跳 URL（绕过详情页）—— atom63 Open Source 入口模式。
   * 设了此字段的 project 不会生成 /projects/<slug> 静态详情页，
   * Timeline 卡片点击直接跳到此 URL。
   */
  directUrl?: string;
}

export const projects: Project[] = [
  // —— 统信软件（武汉，2021–2025）——
  {
    slug: 'eazo-website',
    title: '统信官网',
    description: '公司官网改版——统一 C 端与 B 端视觉语言，整体布局自适应。',
    year: '2025',
    cover: '/images/projects/eazo-website/cover.jpg',
    coverTone: 'dark', // 右上实测亮度 4.7
    type: 'brand',
    featured: true,
    companyLocation: '武汉',
    client: '统信软件科技有限公司',
    role: '设计组长 · 资深 UI',
    gallery: [
      // 用户提供的 5 张原始整页截图 —— 现状 + 三套方案 + 手机端完整长图
      { src: '/images/projects/eazo-website/01.jpg', ratio: 0.2503, label: '现状 · 统信官网（目前线上）' },
      { src: '/images/projects/eazo-website/02.jpg', ratio: 0.293, label: '方案一 · 官网首页' },
      { src: '/images/projects/eazo-website/03.jpg', ratio: 0.2529, label: '方案二 · 官网首页 Demo 1' },
      { src: '/images/projects/eazo-website/04.jpg', ratio: 0.2001, label: '方案三 · 官网首页 Demo 2' },
      { src: '/images/projects/eazo-website/05.jpg', ratio: 0.0699, label: '手机端 · 完整', maxW: 400 },
    ],
    background:
      '统信官网是公司品牌对外展示的核心窗口，同时承载 C 端（产品、生态）与 B 端（解决方案、合作伙伴）两类访问者。原网页样式陈旧，与生态大会等年度物料的视觉语言割裂。\n\n改版目标：网页样式整体改版，C 端与 B 端视觉样式统一；首页考虑与生态大会的延续性与统一性，并把 2020–2024 五年物料纳入同一视觉体系。',
    process:
      '风格探索——先做方案一、方案二两套风格方向，从品牌基因与生态调性收敛出最终视觉。\n\n视觉统一——C 端与 B 端视觉样式统一；首页考虑生态大会的延续性与统一性，2020–2024 物料统一视觉升级。\n\n年份物料——根据用户访问的年份信息，使用贴合年份物料的视觉样式，让历年内容在统一体系下各有特征。\n\n自适应布局——整体布局自适应，保证桌面、平板、移动端的阅读性。\n\n首页头图——做动态效果，让首屏有「活的」第一印象。',
  },
  {
    slug: 'ecosystem-summit',
    title: '统信生态大会',
    description: '年度大会专题——把 2020–2024 物料统一为同一视觉体系，按年份做差异化点缀。',
    year: '2025',
    cover: '/images/projects/ecosystem-summit/cover.jpg',
    coverTone: 'light', // 右上实测亮度 236.7
    type: 'brand',
    companyLocation: '武汉',
    client: '统信软件科技有限公司',
    role: '设计组长 · 资深 UI',
    gallery: [
      // 2020–2024 五届 KV 大图 banner（用户原始高清文件，1920×1080 原生 16:9）
      { src: '/images/projects/ecosystem-summit/02.jpg', ratio: 1.778 },
      { src: '/images/projects/ecosystem-summit/03.jpg', ratio: 1.778 },
      { src: '/images/projects/ecosystem-summit/04.jpg', ratio: 1.778 },
      { src: '/images/projects/ecosystem-summit/05.jpg', ratio: 1.778 },
      { src: '/images/projects/ecosystem-summit/06.jpg', ratio: 1.778 },
    ],
    background:
      '统信生态大会是公司年度最高规格的品牌活动。从 2020 年到 2024 年，每一届大会都有独立的主题与主视觉，但互相割裂，品牌资产无法沉淀、用户认知不连贯。\n\n2024 年的任务是把五年物料统一进同一视觉体系——既保留每届的特征，又让品牌识别一以贯之，并与官网改版互相延续。',
    process:
      '历史盘点——把 2020–2024 五届大会的主视觉、KV、字体、配色、图形元素逐一梳理，找到共同基因。\n\n体系建立——抽取共同基因作为「基线」，把年份主题作为「变量」嵌入，统一视觉升级。\n\n网页承载——统一后的视觉体系落到官网专题，根据用户访问的年份信息自动匹配对应年份的物料视觉样式。\n\n延续性——与官网改版同步考虑，大会页与官网互为延续，访问者切换时感受到「同一品牌的不同章节」。',
  },
  {
    slug: 'uos-dev-platform',
    title: 'UOS 开发者平台',
    description: '开发者社区改版——面向开发者的模块化信息架构与新手指南场景化设计。',
    year: '2024',
    cover: '/images/projects/uos-dev-platform/cover.jpg',
    coverTone: 'dark', // 右上实测亮度 13.2
    type: 'product',
    companyLocation: '武汉',
    client: '统信软件科技有限公司',
    role: '设计组长 · 资深 UI',
    gallery: [
      // 2024 用户提供的原始图：首页长图 + UOS 玲珑双端 + deepin 论坛（步骤分页小图已去掉）
      // （大长图已压 JPEG q85 控制体积；ratio 均为真实宽高比）
      { src: '/images/projects/uos-dev-platform/home.jpg', ratio: 0.347, label: '首页 · 完整长图' },
      { src: '/images/projects/uos-dev-platform/linglong.jpg', ratio: 0.403, label: 'UOS 玲珑 · 桌面端' },
      { src: '/images/projects/uos-dev-platform/linglong-mobile.jpg', ratio: 0.073, label: 'UOS 玲珑 · 移动端', maxW: 400 },
      { src: '/images/projects/uos-dev-platform/forum.png', ratio: 1.036, label: 'deepin 论坛' },
    ],
    background:
      'UOS 开发者平台是统信面向 Linux 应用开发者的核心平台，覆盖 SDK 文档、玲珑应用分发、社区论坛等模块。\n\n原平台各模块边界不清，新手指南与文档参考混在一起，开发者上手成本高。改版的核心诉求是结合使用群体——开发者——做模块化重构。',
    process:
      '模块化设计——结合使用群体是开发者这一特点，把各模块明确区分、模块化设计，从信息架构上让每个模块一眼可辨。\n\n新手指南场景化——根据开发使用场景，把新手指南设计成工作场景的微缩图，让开发者一眼看懂这个模块解决什么问题。\n\n自适应——各模块布局自适应，保证不同设备与代码内容的阅读性。',
  },
  {
    slug: 'uos-cloud-disk',
    title: '统信云盘',
    description: 'UOS 系统原生云盘客户端——打造办公一体式云存储体验。',
    year: '2024',
    cover: '/images/projects/uos-cloud-disk/cover.jpg',
    coverTone: 'light', // 右上实测亮度 237.1
    type: 'product',
    companyLocation: '武汉',
    client: '统信软件科技有限公司',
    role: '设计组长 · 资深 UI',
    gallery: [
      // 2024 畅写云盘 6 张原始图：产品 KV 长图 ×2 + 客户端 @2x 截图 ×3 + 手机登录
      // （KV 长图压 JPEG q85；@2x 截图降回 1440w 逻辑分辨率）
      { src: '/images/projects/uos-cloud-disk/banner.jpg', ratio: 0.34, label: '畅写云盘 · KV 长图' },
      { src: '/images/projects/uos-cloud-disk/client-2.png', ratio: 1.343, label: '客户端 2.0' },
      { src: '/images/projects/uos-cloud-disk/syncing.png', ratio: 1.343, label: '同步中' },
      { src: '/images/projects/uos-cloud-disk/sync-tip.png', ratio: 1.343, label: '同步提示' },
      { src: '/images/projects/uos-cloud-disk/mobile-login.jpg', ratio: 1.538, label: '手机登录' },
      { src: '/images/projects/uos-cloud-disk/docs-banner.jpg', ratio: 0.34, label: '畅写文档中台 · KV 长图' },
    ],
    background:
      '统信云盘是公司自有 UOS 系统的云盘客户端，定位「办公云盘一体式办公软件」——不仅是文件同步，而是把云存储与畅写文档中台整合成一套完整的办公解决方案。\n\n设计目标：让云盘成为 UOS 办公场景的原生基础设施，客户端、同步、移动端与文档中台共用一套视觉语言。',
    process:
      '客户端 2.0——UOS 系统内的云盘客户端界面，文件管理、导航、设置与系统视觉融为一体。\n\n同步状态细化——同步中、同步提示等场景做了明确的状态反馈，让用户随时知道文件处于哪个阶段。\n\n移动端——手机端登录与文件查看，延续客户端同一套视觉语言。\n\n畅写文档中台——与云盘一体的文档中台，KV 与产品页延续「办公一体化」的品牌表达。',
  },
  // —— 平安银行（深圳，2016–2020）——
  {
    slug: 'pingan-mini-program',
    title: '网点服务小程序',
    description: '全平台 C+B 一站式方案——传统零售数字化转型，让门店业务转线上预约办理。',
    year: '2019',
    cover: '/images/projects/pingan-mini-program/cover.jpg',
    coverTone: 'light', // 右上实测亮度 233.3
    type: 'product',
    featured: true,
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [
      // 0423 改版历程：首页双屏方案对比 → 样式探索 → 定稿 → 行长直通车
      // 源图每台手机统一 708px 宽；maxW 400 限制舞台显示尺寸（手机不放太大），全部走长图分支
      { src: '/images/projects/pingan-mini-program/plan-a.jpg', ratio: 0.565, label: '首页方案 · 对比 A', maxW: 400 },
      { src: '/images/projects/pingan-mini-program/plan-b.jpg', ratio: 0.565, label: '首页方案 · 对比 B', maxW: 400 },
      { src: '/images/projects/pingan-mini-program/explore-1.jpg', ratio: 0.371, label: '样式探索 · 方案一', maxW: 400 },
      { src: '/images/projects/pingan-mini-program/explore-2.jpg', ratio: 0.371, label: '样式探索 · 方案二', maxW: 400 },
      { src: '/images/projects/pingan-mini-program/final.jpg', ratio: 0.392, label: '首页 · 定稿', maxW: 400 },
      { src: '/images/projects/pingan-mini-program/manager.png', ratio: 0.462, label: '行长直通车', maxW: 400 },
    ],
    background:
      '线下网点面临客流堆积、业务滞留、办理繁杂等问题，同时客户的线上办理需求持续上升。平安启动网点服务小程序——一个智能运营小程序，助力传统零售数字化转型，定位「有温度的线上数字化经营平台」。\n\n设计关键词「有温度 / 高效 / 简洁」，分别对应「被体贴的服务 / 功能的一致 / 化繁为简」；通过预约办理提高效率，围绕网点、行员个人两大核心板块，做成全平台 C+B 一站式方案。',
    process:
      '产品梳理——从「被体贴的服务 / 功能的一致 / 化繁为简」推导出「有温度 / 高效 / 简洁」三个设计关键词，围绕网点、行员个人两大核心板块展开。\n\n首页层级——首屏由网点自定义背景图、行长信息、网点具体信息构成；根据用户使用深度展示不同卡片；卡片式布局让信息更聚焦，网点信息卡片自动吸顶，浏览时随时可查。\n\n首页改版历程——0423 改版：先出改版需求稿梳理现状问题，再做样式一、样式二两轮风格探索，最终收敛到确定样式——支行长问候、支行信息、业务入口、福利推荐、周边特惠、精选沙龙。\n\n行长直通车——点赞 / 吐槽专用通道，直接反馈到网点行长，第一时间查看处理进度。\n\n双端——C 端客户在线预约办理，B 端行员经营管理，两端共用同一套框架与视觉语言。',
  },
  {
    slug: 'pingan-shop',
    title: '行员个人商铺',
    description: '口袋银行家内的行员个人定制商铺——个性化名片、皮肤、网点产品等核心功能。',
    year: '2019',
    type: 'product',
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [
      { src: '/images/projects/pingan-shop/01.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-shop/02.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-shop/03.jpg', ratio: 1.778 },
    ],
    background:
      '平安银行每个行员都是潜在的「业务出口」——客户更愿意找熟悉的行员办理业务，而不是走进陌生网点排队。\n\n行员个人商铺就是把这个关系数字化：每个行员在 B 端（口袋银行家）配置自己的店铺后，C 端客户通过小程序就能进入这家「专属门店」，看到行员名片、推荐产品、近期观点，并直接咨询办理。',
    process:
      '信息层级——商铺首屏突出「核心名片」（行员头像、姓名、岗位、归属行），个人介绍与归属行信息收齐在次级。\n\n咨询固底——电话咨询与在线咨询作为固底设计，让客户能第一时间联系到当前店铺行员。\n\n一键换肤——行员可在 B 端口袋银行家中更换店铺皮肤，皮肤切换后部分风格、主题、金额颜色跟随更换。\n\n自定义色彩库——设计交付过程中对文字与图形统一建立可自定义的色彩库，让换肤不只是换背景图而是整体视觉语言切换。\n\n业务承载——客户在行员店铺内可做理财、股票、测评等多种业务，不仅是名片展示。',
  },
  {
    slug: 'pingan-pocket-2',
    title: '口袋银行家 2.0',
    description: 'B 端 banker 应用改版——围绕「高效、简单、数据可视模块化」三个方向重塑。',
    year: '2019',
    cover: '/images/projects/pingan-pocket-2/cover.jpg',
    coverTone: 'light', // 右上实测亮度 220.0
    type: 'product',
    featured: true,
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [
      // 行员 2.0 新图（2026 换图）：源图统一 708px 宽；maxW 400 限宽居中（与小程序项目共同视觉宽度体系）
      // 首页
      { src: '/images/projects/pingan-pocket-2/home-today.jpg', ratio: 0.3363, label: '首页 · 经营工作台', maxW: 400 },
      { src: '/images/projects/pingan-pocket-2/home-tasks.jpg', ratio: 0.4467, label: '首页 · 重点事项列表', maxW: 400 },
      // 客户
      { src: '/images/projects/pingan-pocket-2/customer-home.jpg', ratio: 0.4, label: '客户 · 客户列表', maxW: 400 },
      { src: '/images/projects/pingan-pocket-2/customer-tools.jpg', ratio: 0.3971, label: '客户 · 经营工具', maxW: 400 },
      { src: '/images/projects/pingan-pocket-2/customer-monthly.jpg', ratio: 0.3363, label: '客户 · 月度清单', maxW: 400 },
      { src: '/images/projects/pingan-pocket-2/customer-kuaiwin.jpg', ratio: 0.3363, label: '客户 · 快赢名单', maxW: 400 },
      { src: '/images/projects/pingan-pocket-2/customer-due.jpg', ratio: 0.3363, label: '客户 · 到期承接与快赢', maxW: 400 },
      // 传送门
      { src: '/images/projects/pingan-pocket-2/portal-plugins.jpg', ratio: 0.3825, label: '传送门 · 插件选择', maxW: 400 },
    ],
    background:
      '口袋银行家是平安银行面向内部行员的 B 端 APP，行员通过它了解行业资讯、掌握客户动向、管理销售团队、查看业绩。\n\n1.0 版本存在诸多问题：颜色混乱、科技感薄弱、数据模块样式与单位不统一、图标风格杂乱、首页层级阅读顺序混乱、多角色共用同一界面等。2019 年 2.0 改版围绕「高效、简单、数据可视模块化」三个方向重塑。',
    process:
      '现场调研——在平安银行蛇口支行实地调研，对象覆盖营销团队 8 人、理财经理 3 人、个贷团队 4 人、支行长 1 人，明确各角色的核心使用场景与差异。\n\n视觉升级——品牌色饱和度提亮、增加科技感视觉传达，搭配业务品牌色（主/辅色）；统一数据可视化视觉表达，圆角情绪凸显科技、金融、沉稳。\n\n设计理念落地——视觉一致性（相似元素以相同方式呈现）、功能一致性（流程逻辑统一）、简单易用（提升效率、增加预测性）。\n\n五大首页改造——首页（信息层级梳理 + 金刚区重排 + 工作计划卡片折叠）；客户（领导与行员双角色内容差异化）；业绩（核心三指标首屏 + 数据图标化）；发现（功能抽屉 + 常用自动首屏）；我的（十三种身份切换按钮）。\n\n缺省页统一——重绘建设中、无权限、无信号三种高频缺省页。\n\n组件库——2.0 视觉更新同时建立项目组件库。',
  },
  {
    slug: 'pingan-portal',
    title: '口袋银行家传送门',
    description: '悬浮窗快捷系统——解决最多十三种身份的 banker 跨角色功能切换痛点。',
    year: '2019',
    type: 'product',
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [{ src: '/images/projects/pingan-portal/01.jpg', ratio: 1.778 }],
    background:
      '口袋银行家的不同角色（行员、营销主管、理财经理、个贷主管、支行长等）拥有完全不同的权限与关注点，行员最高有十三种身份。\n\n每个身份要进入对应的核心功能，原版本需要反复登录切换或在我的页面深层查找。这是行员反馈最强烈的痛点之一——「最常用的功能最难找」。',
    process:
      '角色权限矩阵——把所有角色与可访问功能列成矩阵，明确每个角色的「核心传送门」。\n\n悬浮窗方案——把传送门从我的页面剥离，做成全局悬浮窗，任何页面都能一键触达。\n\n自定义常用入口——行员可把自己最常用的传送门固定到首位，进一步降低操作成本。\n\n角色感知——根据当前切换的角色，自动调整传送门顺序与可见性。\n\n视觉——与 2.0 整体视觉一致，圆角、阴影、状态反馈都纳入组件库。',
  },
  {
    slug: 'pingan-backoffice',
    title: '平安后台管理系统',
    description: 'PC 后台聚合全行网点数据、经营状况、营销数据、人才库、投诉工单的大数据板块。',
    year: '2020',
    type: 'product',
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [
      { src: '/images/projects/pingan-backoffice/01.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/02.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/03.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/04.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/05.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/06.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/07.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/08.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/09.jpg', ratio: 1.778 },
      { src: '/images/projects/pingan-backoffice/10.jpg', ratio: 1.778 },
    ],
    background:
      '平安银行后台管理系统汇集了全行网点数据、经营状况、营销数据、人才库、投诉工单等大数据 PC 板块。\n\n改造前，不同业务方的平台风格差异巨大，用户在多个平台切换时频繁出现视觉跳跃。2020 年启动数字化转型，针对「网点门店、中台数据、人才库」三大模块做视觉升级，并建立既统一又各自独立的视觉规范体系。',
    process:
      '视觉规范分层——建立「基础 UI」统一库（颜色、字体、间距、基础控件）+ 各平台独立组件库，既保证视觉一致性又保留平台特性。\n\n网点营业模块——实时展示全行各网点营业状态、进店客户、业务量达成情况，监控地图的后台数据模块；每天针对不同网点更新对应策略，由总行下发至各支行，重要信息采用卡片分类式布局。\n\n中台数据模块——全行所有渠道投诉类业务数据，包含文本质检、用户情绪得分详情；同步手机端设计，做双端页面；质检技术指标模块采用大色块设计，增强视觉层级并与主题对应。\n\n弹窗与图标统一——所有弹窗、图标类界面统一设计语言；调整整体布局适应自适应布局。',
  },
  {
    slug: 'pingan-talent',
    title: '平安人才库',
    description: 'HR 级人才管理系统——涵盖储备、推荐、空缺提醒、高潜能标记。',
    year: '2020',
    type: 'product',
    companyLocation: '深圳',
    client: '平安银行',
    role: '设计组长 · 高级 UI',
    gallery: [{ src: '/images/projects/pingan-talent/01.jpg', ratio: 1.778 }],
    background:
      '平安人才库是覆盖全行人员信息、储备岗位备选、推荐、空缺提醒、高潜能人才与储备干部标记的人才管理系统。\n\n原系统是从早期的人事 HR 系统演进而来，操作逻辑偏内部流程化，层级信息混乱，与新版数字化平台的视觉语言脱节。2020 年的改版目标是在保持 HR 系统功能完整性的同时，让它更像一个现代化的人才管理产品。',
    process:
      '品牌色承接——与口袋银行家的「口袋蓝」不同，人才系统采用经典「平安橙」，与平安品牌色统一。\n\n操作逻辑优化——从 HR 系统的「流程驱动」转为「人物驱动」，让管理者第一眼看到的是人而不是审批节点。\n\n功能层级重组——核心功能入口图标化，增强点击感与视觉层级；次级功能收纳到次级菜单。\n\n信息可视化——高潜能、储备干部、空缺岗位等关键状态用 chip 与色块表达，扫一眼就能识别。\n\n组件库独立——在统一基础 UI 库之上建立人才系统独立组件库，方便后期延伸。',
  },
  // —— 早期（爱保护 / 诚讯）——
  {
    slug: 'aibao-ui',
    title: '爱保护智能产品 UI',
    description: '智能产品 UI 设计——主风格设计、交互梳理、官网 PC 端与宣传详情页。',
    year: '2016',
    type: 'product',
    companyLocation: '深圳',
    client: '爱保护科技',
    role: 'UI 设计师',
    background:
      '爱保护科技是一家专注智能硬件产品的公司，产品线覆盖家庭安全、儿童保护等场景。\n\n2016 年公司处于快速扩张期，需要 UI 设计师独立承担智能产品 App、公司官网 PC 端、宣传详情页三条线的设计工作。这是我职业生涯第一份独立负责的设计工作，从学生到职业设计师的过渡期。',
    process:
      '智能产品 UI——负责智能硬件配套 App 的 UI 设计，从主页面风格、交互流程到细节动效。\n\n官网 PC 端——负责公司官网 PC 端界面设计，承载产品介绍、解决方案、合作伙伴等模块。\n\n宣传详情页——针对具体产品做营销详情页，配合市场投放。\n\n项目沟通——与开发、产品、市场多方沟通，跟进开发进度保证项目按节点交付。',
  },
  {
    slug: 'chengxun-tax',
    title: '诚讯税务金服',
    description: '税务金服 PC 端——界面设计、风格优化、交互梳理。',
    year: '2014',
    type: 'product',
    companyLocation: '武汉',
    client: '诚讯科技',
    role: 'UI 设计师',
    background:
      '诚讯科技是一家位于武汉的金融科技公司，核心产品是一套面向中小企业与个人的税务金服系统。\n\n2014 年公司启动产品视觉升级，需要 UI 设计师负责 PC 端界面设计、主风格优化与交互梳理。这是我职业生涯的起点——第一份正式的设计工作，也是第一次接触 B 端复杂业务系统的视觉设计。',
    process:
      '视觉风格定义——在原有界面上做风格优化，建立统一的颜色、字体、控件规范。\n\nPC 端界面设计——覆盖税务金服的主要业务流程，从登录、查询、申报到结果反馈。\n\n交互梳理——与产品经理一起重新梳理核心业务流程，把繁琐的多步操作简化。\n\n项目跟进——与开发团队沟通进度，确保设计还原度。',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  // 直跳项目（directUrl）不生成详情页
  return projects.filter((p) => !p.directUrl).map((p) => p.slug);
}

/**
 * 相关作品 —— 优先同 type，再补 featured
 */
export function getRelatedProjects(slug: string, limit = 12): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  return projects
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: (p.type && p.type === current.type ? 2 : 0) + (p.featured ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

/**
 * Timeline 可见项目 —— 首页 ProjectShowcase 与详情页 More work 共用同一套
 * （隐藏的项目详情页与数据保留，仅不进轮播）
 */
export const TIMELINE_HIDDEN_SLUGS = new Set([
  'pingan-shop',
  'pingan-portal',
  'pingan-backoffice',
  'pingan-talent',
  'aibao-ui',
  'chengxun-tax',
]);

export function getVisibleProjects(): Project[] {
  return projects.filter((p) => !TIMELINE_HIDDEN_SLUGS.has(p.slug));
}
