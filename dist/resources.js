/* Student resource catalog. Coach publishing will supply these metadata fields. */
'use strict';
const resourceRoot = new URL('./', document.currentScript.src);
resources.forEach(r=>Object.assign(r,{
  openUrl:new URL(`resources/lesson-${r.id}.html`,resourceRoot).href,
  downloadUrl:new URL(`resources/lesson-${r.id}.html`,resourceRoot).href,
  fileName:`${r.title}.html`,format:'HTML 网页',publisher:'课程教练',sample:true
}));
function resourceURL(value){
  if(typeof value!=='string'||!value.trim())return '';
  try{const u=new URL(value,resourceRoot);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}
}
function resourceActions(r){
  const open=resourceURL(r.openUrl),download=resourceURL(r.downloadUrl);
  return `<div class="kit-actions">${open?`<a class="primary" href="${esc(open)}" target="_blank" rel="noopener noreferrer" aria-label="打开锦囊：${esc(r.title)}">打开锦囊 ${icon('external',15)}</a>`:'<button class="primary" disabled>链接暂不可用</button>'}${download?`<a class="ghost" href="${esc(download)}" download="${esc(r.fileName||r.title)}" aria-label="下载：${esc(r.title)}">${icon('download',15)} 下载</a>`:'<button class="ghost" disabled>暂无下载文件</button>'}</div>`;
}
icons.download='M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5';
function kitCard(r){return `<article class="kit-card"><div class="kit-heading"><span class="kit-pixel">${pixel(r.pixel)}</span><div class="kit-tags"><span>${esc(r.type)}</span><span>${esc(r.level)}</span></div><span class="kit-format">${esc(r.format||'链接资源')}</span></div><h2>${esc(r.title)}</h2><p class="kit-description">${esc(r.desc)}</p><div class="kit-publisher">${esc(r.publisher||'课程教练')}${r.sample?' · 示例锦囊':''}</div>${resourceActions(r)}</article>`;}
resourcesPage=function(){
 const list=resources.filter(r=>(resourceFilter==='全部'||r.type===resourceFilter)&&(difficulty==='全部'||r.level===difficulty));
 return `${title('','锦囊小屋','教练准备的学习资料，用到哪份，就打开哪份。')}<div class="kit-intro"><span>${icon('book',20)} 随时打开，也可以下载带走</span><p>网页、文档、模板……找到需要的锦囊，按自己的节奏开始。</p></div><section class="kit-filters" aria-label="筛选锦囊"><div class="kit-filter-row"><span class="kit-filter-label">领域</span><div class="kit-filter-options">${['全部',...Object.keys(domains)].map(x=>`<button class="filter ${resourceFilter===x?'active':''}" data-resource-filter="${esc(x)}" aria-pressed="${resourceFilter===x}">${esc(x)}</button>`).join('')}</div></div><div class="kit-filter-row"><span class="kit-filter-label">难度</span><div class="kit-filter-options">${['全部','入门','进阶'].map(x=>`<button class="filter ${difficulty===x?'active':''}" data-level="${x}" aria-pressed="${difficulty===x}">${x}</button>`).join('')}</div></div></section><div class="kit-result-count" role="status">共 ${list.length} 份锦囊</div><div class="kit-grid">${list.map(kitCard).join('')||'<div class="kit-empty"><h2>这里的锦囊还在准备中</h2><p>换个领域或难度，看看其他锦囊。</p><button class="ghost" data-kit-reset>查看全部锦囊</button></div>'}</div>`;
};
// Task and guide shortcuts use the same metadata and access actions.
resource=function(id){const r=resources.find(r=>r.id===id);if(!r)return;activeModal='resource';openModal(esc(r.title),`<div class="kit-detail"><div class="kit-tags"><span>${esc(r.type)}</span><span>${esc(r.level)}</span><span>${esc(r.format||'链接资源')}</span></div><p>${esc(r.desc)}</p><div class="kit-publisher">${esc(r.publisher||'课程教练')}${r.sample?' · 示例锦囊':''}</div>${resourceActions(r)}</div>`,'锦囊小屋');};
document.addEventListener('click',e=>{if(e.target.closest('[data-kit-reset]')){resourceFilter='全部';difficulty='全部';render();}});
