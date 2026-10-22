# 蜂巢引擎 · V11 展示页与概念原型升级包

> 2026-10-22 · 基于用户提供的「蜂巢引擎 V10 · 外部应用工作区」进行增量升级。
>
> **这是可离线交互的产品概念原型，不是已接通 Task Core、模型 API、真实政策知识库或服务器的正式业务系统。**

## 1. 交付内容

| 文件 | 说明 |
|---|---|
| `index.html` | 保留 V10 全部专业板块，在咨询研究之前新增「Policy Research 工作台」完整产品展示板块，以及顶部导航入口。 |
| `HiveEngine_Desktop_Concept_v0.8_AppHost.html` | 保留 V10 桌面原型及原有外部 WebUI 管理机制，新增 `Policy 深度研究台` 侧边入口、嵌入式交互工作台，并在原「政策与咨询」页加入跳转。继续沿用原文件名，避免破坏 V10 内的链接。 |
| `Policy_Research_Workbench_Concept_V11.html` | 独立、单文件、无需依赖 CDN 的 Policy Research 三面板交互概念原型。 |
| `preview_policy_workbench_v11.png` | 独立原型视觉预览，方便查看设计效果。 |
| `README_V11_升级说明.md` | 本说明。 |

## 2. 如何使用 / 与原 V10 工作区合并

1. 解压原 `蜂巢引擎 V10 · 外部应用工作区.zip`，找到内层 `hive_v10_app_host/` 目录。
2. 解压本 V11 增量升级包，将其中三个 HTML 文件**复制到原 `hive_v10_app_host/` 目录的根目录**，覆盖其中两个原 HTML（建议先备份），新增独立工作台 HTML。
3. 双击 `hive_v10_app_host/index.html` 打开升级后的产品展示页，在顶部导航选择「政策研究工作台」。
4. 双击 `hive_v10_app_host/HiveEngine_Desktop_Concept_v0.8_AppHost.html`，点击侧栏「Policy 深度研究台」。
5. 若只需查看独立概念原型，可直接双击 `Policy_Research_Workbench_Concept_V11.html`，无需服务器。
6. 原有 Mermaid Flow Studio、建筑 AI 工作台、外部 WebUI 目录、注册与启动脚本**均不修改**，仍按原 V10 README 的方式启动服务。

**为何使用增量包而非重新打包整个工作区：** V10 压缩包含大量原始静态 vendor 和图片资源。这次没有改动它们；只替换两份 HTML 并新增一份原型，能够最大限度降低对现有外部应用的影响。

## 3. 新版产品展示的设计变化

- 与 V10 现有深蓝 / 墨绿 / 暖金品牌系统一致，增加浅底政策研究专用板块。
- 通过「证据账本—研究轨迹—任务状态」三张能力卡，说明系统的研究方法与质量边界。
- 提供嵌入式可操作工作台、全屏原型链接、桌面原型入口。
- 加入统一架构图与跨专业成果链：`Policy → Project → Geo → Visual → Delivery`。
- 保持原来的城市设计、规划编制、建筑、AI 画布、Model Router、Geo Bridge、APLE/ANTR 和独立 WebUI 等板块不变。

## 4. 独立概念原型的交互清单

**证据面板**：来源、论点、证据缺口三标签；关键词过滤；选中资料后在检查区呈现结构化对象；显示研究覆盖维度。

**研究轨迹面板**：阶段步骤；全部事件、证据操作、研究决策、运行事件过滤；选择轨迹事件联动证据；研究决策与技术执行分离。

**任务状态面板**：Task / Attempt / Checkpoint / Skill / 模型策略；暂停—恢复状态模拟；质量门禁事件生成；提交人工复核；导出合成 Snapshot JSON。

**三种情境**：土地集中统一供应与土地储备、项目选址综合论证、存量空间盘活政策研究。全部采用无实体敏感信息的**合成样本记录**，不是政策事实或法律意见。

## 5. 从演示走向真实系统的接口替换点

| 当前前端原型 | 正式后端应连接 | 权威归属 |
|---|---|---|
| `scenarios` 静态数组 | `GET /tasks/{task_id}/workbench/snapshot` | Workbench BFF / Read Model |
| 证据和论点卡片 | `source_versions`, `evidence_items`, `claim_revisions`, `claim_evidence_links` | Evidence Builder |
| 静态业务事件 | `GET /tasks/{task_id}/events?after_seq=` + SSE | Task Event Store |
| 暂停、恢复、复核模拟 | `POST /tasks/{task_id}/actions` （带权限/幂等/expected revision） | Task Core |
| 研究节点展示 | LangGraph Runner stage events + `checkpoint_ref` | Runner + Task Core |
| 本地 JSON 导出 | 正式 Snapshot + 证据链/成果版本导出 | Task Core / Artifact Registry |

推荐继续使用此前交付的《Policy Research Workbench 技术设计 V1》中的 TS/Pydantic/SQL 契约，本文 HTML 属于**展示层原型**，不能直接等同于 API 的生产实现。

## 6. 边界与注意事项

- 不能把模型的私有思维链冒充可展示的“研究轨迹”。只有可审计的工具回执、明确产出的研究决定和事实性事件可记录。
- UI 中显示的「暂停」「恢复」「人工复核」均为浏览器模拟状态，正式系统必须经过 Task Core 授权才可生效。
- 政策效力、适用时点、法律结论必须连接权威来源、版本与审查流程，不能依据这些演示样本直接作出实务判断。
- 如果单独拷贝 `index.html` 或桌面 HTML 而**未同时放入独立工作台 HTML**，嵌入式概念演示将无法加载。
- 项目展示页原本是自包含的静态资源页面；V11 新增的政策研究嵌入页面需要同目录的 HTML 文件。其他原有外部 WebUI 仍可按 V10 的启动方式运行。

## 7. 验证

- Playwright / Chromium 使用 HTML 内容加载方式完成 JS 语法与 DOM 交互测试（浏览器自动化运行环境阻止直接导航到本地文件和 localhost，因此没用端到端 URL 加载来验证）。
- 验证通过：切换 Claim 标签、论点详情、模拟暂停—恢复、Attempt 递增、场景切换；V10 原展示页及桌面原型均未产生 JS `pageerror`，新增桌面侧栏入口能激活对应内容区。
- **尚需在你的 Windows 本地环境执行一次直接双击/iframe 同目录加载验证**，并复测原外部 WebUI 服务启动功能。
