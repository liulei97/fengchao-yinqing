# 蜂巢引擎 · Personal Harness 全景产品展示（V12 · App Host / App Bridge 协作）

**在线预览：<https://liulei97.github.io/fengchao-yinqing/>**
**迭代图谱（历史版本博物馆）：<https://liulei97.github.io/fengchao-yinqing/iteration-map/>**

一个统一的 Personal Harness，面向政策研究、工程咨询、国土空间规划、城市设计与建筑设计：以任务为组织单元，共享资料、证据、专业软件、模型、审查与可编辑成果。本仓库是其**全景产品展示页**——产品完成态的离线交互原型（示例数据），不代表模型连接、主系统迁移或真实任务执行已完成。

![V12 展示页](docs/预览图片/showcase_app_collab_1600.png)

![App Bridge 协作](docs/预览图片/app_collaboration_1600.png)

![桌面工作台 v0.9](docs/预览图片/desktop_app_collab_1600.png)

## 页面导航（V12 起为多页结构）

| 页面 | 说明 |
|---|---|
| [`index.html`](https://liulei97.github.io/fengchao-yinqing/) | **V12 产品展示主页**——顶部新增「App Bridge 协作」：三层关系与嵌入式交互原型；V11 政策研究、V10 应用中心、Geo/Pro Bridge、APLE/ANTR、Visual Prompt Builder 等展区保留 |
| [`Policy_Research_Workbench_Concept_V11.html`](https://liulei97.github.io/fengchao-yinqing/Policy_Research_Workbench_Concept_V11.html) | V11 政策研究三面板专项工作台 |
| [`App_Collaboration_Workbench_Concept_V12.html`](https://liulei97.github.io/fengchao-yinqing/App_Collaboration_Workbench_Concept_V12.html) | 独立 App Bridge 协作原型：三案例切换，授权→打开→编辑回传→复核→审定，L0–L3 可切换，可导出 JSON（`simulated: true`） |
| [`HiveEngine_Desktop_Concept_v0.9_AppCollab.html`](https://liulei97.github.io/fengchao-yinqing/HiveEngine_Desktop_Concept_v0.9_AppCollab.html) | V12 桌面概念工作台——左侧「App Bridge · 应用协作」入口 |
| [`iteration-map/`](https://liulei97.github.io/fengchao-yinqing/iteration-map/) | **产品能力与原型设计迭代图谱**：33 份真实历史 HTML 原样归档（产品展示 v4→v12 全系列、桌面概念 v0.4「营造师」→v0.9、V11/V12 独立工作台），同屏对照任意两版，附逐文件 SHA-256 出处清单 |

## 当前版本主题：App Host / App Bridge 跨应用协作

- **App Bridge 协作概念**：三场景、三层架构展示、接口面板、事件与成果模拟；App Host 应用目录/打开/标签页沿用 V11。
- **重要边界（如实声明）**：本版未真正联通 App Bridge、Task Core、OpenCode、真实模型与 GIS 后端——操作步骤、回执与人工审定均为前端模拟，生成的 JSON 标记 `simulated: true`，不构成真实专业工作证明。
- **离线可用性**：App Bridge 演示以 `srcdoc` 内嵌，不依赖本地服务；外部应用的真实功能仍需本地运行（见下）。

## 关于 `apps/` 本地运行包（未收入本仓）

完整包内两个独立 WebUI（03_WebUI 建筑AI工作台 · 127.0.0.1:8788、Mermaid Flow Studio · 127.0.0.1:7860）为**本地运行形态**：含用户私有 `prompts.json`、图片与备份数据，Python 服务无法在 GitHub Pages 运行，故不入本仓。本机体验需完整包 + Python 3 运行 `START_HIVE_ENGINE.bat`（宿主 8760）。`app_registry.example.json`（应用登记示例，严格限定 localhost/127.0.0.1/[::1]）收在 `docs/`。

## 仓库结构

| 文件 | 说明 |
|---|---|
| `index.html` | V12 产品展示主页（发布用根入口） |
| `Policy_Research_Workbench_Concept_V11.html` | V11 政策研究工作台 |
| `App_Collaboration_Workbench_Concept_V12.html` | V12 App Bridge 协作原型（独立交互演示） |
| `HiveEngine_Desktop_Concept_v0.9_AppCollab.html` | V12 桌面概念工作台（取代 v0.8） |
| `iteration-map/` | 产品能力与原型迭代图谱（archive/ 33 份历史页 + independent_apps/ + 出处清单） |
| `docs/README_从这里开始_V12.md` | V12 官方说明：打开顺序、新增/保留、边界 |
| `docs/README_V11_升级说明.md` | V11 升级说明存档 |
| `docs/V12_AppHost_AppBridge_分层设计与实施契约.md` | AppHost/AppBridge 分层设计与实施契约（完整技术说明） |
| `docs/README_第八版产品展示与技术说明.md`、`docs/57_富组件机制迁移_依据文档.md` | 第八版（富组件）说明存档与迁移底稿 |
| `docs/README_外部WebUI应用中心.md`、`docs/app_registry.example.json` | V10 应用中心说明与应用登记示例 |
| `docs/assets/` | 各功能模块可编辑源码（rich-components / subagent-multimodel / geo-delivery / research-architecture） |
| `docs/samples/` | 页面导出功能生成的演示 JSON 与离线 HTML 样例 |
| `docs/预览图片/` | V12 App Bridge 桌面 / 移动端演示截图 |

## 页面特点

- **多页自包含**：各页样式内联、图片 data URI、零外部请求（主页 CSP 含 `script-src 'none'` 为纯静态口径；图谱页除外）；同目录文件名相对跳转，Pages 与本地解压均可用。
- **迭代图谱同屏对照**：`iteration-map/` 内 iframe 直接加载真实历史 HTML（非截图），可选任意两版并排比对；早期桌面 v0.1 沿用「营造师」旧名称，系历史原貌未改动。
- **版本沿革**：V12（AppHost/AppBridge 协作）← V11（政策研究工作台）← V10（外部应用工作区）← V9（视觉提示词工作台）← 第八版·执行路由增强 ← 第八版（富组件成果引擎）← 第七版（Subagent 多模型编排）← 第六版 ← 第五版 ← 第四版（咨询规划建筑专业深化）← 第三版（首发入库）。
