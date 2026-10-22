# 蜂巢引擎 V10 · 独立 WebUI 应用中心原型

## 定位
在 V9 视觉提示词工作台基础上新增「独立 WebUI · 应用中心」，不改变现有六领域、Task Core、INDEX 与 Delivery 权威边界。

- `index.html`：升级版产品展示，新设可插拔 WebUI 专区。
- `HiveEngine_Desktop_Concept_v0.8_AppHost.html`：桌面工作台原型，左侧新增外部 WebUI 入口。
- `app_registry.example.json`：两个来自用户上传压缩包的独立应用声明示例。
- `apps/03_WebUI/`：原始建筑 AI 工作台（Python 标准库服务，默认 8788）。
- `apps/Mermaid_Flow_Studio/`：原始 Mermaid Flow Studio（前端静态应用，默认 7860，需本地 HTTP）。
- `启动_蜂巢引擎应用中心.bat`：Windows 启动器，使用 Python 3 启动两个子应用和宿主（8760）。**需要用户本机执行**。

## 使用方式
1. 解压全部目录（不要只拿两份 HTML，因为 Mermaid 依赖 `vendor` 目录，提示词库也需要其 `data`）。
2. Windows 装有 Python 3 时，双击 `启动_蜂巢引擎应用中心.bat`；或运行 `python start_hive_workspace.py`。
3. 桌面工作台左侧点击 `独立 WebUI · 应用中心`，分别打开两个独立应用。
4. 也可以手动运行原应用各自的启动脚本，打开独立 HTML 并从应用中心连接 `http://127.0.0.1:8788/` 或 `http://127.0.0.1:7860/`。
5. 其他本地应用可直接登记 URL（严格限制 `localhost` / `127.0.0.1` / `[::1]`）。

## 重要技术边界
- 本版采用**跨端口 iframe**，而非把两个应用的源码合并到蜂巢引擎前端，保持本地服务、依赖、用户数据和设计风格独立。
- HTML 不可能自己启动 Python 服务；启动器必须在用户机器运行。网页中的离线交互预览不代表服务已经接通。
- 若第三方 WebUI 设置 `X-Frame-Options` 或 CSP `frame-ancestors` 阻止嵌入，需要它官方允许宿主，或退化为“独立窗口打开”。不能绕过安全限制。
- App Bridge 计划采用经校验 origin、nonce、Schema 与 scope 的消息协议或有授权的服务端适配器。当前并未建立真正的消息互通，也未让外部 WebUI 拥有 Task Core 操作权限。
- 本包里的 Python 服务端来自用户上传文件，未对全部代码、上传及写入接口做完整安全审计；只能绑定 `127.0.0.1`，不要转发到公网。现有 `03_WebUI` 可写入本地 JSON 和图片，请备份原数据后使用。
- V9 原有 Geo、APLE/ANTR、WebGIS、Visual、Agentic RAG、Subagent、Delivery 等原型仍然保留。
- **本版仅是集成样例与目标架构演示，不是已经完成 Personal Harness 后端接入的生产环境。**

安全补充：宿主端口 8760 只允许访问两份页面，不会将 `apps/` 下的私有 `prompts.json`、图片或备份目录通过宿主服务公开。各子应用端口仍由它们自身服务程序控制。
