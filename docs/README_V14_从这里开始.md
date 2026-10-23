# 蜂巢引擎 V14 · 政策规则库与项目工具包

V14 在 V13 完整项目包基础上新增政策研究成果资产化设计与操作原型，保留原有项目展示、桌面原型、专业独立应用、资料、脚本及数据；另纳入你上传的 **政策规则库与20案例工作流 V3 原始完整项目**。

## 查看入口

- `index.html`：V14 产品展示；导航“政策规则与工具包”。
- `HiveEngine_Desktop_Concept_v1.1_PolicyToolkits.html`：桌面概念原型；左侧“规则库 · 项目工具包”。
- `Policy_Toolkit_Studio_V14.html`：V14 新建独立交互原型，离线可运行，嵌入 V3 规则/案例/工作流元数据。
- `Policy_Rules_V3/webui/index.html`：原版 V3 前端静态页面（不运行规则引擎）。
- `Policy_Rules_V3/启动后台.bat`：V3 原始服务启动脚本。
- `启动_V3政策研究后台.bat`：V14 包便捷调用原始脚本。
- `V14_政策规则资产与项目工具包体系_技术设计.md`：真实架构边界、接口与验收。

## 真实 V3 后台

需安装 Python 3.10+（及与实际依赖兼容的版本）后，在 `Policy_Rules_V3` 目录执行：

```powershell
pip install -r requirements.txt
python -m uvicorn backend.server:app --host 127.0.0.1 --port 8765
```

再打开 http://127.0.0.1:8765/ 或访问 `GET /api/health`。V3 自有 API 是研究初筛，不会自动注册到蜂巢引擎正式 Task Core。关闭服务可在前台命令窗口按 `Ctrl+C`。如果应用不允许 iframe 嵌入，请从 App Host 用独立窗口打开。

## 演示与现实边界

- 规则/案例/节点是你上传的 V3 真实结构化数据；V14 装配出的六类工具包只是**候选研究组合**，不是发布的行政审批工具或政策结论。
- 通过 iframe 浏览 V14 离线应用不需要 Python；打开 V3 原版 WebUI 静态页面也不会调用 `/api/analyze`。实际政策推理需要启动 V3 后台。
- Windows 本地浏览器一般支持同目录相对页面。为兼容严格沙箱，V14 产品展示与桌面原型的嵌入原型还提供 `srcdoc` 内嵌副本。
- 未做官方政策现行效力在线核验、正式审批卷宗核实，也未接入 Task Core、Rule Registry 或 App Bridge 的真实命令调用。

## 资料保留

原 V13 的所有文件继续保留（原桌面 v1.0 单 HTML 另在历史档案版中保存）；新 V14 为独立演进版。`Policy_Rules_V3` 内文件不修改，保留全部原始后台、测试、案例报告及政策源文件。
