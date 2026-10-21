(()=>{
'use strict';
const root=document.querySelector('#mx7-orchestrator');if(!root)return;
const q=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
const MODELS={
 llm:[['qwen','本地 Qwen（LLM）'],['deepseek','DeepSeek（LLM）'],['cloud','云端推理 LLM'],['alternate','独立 Provider LLM']],
 coding:[['qwen','本地 Qwen（编码 LLM）'],['deepseek','DeepSeek（编码 LLM）'],['cloud','云端编码 LLM'],['alternate','独立 Provider 编码 LLM']],
 vision:[['localvlm','本地视觉 VLM'],['cloudvlm','云端视觉 VLM'],['deepseek','LLM + 图像理解工具']],
 visual:[['qwen','本地 Qwen（Visual Agent）'],['deepseek','DeepSeek（Visual Agent）'],['cloudvlm','云端视觉 VLM（理解）'],['cloud','云端推理 LLM（编排）']]
};
const LABEL=Object.fromEntries(Object.values(MODELS).flat().map(([a,b])=>[a,b]));
const scenes={
 policy:{tag:'POLICY / KNOWLEDGE-GROUNDED RESEARCH',name:'政策制度沿革与项目适用性研究',intro:'主 Agent 拆分“政策沿革、现行效力、项目事实、复核”四类子任务。前面三个角色可并行取证，复核角色汇聚冻结的 EvidencePacket 与 Claim，不直接代替人工法律或业务审定。',roles:[
  {id:'history',name:'政策沿革 Agent',short:'政策时间序列',kind:'llm',job:'检索历次法规与规范性文件，比较条款变化、制度目的和适用时点。',tools:'Knowledge MCP / Web Search / Fetch',io:'输入：法规专题、地域及历史时段；输出：政策时间线与原文位置。',guard:'搜索命中仅为候选；必须回读原文并核实出处。'},
  {id:'validity',name:'政策效力 Agent',short:'效力与适用核验',kind:'llm',job:'回查发布机关、修改废止关系、地域范围和现行适用条件。',tools:'Policy Skill / 官方政策来源',io:'输入：文件与版本引用；输出：效力核验清单、条款限制和反证。',guard:'模型对法规效力的判断是待核分析，不构成正式行政意见。'},
  {id:'project',name:'Project 事实 Agent',short:'项目材料结构化',kind:'llm',job:'解析建设项目的权属、土地性质、审批手续及时间链，建立材料与事实映射。',tools:'Project MCP / OCR / Evidence',io:'输入：项目文件和材料；输出：项目事实表、冲突与缺项。',guard:'缺失证明不允许由模型补造，文件记载不自动代表事实成立。'},
  {id:'review',name:'独立复核 Agent',short:'证据与结论交叉审查',kind:'llm',job:'对被冻结的证据和研究结论检查冲突、漏项、时间口径和未决问题。',tools:'EvidencePacket / Review Skill',io:'输入：三专题结果及冻结证据；输出：分歧、核查意见及缺口。',guard:'尽可能选不同 Provider；多模型同意不等于政策正确。'}],output:'政策适用矩阵 / 研究报告 / 证据包'},
 planning:{tag:'PLANNING / CROSS-DOMAIN PRODUCTION',name:'村庄规划：证据、空间、政策和文本并行协作',intro:'并行整理资料、核查上位约束、开展 Geo 专业分析和规划文本组织；Geo Agent 通过能力路由调用开源 GIS Worker 或 ArcGIS Pro Bridge，所有面积指标来自专业执行器。',roles:[
  {id:'baseline',name:'Knowledge / Project Agent',short:'现状与项目事实',kind:'llm',job:'抽取村庄基础资料、人口产业现状、资源清单与已有规划材料。',tools:'OCR / INDEX / Project',io:'输入：现状资料；输出：事实基线、依据目录和待核材料。',guard:'不以摘要替代原始调查材料。'},
  {id:'rules',name:'Policy / Planning Agent',short:'三区三线与规则',kind:'llm',job:'核对三区三线、用地管控、规划层级、约束和适用例外。',tools:'Policy Skill / Knowledge MCP',io:'输入：上位规划、政策与场地；输出：适用矩阵和限制清单。',guard:'行政审批和法定规划效力需按真实依据复核。'},
  {id:'geo',name:'Geo 操作 Agent',short:'GIS 分析与图数',kind:'coding',job:'提出空间分析计划，选择开源 GIS 或 ArcGIS Pro 桥接，调度面积统计、叠加与地图制作。',tools:'Geo Core → OSS GIS Worker / ArcPy Pro Bridge',io:'输入：数据集、CRS 和计算口径；输出：GeoResult、图层资产与回执。',guard:'LLM 不能自行编造面积；正式数值必须有真实引擎回执。'},
  {id:'writer',name:'成果编制 Agent',short:'章节与交付装配',kind:'llm',job:'根据冻结的事实、规划约束和 GeoResult 编制规划文本、图件清单及一致性校核任务。',tools:'Delivery Skill / RichDocument / APLE',io:'输入：事实和专业结果；输出：章节草案与待复核成果清单。',guard:'写作不能改变原有 Geo 数值或假装完成报批。'}],output:'规划文本 / 表格 / GIS 图件 / 空间数据库'},
 visual:{tag:'VISUAL / MULTIMODAL AGENT ROUTING',name:'城市设计：LLM、VLM 与图像模型分工',intro:'LLM 分解设计任务与检索专业知识，Geo Agent 取得空间底图及约束；VLM 阅读参考图，Visual Agent 统一编排 ComfyUI 开源工作流或闭源 Image API，形成鸟瞰图、效果图、彩平图和分析图候选。',roles:[
  {id:'intent',name:'设计策略 Agent',short:'目标与空间策略',kind:'llm',job:'解释设计意图，结合项目约束生成镜头、风格和场景生成任务。',tools:'Design Skill / Policy / Project',io:'输入：方案目标和资料；输出：设计约束、风格意向与 ImageBrief。',guard:'策略建议必须与已确认的场地边界区分。'},
  {id:'site',name:'Geo / Design Agent',short:'底图与几何基线',kind:'coding',job:'调用 Geo 双路径和原生建模工具形成可追溯的地形、道路、地块与体量参考。',tools:'Open GIS / ArcGIS Pro / CAD / Rhino',io:'输入：Geo 数据及模型；输出：冻结底图、空间参考和几何快照。',guard:'工程尺寸来源于专业数据或原生模型。'},
  {id:'vision',name:'视觉理解 Agent',short:'VLM 图像理解与复核',kind:'vision',job:'识别参考图视角、风格、主体布局及应保持的空间关系，并对候选结果作图像检查。',tools:'VLM / 视觉检索 / 图片定位',io:'输入：底图、参考图；输出：图像约束、差异说明。',guard:'VLM 识别是模型观察，不能自证 GIS 边界或建筑尺寸。'},
  {id:'image',name:'Visual 编排 Agent',short:'统一图像生成工作流',kind:'visual',job:'根据 ImageBrief 调度 ComfyUI 开源模型、ControlNet/LoRA 或闭源图像 API，管理候选及复核。',tools:'Visual → ComfyUI / 开源 Image / 闭源 Image API',io:'输入：提示词、参考图、保持项和模型版本；输出：候选图与生成回执。',guard:'Image Model 是受控工具，不是拥有业务任务权威的 Subagent。'}],output:'城市设计鸟瞰 / 效果图 / 彩平 / 分析图候选'},
 audit:{tag:'CODE / DYNAMIC WORKFLOW',name:'代码审查：多个子 Agent 扇出后统一汇总',intro:'模仿 ZCode 一类代码式动态工作流：一个 Runner 并行下发后端导出链、权限链、模板层审查任务，独立复核后汇总问题清单；编排脚本和结果复用必须服从 Task Core。',roles:[
  {id:'backend',name:'Backend Agent',short:'导出链与文件读写',kind:'coding',job:'检查后端成果导出、持久化、恢复与文件写入路径。',tools:'只读源码 / Git / 测试命令',io:'输入：backend/；输出：问题清单、文件位置和复现条件。',guard:'未经许可不直接修改原始代码。'},
  {id:'auth',name:'Authorization Agent',short:'权限、签名与风险',kind:'coding',job:'复核执行权限、幂等、fence、取消与越权边界。',tools:'源码索引 / 单元测试',io:'输入：授权实现；输出：风险、证据和建议。',guard:'敏感凭据不流入模型上下文或日志。'},
  {id:'ui',name:'Template Agent',short:'模板和前端产物',kind:'coding',job:'检查页面模板、渲染器与离线导出的一致性。',tools:'模板源码 / Renderer / 浏览器测试',io:'输入：template/ 与 UI；输出：可定位问题和测试结果。',guard:'页面可显示不等于离线功能或质量验收通过。'},
  {id:'review',name:'Synthesis Reviewer',short:'跨模块问题汇总',kind:'coding',job:'合并重复问题，确定跨模块依赖与修订优先次序。',tools:'Read-only Review / Checklists',io:'输入：三个子审查报告；输出：去重问题、修复路径和争议。',guard:'重跑时缓存复用要检查代码版本与副作用。'}],output:'分模块问题清单 / 汇总报告 / 测试证据'}
};
const defaults={balanced:{llm:'deepseek',coding:'qwen',vision:'cloudvlm',visual:'deepseek'},local:{llm:'qwen',coding:'qwen',vision:'localvlm',visual:'qwen'},quality:{llm:'cloud',coding:'cloud',vision:'cloudvlm',visual:'cloud'}};
let current='policy',profile='balanced',stage='plan',focused='coordinator',overrides={},imageEngine='hybrid';
const imageEngines={open:'ComfyUI / 开源 Image Model',closed:'闭源 Image Model API',hybrid:'ComfyUI + 闭源 Image 双路线'};
const svg=q('#mx7-topology'),ns='http://www.w3.org/2000/svg';
function el(tag,attrs={},value){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(value!=null)n.textContent=value;return n;}
function path(d,color='#749ca7',w=1.7){svg.appendChild(el('path',{d,fill:'none',stroke:color,'stroke-width':w,'stroke-opacity':'.9'}));}
function modelOf(r){return overrides[r.id] || (r.id==='review'&&profile!=='local'?'alternate':defaults[profile][r.kind]);}
function modelLabel(k,kind){const entries=MODELS[kind]||MODELS.llm;return (entries.find(pair=>pair[0]===k)||[])[1]||LABEL[k]||'能力未指定';}
function createNode(id,x,y,w,h,title,subtitle,model,color){const active=stage==='fanout'&&scenes[current].roles.slice(0,3).some(r=>r.id===id)||stage==='review'&&(id===scenes[current].roles[3].id||id==='delivery')||stage==='plan'&&id==='coordinator';const g=el('g',{class:'mx7-svg-node'+(focused===id?' mx7-focus':'')+(active?' mx7-running':''),'data-node':id,role:'button',tabindex:'0','aria-label':`${title}：${subtitle}`});g.appendChild(el('rect',{x,y,width:w,height:h,rx:12,fill:'#254b5a',stroke:active?'#ffd08c':(color||'#648f9e'),'stroke-width':active?2.1:1.3}));g.appendChild(el('text',{x:x+14,y:y+26,fill:'#f6f8f4','font-size':14,'font-weight':700},title));g.appendChild(el('text',{x:x+14,y:y+47,fill:'#bfd2d5','font-size':11},subtitle.slice(0,18)));if(model){let trim=model.length>27?model.slice(0,26)+'…':model;g.appendChild(el('rect',{x:x+11,y:y+h-33,width:w-22,height:25,rx:5,fill:'#112f3d',stroke:'#537988','stroke-width':.5}));g.appendChild(el('text',{x:x+18,y:y+h-17,fill:'#f5c47a','font-size':10},trim));}g.addEventListener('click',()=>focus(id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(id)}});svg.appendChild(g);}
function redraw(){svg.replaceChildren();
  const sc=scenes[current],pos=[{x:327,y:35},{x:327,y:153},{x:327,y:271}];
  path('M244 211 H279','#d4af77',2.2);path('M279 85 V329','#d4af77',1.7);
  sc.roles.slice(0,3).forEach((r,i)=>{const p=pos[i];path(`M279 ${p.y+49} H${p.x-10}`,'#719da6',1.6);path(`M${p.x+240} ${p.y+49} C595 ${p.y+49} 611 207 628 207`,'#719da6',1.7)});
  path('M862 207 H888','#d4af77',2.2);
  createNode('coordinator',21,161,223,100,'主 Agent / Planner','计划分解 · 能力路由',modelLabel(defaults[profile].llm,'llm'),'#e0b15f');
  sc.roles.slice(0,3).forEach((r,i)=>{const p=pos[i];createNode(r.id,p.x,p.y,240,98,r.name,r.short,(r.id==='image'?modelLabel(modelOf(r),r.kind)+' / '+imageEngines[imageEngine]:modelLabel(modelOf(r),r.kind)),'#719ba4')});
  const last=sc.roles[3];createNode(last.id,628,159,234,98,last.name,last.short,(last.id==='image'?modelLabel(modelOf(last),last.kind)+' / '+imageEngines[imageEngine]:modelLabel(modelOf(last),last.kind)),'#d9b171');
  createNode('delivery',888,158,232,102,'QC / Delivery','结构化汇总 · 完成门',sc.output,'#dcb474');
  svg.appendChild(el('text',{x:325,y:22,fill:'#eac286','font-size':11},'PARALLEL / 并行执行'));
  svg.appendChild(el('text',{x:627,y:146,fill:'#eac286','font-size':11},'DEPENDENCY / 结果汇总'));
  svg.appendChild(el('text',{x:888,y:146,fill:'#eac286','font-size':11},'ACCEPTANCE'));
}
function focus(id){focused=id;let item;
 if(id==='coordinator'){item={name:'主 Agent / Planner',job:'把业务目标转换为受控 Plan 与子任务分工；协调依赖和汇总，不直接获得额外资源权限。',io:'Task Core 先接受 TaskEnvelope / RoutePlan；Runner 分配子任务和预算。',guard:'主 Agent 不能修改控制规则、虚构工具能力或把多个 Loop 同时派给同一 attempt。'};}
 else if(id==='delivery'){item={name:'成果汇总与质量门',job:'收集各子 Agent 的结构化结果，进行依赖检查、交叉核验和交付组装。',io:'输入：冻结输入与候选结果；输出：'+scenes[current].output,guard:'Reviewer 的模型意见与专业完成门、Task Core 业务接受分别记录。'};}
 else item=scenes[current].roles.find(r=>r.id===id);
 if(!item)return;
 q('#mx7-inspect-name').textContent=item.name;q('#mx7-inspect-desc').textContent=item.job;
 q('#mx7-inspect-model').textContent=id==='coordinator'?modelLabel(defaults[profile].llm,'llm')+' · 规划/路由':id==='delivery'?'聚合器 / QC（非模型身份）':modelLabel(modelOf(item),item.kind)+' · '+(item.id==='image'?imageEngines[imageEngine]+'（工具后端）':item.tools);
 q('#mx7-inspect-contract').textContent=item.io;q('#mx7-inspect-guard').textContent=item.guard;
 all('.mx7-role-card').forEach(n=>n.classList.toggle('mx7-selected',n.dataset.mx7Role===id));redraw();
}
function renderRoles(){const grid=q('#mx7-role-grid');grid.replaceChildren();scenes[current].roles.forEach((r,i)=>{
 let card=document.createElement('div');card.className='mx7-role-card';card.dataset.mx7Role=r.id;card.tabIndex=0;
 let head=document.createElement('div');head.className='mx7-card-head';let b=document.createElement('b');b.textContent=String(i+1).padStart(2,'0')+' · '+r.name;let kind=document.createElement('span');kind.textContent=r.kind==='vision'?'VLM':r.kind==='visual'?'Visual LLM':'LLM';head.append(b,kind);
 let description=document.createElement('p');description.textContent=r.short+' | '+r.tools;
 let label=document.createElement('label');label.textContent='选择执行该角色的模型';let select=document.createElement('select');select.setAttribute('aria-label',r.name+' 模型绑定');
 MODELS[r.kind].forEach(([id,name])=>{let o=document.createElement('option');o.value=id;o.textContent=name;select.append(o)});select.value=modelOf(r);select.addEventListener('change',()=>{overrides[r.id]=select.value;focus(r.id);updateCount()});label.append(select);card.append(head,description,label);if(r.id==='image'){let imgLabel=document.createElement('label');imgLabel.textContent='选择 Visual 统一调用的生图工作流';imgLabel.style.marginTop='11px';let imgs=document.createElement('select');imgs.setAttribute('aria-label','Visual Image Workflow 模型执行后端');Object.entries(imageEngines).forEach(([id,name])=>{let o=document.createElement('option');o.value=id;o.textContent=name;imgs.append(o)});imgs.value=imageEngine;imgs.addEventListener('change',()=>{imageEngine=imgs.value;focus('image')});imgLabel.append(imgs);card.append(imgLabel)}card.addEventListener('click',e=>{if(e.target!==select)focus(r.id)});card.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target===card)focus(r.id)});grid.append(card);
 });}
