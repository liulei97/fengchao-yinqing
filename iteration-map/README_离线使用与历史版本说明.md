# 蜂巢引擎产品能力与原型迭代图谱 · V13 更新

该档案从原 V12 历史包复制而来，**原有 archive/ 历史文件未经修改**。新增 V13 产品展示、桌面 v1.0、独立「规划设计分析图工作台」HTML 及相关技术文档。

- `index.html`：新的互动版本时间线与 V13 实际原型内嵌。
- `archive/v4.html` ～ `archive/v12.html`：原历史页面及专题修订，完整保留。
- `archive/d01.html` ～ `archive/d09.html`：原桌面 v0.1～v0.9，完整保留。
- `archive/v13.html`：基于 V12 追加规划分析图展区的 V13 产品展示。
- `archive/d10.html`：桌面原型 v1.0。
- `archive/planning_studio.html`、`archive/Planning_Analysis_Studio_V13.html`：独立原型及支持页。
- `V13_工作台技术架构与接口契约.md`：Data、GIS Worker、App Bridge、Delivery 与绘图架构。

推荐完整解压、在根目录运行 `python -m http.server 8765 --bind 127.0.0.1`，然后浏览器访问 `http://127.0.0.1:8765/index.html`。直接双击 index.html 也可，但部分浏览器限制 `file://` 内嵌页面，必要时用本地 HTTP。

重要：此包为**网页原型与 HTML/CSS/JS 源码档案**，不是完整 ArcGIS Pro/CAD/BIM/Python 后端工程；先前 V12 两套外部 WebUI 的完整 Python 工程应另外保存其原始包。本包不包含外部模型服务、真实空间计算或 Task Core 服务。
