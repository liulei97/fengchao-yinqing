/* v8 isolated: offline interactive showcase. All content is local synthetic sample data. */
(()=>{
'use strict';
const root=document.getElementById('fx8-rich');if(!root)return;
const $=(s)=>root.querySelector(s);
const $$=(s)=>[...root.querySelectorAll(s)];
const state={scene:'economy',mode:'native',a:100,frame:1,policyTab:0,layer:'green',kind:'typed',arch:'source'};
const arch=[
{id:'source',head:'外部来源',sub:'HTML / JSON / MD',short:'01 / SOURCE',title:'来源与导入',desc:'解析历史 ChatGPT 页面、其他 AI 输出与 Markdown 文档，识别文本、结构、图表、元数据、引用和快照。',guard:'原始文件保留来源身份，不执行其中的任意 JavaScript / JSX；输入内容始终视为数据。'},
{id:'classify',head:'Classifier',sub:'递归识别 / 路由',short:'02 / CLASSIFY',title:'递归内容分类器',desc:'不能仅依赖顶层标签判断。识别 matched_type、DIL 结构、useState 特征、已有 SVG 快照与图片提示词；保留混合嵌套。',guard:'类别识别只是候选技术分类。没有元数据时可以退化，不保证复刻私有组件语义。'},
{id:'rich',head:'RichDocument',sub:'唯一版本化文档',short:'03 / AUTHORITY',title:'RichDocument 文档权威',desc:'记录正文、内容块引用、证据链、数据、当前修订以及渲染所需的版本依赖。',guard:'Task Core 负责成果接受；RichDocument 是文档权威，blocks.json 只是其规范化交换投影。'},
{id:'blocks',head:'ph.blocks',sub:'blocks.json / Schema',short:'04 / BLOCKS',title:'规范化块交换层',desc:'为文本、表格、公式、图表、布局、交互组件、图片、引用分别生成有 id、kind、type、state、fallback 的结构。',guard:'必须检查父子关系、类型、版本、数值域与来源定位，禁止将可执行源码直接当作可信组件。'},
{id:'registry',head:'Registry',sub:'type + version',short:'05 / REGISTRY',title:'受控组件注册表',desc:'通过 (source, type, version) 选择经过审核的模板，再决定 native、frames 或 static 路径。',guard:'外来或 AI 生成的模板必须先通过准入与版本测试，不能在正式界面直接执行。'},
{id:'render',head:'Renderer',sub:'native / frames / static',short:'06 / RENDER',title:'渲染器与组件隔离',desc:'可计算的组件原生运行；离散状态用帧集合表达；未知内容用静态快照、表格或文字逐级降级。',guard:'每块独立渲染和报错；Widget Host / Model Runtime 只加载受控实现，禁止任意脚本获得工具权限。'},
{id:'deliver',head:'Validator / Export',sub:'HTML + MD + Assets',short:'07 / DELIVERY',title:'验证、离线构建与成果接受',desc:'检查内容一致性、图表数据、离线资源、交互状态、移动端、导出回读与引用，再由 Delivery 打包。',guard:'单文件禁用 CDN；显示正常不等于事实正确，成果需按用途经过专业 QC 与 Task Core 接受。'}
];
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderArch(){
 const x0=15,w=150,gap=17,y=54,h=93;
 const edge=arch.slice(0,-1).map((n,i)=>{const x=x0+(w+gap)*i+w;return `<path d="M${x} ${y+h/2} H${x+gap-3}" class="fx8-svg-edge" marker-end="url(#fx8-arr)"/>`;}).join('');
 const nodes=arch.map((n,i)=>{const x=x0+(w+gap)*i;return `<g data-fx8-arch="${n.id}" tabindex="0" role="button" aria-label="${esc(n.title)}" class="fx8-svg-node ${state.arch===n.id?'fx8-active':''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/><text x="${x+12}" y="${y+30}" class="fx8-name">${esc(n.head)}</text><text x="${x+12}" y="${y+54}" class="fx8-desc">${esc(n.sub)}</text><text x="${x+12}" y="${y+75}" class="fx8-desc">${String(i+1).padStart(2,'0')} / 07</text></g>`;}).join('');
 $('#fx8-architecture-svg').innerHTML=`<defs><marker id="fx8-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 L9 5 L1 9" stroke="#7c9da4" fill="none" stroke-width="1.4"/></marker></defs><text x="15" y="28" fill="#759297" font-size="12" letter-spacing="2">CONTENT INGESTION</text><text x="1158" y="178" fill="#759297" font-size="11" text-anchor="end">PH / DOCUMENT RUNTIME → DELIVERY</text>${edge}${nodes}`;
 $$('[data-fx8-arch]').forEach(el=>{
  const select=()=>{state.arch=el.dataset.fx8Arch;renderArch();};
  el.addEventListener('click',select);
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
 });
 const cur=arch.find(n=>n.id===state.arch);
 $('#fx8-node-num').textContent=cur.short;$('#fx8-node-title').textContent=cur.title;$('#fx8-node-desc').textContent=cur.desc;$('#fx8-node-boundary').textContent=cur.guard;
}
const types={
 typed:{title:'A 类 / 已类型化的富组件',note:'若来源有 matched_type 或明确组件类型，优先查询 (source,type,version) 注册表并用已审核 native 模板表达。',example:'widget.SUPPLY_AND_DEMAND → native / snapshot'},
 layout:{title:'B 类 / DIL 声明式结构',note:'递归识别 box、grid、row 与内部图表或图像。仅解析可支持的结构到 layout.* 块，不承诺运行任意 DIL。',example:'<grid> + Chart → layout.grid + chart.line'},
 stateful:{title:'C 类 / 状态与表达式',note:'识别 useState 等信号，尝试已登记的签名映射；复杂未知交互退化为可验证的 frames 或 static，不编译陌生 JSX。',example:'useState + SVG → known signature → frames'},
 snapshot:{title:'D 类 / 只有页面快照',note:'以固定尺寸与原始字体约束保存 SVG / PNG，附标题、说明、位置和无法交互的限制。',example:'figure.os-svg → image.snapshot'},
 prompt:{title:'E 类 / 只有生图提示词',note:'AsyncImage query 只能作为 image.prompt 或候选素材请求；离线成果须另有已获取的图片资源。',example:'AsyncImage(query) → image.prompt / text fallback'}
};
function renderType(){
 $$('[data-fx8-kind]').forEach(b=>{b.classList.toggle('fx8-picked',b.dataset.fx8Kind===state.kind);b.setAttribute('aria-pressed',String(b.dataset.fx8Kind===state.kind));});
 const d=types[state.kind];$('#fx8-type-detail').innerHTML=`<h4>${esc(d.title)}</h4><p>${esc(d.note)}</p><code>${esc(d.example)}</code>`;
}
function chartSvg(a){
 const x0=42,y0=220,xW=480,yH=191,x=q=>x0+(q/140)*xW,y=p=>y0-(p/38)*yH;
 const pstar=(a-20)/4,qstar=20+2*pstar;
 const grid=[0,20,40,60,80,100,120,140].map(v=>`<line x1="${x(v)}" y1="29" x2="${x(v)}" y2="220" stroke="#ecf1ee"/><text x="${x(v)}" y="239" text-anchor="middle">${v}</text>`).join('') + [0,10,20,30].map(v=>`<line x1="42" y1="${y(v)}" x2="522" y2="${y(v)}" stroke="#ecf1ee"/><text x="33" y="${y(v)+4}" text-anchor="end">${v}</text>`).join('');
 return `<svg class="fx8-chart-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 264" role="img" aria-label="演示供给与需求曲线，均衡价格 ${pstar}，均衡数量 ${qstar}"><rect width="560" height="264" fill="#fff"/>${grid}<path d="M42 29 V220 H522" fill="none" stroke="#789499" stroke-width="1.7"/><path d="M${x(20)} ${y(0)} L${x(96)} ${y(38)}" stroke="#53958c" stroke-width="3" fill="none"/><path d="M${x(a)} ${y(0)} L${x(a-76)} ${y(38)}" stroke="#c99143" stroke-width="3" fill="none"/><path d="M${x(qstar)} ${y(pstar)} V220 M42 ${y(pstar)} H${x(qstar)}" stroke="#b7a36f" stroke-dasharray="5 5" stroke-width="1.4" fill="none"/><circle cx="${x(qstar)}" cy="${y(pstar)}" r="5.7" fill="#263e49" stroke="#fff" stroke-width="2"/><text x="${x(qstar)+9}" y="${y(pstar)-10}" fill="#263e49">E (Q=${qstar}, P=${pstar})</text><text class="fx8-legend" x="387" y="24" fill="#c99143">— 需求 D</text><text class="fx8-legend" x="477" y="24" fill="#53958c">— 供给 S</text><text x="528" y="240">Q</text><text x="28" y="25">P</text></svg>`;
}
function mapSvg(layer){
 const colors={green:'#8db69d',road:'#d8b28a',building:'#a6bec4'};
 return `<svg class="fx8-mini-map" viewBox="0 0 560 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="示意 GIS 总平面，突出显示 ${esc(layer)} 资源"><rect width="560" height="250" fill="#f4f6f2"/><path d="M-10 120 L570 170" stroke="#d4d6cc" stroke-width="24"/><path d="M-10 120 L570 170" stroke="${colors.road}" stroke-width="${layer==='road'?15:9}"/><path d="M350 -10 L300 260" stroke="#dedbc9" stroke-width="40"/><path d="M350 -10 L300 260" stroke="${colors.road}" stroke-width="${layer==='road'?23:15}"/><path d="M46 27 L277 27 L272 99 L173 109 L103 79Z" fill="${colors.green}" fill-opacity=".9" stroke="${layer==='green'?'#bc8a48':'#7fada0'}" stroke-width="${layer==='green'?4:1.5}"/><path d="M380 178 L525 190 L515 231 L363 234Z" fill="${colors.green}" stroke="${layer==='green'?'#bc8a48':'#7fada0'}" stroke-width="${layer==='green'?4:1.5}"/><g fill="${colors.building}" stroke="${layer==='building'?'#c18a3e':'#6f98a0'}" stroke-width="${layer==='building'?4:1.3}"><rect x="62" y="146" width="83" height="55" rx="3"/><rect x="161" y="172" width="88" height="51" rx="3"/><rect x="384" y="39" width="58" height="89" rx="3"/><rect x="451" y="55" width="75" height="78" rx="3"/></g><g fill="#365d63" font-size="12"><text x="135" y="62">绿地</text><text x="105" y="177">建筑</text><text x="372" y="163">道路</text></g><g transform="translate(495 15)"><circle cx="12" cy="12" r="11" fill="#fff" stroke="#7d999a"/><path d="M12 2 L16 17 L12 14 L8 17Z" fill="#4a6871"/><text x="12" y="33" font-size="9" text-anchor="middle" fill="#5c767b">N</text></g><text x="16" y="239" font-size="10" fill="#7c8d84">示意空间结构 · 无真实 CRS / 不可用于测算</text></svg>`;
}
const modeLabels={native:'native · 本页演示组件',frames:'frames · 离散状态模拟',static:'static · 冻结示意'};
function sharedHeader(title,subtitle,tag){return `<div class="fx8-doc-tag">${esc(tag)} / RICH DOCUMENT DEMO</div><h3>${esc(title)}</h3><p class="fx8-doc-summary">${esc(subtitle)}</p><div class="fx8-doc-metadata"><span>文档版本 · demo.r8</span><span>数据性质 · 虚构演示</span><span>证据状态 · 未用于正式业务</span></div>`;}
function economy(){
 const a=state.mode==='native'?state.a:state.mode==='frames'?[80,100,120][state.frame]:100;
 const p=(a-20)/4,q=20+2*p;
 const ctl=state.mode==='native'?`<label class="fx8-chart-control">需求截距 A <input id="fx8-control-slider" type="range" min="70" max="130" step="2" value="${a}" aria-label="需求函数截距"/><output id="fx8-a-output">${a}</output></label>`:state.mode==='frames'?`<div class="fx8-frame-nav" aria-label="离散快照状态">${[80,100,120].map((v,i)=>`<button type="button" data-fx8-frame="${i}" class="${i===state.frame?'fx8-selected':''}">${v} / 第 ${i+1} 帧</button>`).join('')}</div>`:`<div class="fx8-evidence-note"><b>STATIC</b><span>本块使用固定状态 A = 100 的快照，不提供连续参数计算。</span></div>`;
 return sharedHeader('市场均衡：需求变化如何影响价格？','同一篇经济学报告内混排文字、交互模型、数据表、概念解释与引用区。可切换可计算组件、有限录帧及静态兜底。','ECONOMICS') + `<div class="fx8-rich-claim"><b>教学模型：</b>需求 Qd = A − 2P，供给 Qs = 20 + 2P。下图用虚构数据解释均衡形成机制，非统计观测。</div><div class="fx8-widget"><div class="fx8-widget-heading"><b>widget.SUPPLY_AND_DEMAND</b><small>${state.mode.toUpperCase()} / VERSION 1</small></div><div class="fx8-widget-body">${ctl}<div id="fx8-graph-host">${chartSvg(a)}</div><div class="fx8-widget-info"><span>均衡价格 P*<strong id="fx8-eq-price">${p}</strong></span><span>均衡数量 Q*<strong id="fx8-eq-quantity">${q}</strong></span></div></div></div><h4>结构化计算结果（table.data）</h4><table class="fx8-data-table"><thead><tr><th>变量</th><th>数值</th><th>数据含义</th></tr></thead><tbody><tr><td>A</td><td id="fx8-table-a">${a}</td><td>需求截距</td></tr><tr><td>P*</td><td id="fx8-table-p">${p}</td><td>供需相等的价格</td></tr><tr><td>Q*</td><td id="fx8-table-q">${q}</td><td>供需相等的数量</td></tr></tbody></table><div class="fx8-evidence-note"><b>数据与结论</b><span>图、表、说明使用同一状态。正式工程中的指标应来自已审核的 Model Runtime，而不是由 DOM 视觉位置反推。</span></div>`;
}
function policy(){
 const tab=state.mode==='static'?0:state.mode==='frames'?state.frame:state.policyTab;
 const labels=['政策依据','项目事实','适用结论'];
 const descriptors=[
 '核对原文、发布与施行时点；文号、效力、地域适用性全部保留待核。',
 '比对土地权属、建设内容、用地范围和既有手续；缺失资料以待补列出。',
 '只形成有条件的候选判断，证据不足不得直接生成“可以审批”等结论。'];
 const ctl=state.mode==='native'||state.mode==='frames'?`<div class="fx8-policy-switch">${labels.map((v,i)=>`<button type="button" data-fx8-policy="${i}" class="${i===tab?'fx8-selected':''}">${v}</button>`).join('')}</div>`:`<div class="fx8-evidence-note"><b>STATIC</b><span>固定显示政策依据阶段。其他阶段未提供可切换数据。</span></div>`;
 return sharedHeader('建设项目用地：证据如何支持政策适用性？','Project 的事实、Knowledge 的 EvidencePacket 和 Policy 的条件判断，共享版本后输出可审查的研究报告与关系图。','POLICY / PROJECT')+`<div class="fx8-rich-claim">重要边界：相关检索命中、政策原文存在、条款现行有效和本项目符合条件，是四个需要分开核验的判断。</div><div class="fx8-widget"><div class="fx8-widget-heading"><b>widget.POLICY_APPLICABILITY / 条件核验视图</b><small>${state.mode.toUpperCase()} / DEMO</small></div><div class="fx8-widget-body">${ctl}<div class="fx8-condition-list"><div class="fx8-condition-row"><span><b>${esc(labels[tab])}</b> · ${esc(descriptors[tab])}</span><strong>待核查</strong></div><div class="fx8-condition-row"><span>支持链：SourceRef → EvidenceItem → Claim</span><strong>未冻结</strong></div><div class="fx8-condition-row"><span>反证 / 缺口 / 适用时点</span><strong>需人工确认</strong></div></div></div></div><h4>证据矩阵（table.evidence）</h4><table class="fx8-data-table"><thead><tr><th>核验维度</th><th>候选材料</th><th>状态</th></tr></thead><tbody><tr><td>政策效力</td><td>原文及历史版本</td><td>待核</td></tr><tr><td>事实证明</td><td>项目资料与批准文件</td><td>待补</td></tr><tr><td>结论适用</td><td>逐项条件矩阵</td><td>未审定</td></tr></tbody></table><div class="fx8-evidence-note"><b>Evidence</b><span>演示没有捏造真实法规、审批结论或引用编号。真实 EvidenceItem 应绑定来源位置和版本。</span></div>`;
}
function spatial(){
 const layer=state.mode==='native'?state.layer:state.mode==='frames'?['building','green','road'][state.frame]:'green';
 const labels={building:'建筑基底',green:'绿地结构',road:'道路组织'};
 const ctl=state.mode==='native'||state.mode==='frames'?`<div class="fx8-layer-switch">${Object.entries(labels).map(([key,lab],i)=>`<button type="button" data-fx8-layer="${key}" class="${key===layer?'fx8-selected':''}">${esc(lab)}</button>`).join('')}</div>`:`<div class="fx8-evidence-note"><b>STATIC</b><span>已冻结绿地层的示意图，不提供其它图层切换。</span></div>`;
 return sharedHeader('场地研究：空间分析、规划图与视觉表达联动','Geo 的真实引擎回执、Design 的原生对象和 Visual 的 DiagramSpec / 生图资产，在同一份 RichDocument 中组合呈现。','URBAN DESIGN / GEO')+`<div class="fx8-rich-claim"><b>两种专业执行：</b>开源 GIS Worker（GeoPandas / Shapely / GDAL）或 ArcGIS Pro Bridge（ArcPy / APLE / ANTR），计算结果应带 CRS、单位、参数和版本回执。</div><div class="fx8-widget"><div class="fx8-widget-heading"><b>diagram.SPATIAL_SYSTEM / GIS 结构视图</b><small>${state.mode.toUpperCase()} / SCHEMATIC</small></div><div class="fx8-widget-body">${ctl}${mapSvg(layer)}<div class="fx8-widget-info"><span>当前关注系统<strong>${labels[layer]}</strong></span><span>数据质量<strong>概念示意</strong></span></div></div></div><h4>成果与来源关系（table.data）</h4><table class="fx8-data-table"><thead><tr><th>领域来源</th><th>富组件类型</th><th>专业边界</th></tr></thead><tbody><tr><td>Geo</td><td>Map / GeoResult</td><td>以真实引擎回执为准</td></tr><tr><td>Visual</td><td>DiagramSpec / image</td><td>表达不改写原始几何</td></tr><tr><td>Delivery</td><td>RichDocument / Asset</td><td>检查文表图一致性</td></tr></tbody></table><div class="fx8-evidence-note"><b>IMAGE BRIEF</b><span>鸟瞰图、彩平图、总平图和效果图可由 Visual 编排 ComfyUI / 闭源模型生成候选，但不能直接认定为专业测量成果。</span></div>`;
}
function documentData(){
 const scene=state.scene,mode=state.mode;
 const name={economy:'宏观经济 / 供需均衡',policy:'政策研究 / 适用条件',spatial:'城市设计 / 空间研究'}[scene];
 const a=mode==='native'?state.a:mode==='frames'?[80,100,120][state.frame]:100;
 const current=scene==='economy'?{demand_A:a,equilibrium_price:(a-20)/4,equilibrium_quantity:20+(a-20)/2}:scene==='policy'?{focus:['policy','project','conclusion'][mode==='static'?0:mode==='frames'?state.frame:state.policyTab],verification:'pending'}:{highlight:mode==='static'?'green':mode==='frames'?['building','green','road'][state.frame]:state.layer,crs:'not_available_demo'};
 return {
  schema:'ph.richdocument.exchange.demo/0.1',document_id:'rd_demo_008',revision:8,
  source:'PersonalHarness / standalone demo',title:name,render_profile:{preferred:mode,allowed:['native','frames','static']},
  blocks:[
   {id:'b01',kind:'text',type:'text.heading',data:{title:name}},
   {id:'b02',kind:'text',type:'text.paragraph',data:{purpose:'illustrative;not authoritative'}},
   {id:'b03',kind:'typed',type:scene==='economy'?'widget.SUPPLY_AND_DEMAND':scene==='policy'?'widget.POLICY_APPLICABILITY':'diagram.SPATIAL_SYSTEM',version:1,state:current,fallback:{kind:'static',ref:'local_demo_snapshot'}},
   {id:'b04',kind:'table',type:scene==='policy'?'table.evidence':'table.data',data:{source:'demo_dataset',status:'synthetic'}},
   {id:'b05',kind:'evidence',type:'cite.ref',evidence:[],data:{review:'requires_verification'}},
   {id:'b06',kind:'layout',type:'layout.section',data:{children:['b03','b04','b05']}}
  ],
  authority_note:'blocks.json is an exchange projection, not a second document authority',
  validity:'concept_prototype_only'
 };
}
function updateJSON(){const d=documentData();$('#fx8-json').textContent=JSON.stringify(d,null,2);$('#fx8-block-count').textContent=d.blocks.length+' BLOCKS';$('#fx8-case-name').textContent=d.blocks[2].type;$('#fx8-preview-status').textContent=modeLabels[state.mode];}
function renderDoc(){
 $$('.fx8-choices [data-fx8-case]').forEach(b=>{const selected=b.dataset.fx8Case===state.scene;b.classList.toggle('fx8-on',selected);b.setAttribute('aria-selected',String(selected));});
 $$('[data-fx8-mode]').forEach(b=>{const selected=b.dataset.fx8Mode===state.mode;b.classList.toggle('fx8-on',selected);b.setAttribute('aria-selected',String(selected));});
 $('#fx8-report').innerHTML=state.scene==='economy'?economy():state.scene==='policy'?policy():spatial();
 const input=$('#fx8-control-slider');if(input) input.addEventListener('input',()=>{
  state.a=Number(input.value);const a=state.a,p=(a-20)/4,q=20+(a-20)/2;
  $('#fx8-a-output').textContent=a;$('#fx8-graph-host').innerHTML=chartSvg(a);$('#fx8-eq-price').textContent=p;$('#fx8-eq-quantity').textContent=q;$('#fx8-table-a').textContent=a;$('#fx8-table-p').textContent=p;$('#fx8-table-q').textContent=q;updateJSON();
 });
 $$('[data-fx8-frame]').forEach(b=>b.addEventListener('click',()=>{state.frame=Number(b.dataset.fx8Frame);renderDoc();}));
 $$('[data-fx8-policy]').forEach(b=>b.addEventListener('click',()=>{if(state.mode==='frames')state.frame=Number(b.dataset.fx8Policy);else state.policyTab=Number(b.dataset.fx8Policy);renderDoc();}));
 $$('[data-fx8-layer]').forEach(b=>b.addEventListener('click',()=>{if(state.mode==='frames')state.frame=['building','green','road'].indexOf(b.dataset.fx8Layer);else state.layer=b.dataset.fx8Layer;renderDoc();}));
 updateJSON();
}
function download(filename,contents,mime){const blob=new Blob([contents],{type:mime});const a=document.createElement('a');const uri=URL.createObjectURL(blob);a.href=uri;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),7000);}
$('#fx8-export-json').addEventListener('click',()=>download('PH_rich_blocks_demo_v8.json',JSON.stringify(documentData(),null,2),'application/json;charset=utf-8'));
$('#fx8-export-html').addEventListener('click',()=>{
  const preview=$('#fx8-report').cloneNode(true);preview.querySelectorAll('button,input').forEach(n=>n.remove());
  const css=document.getElementById('fx8-rich-style')?.textContent||'';
  const body=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; script-src 'none'; connect-src 'none'"><title>PersonalHarness 富文档离线示例</title><style>body{background:#e7eeea;font-family:Arial,'Microsoft YaHei',sans-serif;padding:2rem;color:#263e49}.fx8-report{width:min(100%,760px);margin:auto;min-height:0}${css}</style></head><body><main class="fx8-section" style="background:transparent;padding:0"><article class="fx8-report">${preview.innerHTML}</article></main><p style="text-align:center;font-size:12px;color:#617c7e">PersonalHarness 第八版展示 / 静态导出 · 非正式专业成果 · 不含外部依赖</p></body></html>`;
  download('PH_rich_report_offline_demo_v8.html',body,'text/html;charset=utf-8');
});
$$('[data-fx8-case]').forEach(b=>b.addEventListener('click',()=>{state.scene=b.dataset.fx8Case;state.frame=1;state.policyTab=0;renderDoc();}));
$$('[data-fx8-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.fx8Mode;state.frame=1;renderDoc();}));
$$('[data-fx8-kind]').forEach(b=>b.addEventListener('click',()=>{state.kind=b.dataset.fx8Kind;renderType();}));
renderArch();renderType();renderDoc();
})();
