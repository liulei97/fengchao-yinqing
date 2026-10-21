# 蜂巢引擎｜Personal Harness 第七版（子 Agent 编排与多模型协同）

**更新日期：**2026-10-21  
**输入基线：**第六版 `source_base_v6.htm`  
**用途：**产品完成态的离线交互展示；不代表模型连接或真实任务执行已完成。

## 打开方式

直接用 Chrome / Edge 打开 `蜂巢引擎_PersonalHarness_第七版_Subagent多模型编排_完整产品展示.htm`。全部 CSS、SVG、JavaScript 内嵌，页面不依赖 CDN 或外部 API。其 Content Security Policy 禁止联网。

## 本次新增

### 1. 子 Agent 编排工作流（互动拓扑）

导航中的 **“多模型编排”** 进入新增展区。系统在同一 Task Core 下，展示主 Agent 计划拆分、三个并行子 Agent、一个依赖子 Agent（汇总/编制/Visual/审查角色随场景变化）、专业完成门与 Delivery。

四个场景：

| 场景 | 并行子 Agent | 依赖子 Agent | 输出 |
|---|---|---|---|
| 政策沿革/项目适用 | 政策沿革、效力核查、Project 事实 | 独立复核 | EvidencePacket / 适用矩阵 / 报告 |
| 村庄规划编制 | 现状资料、规划规则、Geo 工具操作 | 成果编制 | 文本 / 图件 / 空间数据库 |
| 城市设计与 AI 生图 | 设计策略、Geo/Design、视觉理解 | Visual 工作流编排 | 鸟瞰、效果图、彩平、分析图候选 |
| 并行代码审查 | 后端、授权、模板审查 | 综合复核 | 问题清单与复现证据 |

### 2. Subagent 与不同模型的动态绑定

每个子 Agent 都有**角色职责、模型选择和工具链**。可切换“均衡分配”“本地优先”“深度研究优先”三种示例策略，再进一步调整某个角色的模型；图表与节点详情会同步更新。模型选项是能力位与示例，不是已接通、已评估或者实际可用的模型清单。需要实际接入时由 Model Router / Provider Adapter 完成能力探测、费用控制、数据出境控制、身份记录与真实调用。

**角色与模型的区别：**子 Agent 可以是政策研究者、Geo Agent、Visual Agent；LLM、VLM 是模型能力，开源 GIS Worker、ArcGIS Pro Bridge、ComfyUI、闭源 Image API 是它们经许可调用的专业工具后端。图像生成模型本身不被当作独立获得业务控制权的 Agent。

### 3. Visual 开源 / 闭源工作流可选

切换“城市设计与生图”后，在 `Visual 编排 Agent` 的模型选择下，还可单独选择：ComfyUI 开源工作流、闭源 Image API 或双路线候选。Visual 接收已冻结的 ImageBrief、原图及必须保持的空间约束，输出可复核图像候选。生成图不得替代 GeoResult、原生设计几何和法定规划成果。

### 4. 三阶段执行轨迹

选择“规划授权 → 并行执行 → 汇总 / QC”，拓扑中的对应节点高亮，下方展示任务如何获取许可、并行派发、记录回执、汇聚和专业验收。仅作前端模拟，不启动后台子 Agent。

### 5. 原多视角架构同步

扩展第六版“架构图解”的 Runner 解释，明确 Planner、受控多 Agent 并发、Model Router 和不同模型的职责；保留 Geo 双路径、Visual 生图、Delivery 成果制作的原有交互。

## 架构约束

- **一个 Task Core**：任务、计划接受、权限、预算、attempt、lease/fence、取消与成果接受均为统一权威。
- **一个受控执行驱动路径**：不同 Subagent 可参与同一业务工作流，但不能出现同一 attempt 被两个 Runner Loop 争夺控制。
- **职责分离**：主 Agent 提出计划，Runner 协调执行，Subagent 根据各自模型和工具完成任务，Reviewer 形成复核意见，Task Core 接受成果。
- **知识与项目证据**：INDEX 的正式写入仍走受控入口。Web Search/Fetch 是外部检索 Provider，不形成第二知识库。
- **模型异构**：LLM 负责分析、规划或工具调用；VLM 负责图像理解；Image Model 是 Visual 生成图的工具；GIS/建模由真实计算和原生软件完成。
- **质量检查**：多模型一致不是专业事实证明。成果须遵守证据、Geo 计算、文件回读和必要人工审定的完成门。

## 文件结构

- `source_base_v6.htm`：第六版完整网页基线。
- `assets/subagent-multimodel.html`、`.css`、`.js`：第七版新增完整模块源。
- `assets/geo-delivery.*`、`assets/research-architecture.*`：第六版及之前功能参考源码。
- `build_revision.py`：从第六版基线生成第七版完整网页。
- `test_revision.py`：Chromium/Playwright 离线交互回归测试。
- `previews/`：页面演示截图。

重新构建（有 Python 即可）：`python build_revision.py`。测试需要本机安装 Playwright 和 Chromium，并可能调整浏览器路径。

## 验收结果

已经完成第七版交互的浏览器检查：桌面 1440×900 与手机 390×844 下，四个案例、三种模型路由策略、逐角色下拉绑定、Visual 生图后端切换、执行阶段高亮、旧版 Geo A/B 切换、成果制作和架构图点击均正常，无页面 JavaScript 异常，未出现页面级横向溢出。手机端 SVG 大图支持容器内部横向滚动。

**未进行：**真实 LLM/VLM/Image 调用、Token/费用统计、子 Agent 并发执行、ArcGIS Pro 桥接、成果专业审定、云端 Provider 可用性验证。因此所有模拟均不构成功能上线声明。
