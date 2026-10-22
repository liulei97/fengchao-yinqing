# 蜂巢引擎 V13 · 规划设计分析图工作台

- `index.html`：基于 V12 原页面保留能力，新增 V13 专项展示区，可在页面中直接操作工作台。
- `HiveEngine_Desktop_Concept_v1.0_PlanningStudio.html`：桌面概念原型 v1.0，新增「规划设计分析图」侧栏，沿用原 App Host、App Bridge、Policy、Geo、APLE/ANTR、Visual 等工作区。
- `Planning_Analysis_Studio_V13.html`：独立离线 HTML WebUI，二维/三维图面、GeoJSON/CSV、绘制标注、主题渲染及 JSON/SVG/PNG 导出。
- `V13_规划设计分析图工作台_技术架构与接口契约.md`：目标接口、安全、专业精度边界及用地、交通、约束案例。
- 其他原有 V12 文件、两套独立 WebUI 及 Policy/App Bridge 工作台保留。

推荐在本机通过 HTTP 服务（例如 Python `python -m http.server 8765 --bind 127.0.0.1`）打开 `http://127.0.0.1:8765/index.html`；直接打开独立 HTML 也支持主要离线交互，但部分浏览器会限制 `file://` 的 iframe 嵌入。

本次是产品概念与可运行前端，未接入真实 GIS 计算、三维地形、ArcGIS Pro、App Bridge 和 Task Core。旧版历史文件不应覆盖原版。
