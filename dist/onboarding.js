/* First signed-in visit: a dismissible tour, remembered with the local profile. */
'use strict';
const onboardingSteps=[
 {selector:'.mission-grid .mission-card',title:'查看本周任务',text:'这里列出本周要完成的任务。打开任务，查看要求和提交内容。'},
 {selector:'.home-kit-heading',title:'查阅配套锦囊',text:'制作方法和参考资料放在锦囊里，点击卡片即可打开。'},
 {selector:'.nav [data-page="gallery"]',title:'看看伙伴的作品',text:'在广场查看作品、认识伙伴，也可以分享具体的使用建议。'},
 {selector:'.nav [data-page="profile"]',title:'管理自己的作品',text:'在“我的”中修改资料，查看提交的作品、反馈和版本记录。'}
];
let onboardingIndex=0,onboardingRoot=null,onboardingFrame=0;
function positionOnboarding(){
 if(!onboardingRoot)return;
 const target=document.querySelector(onboardingSteps[onboardingIndex].selector);
 if(!target)return;
 const panel=onboardingRoot.querySelector('.onboarding-panel'),spot=onboardingRoot.querySelector('.onboarding-spotlight');
 const bounds=onboardingRoot.getBoundingClientRect(),w=onboardingRoot.clientWidth,h=onboardingRoot.clientHeight;
 const sx=w/bounds.width,sy=h/bounds.height,margin=16,pad=6;
 const mobile=w<=680,navTarget=!!target.closest('.nav');
 const targetRect=target.getBoundingClientRect();
 // Reload scroll restoration and late font layout can move the target after paint.
 if(!navTarget&&(targetRect.top<12||targetRect.top>h-64)){
  const before=window.scrollY;window.scrollBy({top:targetRect.top-20,behavior:'instant'});
  if(window.scrollY!==before){requestAnimationFrame(positionOnboarding);return;}
 }
 const focusTarget=mobile&&h<=520?(target.querySelector('h3')||target):target;
 const r=focusTarget.getBoundingClientRect();
 const clamp=(value,min,max)=>Math.max(min,Math.min(value,Math.max(min,max)));
 const left=clamp((r.left-bounds.left)*sx-pad,8,w-8),top=clamp((r.top-bounds.top)*sy-pad,8,h-8);
 const right=clamp((r.right-bounds.left)*sx+pad,left,w-8),bottom=clamp((r.bottom-bounds.top)*sy+pad,top,h-8);
 Object.assign(spot.style,{left:left+'px',top:top+'px',width:(right-left)+'px',height:(bottom-top)+'px'});
 onboardingRoot.classList.toggle('onboarding-mobile',mobile);
 onboardingRoot.classList.toggle('onboarding-nav-step',navTarget);
 const nav=document.querySelector('.nav');
 onboardingRoot.style.setProperty('--tour-nav-height',navTarget&&nav?Math.max(0,h-(nav.getBoundingClientRect().top-bounds.top)*sy)+'px':'0px');
 // The overlay is the containing block; CSS also clamps the panel independently.
 const width=panel.offsetWidth,height=panel.offsetHeight;
 let x=clamp(left,margin,w-width-margin),y;
 if(bottom+16+height<=h-margin)y=bottom+16;
 else if(top-16-height>=margin)y=top-height-16;
 else {x=right+16+width<=w-margin?right+16:left-16-width>=margin?left-16-width:x;y=clamp(top,margin,h-height-margin);}
 onboardingRoot.style.setProperty('--tour-x',x+'px');
 onboardingRoot.style.setProperty('--tour-y',clamp(y,margin,h-height-margin)+'px');
 onboardingRoot.style.setProperty('--tour-height',height+'px');
}
function paintOnboarding(){
 const step=onboardingSteps[onboardingIndex];
 onboardingRoot.innerHTML=`<div class="onboarding-spotlight" aria-hidden="true"></div><section class="onboarding-panel" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-text"><div class="onboarding-meta"><span>${onboardingIndex+1} / ${onboardingSteps.length}</span><button data-tour="skip">跳过指引</button></div><h2 id="onboarding-title">${step.title}</h2><p id="onboarding-text">${step.text}</p><div class="onboarding-actions">${onboardingIndex?'<button class="ghost" data-tour="back">上一步</button>':''}<button class="primary" data-tour="next">${onboardingIndex===onboardingSteps.length-1?'开始使用':'下一步'}</button></div></section>`;
 const target=document.querySelector(step.selector);
 if(target&&getComputedStyle(target.closest('.nav')||target).position!=='fixed'){target.scrollIntoView({block:'start',behavior:'instant'});window.scrollBy({top:-20,behavior:'instant'});}
 positionOnboarding();onboardingResizeObserver.disconnect();onboardingResizeObserver.observe(onboardingRoot.querySelector('.onboarding-panel'));onboardingResizeObserver.observe(onboardingRoot);
 requestAnimationFrame(positionOnboarding);document.fonts?.ready.then(positionOnboarding);
 onboardingRoot.querySelector('[data-tour="next"]').focus({preventScroll:true});
}
function finishOnboarding(){
 if(!onboardingRoot)return;
 saved.welcomeGuideCompleted=true;persist();
 onboardingResizeObserver.disconnect();onboardingRoot.remove();onboardingRoot=null;document.querySelector('#app').inert=false;
 document.body.classList.remove('onboarding-open');window.scrollTo({top:0,behavior:'instant'});
 document.querySelector('.nav [data-page="home"]')?.focus({preventScroll:true});
}
function maybeStartOnboarding(){
 if(onboardingRoot||saved.welcomeGuideCompleted||!saved.demoAccount.signedIn||page!=='home')return;
 onboardingIndex=0;onboardingRoot=document.createElement('div');
 onboardingRoot.className='onboarding';document.body.append(onboardingRoot);
 document.querySelector('#app').inert=true;document.body.classList.add('onboarding-open');paintOnboarding();
}
const renderBeforeOnboarding=render;
render=function(){renderBeforeOnboarding();cancelAnimationFrame(onboardingFrame);onboardingFrame=requestAnimationFrame(maybeStartOnboarding);};
const finishAuthBeforeOnboarding=finishAuth;
finishAuth=function(e){finishAuthBeforeOnboarding(e);if(saved.demoAccount.signedIn&&!saved.welcomeGuideCompleted&&page!=='login')go('home');};
document.addEventListener('click',e=>{const action=e.target.closest('[data-tour]')?.dataset.tour;if(!action||!onboardingRoot)return;if(action==='skip'||action==='next'&&onboardingIndex===onboardingSteps.length-1){finishOnboarding();return;}onboardingIndex+=action==='back'?-1:1;paintOnboarding();});
document.addEventListener('keydown',e=>{if(!onboardingRoot)return;if(e.key==='Escape'){e.preventDefault();finishOnboarding();}if(e.key==='Tab'){const buttons=[...onboardingRoot.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('load',()=>requestAnimationFrame(positionOnboarding));
window.addEventListener('resize',positionOnboarding);window.addEventListener('scroll',positionOnboarding,{passive:true});
window.visualViewport?.addEventListener('resize',positionOnboarding);
window.visualViewport?.addEventListener('scroll',positionOnboarding);
const onboardingResizeObserver=new ResizeObserver(()=>{if(onboardingRoot)positionOnboarding();});

maybeStartOnboarding();
