# Config 数据说明

姓名 / 导航 / 履历等站点级数据集中在此目录，**修改 JSON 即可更新全站，无需改动任何 .tsx**。

## 文件清单

| 文件 | 内容 |
|---|---|
| `site.json` | 站点级信息：姓名、邮箱、社交、主题等 |
| `nav.json` | 顶部导航项 |
| `resume.json` | 履历：经历 / 教育 / 技能 / 奖项 |

> 项目数据已迁移到 CMS 风格的文件系统加载，详见
> [`public/projects/README.md`](../../public/projects/README.md)。

> JSON 不支持注释。每个字段的含义见下方说明。

---

## site.json

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 中文姓名（用于 logo / footer） |
| `nameEn` | string | 英文名（SEO / og） |
| `role` | string | 职位标题 |
| `tagline` | string | 母题标语，如 "Make to Think." |
| `intro` | string | Hero 简短介绍（一句话定位 + 引导滚动） |
| `location` | string | 所在地 |
| `email` | string | 联系邮箱 |
| `calendarUrl` | string | 预约链接（Calendly / Cal.com），可空 |
| `availableForWork` | boolean | footer 状态点：是否接活 |
| `social.twitter` / `linkedin` / `dribbble` | string | 留空则不显示 |
| `theme.default` | `"dark"` / `"light"` | 默认主题 |
| `theme.toggleable` | boolean | 是否允许访客切换主题 |

---

## resume.json

| 字段 | 说明 |
|---|---|
| `summary` | About 页长读正文 |
| `philosophy` | `{ manifesto, principles: [{title, body}], coda }` 设计理念 |
| `stats` | About 页数据化展示：`[{ value, suffix?, prefix?, label }]` |
| `experience` | 工作经历数组：`{ period, role, company, summary }` |
| `education` | 教育数组：`{ period, degree, school }` |
| `skills` | 技能分组对象（key = 分类，value = 字符串数组） |
| `languages` | 语言数组 |
| `awards` | 奖项数组：`{ name, year }` |
| `pdfUrl` | 简历 PDF 下载路径 |

PDF 放在 `public/resume.pdf`。

---

## 类型定义

字段对应的 TypeScript 类型在 `lib/types.ts`，修改 JSON 字段时同步更新。
