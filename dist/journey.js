/* Shared by both visual editions. Previews never imply course completion. */
const expeditionBright=location.pathname.includes('/bright/');
const expeditionBase=new URL('.',document.currentScript.src);
const expeditionAssets=new URL('assets/',expeditionBase).href;
document.body.dataset.edition=expeditionBright?'bright':'warm';
navs[0][2]='冒险大厅';
let guideLine=0, journeySelection=0, journeyPaused=false;
const guideTips=[
  {text:'先做一张个人主页吧。让大家知道，你正在做什么。',label:'打开本周任务',action:'task'},
  {text:'网页制作锦囊介绍了从准备内容到完成页面的具体步骤。',label:'看看网页锦囊',resource:'2'},
  {text:'第一版做完就交上来，带着伙伴的建议再改一轮。',label:'提交我的作品',action:'submit'},
  {text:'看看伙伴的作品，分享你喜欢的细节和使用建议。',label:'逛逛作品广场',page:'gallery'}
];
const guideAsset=expeditionBright?'blue-guide.webp':'warm-guide.webp';
const guideName=expeditionBright?'旅途向导':'村庄向导';
function artSources(src){return `src="${esc(src)}" data-art-primary="${esc(src)}" data-art-fallback="${esc(src.replace(/\.webp$/,'.png'))}" decoding="async"`;}
const navigationArtwork={home:'01-adventure-hall',map:'02-eight-week-journey',resources:'03-knowledge-scroll',gallery:'04-work-gallery',people:'05-companions',profile:'06-my-backpack'};
function navigationIcon(id){return `<img class="nav-art" ${artSources(expeditionAssets+'navigation/'+navigationArtwork[id]+'.webp')} width="40" height="40" alt="" aria-hidden="true">`;}
const expeditionCrest='<svg class="expedition-crest" viewBox="0 0 48 48" aria-hidden="true" shape-rendering="crispEdges"><path class="crest-gold" d="M22 0h4v8h4v4h8v4H28v8h-8v-8H10v-4h8V8h4z"/><path class="crest-stone" d="M8 46V26h4v-6h6v-4h12v4h6v6h4v20h-8V28h-4v-4h-8v4h-4v18z"/><path class="crest-gold" d="M4 44h40v4H4z"/></svg>';
const expeditionShell=shell;
shell=function(){return expeditionShell().replace(/<canvas[^>]*class="brand-mark"[^>]*><\/canvas>/,expeditionCrest).replace('营地存档 · 进度保存在当前浏览器','旅程存档 · 进度保存在当前浏览器');};
const expeditionAvatar=avatar;
avatar=function(n=0,cls=''){return n===0?`<img class="avatar npc-avatar ${cls}" ${artSources(expeditionAssets+guideAsset)} alt="" width="48" height="48">`:expeditionAvatar(n,cls);};
function guideAction(t){return t.action?`data-action="${t.action}"`:t.resource?`data-resource="${t.resource}"`:`data-page="${t.page}"`;}
function guideStrip(){const t=guideTips[guideLine];return `<section class="guide-strip" aria-label="${guideName}"><button class="guide-character" data-guide-next aria-label="和${guideName}聊一句"><img ${artSources(expeditionAssets+guideAsset)} width="108" height="118" alt="${expeditionBright?'戴蓝色兜帽、拿着地图的小向导':'拿着旅行日志的暖色斗篷村庄向导'}"><span>点我聊聊</span></button><div class="guide-dialogue"><div class="guide-byline"><span>${guideName}</span><span class="guide-pagination" id="guide-count">${guideLine+1} / 4</span></div><p id="guide-line" aria-live="polite">${t.text}</p><div class="guide-actions"><button class="guide-link" id="guide-action" ${guideAction(t)}>${t.label} <span aria-hidden="true">↗</span></button></div></div></section>`;}
const expeditionHome=home;
home=function(){
 const old=expeditionHome(), end=old.indexOf('</section>',old.indexOf('<section class="hero">'))+10;
 const remainder=old.slice(end), scene=new URL(expeditionBright?'bright/assets/daylight-gateway-v2.webp':'assets/adventure-guild-v2.webp',expeditionBase).href;
 return `${guideStrip()}<section class="quest-scene" aria-label="本周任务日志"><img class="quest-landscape" ${artSources(scene)} width="1536" height="1024" alt="${expeditionBright?'晴空下的白石城门、拱桥与蓝色群山':'暖阳下的冒险公会、金色树林与溪流石桥'}" fetchpriority="high"><div class="scene-heading"><span>AI BUILDER SCHOOL</span><small>第一章 · 相识与表达</small></div><div class="quest-log"><div class="log-tab">任务日志</div><div class="log-meta"><span>WEEK 01</span><span>${status()}</span></div><h1>第一站：<br>让伙伴认识你</h1><p>做一个属于你的个人主页，<br>留下你想分享的故事。</p><button class="primary" data-action="${saved.versions.length?'mywork':saved.draft.title?'submit':'task'}">${saved.versions.length?'查看我的作品':saved.draft.title?'继续我的草稿':'打开本周任务'} ${icon('arrow',15)}</button></div><span class="scene-coordinate" aria-hidden="true">CHAPTER I · THE BEGINNING</span></section>${remainder}`;
};
const journeyStops=[
 {x:16,y:29,artifact:'一份可打开的个人主页',deliverable:'自我介绍、个性头像，以及一个能分享的网页。'},
 {x:39,y:22,artifact:'一件多媒体小作品',deliverable:'用漫画、短视频或小游戏，表达一个自己的想法。'},
 {x:62,y:29,artifact:'一份需求洞察与初步原型',deliverable:'从身边人的真实经历里，找到一个值得解决的问题。'},
 {x:85,y:23,artifact:'一份真实场景调研记录',deliverable:'通过案主访谈和案例分析，理解问题发生的条件。'},
 {x:85,y:70,artifact:'一份小组项目约定',deliverable:'把选题、项目边界与伙伴分工说清楚。'},
 {x:62,y:77,artifact:'一个可试用的原型',deliverable:'让使用者实际操作，收集第一轮具体反馈。'},
 {x:39,y:69,artifact:'一版经过试用的改进作品',deliverable:'记录遇到的问题，修复最影响使用的部分。'},
 {x:16,y:76,artifact:'一份展示与交接材料',deliverable:'讲清作品如何使用，把成果和过程交到需要的人手里。'}
];
function journeyDetail(){
 const i=journeySelection,w=weeks[i],s=journeyStops[i],hasWork=saved.versions.length>0;
 const hasFeedback=saved.feedback.some(f=>f.work==='mine'&&f.version===saved.versions.length);
 return `<div class="detail-topline"><span>WEEK 0${i+1}</span><span class="detail-status ${i===0?'available':''}">${i===0?'当前周':'方向预览'}</span></div><h2 id="journey-detail-title">${w[0]}</h2><p class="detail-intro">${w[2]}</p><div class="journey-output"><span>${i===0?'这周留下':'本周目标'}</span><h3>${s.artifact}</h3><p>${s.deliverable}</p></div>${i===0?`<div class="journey-actions-list" aria-label="本周行动"><button data-action="task"><span class="action-number">01</span><span>看任务与完成标准</span><span aria-hidden="true">↗</span></button><button data-resource="2"><span class="action-number">02</span><span>打开网页制作锦囊</span><span aria-hidden="true">↗</span></button><button data-action="${hasWork?'mywork':'submit'}"><span class="action-number">03</span><span>${hasWork?'回看作品与反馈':'提交第一版作品'}</span><span aria-hidden="true">↗</span></button></div><div class="journey-state"><i></i>${hasWork?`已保存 v${saved.versions.length} · ${hasFeedback?'有反馈可回看':'等待反馈'}`:saved.draft.title?'有一份草稿，可以接着写':'还没提交，先从第一版开始'}</div><button class="primary journey-cta" data-action="${hasWork?'mywork':saved.draft.title?'submit':'task'}">${hasWork?'打开我的作品':saved.draft.title?'继续我的草稿':'开始本周任务'} ${icon('arrow',16)}</button>`:`<div class="journey-preview-note">先看看接下来会走向哪里。<br>本周任务尚未发布，请先完成当前周的任务。</div><button class="ghost journey-cta" data-journey-week="0">回到当前周 ${icon('arrow',16)}</button>`}<div class="detail-chapter">${w[3]} <span>CHAPTER ${i<2?'I':i<4?'II':'III'}</span></div>`;
}
function journeyArchive(){const v=saved.versions.at(-1);return `<section class="journey-archive"><div class="archive-emblem" aria-hidden="true">${icon('bag',27)}</div><div><span class="archive-eyebrow">沿途留下的作品</span><h2>${v?esc(v.title):'下一次回来，能看见自己的变化。'}</h2><p>${v?`W1 · 已保存 ${saved.versions.length} 个版本 · ${saved.feedback.filter(f=>f.work==='mine').length} 条反馈`:'第一件作品、收到的建议、每一次修改，都会留在背包里。'}</p></div><button class="ghost" ${v?'data-action="mywork"':'data-page="profile"'}>${v?'回看作品与版本':'打开我的背包'} ${icon('arrow',15)}</button></section>`;}
mapPage=function(){return `<div class="journey-heading"><div><span class="journey-eyebrow">THE BUILDER'S ATLAS</span><h1>八周，一段创造之旅。</h1><p>从自己的第一个作品，走向真实世界里的问题。</p></div><button class="journey-return" data-journey-week="0"><span class="current-dot"></span>当前 · W1 <span aria-hidden="true">↗</span></button></div><div class="journey-layout"><section class="journey-world ${journeyPaused?'is-paused':''}" aria-label="八周路线地图"><div class="world-toolbar"><span>旅程地图 <small>· 点击路标查看任务</small></span><button data-journey-motion aria-pressed="${journeyPaused}" aria-label="${journeyPaused?'开启动效':'暂停动效'}">${journeyPaused?'开启动效':'暂停动效'}</button></div><div class="world-canvas"><img class="world-image" ${artSources(expeditionAssets+"journey-world.webp")} width="1536" height="1024" alt="八周旅程的像素世界：小镇、创作庭院、桥梁、工坊、会堂、高塔、图书馆与港口沿石路相连。" fetchpriority="high"><span class="world-mote mote-one" aria-hidden="true"></span><span class="world-mote mote-two" aria-hidden="true"></span><span class="world-mote mote-three" aria-hidden="true"></span>${journeyStops.map((s,i)=>`<button class="world-stop ${i===journeySelection?'is-selected':''} ${i===0?'is-current':''}" style="--stop-x:${s.x}%;--stop-y:${s.y}%" data-journey-week="${i}" aria-pressed="${i===journeySelection}" aria-controls="journey-detail" aria-label="W${i+1} ${weeks[i][0]}，${i===0?'当前周':'课程方向预览'}"><span class="stop-marker">${String(i+1).padStart(2,'0')}</span><span class="stop-label"><small>W${i+1}</small>${weeks[i][0]}</span>${i===0?'<span class="stop-current">你在这里</span>':''}</button>`).join('')}<span class="world-compass" aria-hidden="true">N<br>✧</span></div><div class="world-legend"><span><i class="legend-current"></i> 当前周</span><span><i></i> 方向预览</span><span class="world-caption">每一站，留下一件作品。</span></div></section><aside class="journey-detail" id="journey-detail" aria-labelledby="journey-detail-title">${journeyDetail()}</aside></div><nav class="journey-chapters" aria-label="课程阶段"><div><span>01—02</span><strong>为自己做</strong><p>从兴趣出发，让想法有形状。</p></div><div><span>03—04</span><strong>为身边人做</strong><p>听见真实需要，走进具体场景。</p></div><div><span>05—08</span><strong>与伙伴共创</strong><p>一起试用、修改、展示与交接。</p></div></nav>${journeyArchive()}<p class="journey-footnote">W2–W8 的任务尚未发布。作品与反馈保存在当前浏览器。</p>`;}
function selectJourneyWeek(index){
 if(!Number.isInteger(index)||index<0||index>=weeks.length)return;
 journeySelection=index;
 document.querySelectorAll('.world-stop').forEach(el=>{const active=Number(el.dataset.journeyWeek)===index;el.classList.toggle('is-selected',active);el.setAttribute('aria-pressed',String(active));});
 const detail=$('#journey-detail');
 if(detail){const returnFocus=detail.contains(document.activeElement);detail.innerHTML=journeyDetail();if(returnFocus){const heading=$('#journey-detail-title');heading.tabIndex=-1;heading.focus({preventScroll:true});}}
}
document.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-guide-next')){
  guideLine=(guideLine+1)%guideTips.length;const tip=guideTips[guideLine];
  $('#guide-line').textContent=tip.text;$('#guide-count').textContent=`${guideLine+1} / 4`;
  const action=$('#guide-action');['action','resource','page'].forEach(k=>delete action.dataset[k]);
  if(tip.action)action.dataset.action=tip.action;else if(tip.resource)action.dataset.resource=tip.resource;else action.dataset.page=tip.page;
  action.innerHTML=`${tip.label} <span aria-hidden="true">↗</span>`;
  const img=$('.guide-character img');img.classList.remove('npc-greeting');void img.offsetWidth;img.classList.add('npc-greeting');
 }
 if(button.dataset.journeyWeek!==undefined)selectJourneyWeek(Number(button.dataset.journeyWeek));
 if(button.hasAttribute('data-journey-motion')){
  journeyPaused=!journeyPaused;$('.journey-world').classList.toggle('is-paused',journeyPaused);
  button.setAttribute('aria-pressed',String(journeyPaused));button.setAttribute('aria-label',journeyPaused?'开启动效':'暂停动效');button.textContent=journeyPaused?'开启动效':'暂停动效';
 }
});
// Fast delivery copies have original PNG fallbacks. Never retry in a loop.
function updateArtworkNotice(){
 const failed=document.querySelectorAll('img[data-art-failed]');
 let notice=$('#artwork-notice');
 if(!failed.length){notice?.remove();return;}
 if(!notice){notice=document.createElement('div');notice.id='artwork-notice';notice.className='artwork-notice';notice.setAttribute('role','status');notice.innerHTML='<span>有图片暂时没有加载出来。</span><button class="ghost" data-retry-artwork>重新加载图片</button>';$('#page-content')?.prepend(notice);}
}
function retryArtwork(){
 document.querySelectorAll('img[data-art-failed]').forEach(img=>{delete img.dataset.artFailed;delete img.dataset.artRetried;const src=new URL(img.dataset.artPrimary);src.searchParams.set('retry',Date.now());img.src=src.href;});
 updateArtworkNotice();
}
document.addEventListener('error',event=>{
 const img=event.target;if(!img.matches?.('img[data-art-primary]'))return;
 if(!img.dataset.artRetried){img.dataset.artRetried='1';img.src=img.dataset.artFallback;return;}
 img.dataset.artFailed='1';updateArtworkNotice();
},true);
document.addEventListener('load',event=>{const img=event.target;if(!img.matches?.('img[data-art-primary]'))return;delete img.dataset.artFailed;updateArtworkNotice();},true);
document.addEventListener('click',event=>{if(event.target.closest('[data-retry-artwork]'))retryArtwork();});
window.addEventListener('online',retryArtwork);
// Initial rendering runs after experience.js and realm.js.
