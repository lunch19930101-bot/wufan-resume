/**
 * default-template —— /resume 编辑器的默认 MDX 模板
 *
 * 1:1 对齐 resume.atom63.io 上游默认模板的结构与排版：
 *   - Header: HeaderLeft（姓名 + 作品集 / 领英）/ HeaderRight（职位 + 简介 + 邮箱 / 电话）
 *   - Columns: Sidebar（简介 · 技能 · 教育 · 认证 · 语言 · 兴趣）
 *              Main（工作经历 · 精选项目 · 奖项与荣誉 · 其他工作）
 *   - Footer: _2026 © 姓名_
 *
 * 内容为通用占位符式（与上游一致），用户在 textarea 编辑这个字符串，
 * 右侧 MDXRemote 实时编译预览。
 *
 * 姓名与联系方式使用站点真实配置（lib/config/site.json）。
 */

import { site } from '@/lib/config';

export const DEFAULT_TEMPLATE = `<ResumeDocument>
  <Header>
    <HeaderLeft>
      # ${site.name}
      <Links>
      _作品集:_ [wufan.example](https://wufan.example)
      _领英:_ [linkedin.com/in/fan-wu](https://linkedin.com/in/fan-wu)
      </Links>
    </HeaderLeft>
    <HeaderRight>
      **AI 设计工程师**
      _我端到端地设计与构建产品界面与系统。_
      <Links>
      _邮箱:_ [${site.email}](mailto:${site.email})
      _电话:_ [+86 ${site.phone}](tel:+86${site.phone})
      </Links>
    </HeaderRight>
  </Header>

  <Columns>
    <Sidebar>
      ### 简介
      一段简短的自我定位：你是谁、你构建什么、你解决哪一类问题。两到三句话足够——把亮点放在最前面，让下面的经历来证明。

      ### 技能
      - **工程:** React、TypeScript、Node.js、测试、CI/CD
      - **设计:** 设计系统、语义化 Token、原型、动效
      - **工具:** PS · Sketch · C4D · MJ · 豆包 · 即梦 · Claude Code
      - **协作:** 跨职能交付、辅导新人、技术写作

      ### 教育
      <Group>
      #### 示例大学
      _城市 · 2014 – 2018_
      **本科** 计算机科学
      </Group>

      <Group>
      #### 另一个项目
      _城市 · 2013_
      **证书** 相关课程或方向
      </Group>

      ### 认证
      - 相关认证、颁发机构、年份
      - 另一项值得列出的 credential

      ### 语言
      - **中文** — 母语
      - **英文** — 工作专业水平

      ### 兴趣
      两三个让你像活人的词——跑步、陶艺、开源。
    </Sidebar>

    <Main>
      ### 工作经历
      <Group>
      #### 资深产品工程师 @ [示例公司](https://example.com)
      _城市（远程）· 2022 — 至今_
      - 在这里主导一项可量化的成果——用强动词开头，并量化影响（规模、百分比、节省的时间）
      - 上线一项重要的功能或系统，点出所用的技术与最终结果
      - 端到端推动一项倡议，从问题定义到上线与后续迭代
      - 跨产品、设计与工程协作，整体抬升质量基线
      </Group>

      <Group>
      #### 产品工程师 @ [另一家](https://example.com)
      _城市 · 2019 – 2022_
      - 一项有具体成果的贡献，以及你所扮演的角色
      - 第二条 bullet 展示广度——一种不同类型的贡献
      - 第三条 bullet 点出所用的技术栈与其产出的结果
      </Group>

      <Group>
      #### 软件工程师 @ [起步公司](https://example.com)
      _城市 · 2018 – 2019_
      - 你起步的地方：基础性的工作与你学到了什么
      - 一项已经显露出你未来轨迹的贡献
      </Group>

      ### 精选项目
      <Group>
      #### 项目名称
      - **是什么:** 一句话描述这个项目以及你的角色
      - **你做了什么:** 你所主导的关键技术或设计决策
      - **成果:** 结果、链接或荣誉
      </Group>

      <Group>
      #### 第二个项目
      - **是什么:** 一句话描述这个项目以及你的角色
      - **你做了什么:** 思路、技术栈、你解决的难点
      - **成果:** 已上线、被采用或被认可——如果有数字更好
      </Group>

      ### 奖项与荣誉
      <Group>
      #### 奖项或荣誉
      _颁发方 · 年份_
      - 一句话说明它认可了什么、为什么重要
      </Group>

      ### 其他工作
      - [**业余项目**](https://example.com) — 一段简短的描述，说明它是什么
      - [**开源贡献**](https://example.com) — 一个值得提及的贡献
      - [**写作**](https://example.com) — 一次值得点击的演讲、文章或帖子
    </Main>
  </Columns>

  <Footer>_2026 © ${site.name}_</Footer>
</ResumeDocument>
`;
