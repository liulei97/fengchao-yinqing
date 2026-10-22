import { b5 as mermaidModule } from './vendor/mermaid.core-nQedeAL4.js';

// Mermaid's pre-bundled namespace is shipped with the app. No network, AI, or API key is required.
const mermaid = mermaidModule.default || mermaidModule;
const $ = id => document.getElementById(id);
const $$ = selector => [...document.querySelectorAll(selector)];
const PALETTES = {
  blue:  {name:'专业蓝',fill:'#eaf2fd',stroke:'#648dca',text:'#203f66',line:'#728cae',cluster:'#f5f8ff',clusterStroke:'#b7cce8',background:'#ffffff'},
  green: {name:'规划绿',fill:'#e7f3eb',stroke:'#6e9d86',text:'#244d3d',line:'#699381',cluster:'#f4faf6',clusterStroke:'#afcebd',background:'#ffffff'},
  slate: {name:'极简灰',fill:'#f0f2f5',stroke:'#9ca9ba',text:'#334157',line:'#929cad',cluster:'#f7f8fa',clusterStroke:'#c4cbd6',background:'#ffffff'},
  dark:  {name:'深色架构',fill:'#344c69',stroke:'#7b99bb',text:'#ffffff',line:'#6d849f',cluster:'#e9eef5',clusterStroke:'#9db1c9',background:'#ffffff'},
  market:{name:'橙蓝对照',fill:'#fff1ed',stroke:'#e6a28e',text:'#963e29',line:'#94a3b8',cluster:'#fdf8f3',clusterStroke:'#e6c3b4',background:'#ffffff'},
  scholar:{name:'学术三色',fill:'#eaf0f8',stroke:'#7698c4',text:'#24466e',line:'#94a3b8',cluster:'#f5f8fc',clusterStroke:'#afc2d8',background:'#ffffff'},
  policy:{name:'政策蓝绿',fill:'#eaf1fb',stroke:'#7698c4',text:'#24466e',line:'#91a2b5',cluster:'#f5f8fd',clusterStroke:'#afc1d8',background:'#ffffff'},
  fourcolor:{name:'四色分支',fill:'#f1f6ff',stroke:'#bfdbfe',text:'#334155',line:'#94a3b8',cluster:'#f8faff',clusterStroke:'#bfdbfe',background:'#ffffff'}
};
const SAMPLES = [
`flowchart LR
    A("需求增加") --> B["原价格下出现超额需求"]
    B --> C{"供给能否迅速调整？"}
    C -->|能够| D["生产者增加供给量"]
    C -->|短期不能| E["市场价格上涨"]
    D --> F("形成新的市场均衡")
    E --> F
    subgraph MECHANISM["供求调节机制"]
        B
        C
        D
        E
    end`,
`flowchart TB
    A["最高限价低于均衡价格"] --> B["价格受到行政约束"]
    B --> C["需求量增加"]
    B --> D["供给量减少"]
    C --> E{"出现市场短缺"}
    D --> E
    E --> F["排队与非价格配给"]
    E --> G["变相收费 / 降低质量"]
    F --> H("需要配套供给与监管措施")
    G --> H`,
`flowchart LR
    A["现场调研"] --> B["记录照片与位置"]
    B --> C["关联空间对象"]
    C --> D{"检查资料完整性"}
    D -->|通过| E["整理研究成果"]
    D -->|补充| A
    subgraph DATA["调查信息管理"]
       B
       C
       D
    end`
];

const DEFAULT_SETTINGS={preset:'blue',direction:'LR',nodeGap:55,rankGap:70,fontSize:15,curve:'basis',lineGap:1};
const app={source:SAMPLES[0],settings:{...DEFAULT_SETTINGS},nodeStyles:{},edgeStyles:{},clusterStyles:{},selection:null,undo:[],redo:[],sourceSnapshotTimer:null,historyDebounce:null,autoFit:true,zoom:1,panX:0,panY:0};
const snapshot=()=>JSON.stringify({source:app.source,settings:app.settings,nodeStyles:app.nodeStyles,edgeStyles:app.edgeStyles,clusterStyles:app.clusterStyles});
let lastCommitted='';
function saveHistory(){const s=snapshot();if(s===lastCommitted)return;app.undo.push(lastCommitted);if(app.undo.length>55)app.undo.shift();app.redo=[];lastCommitted=s;updateHistory();}
function loadSnapshot(value){if(!value)return;const s=JSON.parse(value);Object.assign(app,{source:s.source,settings:s.settings,nodeStyles:s.nodeStyles,edgeStyles:s.edgeStyles,clusterStyles:s.clusterStyles});$('editor').value=app.source;app.selection=null;syncSettings();syncSelection();saveLocal();scheduleRender(0);}
function undo(){if(!app.undo.length)return;app.redo.push(snapshot());lastCommitted=app.undo.pop();loadSnapshot(lastCommitted);updateHistory();}
function redo(){if(!app.redo.length)return;app.undo.push(snapshot());lastCommitted=app.redo.pop();loadSnapshot(lastCommitted);updateHistory();}
function updateHistory(){$('undoBtn').disabled=!app.undo.length;$('redoBtn').disabled=!app.redo.length;}
function persist(){saveLocal();}
function saveLocal(){try{localStorage.setItem('mermaid-flow-studio-v1',snapshot());}catch{}}
function restoreLocal(){try{const s=JSON.parse(localStorage.getItem('mermaid-flow-studio-v1')||'null');if(s&&typeof s.source==='string'&&s.settings){app.source=s.source;app.settings={...DEFAULT_SETTINGS,...s.settings};app.nodeStyles=s.nodeStyles||{};app.edgeStyles=s.edgeStyles||{};app.clusterStyles=s.clusterStyles||{};// 自愈：历史版本可能存过幽灵节点/幽灵分组的样式，启动时按当前源码过滤
const keep=sourceNodeIds(app.source);for(const k of Object.keys(app.nodeStyles))if(!keep.has(k))delete app.nodeStyles[k];const mem=clusterMembership(cleanSource(app.source));for(const k of Object.keys(app.clusterStyles))if(!mem[k])delete app.clusterStyles[k];}}catch{}}

