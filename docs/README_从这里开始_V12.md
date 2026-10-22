# 蜂巢引擎 V12｜App Host / App Bridge 跨应用协作增强版

本次基于用户上传的 **《蜂巢引擎 V11 · 完整项目包.zip》** 增量修改，不改动 V11 包内两套独立 WebUI 的程序与数据。

## 推荐打开顺序

1. **V12 产品展示**：双击 `index.html`，在顶部选择「App Bridge 协作」，可以看到三层关系和嵌入式交互原型。
2. **V12 桌面概念原型**：双击 `HiveEngine_Desktop_Concept_v0.9_AppCollab.html`，左侧选择「App Bridge · 应用协作」。
3. **独立 App Bridge 原型**：双击 `App_Collaboration_Workbench_Concept_V12.html`。在三个案例之间切换，依次点击授权、打开、编辑回传、复核、审定；可以切换 L0–L3，也可以导出 JSON。
4. **真实的两个独立 WebUI**：在 Windows + Python 3 环境中运行 `START_HIVE_ENGINE.bat`，启动本地宿主及外部应用，工作台原来的「独立 WebUI · 应用中心」可打开其实际页面。默认监听在 `127.0.0.1:8760` / `:8788` / `:7860`。

## 版本新增 / 保留

| 能力 | 本次处理 |
|---|---|
| App Host 应用目录、打开和标签页 | 保留 V11 原型，未替换 |
| App Bridge 协作概念 | 新增三场景、三层架构展示、接口面板、事件与成果模拟 |
| Policy Research 三面板 | 保留 V11 专项工作台 |
| Geo / Pro Bridge、APLE/ANTR、Visual Prompt Builder | 保留原功能与对应产品专题 |
| 建筑 AI 工作台、Mermaid Studio | 保留原应用服务端、WebUI、vendor、图片与 JSON 数据 |
| 离线可使用性 | App Bridge 演示嵌入 `srcdoc`；不依赖启动服务；子应用真实功能仍需本地服务 |
| 顶部产品展示导航 | 防止桌面长导航横向溢出，窄屏折叠菜单 |

## 重要边界

**本包没有真正联通 App Bridge、Task Core、OpenCode、真实模型、GIS 后端。** App Bridge 操作步骤、回执和人工审定都是前端模拟。生成的 JSON 标记 `simulated: true`，不可作为真实专业工作证明。

`apps/` 下面的程序代码未进行完整安全审计。请勿将本地服务直接开放至公网；操作真实数据前先备份。

## 主要文件

- `index.html` — V12 产品展示；原 V11 功能保留。
- `HiveEngine_Desktop_Concept_v0.9_AppCollab.html` — V12 桌面工作台。
- `App_Collaboration_Workbench_Concept_V12.html` — 独立交互演示，可编辑源码。
- `Policy_Research_Workbench_Concept_V11.html` — V11 政策研究三面板。
- `V12_AppHost_AppBridge_分层设计与实施契约.md` — 完整技术说明。
- `app_registry.example.json` — V11 原应用目录，仅 L0 已有演示能力。
- `previews_v12/` — 本次截图。
- `MANIFEST_V12.json` — 本次整合文件结构及哈希清单。
- `apps/` — 原用户独立 WebUI 与业务资产，未改动。

## 开发迁移

优先做 Policy → Mermaid 的 **真实 L2 纵切片**，再接 Visual 与 Geo/WebGIS，最后统一 L3 任务治理。桌面宿主的 WebView2/WPF 路线可以独立 PoC，但不应反过来决定业务任务契约。
