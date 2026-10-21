# 蜂巢引擎 Personal Harness｜第八版

**主题：ChatGPT 式富组件机制的分层迁移与 RichDocument 产品展示**  
**创建日期：2026-10-21**  
**基线：第七版 Subagent 多模型编排网页**  
**方法依据：用户提供《57_ChatGPT富组件机制迁移PersonalHarness_机制解构与落地方案_2026-10-21.md》；同时遵守完成态全景架构基线中的 Task Core、RichDocument、六领域及 Delivery 权威划分。**

## 1. 如何打开

解压后使用 Chrome / Edge 打开：

`蜂巢引擎_PersonalHarness_第八版_富组件机制与多模型专业协同_完整产品展示.htm`

文件中已内嵌所需 CSS、JS、SVG 和现有产品内容；不需要安装依赖或运行本地服务。本页有禁止出站网络连接的 CSP。若要修改源码，可编辑 `assets/rich-components.html/.css/.js`，然后执行 `python build_revision.py` 重新构建。

## 2. 增强内容

| 展区 | 具体能力 | 展示方式 |
|---|---|---|
| 迁移整体机制 | 来源→递归分类→RichDocument→规范块→Registry→Renderer→验证 / 交付 | 7 节点可点击 SVG 结构图与节点检视器 |
| L0-L5 表达层 | Markdown、DIL Layout、Chart/SVG、Typed Widget、Stateful JSX、Snapshot | 六层横向结构图 |
| 三种渲染策略 | native / frames / static | 交互按钮动态切换、显示不同可操作状态 |
| 三个业务场景 | 宏观经济、政策研究、GIS/城市设计 | 可混排的完整研究报告内容块 |
| 内容块结构 | id、kind、type、state、fallback、render_profile | 可实时观看的结构化块示例 JSON |
| 迁移分类 | A 类型化、B 声明式布局、C 状态型、D 快照型、E 生图提示词 | 点击类别查看策略和降级方式 |
| 本地导出 | 结构化 JSON，当前报告的冻结离线 HTML | 浏览器真实下载行为；内嵌样式、图表、表格 |
| 六领域耦合 | Knowledge/Policy/Project/Geo/Design/Visual → RichDocument → Delivery | 跨域数据流卡片 |
| 迁移顺序 | P1–P6 | 方案依赖展示，不将其当作已完成进度 |

## 3. 必须区分的三件事

1. **本页富组件 demo 是真实的前端交互。** 例如经济学曲线能在本浏览器更新，Geo 示意图能高亮图层，Policy 示例能切换维度；可导出本页生成的 JSON 和静态 HTML。
2. **本页不等于已经完成 Personal Harness 主系统迁移。** 还没有把此原型接入正式 Task Core、RichDocument 持久存储、Registry 发布系统或专业 Model Runtime；没有部署真正的 ChatGPT 源页面分类器。
3. **本页没有调用外部模型、专业软件或搜索 Provider。** 示例中所有政策条件、地图和经济学数据均用于展示，不提供法律结论、GIS 量测或生产数据。

## 4. 关于 `frames` 的真实性说明

该演示通过前端预设值**模拟**有限状态的切换，方便解释录帧模式的阅读体验。它尚未执行自动浏览器录帧、资源打包、覆盖率测试；正式迁移时按 57 号方案保存真实快照与状态域。

## 5. 关键架构决策

- RichDocument 是业务内容的版本化文档权威，`blocks.json` 是其规范化交换投影，不能出现两个相互竞争的编辑真相。
- 图、表、文、证据、组件由 Schema + Registry 约束。模板来自获准注册表，不执行导入文档的任意 JS/JSX。
- 任一块失败时分级退化：native → frames（存在时）→ static → table/text → 不可用提示。
- 任务授权、预算、产物接受属于 Task Core；六领域保持自己的专业真值与权威；富组件引擎不改写政策效力、GeoResult 或 Design 原生资产。
- 主页面仍保留第七版 Subagent / Model Router，以及 Geo 双路径、Visual ComfyUI + 闭源生图、Delivery 成果制作等展区。

## 6. 文件结构

- `蜂巢引擎_PersonalHarness_第八版_富组件机制与多模型专业协同_完整产品展示.htm`：最终离线单文件网页。
- `assets/rich-components.html`：第八版新增模块结构。
- `assets/rich-components.css`：独立样式。
- `assets/rich-components.js`：交互演示（含组件切换、曲线计算、地图图层、JSON/HTML 导出）。
- `base_v7.htm`：完整第七版基线。
- `assets/*`：第七版的既有模块源码参考。
- `build_revision.py`：从第七版构建第八版。
- `test_revision.py`：Playwright 桌面、平板与移动端交互测试。
- `previews/`：页面截图。
- `samples/`：通过网页导出生成的演示 JSON、离线 HTML。
- `57_富组件机制迁移_依据文档.md`：本次迁移原始技术底稿。

## 7. 已执行测试及不在范围内的测试

已检查：Chromium 1440×900、1024×768、390×844；分类器图七节点、三场景、三渲染模式、经济学数值联动、导出 JSON/HTML、政策矩阵、GIS 图层、v7 多 Agent / Geo / Delivery / Visual 回归；页面级无 JavaScript 错误及整体横向溢出。所有示例可断网运行。

未执行：真实 ChatGPT 页面逆向解析或结构提取；真正 DIL JSX 到 PH AST 的通用解析；组件库安全审计；后台持久化与重开回读；真实 PDF/Word 导出；主系统任务治理整合；模型与专业工具服务的生产验收。

**建议将第八版作为产品完成态演示，而将正式迁移开发继续依赖 57 号设计及原有 P9/P10 实施次序。**