// Only the Mermaid code inside a Markdown fence is edited; surrounding Markdown is not interpreted.
function extractMermaid(src){
 const match=src.match(/```\s*mermaid\s*\r?\n([\s\S]*?)\r?\n?```/i);
 if(match)return match[1].trim();
 return src.replace(/^\s*```(?:mermaid)?\s*\r?\n/i,'').replace(/\r?\n?```\s*$/,'').trim();
}
function cleanSource(src){return extractMermaid(src)
 .replace(/(?:\r?\n)?%% FLOW-STUDIO-START[^\r\n]*\r?\n[\s\S]*?%% FLOW-STUDIO-END[^\r\n]*(?:\r?\n)?/g,'\n')
 .replace(/%%\{\s*init\s*:[\s\S]*?\}%%\s*/g,'')
 .trim();}
function initialDirection(src){return (src.match(/\b(?:flowchart|graph)\s+(LR|RL|TB|BT|TD)\b/i)||[])[1]?.toUpperCase().replace('TD','TB')||null;}
function escapeReg(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function escapeLabel(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r?\n/g,' ');}
function color(hex){return /^#[0-9a-f]{6}$/i.test(hex||'')?hex:'#648dca';}
function validId(id){return /^[a-zA-Z_][\w-]*$/.test(id);}
function findDefinition(source,id){
 if(!validId(id))return null;
 const pattern=new RegExp('(^|[^\\w\\u4e00-\\u9fa5])('+escapeReg(id)+')(\\s*)(\\(\\[|\\(\\(|\\[\\[|\\{\\{|\\[\\/|\\[|\\(|\\{|>)','gm');
 let m;
 while((m=pattern.exec(source))){
   const opening=m[4];let suffix={ '([':'])','((':'))','[[':']]','{{':'}}','[/':'/]','[':']','(':')','{':'}','>':']'}[opening];
   let i=m.index+m[1].length+m[2].length+m[3].length+opening.length;
   let close=source.indexOf(suffix,i);
   const eol=source.indexOf('\n',i);
   if(close<0||(eol>=0&&close>eol))continue;
   // Avoid treating a subgraph declaration as a node declaration.
   const lineStart=source.lastIndexOf('\n',m.index)+1;
   if(/^\s*subgraph\b/i.test(source.slice(lineStart,m.index)))continue;
   return {start:m.index+m[1].length,end:close+suffix.length,label:source.slice(i,close),opening,explicit:true};
 }
 return null;
}
function detectShape(source,id){const d=findDefinition(source,id);if(!d)return'rect';return {'[':'rect','(':'round','([':'stadium','{':'diamond','((':'circle','{{':'hexagon'}[d.opening]||'rect';}
function shapeDefinition(id,label,shape){
 const content='"'+escapeLabel(label)+'"';
 switch(shape){
  case 'round':return `${id}(${content})`;
  case 'stadium':return `${id}([${content}])`;
  case 'diamond':return `${id}{${content}}`;
  case 'circle':return `${id}((${content}))`;
  case 'hexagon':return `${id}{{${content}}}`;
  default:return `${id}[${content}]`;
 }
}
function originalLabel(id){const def=findDefinition(cleanSource(app.source),id);if(def){let text=def.label.trim();if(/^"[\s\S]*"$/.test(text))text=text.slice(1,-1);// 先用占位符保护换行标签，避免被通用标签清理吃掉
return text.replace(/\\"/g,'"').replace(/<br\s*\/?>/gi,'\u0001').replace(/<[^>]*>/g,'').replace(/\u0001/g,'<br/>');}return id;}
function modifiedSource(){
 let source=cleanSource(app.source);
 if(!source)return'';
 if(!/\b(?:flowchart|graph)\s+(LR|RL|TB|BT|TD)\b/i.test(source))return source;
 source=source.replace(/\b(flowchart|graph)(\s+)(?:LR|RL|TB|BT|TD)\b/i,(_,a,b)=>a+b+app.settings.direction);
 let newlyDeclared=[];
 const idList=Object.keys(app.nodeStyles);
 for(const id of idList){
   if(!validId(id))continue;
   const config=app.nodeStyles[id]||{};
   if(!config.shape&&!Object.prototype.hasOwnProperty.call(config,'label'))continue;
   const d=findDefinition(source,id);
   const label=Object.prototype.hasOwnProperty.call(config,'label')?config.label:originalLabel(id);
   const shape=config.shape||(d?detectShape(source,id):'rect');
   const replacement=shapeDefinition(id,label,shape);
   if(d)source=source.slice(0,d.start)+replacement+source.slice(d.end);
   else newlyDeclared.push('    '+replacement);
 }
 // Place new declarations at top-level, outside subgraphs, and after existing statements.
 if(newlyDeclared.length)source+='\n'+newlyDeclared.join('\n');
 return source;
}
function mermaidConfig(){
 const p=PALETTES[app.settings.preset]||PALETTES.blue;
 return {theme:'base',securityLevel:'strict',flowchart:{htmlLabels:false,nodeSpacing:+app.settings.nodeGap,rankSpacing:+app.settings.rankGap,curve:app.settings.curve,padding:17},themeVariables:{fontFamily:'Microsoft YaHei, PingFang SC, Arial, sans-serif',fontSize:`${app.settings.fontSize}px`,primaryColor:p.fill,primaryTextColor:p.text,primaryBorderColor:p.stroke,lineColor:p.line,secondaryColor:p.cluster,tertiaryColor:p.cluster,clusterBkg:p.cluster,clusterBorder:p.clusterStroke,edgeLabelBackground:'#ffffff',background:p.background}};
}
function styledSource(){
 const source=modifiedSource();if(!source)return'';
 const config=mermaidConfig();
 const declaration=`%%{init: ${JSON.stringify({theme:config.theme,flowchart:config.flowchart,themeVariables:config.themeVariables})}}%%`;
 const p=PALETTES[app.settings.preset]||PALETTES.blue;
 let generated=[`linkStyle default stroke:${p.line},stroke-width:2px`];
 for(const [id,v] of Object.entries(app.nodeStyles)){
   if(!validId(id))continue;
   const css=[`fill:${color(v.fill||p.fill)}`,`stroke:${color(v.stroke||p.stroke)}`,`color:${color(v.text||p.text)}`,`stroke-width:${v.strokeWidth||2}px`,`font-size:${v.fontSize||app.settings.fontSize}px`].join(',');
   generated.push(`style ${id} ${css}`);
 }
 for(const [id,v] of Object.entries(app.clusterStyles)){
   if(!validId(id))continue;
   generated.push(`style ${id} fill:${color(v.fill||p.cluster)},stroke:${color(v.stroke||p.clusterStroke)},color:${color(v.text||p.text)},stroke-width:${v.strokeWidth||2}px`);
 }
 for(const [index,v] of Object.entries(app.edgeStyles)){
   if(!/^\d+$/.test(index))continue;
   generated.push(`linkStyle ${index} stroke:${color(v.stroke||p.line)},stroke-width:${v.strokeWidth||2}px`);
 }
 return `${declaration}\n${source}\n\n%% FLOW-STUDIO-START · 以下为可视化样式，可在 Mermaid 中继续编辑\n${generated.join('\n')}\n%% FLOW-STUDIO-END`;
}
let renderTimer=null, renderSequence=0, renderQueue=Promise.resolve(), toastTimer=null;
function scheduleRender(wait=180){clearTimeout(renderTimer);renderTimer=setTimeout(()=>{renderQueue=renderQueue.then(renderGraph).catch(e=>{setStatus('渲染失败',true);console.error(e)});},wait);}
function setStatus(message,isError=false){$('renderStatus').innerHTML=`<span class="${isError?'status-error':'status-good'}">●</span> ${message}`;}
function showError(message){$('canvasError').hidden=false;$('canvasError').textContent=String(message).slice(0,1700);setStatus('Mermaid 语法错误',true);}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
// 文字行距：放大多行标签（<br/> 分行）内部的行间隔。只改渲染后的 DOM，不写回 Mermaid 代码；导出 SVG/PNG 同步生效。
function applyLineSpacing(svg){
 const m=Number(app.settings.lineGap||1);if(!svg||m===1)return;
 svg.querySelectorAll('.node text, .cluster text').forEach(tx=>{
   const tspans=[...tx.querySelectorAll('tspan')].filter(t=>t.parentElement===tx);
   for(let i=1;i<tspans.length;i++){
     const dy=tspans[i].getAttribute('dy');if(!dy)continue;
     const v=parseFloat(dy);if(isNaN(v))continue;
     const unit=(String(dy).trim().match(/[a-z%]+/i)||[''])[0];
     tspans[i].setAttribute('dy',(v*m)+unit);
   }
 });
}
// 源码中真实存在的节点 id 集合（用于识别并修剪 Mermaid 解析状态泄漏产生的幽灵节点）。
function sourceNodeIds(src){
 const set=new Set();
 const body=src.replace(/%%\{[\s\S]*?\}%%/g,'\n');
 for(const raw of body.split(/\r?\n/)){
  const line=raw.trim().replace(/<[^>]*>/g,' ');
  if(/^(%%|classDef|class|style|linkStyle|direction|subgraph\b|end\b|flowchart\b|graph\b)/i.test(line))continue;
  for(const id of line.match(/[A-Za-z_][\w-]*/g)||[]){
   if(/^(flowchart|graph|subgraph|end|direction|tb|td|lr|rl|bt)$/i.test(id))continue;
   set.add(id);
  }
 }
 return set;
}
// 渲染后移除不在源码里的幽灵节点（Mermaid 解析状态跨渲染泄漏的防护），并同步真实统计。
function pruneGhostNodes(svg,src){
 try{
  const keep=sourceNodeIds(src);
  svg.querySelectorAll('.node').forEach(n=>{
    const id=(n.id||'').replace(/^flowchart-/,'').replace(/-\d+$/,'')||(n.getAttribute('data-id')||'');
    if(id&&!keep.has(id))n.remove();
  });
 }catch{}
}
async function renderGraph(){
 const code=styledSource();
 const raw=cleanSource(app.source);
 if(!raw){$('diagram').innerHTML='';$('canvasEmpty').hidden=false;$('canvasError').hidden=true;setStatus('等待粘贴流程图代码');return;}
 $('canvasEmpty').hidden=true;
 if(!/\b(flowchart|graph)\s+(LR|RL|TB|BT|TD)\b/i.test(raw)){
   showError('仅支持 Mermaid flowchart / graph 语法。\n示例：flowchart LR\n    A[开始] --> B[结束]');return;
 }
 const current=++renderSequence;
 try{
   mermaid.initialize(mermaidConfig());
   const {svg}=await mermaid.render(`flowstudio-${current}`,code);
   if(current!==renderSequence)return;
   $('diagram').innerHTML=svg;
   const target=$('diagram').querySelector('svg');
   if(target){
     const vb=target.viewBox?.baseVal;
     if(vb&&vb.width&&vb.height){target.style.width=`${Math.ceil(vb.width)}px`;target.style.height=`${Math.ceil(vb.height)}px`;target.setAttribute('width',String(Math.ceil(vb.width)));target.setAttribute('height',String(Math.ceil(vb.height)));}
     // Avoid max-width imposed by Mermaid for readable zoom and exact SVG export.
     target.style.maxWidth='none';target.style.display='block';
     if(vb&&vb.width&&vb.height){target.style.width=`${Math.ceil(vb.width)}px`;target.style.height=`${Math.ceil(vb.height)}px`;}
     installHitTargets(target);applyLineSpacing(target);
   }
   $('canvasError').hidden=true;
   pruneGhostNodes(target,cleanSource(app.source));
   const numNodes=$('diagram').querySelectorAll('.node').length;
   const numLinks=$('diagram').querySelectorAll('.edgePaths .edgePath, .edgePaths path.flowchart-link').length;
   $('graphStats').textContent=`${numNodes} 个节点 · ${numLinks} 条路径 · 离线运行`;
   setStatus('图表已更新 · 点击元素开始编辑');
   restoreSelectionOutline();
   if(app.autoFit)fitCanvas();else transformCanvas();
 }catch(error){showError(error?.str||error?.message||error);}
}
function elementInfo(target){
 const svg=$('diagram').querySelector('svg');if(!svg||!target)return null;
 const g=target.closest('.node');
 if(g){const id=(g.getAttribute('data-id')||g.id||'').replace(/^flowchart-/,'').replace(/-\d+$/,'');if(id)return {type:'node',id};}
 const c=target.closest('.cluster');
 if(c){const id=(c.getAttribute('data-id')||c.id||'').replace(/^cluster-/,'');if(id)return {type:'cluster',id};}
 const edges=[...svg.querySelectorAll('.edgePaths .edgePath')];
 const path=target.closest('.edgePath')||target.closest('path.flowchart-link');
 if(path){let idx=edges.indexOf(path);if(idx<0)idx=[...svg.querySelectorAll('.edgePaths path.flowchart-link')].indexOf(path);if(idx>=0)return {type:'edge',id:String(idx)};}
 return null;
}
function installHitTargets(svg){
 svg.addEventListener('click',e=>{const selected=elementInfo(e.target);if(selected){e.stopPropagation();app.selection=selected;syncSelection();restoreSelectionOutline();}});
}
function restoreSelectionOutline(){
 const svg=$('diagram').querySelector('svg');if(!svg)return;
 svg.querySelectorAll('.is-selected').forEach(n=>n.classList.remove('is-selected'));
 if(!app.selection)return;
 const info=app.selection;
 if(info.type==='edge'){
   const paths=[...svg.querySelectorAll('.edgePaths .edgePath')];let edge=paths[+info.id];if(!edge)edge=[...svg.querySelectorAll('.edgePaths path.flowchart-link')][+info.id];edge?.classList.add('is-selected');
 }else{
   const nodes=[...svg.querySelectorAll(info.type==='node'?'.node':'.cluster')];
   const matched=nodes.find(n=>elementInfo(n)?.id===info.id);matched?.classList.add('is-selected');
 }
}
function themeStyle(info){
 const p=PALETTES[app.settings.preset]||PALETTES.blue;
 if(info.type==='node')return {fill:p.fill,stroke:p.stroke,text:p.text,strokeWidth:2,fontSize:app.settings.fontSize,shape:detectShape(cleanSource(app.source),info.id),label:originalLabel(info.id)};
 if(info.type==='cluster')return {fill:p.cluster,stroke:p.clusterStroke,text:p.text,strokeWidth:2,fontSize:app.settings.fontSize};
 return {stroke:p.line,strokeWidth:2};
}
function currentStyle(info){const d=themeStyle(info);const key=info.type==='node'?'nodeStyles':info.type==='edge'?'edgeStyles':'clusterStyles';return {...d,...(app[key][info.id]||{})};}
function syncSelection(){
 const info=app.selection, inspector=$('inspector');inspector.classList.toggle('on',!!info);
 if(!info)return;
 const style=currentStyle(info);
 $('selectedType').textContent=({node:'节点 / NODE',edge:'连接线 / EDGE',cluster:'分组 / GROUP'})[info.type];
 $('selectedId').textContent=info.type==='edge'?`连接线 #${+info.id+1}`:info.id;
 $('nodeControls').hidden=info.type!=='node';$('fillRow').hidden=info.type==='edge';$('textRow').hidden=info.type==='edge';$('nodeFontRow').hidden=info.type!=='node';$('quickTitle').hidden=info.type==='edge';$('quickPalette').hidden=info.type==='edge';
 if(info.type==='node'){$('nodeLabel').value=style.label;$$('.shape-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.shape===style.shape));}
 for(const prop of ['fill','stroke','text']){const value=color(style[prop]||'#ffffff');$(prop+'Color').value=value;$(prop+'Code').textContent=value.toUpperCase();}
 $('strokeWidth').value=style.strokeWidth||2;$('strokeWidthValue').textContent=(style.strokeWidth||2)+'px';$('nodeFont').value=style.fontSize||app.settings.fontSize;$('nodeFontValue').textContent=(style.fontSize||app.settings.fontSize)+'px';
 const palettes=info.type==='cluster'?
  [{fill:'#eff5ff',stroke:'#8eafe0',text:'#243f69'},{fill:'#edf8f0',stroke:'#8ac5a0',text:'#2e5842'},{fill:'#fff5e7',stroke:'#d4ab66',text:'#65481f'},{fill:'#f3edff',stroke:'#b09bdb',text:'#55417b'},{fill:'#f0f2f5',stroke:'#a7b2c1',text:'#34465c'}]:
  [{fill:'#eaf2fd',stroke:'#648dca',text:'#203f66'},{fill:'#e5f4eb',stroke:'#69a384',text:'#275743'},{fill:'#fff2d7',stroke:'#d2a24f',text:'#72501d'},{fill:'#f2e9ff',stroke:'#ad8ad3',text:'#574277'},{fill:'#fdecec',stroke:'#d89393',text:'#813b42'},{fill:'#344c69',stroke:'#6885a7',text:'#ffffff'}];
 $('quickPalette').innerHTML='';for(const p of palettes){const b=document.createElement('button');b.className='palette-color';b.style.background=p.fill;b.title=`${p.fill} / ${p.stroke}`;b.addEventListener('click',()=>editSelected({fill:p.fill,stroke:p.stroke,text:p.text}));$('quickPalette').append(b);}
}
function editSelected(patch){
 const info=app.selection;if(!info)return;
 saveHistory();const key=info.type==='node'?'nodeStyles':info.type==='edge'?'edgeStyles':'clusterStyles';app[key][info.id]={...(app[key][info.id]||{}),...patch};saveHistory();syncSelection();persist();scheduleRender(40);
}
function restoreSelected(){const info=app.selection;if(!info)return;const key=info.type==='node'?'nodeStyles':info.type==='edge'?'edgeStyles':'clusterStyles';saveHistory();delete app[key][info.id];saveHistory();syncSelection();persist();scheduleRender(40);}
function syncSettings(){
 const s=app.settings;
 $$('[data-dir]').forEach(b=>b.classList.toggle('active',b.dataset.dir===s.direction));
 $$('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===s.preset));
 for(const [key,input,label] of [['nodeGap','nodeGap','nodeGapValue'],['rankGap','rankGap','rankGapValue'],['fontSize','fontSize','fontSizeValue']]){$(input).value=s[key];$(label).textContent=s[key]+(key==='fontSize'?'px':'');}
 const lgPct=Math.round((s.lineGap||1)*100);$('lineGap').value=lgPct;$('lineGapValue').textContent=lgPct+'%';
 $('curve').value=s.curve;syncSelection();
}
function modifySettings(next){saveHistory();Object.assign(app.settings,next);saveHistory();syncSettings();persist();scheduleRender(35);}

// Pan and zoom, affecting only the view, never graph semantics or source code.
function transformCanvas(){
 $('diagram').style.transform=`translate(${app.panX}px,${app.panY}px) scale(${app.zoom})`;
 $('zoomValue').textContent=Math.round(app.zoom*100)+'%';
}
function fitCanvas(){
 const area=$('stage');const svg=$('diagram').querySelector('svg');if(!svg)return;
 const rect=svg.viewBox?.baseVal;const w=rect?.width||svg.clientWidth||900;const h=rect?.height||svg.clientHeight||450;
 const cw=area.clientWidth,ch=area.clientHeight;
 app.zoom=Math.min(1.65,Math.max(.16,Math.min((cw-80)/w,(ch-70)/h)));
 app.panX=(cw-w*app.zoom)/2;app.panY=(ch-h*app.zoom)/2;
 transformCanvas();
}
function setZoom(value){const area=$('stage');const centerX=area.clientWidth/2,centerY=area.clientHeight/2;const before=app.zoom;app.zoom=Math.min(3,Math.max(.2,value));app.panX=centerX-(centerX-app.panX)*(app.zoom/before);app.panY=centerY-(centerY-app.panY)*(app.zoom/before);app.autoFit=false;transformCanvas();}
function installCanvas(){
 const stage=$('stage');let drag=null;
 stage.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.node,.cluster,.edgePath,path.flowchart-link'))return;drag={x:e.clientX,y:e.clientY,panX:app.panX,panY:app.panY};stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');});
 stage.addEventListener('pointermove',e=>{if(!drag)return;app.panX=drag.panX+e.clientX-drag.x;app.panY=drag.panY+e.clientY-drag.y;app.autoFit=false;transformCanvas();});
 const stop=()=>{drag=null;stage.classList.remove('is-dragging');};stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);
 stage.addEventListener('click',e=>{if(e.target===stage){app.selection=null;syncSelection();restoreSelectionOutline();}});
 stage.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(app.zoom*(e.deltaY>0?.91:1.09));}},{passive:false});
 $('zoomOutBtn').onclick=()=>setZoom(app.zoom/1.2);$('zoomInBtn').onclick=()=>setZoom(app.zoom*1.2);$('fitBtn').onclick=()=>{app.autoFit=true;fitCanvas();};
 window.addEventListener('resize',()=>{if(app.autoFit)fitCanvas();});
}
async function copyToClipboard(s){
 try{await navigator.clipboard.writeText(s);return true;}catch{
   const t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();return ok;
 }
}
function downloadText(name,content,kind){const blob=new Blob([content],{type:kind});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),7000);}
function svgText(){
 const orig=$('diagram').querySelector('svg');if(!orig)throw new Error('图表尚未成功渲染');
 const svg=orig.cloneNode(true);svg.querySelectorAll('.is-selected').forEach(el=>el.classList.remove('is-selected'));
 svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
 const vb=orig.viewBox.baseVal;const w=Math.ceil(vb?.width||orig.clientWidth);const h=Math.ceil(vb?.height||orig.clientHeight);
 svg.setAttribute('width',w);svg.setAttribute('height',h);svg.style.width=`${w}px`;svg.style.height=`${h}px`;svg.style.maxWidth='none';
 return {text:new XMLSerializer().serializeToString(svg),width:w,height:h};
}
async function exportPng(){
 try{
   const {text,width,height}=svgText();const size=2;
   const canvas=document.createElement('canvas');canvas.width=width*size;canvas.height=height*size;
   const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.scale(size,size);
   const image=new Image();const url=URL.createObjectURL(new Blob([text],{type:'image/svg+xml;charset=utf-8'}));
   await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('SVG 图片转换失败。可优先导出 SVG。'));image.src=url;});
   ctx.drawImage(image,0,0,width,height);URL.revokeObjectURL(url);
   canvas.toBlob(blob=>{if(!blob){toast('PNG 生成失败，请改用 SVG');return;}const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='流程图-高清.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),7000);toast('PNG 已导出（2 倍清晰度）');},'image/png');
 }catch(e){toast(e.message||'无法导出 PNG');}
}
// 样式模板：提取自内置示例图的配色与形状语言，点击即套用到当前图表。
// 角色划分：root=起点（无入边） decision=菱形判断节点 sink=终点（无出边） normal=其余节点；起止节点改用胶囊形状。
const STYLE_TEMPLATES = [
 {key:'market', name:'橙蓝对照',
  roles:{root:{shape:'stadium',fill:'#243b53',stroke:'#243b53',text:'#ffffff',strokeWidth:2},
         decision:{shape:'diamond',fill:'#fff8eb',stroke:'#ddb77d',text:'#76552c',strokeWidth:1.4},
         sink:{shape:'stadium',fill:'#e7f5ef',stroke:'#77be9d',text:'#17664e',strokeWidth:2},
         normal:{shape:'rect',fill:'#fff1ed',stroke:'#e6a28e',text:'#963e29',strokeWidth:1.5}}},
 {key:'scholar', name:'学术三色',
  roles:{root:{shape:'stadium',fill:'#eaf0f8',stroke:'#7698c4',text:'#24466e',strokeWidth:1.8},
         decision:{shape:'diamond',fill:'#fff8eb',stroke:'#ddb77d',text:'#76552c',strokeWidth:1.4},
         sink:{shape:'stadium',fill:'#eaf5ee',stroke:'#90b79e',text:'#2a6545',strokeWidth:1.8},
         normal:{shape:'rect',fill:'#ffffff',stroke:'#bfccda',text:'#34465d',strokeWidth:1.2}}},
 {key:'policy', name:'政策蓝绿',
  roles:{root:{shape:'stadium',fill:'#eaf1fb',stroke:'#7698c4',text:'#24466e',strokeWidth:1.8},
         decision:{shape:'diamond',fill:'#fff6e9',stroke:'#e3b77e',text:'#875a2a',strokeWidth:1.4},
         sink:{shape:'stadium',fill:'#eaf5ef',stroke:'#94bda3',text:'#296448',strokeWidth:1.3},
         normal:{shape:'rect',fill:'#f8fafd',stroke:'#b7c8dc',text:'#34465d',strokeWidth:1.2}}},
 {key:'fourcolor', name:'四色分支',
  roles:{root:{shape:'stadium',fill:'#17263c',stroke:'#17263c',text:'#ffffff',strokeWidth:2},
         decision:{shape:'diamond',fill:'#fef3c7',stroke:'#fcd34d',text:'#b45309',strokeWidth:1.4},
         sink:{shape:'stadium',fill:'#2563eb',stroke:'#1d4ed8',text:'#ffffff',strokeWidth:1.5},
         normal:{shape:'rect',fill:'#f1f6ff',stroke:'#bfdbfe',text:'#334155',strokeWidth:1}},
  branches:[
   {head:{fill:'#dbeafe',stroke:'#93c5fd',text:'#1d4ed8',strokeWidth:1.5},
    body:{fill:'#f1f6ff',stroke:'#bfdbfe',text:'#334155',strokeWidth:1},
    end:{fill:'#2563eb',stroke:'#1d4ed8',text:'#ffffff',strokeWidth:1.5},
    cluster:{fill:'#f8faff',stroke:'#bfdbfe'}},
   {head:{fill:'#d1fae5',stroke:'#6ee7b7',text:'#047857',strokeWidth:1.5},
    body:{fill:'#f0fdf4',stroke:'#a7f3d0',text:'#334155',strokeWidth:1},
    end:{fill:'#059669',stroke:'#047857',text:'#ffffff',strokeWidth:1.5},
    cluster:{fill:'#f7fcf9',stroke:'#a7f3d0'}},
   {head:{fill:'#fef3c7',stroke:'#fcd34d',text:'#b45309',strokeWidth:1.5},
    body:{fill:'#fffbec',stroke:'#fde68a',text:'#334155',strokeWidth:1},
    end:{fill:'#d97706',stroke:'#b45309',text:'#ffffff',strokeWidth:1.5},
    cluster:{fill:'#fffcf5',stroke:'#fde68a'}},
   {head:{fill:'#ede9fe',stroke:'#c4b5fd',text:'#6d28d9',strokeWidth:1.5},
    body:{fill:'#f8f5ff',stroke:'#ddd6fe',text:'#334155',strokeWidth:1},
    end:{fill:'#7c3aed',stroke:'#6d28d9',text:'#ffffff',strokeWidth:1.5},
    cluster:{fill:'#faf8ff',stroke:'#ddd6fe'}}]}
];
function graphTopology(){
 const svg=$('diagram').querySelector('svg');const ids=new Set(),indeg={},outdeg={},edges=[];
 if(!svg)return{ids:[],indeg,outdeg,edges};
 svg.querySelectorAll('.node').forEach(n=>{const id=(n.getAttribute('data-id')||n.id||'').replace(/^flowchart-/,'').replace(/-\d+$/,'');if(id)ids.add(id);});
 svg.querySelectorAll('path.flowchart-link').forEach(p=>{
   if(/edge-thickness-invisible/.test(p.getAttribute('class')||''))return;
   const m=(p.id||'').match(/^L_(.+?)_(.+?)_\d+$/);if(!m)return;
   const a=m[1],b=m[2];if(ids.has(a)&&ids.has(b)){outdeg[a]=(outdeg[a]||0)+1;indeg[b]=(indeg[b]||0)+1;edges.push([a,b]);}
 });
 return{ids:[...ids],indeg,outdeg,edges};
}
// 解析源码里的 subgraph 归属：分组 id -> 组内节点 id 集合（不支持嵌套分组）。
function clusterMembership(src){
 const map={};let current=null;
 for(const raw of src.split(/\r?\n/)){
  const line=raw.trim().replace(/<[^>]*>/g,' ');
  const sg=line.match(/^subgraph\s+([A-Za-z_][\w-]*)/i);
  if(sg){current=sg[1];continue;}
  if(/^end\b/i.test(line)){current=null;continue;}
  if(!current||/^(direction|classDef|class|style|linkStyle|%%)/i.test(line))continue;
  for(const id of line.match(/[A-Za-z_][\w-]*/g)||[]){
   if(/^(flowchart|graph|subgraph|end|direction|tb|td|lr|rl|bt)$/i.test(id))continue;
   (map[current]=map[current]||new Set()).add(id);
  }
 }
 return map;
}
function applyStyleTemplate(t){
 const {ids,indeg,outdeg,edges}=graphTopology();
 if(!ids.length){toast('请先粘贴流程图代码，再套用模板');return;}
 saveHistory();
 app.settings.preset=t.key;
 app.nodeStyles={};app.clusterStyles={};app.edgeStyles={};
 const clean=cleanSource(app.source);
 const mem=clusterMembership(clean);
 const cidOf={};for(const cid in mem)for(const id of mem[cid])cidOf[id]=cid;
 const cids=Object.keys(mem).sort((a,b)=>{
   const pa=clean.search(new RegExp('subgraph\\s+'+a+'\\b')),pb=clean.search(new RegExp('subgraph\\s+'+b+'\\b'));
   return (pa<0?1e9:pa)-(pb<0?1e9:pb);
 });
 const useBranches=!!(t.branches&&cids.length);
 for(const id of ids){
   if(useBranches&&cidOf[id])continue;
   let role='normal';
   if((indeg[id]||0)===0)role='root';
   else if(detectShape(clean,id)==='diamond')role='decision';
   else if((outdeg[id]||0)===0)role='sink';
   app.nodeStyles[id]={...(t.roles[role]||t.roles.normal)};
 }
 if(useBranches){
   cids.forEach((cid,i)=>{
     const hue=t.branches[i%t.branches.length];
     app.clusterStyles[cid]={fill:hue.cluster.fill,stroke:hue.cluster.stroke,strokeWidth:1.5,text:hue.head.text};
     const group=[...mem[cid]],inIn={},depth={},queue=[];
     for(const id of group){
       inIn[id]=edges.filter(([a,b])=>b===id&&cidOf[a]===cid).length;
       if(inIn[id]===0){depth[id]=1;queue.push(id);}
     }
     while(queue.length){
       const cur=queue.shift();
       for(const [a,b] of edges)if(a===cur&&cidOf[b]===cid&&(depth[b]===undefined||depth[b]>depth[cur]+1)){depth[b]=depth[cur]+1;queue.push(b);}
     }
     for(const id of group){
       if(detectShape(clean,id)==='diamond'){app.nodeStyles[id]={...t.roles.decision};continue;}
       const d=depth[id]||1;
       let st;
       if((outdeg[id]||0)===0&&inIn[id]>0){st=hue.end;app.nodeStyles[id]={shape:'stadium',...st};}
       else if(d===1)app.nodeStyles[id]={shape:'rect',...hue.head};
       else app.nodeStyles[id]={shape:'rect',...hue.body};
     }
   });
 }else{
   const clusterPalette=PALETTES[t.key]||PALETTES.blue;
   for(const cid of cids)app.clusterStyles[cid]={fill:clusterPalette.cluster,stroke:clusterPalette.clusterStroke,strokeWidth:1};
 }
 const keepIds=sourceNodeIds(clean);
 for(const id of Object.keys(app.nodeStyles))if(!keepIds.has(id))delete app.nodeStyles[id];
 for(const cid of Object.keys(app.clusterStyles))if(!mem[cid])delete app.clusterStyles[cid];
 app.selection=null;syncSettings();syncSelection();saveHistory();persist();app.autoFit=true;scheduleRender(0);
 toast('已套用模板「'+t.name+'」的配色与形状，「清除美化」可还原');
}
function syncStyleTemplates(){$$('.tpl-chip').forEach(b=>b.classList.toggle('active',app.settings.preset===b.dataset.styleTpl));}
function buildStyleTemplates(){const row=$('templateRow');if(!row)return;row.innerHTML='';for(const t of STYLE_TEMPLATES){const b=document.createElement('button');b.className='btn btn-small tpl-chip';b.textContent=t.name;b.dataset.styleTpl=t.key;b.title='把「'+t.name+'」的配色与形状套用到当前图表';b.onclick=()=>applyStyleTemplate(t);row.append(b);}syncStyleTemplates();}
function initControls(){
 $('editor').addEventListener('input',()=>{clearTimeout(app.historyDebounce);app.historyDebounce=setTimeout(()=>{app.source=$('editor').value;saveHistory();persist();},550);app.source=$('editor').value;const d=initialDirection(cleanSource(app.source));if(d)app.settings.direction=d;syncSettings();syncStyleTemplates();scheduleRender(270);});
 $('editor').addEventListener('blur',()=>{clearTimeout(app.historyDebounce);app.source=$('editor').value;saveHistory();persist();});
 $('editor').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const s=e.target.selectionStart;e.target.setRangeText('    ',s,e.target.selectionEnd,'end');e.target.dispatchEvent(new Event('input'));}});
 $('exampleBtn').onclick=()=>{saveHistory();const next=(SAMPLES.indexOf(app.source)+1)%SAMPLES.length;app.source=SAMPLES[next];$('editor').value=app.source;app.nodeStyles={};app.clusterStyles={};app.edgeStyles={};app.settings.direction=initialDirection(app.source)||'LR';app.selection=null;syncSettings();syncSelection();saveHistory();persist();app.autoFit=true;scheduleRender(0);syncStyleTemplates();toast('已加载示例，可点击图形修改');};
 $('resetBtn').onclick=()=>{saveHistory();app.nodeStyles={};app.edgeStyles={};app.clusterStyles={};app.settings={...DEFAULT_SETTINGS,direction:initialDirection(cleanSource(app.source))||'LR'};app.selection=null;syncSettings();saveHistory();persist();scheduleRender(0);toast('已清除可视化样式（保留原代码）');};
 $('beautifyBtn').onclick=()=>{modifySettings({nodeGap:65,rankGap:85,fontSize:15,curve:'basis'});app.autoFit=true;toast('已优化布局、字体与线条，未修改连接关系');};
 $('copyBtn').onclick=async()=>{const result=await copyToClipboard(styledSource());toast(result?'已复制完整 Mermaid 代码':'复制失败，请检查剪贴板权限');};
 $('copyMdBtn').onclick=async()=>{const result=await copyToClipboard('```mermaid\n'+styledSource()+'\n```');toast(result?'已复制可直接粘贴到 Markdown 的代码块':'复制失败，请检查剪贴板权限');};
 $('svgBtn').onclick=()=>{try{downloadText('流程图.svg',svgText().text,'image/svg+xml');toast('SVG 已导出');}catch(e){toast(e.message)}};
 $('pngBtn').onclick=exportPng;
 $('undoBtn').onclick=undo;$('redoBtn').onclick=redo;
 $$('[data-preset]').forEach(btn=>btn.onclick=()=>modifySettings({preset:btn.dataset.preset}));
 $$('[data-dir]').forEach(btn=>btn.onclick=()=>modifySettings({direction:btn.dataset.dir}));
 for(const key of ['nodeGap','rankGap','fontSize']){$(key).addEventListener('input',e=>modifySettings({[key]:Number(e.target.value)}));}
 $('lineGap').addEventListener('input',e=>modifySettings({lineGap:Number(e.target.value)/100}));
 $('curve').onchange=e=>modifySettings({curve:e.target.value});
 $$('[data-shape]').forEach(btn=>btn.onclick=()=>editSelected({shape:btn.dataset.shape}));
 for(const field of ['fill','stroke','text']){$(field+'Color').addEventListener('input',e=>editSelected({[field]:e.target.value}));}
 $('strokeWidth').oninput=e=>editSelected({strokeWidth:Number(e.target.value)});
 $('nodeFont').oninput=e=>editSelected({fontSize:Number(e.target.value)});
 $('nodeLabel').onchange=e=>editSelected({label:e.target.value});
 $('nodeLabel').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.target.blur();}};
 $('restoreElement').onclick=restoreSelected;
 $('clearSelection').onclick=()=>{app.selection=null;syncSelection();restoreSelectionOutline();};
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();$('beautifyBtn').click();}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!['TEXTAREA','INPUT'].includes(document.activeElement?.tagName)){e.preventDefault();if(e.shiftKey)redo();else undo();}});
}
restoreLocal();$('editor').value=app.source;
lastCommitted=snapshot();syncSettings();updateHistory();installCanvas();buildStyleTemplates();initControls();scheduleRender(30);
