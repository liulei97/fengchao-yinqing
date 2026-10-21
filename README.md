# 蜂巢引擎 · Personal Harness 全景产品展示（第八版 · 执行路由增强）

**在线预览：<https://liulei97.github.io/fengchao-yinqing/>**

一个统一的 Personal Harness，面向政策研究、工程咨询、国土空间规划、城市设计与建筑设计：以任务为组织单元，共享资料、证据、专业软件、模型、审查与可编辑成果。本仓库是其**全景产品展示页**——产品完成态的离线交互原型（示例数据），不代表模型连接、主系统迁移或真实任务执行已完成。

![富组件成果引擎](docs/预览图片/desktop_rich_components.png)

![架构总览](docs/预览图片/desktop_v8_architecture_top.png)

![活报告](docs/预览图片/desktop_v8_live_report.png)

## 双页结构：V8 展示页 + 桌面工作台概念原型

本版为**离线跳转整合包**形态，仓库内两页配套发布，均为自包含单文件：

- `index.html` —— **V8 执行路由增强版**展示主页。顶部「桌面原型 ↗」、首页「体验桌面原型」及「一体化工作台」展区的入口卡片，经同目录相对路径跳转到桌面原型页。
- `HiveEngine_Desktop_Concept_v0.4.html` —— **桌面工作台概念原型 v0.4**（原样收录、未重构），可体验 AI 对话、WebGIS 2D/3D、Geo、Visual、Delivery 等交互；浏览器返回键回到 V8。

![桌面工作台入口](docs/预览图片/v8_desktop_workspace_entry_preview.png)

## 当前版本：第八版 · 富组件 + 执行策略路由器

在第七版 Subagent / Model Router 全部展区之上：

- **Execution Router / 执行策略路由器**（本次新增 `#exec-router` 展区）：入口收到自然语言后如何选择执行方式——按任务特征路由到 **Direct / Agent Loop / LangGraph / Hybrid** 四种执行模式，附四种触发条件对照、四个模拟任务演示与执行提案展示。核心边界：Router 只做策略建议，不拥有任务控制权、证据发布权或成果接受权，计划接受、attempt、预算、取消与恢复仍由 Task Core 统一掌管。
- **ChatGPT 式富组件机制分层迁移与 RichDocument** 展区：迁移机制七节点图、L0–L5 表达层、native/frames/static 三渲染策略、宏观经济/政策研究/GIS 三场景活报告、块结构 JSON 实时示例、A–E 迁移分类、本地导出（结构化 JSON + 冻结离线 HTML，样例见 `docs/samples/`）、六领域耦合与 P1–P6 顺序。

关键架构口径：RichDocument 是业务内容的版本化文档权威；任一块失败按 native → frames → static → table/text → 不可用提示分级退化；Execution Router 与富组件引擎都只做建议与渲染，不改动政策效力、GeoResult 或设计原生资产。

## 仓库结构

| 文件 | 说明 |
|---|---|
| `index.html` | V8 执行路由增强版展示主页（原文件名：`蜂巢引擎_PersonalHarness_V8_执行路由增强版.html`，改名以便 GitHub Pages 直达） |
| `HiveEngine_Desktop_Concept_v0.4.html` | 桌面工作台概念原型 v0.4，与 index.html 同目录相对路径跳转（Pages 下直接可用） |
| `docs/README_第八版产品展示与技术说明.md` | 第八版官方说明：富组件增强内容、三件事区分、架构决策、测试范围 |
| `docs/README_离线跳转说明.md` | 整合包官方说明：双页使用方式、入口位置与边界声明 |
| `docs/57_富组件机制迁移_依据文档.md` | 富组件迁移的原始技术底稿 |
| `docs/assets/` | 各功能模块可编辑源码（`rich-components.*` 为第八版；`subagent-multimodel.*` 为第七版；`geo-delivery.*`、`research-architecture.*` 为更早版本参考） |
| `docs/samples/` | 通过页面导出功能生成的演示 JSON 与离线 HTML 样例 |
| `docs/预览图片/` | 桌面 / 平板 / 移动端演示截图与桌面原型入口截图 |

构建用 `base_v7.htm` 基线、中间产物页与 `build_revision.py` / `test_*.py` / `capture_previews.py` / `add_desktop_entry.py` 属原制作管线，未收入本展示仓。

## 页面特点

- **自包含 + 相对跳转**：两页各自样式脚本内联、图片 data URI、零外部网络请求；两页之间仅靠同目录文件名相对跳转，本地解压与 GitHub Pages 均可直接使用。
- **纯静态零依赖**：无需构建，`file://` 双击 `index.html` 亦可（跳转入口需桌面临时页在同目录）。
- **版本沿革**：第八版·执行路由增强（V8 + 桌面概念 v0.4 整合）← 第八版（富组件成果引擎）← 第七版（Subagent 多模型编排）← 第六版 ← 第五版 ← 第四版（咨询规划建筑专业深化）← 第三版（全景产品展示首发入库）。