function updateCount(){const arr=['llm:'+defaults[profile].llm,...scenes[current].roles.map(r=>r.kind+':'+modelOf(r))];q('#mx7-agent-count').textContent=scenes[current].roles.length;q('#mx7-model-count').textContent=new Set(arr).size;}
const trace={
 plan:[['任务接收','Task Core 校验范围、预算、能力、来源和用户授权'],['主 Agent 制定分工','Planner 生成子任务、依赖、输入输出与完成门'],['接受工作计划','Runner 获取获准计划修订与 attempt，准备派发']],
 fanout:[['并行子任务 A / B','按不同模型与上下文分发工作；每个结果绑定当前输入版本'],['并行子任务 C / D','子 Agent 使用 Knowledge / Geo / Visual 等获准工具'],['保存回执','结构化 ToolResult、Token 记录、资产版本、结果与异常']],
 review:[['分支汇聚','等待相关结果，核对引用、依赖、缺项和未完成支路'],['依赖阶段 / 复核','按任务将证据交给 Reviewer、将计算结果交给编制 Agent，或交 Visual 生成候选'],['完成门与交付','Delivery 校核版本和成果；需要时开展独立审查，再由 Task Core 接受']]
};
function renderTrace(){const root=q('#mx7-trace');root.replaceChildren();for(const [name,desc] of trace[stage]){const a=document.createElement('article'),b=document.createElement('b'),p=document.createElement('p');b.textContent=name;p.textContent=desc;a.append(b,p);root.append(a)}all('[data-mx7-stage]').forEach(b=>b.classList.toggle('mx7-active',b.dataset.mx7Stage===stage));redraw();}
function render(){const d=scenes[current];q('#mx7-scene-tag').textContent=d.tag;q('#mx7-scene-name').textContent=d.name;q('#mx7-scene-intro').textContent=d.intro;
 all('[data-mx7-case]').forEach(b=>{let on=b.dataset.mx7Case===current;b.classList.toggle('mx7-active',on);b.setAttribute('aria-selected',String(on))});
 q('#mx7-profile').value=profile;renderRoles();updateCount();focus('coordinator');renderTrace();}
all('[data-mx7-case]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.mx7Case;overrides={};imageEngine=profile==='local'?'open':profile==='quality'?'closed':'hybrid';stage='plan';render()}));
q('#mx7-profile').addEventListener('change',e=>{profile=e.target.value;overrides={};imageEngine=profile==='local'?'open':profile==='quality'?'closed':'hybrid';render()});
all('[data-mx7-stage]').forEach(b=>b.addEventListener('click',()=>{stage=b.dataset.mx7Stage;renderTrace()}));
render();
})();
