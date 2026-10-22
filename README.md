# 蜂巢引擎 · Personal Harness 全景产品展示（V13 · 规划设计分析图工作台）

**在线预览：<https://liulei97.github.io/fengchao-yinqing/>**
**迭代图谱（历史版本博物馆）：<https://liulei97.github.io/fengchao-yinqing/iteration-map/>**

一个统一的 Personal Harness，面向政策研究、工程咨询、国土空间规划、城市设计与建筑设计：以任务为组织单元，共享资料、证据、专业软件、模型、审查与可编辑成果。本仓库是其**全景产品展示页**——产品概念与可运行前端（示例数据），未接入真实 GIS 计算、三维地形、ArcGIS Pro、App Bridge 与 Task Core。

![V13 展示页](docs/预览图片/showcase_app_collab_1600.png)

![App Bridge 协作](docs/预览图片/app_collaboration_1600.png)

![桌面工作台 v1.0](docs/预览图片/desktop_app_collab_1600.png)

## 页面导航

| 页面 | 说明 |
|---|---|
| [`index.html`](https://liulei97.github.io/fengchao-yinqing/) | **产品展示主页**（基于 V12 页保留全部能力，新增 V13 规划设计分析图专项展区，可在页内直接操作工作台；页面自带标题沿用 V12 口径） |
| [`Planning_Analysis_Studio_V13.html`](https://liulei97.github.io/fengchao-yinqing/Planning_Analysis_Studio_V13.html) | **规划设计分析图工作台**（独立离线 WebUI）：二维/三维图面、GeoJSON/CSV 加载、绘制标注、主题渲染、JSON/SVG/PNG 导出 |
| [`Policy_Research_Workbench_Concept_V11.html`](https://liulei97.github.io/fengchao-yinqing/Policy_Research_Workbench_Concept_V11.html) | V11 政策研究三面板专项工作台 |
| [`App_Collaboration_Workbench_Concept_V12.html`](https://liulei97.github.io/fengchao-yinqing/App_Collaboration_Workbench_Concept_V12.html) | App Bridge 协作原型：三案例、授权→打开→编辑回传→复核→审定、L0–L3、导出 JSON（`simulated: true`） |
| [`HiveEngine_Desktop_Concept_v1.0_PlanningStudio.html`](https://liulei97.github.io/fengchao-yinqing/HiveEngine_Desktop_Concept_v1.0_PlanningStudio.html) | V13 桌面概念工作台——新增「规划设计分析图」侧栏，沿用 App Host / App Bridge / Policy / Geo / APLE/ANTR / Visual 工作区 |
| [`HiveEngine_Desktop_Concept_v0.8_AppHost.html`](https://liulei97.github.io/fengchao-yinqing/HiveEngine_Desktop_Concept_v0.8_AppHost.html) | 桌面原型 v0.8 AppHost（V13 完整包仍随附，且 Policy V11 页内入口指向它，故保留于根目录） |
| [`iteration-map/`](https://liulei97.github.io/fengchao-yinqing/iteration-map/) | **产品能力与原型设计迭代图谱 V13**：35+ 份真实历史 HTML 原样归档（展示页 v4→v13、桌面概念 v0.4「营造师」→v1.0、各专项工作台），同屏对照任意两版，附逐文件 SHA-256 出处清单 |

部分浏览器限制 `file://` 的 iframe 嵌入，本地体验可在仓库目录起 `python -m http.server 8765 --bind 127.0.0.1` 后访问。

## 当前版本主题：规划设计分析图工作台

- **分析图工作台**（独立可运行前端）：二维/三维图面切换、GeoJSON/CSV 数据加载（`example_data/` 内附合成示例：规划地块、公共设施点位）、绘制标注、主题化渲染，成果可导出 JSON/SVG/PNG。
- **能力保留**：V12 App Host / App Bridge 协作、V11 政策研究三面板、Geo/Pro Bridge、APLE/ANTR、Visual Prompt Builder 等展区与工作台全部保留。
- **边界（如实声明）**：本版未接入真实 GIS 计算、三维地形、ArcGIS Pro、App Bridge 与 Task Core；历史原型页均保留原貌（早期桌面 v0.1「营造师」旧名称未改）。

## 关于 `apps/` 本地运行包（未收入本仓）

完整包内两个独立 WebUI（03_WebUI 建筑AI工作台 · 127.0.0.1:8788、Mermaid Flow Studio · 127.0.0.1:7860）为**本地运行形态**：含用户私有 `prompts.json`、图片与备份数据，Python 服务无法在 GitHub Pages 运行，故不入本仓。本机体验需完整包 + Python 3 运行 `START_HIVE_ENGINE.bat`（宿主 8760）。`app_registry.example.json`（应用登记示例，严格限定 localhost/127.0.0.1/[::1]）收在 `docs/`。

## 仓库结构

| 文件 | 说明 |
|---|---|
| `index.html` | 产品展示主页（V13 内容；发布用根入口） |
| `Planning_Analysis_Studio_V13.html` | 规划设计分析图工作台（独立离线 WebUI） |
| `HiveEngine_Desktop_Concept_v1.0_PlanningStudio.html` | V13 桌面概念工作台 |
| `HiveEngine_Desktop_Concept_v0.8_AppHost.html` | 桌面原型 v0.8（V13 包随附；Policy V11 页内链接指向） |
| `example_data/` | 分析图工作台合成示例数据（规划地块 GeoJSON、公共设施点位 CSV） |
| `iteration-map/` | 产品能力与原型迭代图谱 V13（archive/ 历史页 + independent_apps/ + 出处清单 + 架构契约） |
| `docs/README_从这里开始_V13.md` | V13 官方说明 |
| `docs/V13_规划设计分析图工作台_技术架构与接口契约.md` | V13 目标接口、安全与专业精度边界 |
| `docs/PolicyResearch_Workbench_TechnicalDesign/` | 政策研究工作台技术设计包（模型 / TS 契约 / 建库脚本 / 示例） |
| `docs/README_从这里开始_V12.md`、`docs/README_V11_升级说明.md`、`docs/V12_AppHost_AppBridge_分层设计与实施契约.md`、`docs/README_外部WebUI应用中心.md`、`docs/README_第八版产品展示与技术说明.md`、`docs/57_富组件机制迁移_依据文档.md` | 各版本官方说明与契约存档 |
| `docs/app_registry.example.json` | 外部应用登记示例 |
| `docs/assets/` | 各功能模块可编辑源码（rich-components / subagent-multimodel / geo-delivery / research-architecture） |
| `docs/samples/` | 页面导出功能生成的演示 JSON 与离线 HTML 样例 |
| `docs/预览图片/` | App Bridge / 桌面工作台演示截图 |

## 版本沿革

V13（规划设计分析图工作台）← V12（AppHost/AppBridge 协作）← V11（政策研究工作台）← V10（外部应用工作区）← V9（视觉提示词工作台）← 第八版·执行路由增强 ← 第八版（富组件成果引擎）← 第七版（Subagent 多模型编排）← 第六版 ← 第五版 ← 第四版（咨询规划建筑专业深化）← 第三版（首发入库）；全部历史版本可在 `iteration-map/` 中查阅原始页面。
