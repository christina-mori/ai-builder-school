// Keep native wheel, trackpad, touch and keyboard scrolling.
document.addEventListener('click',e=>{const a=e.target.closest('.theme-swatch');if(a)a.href=a.href.split('#')[0]+(location.hash||'#home');});
let navigationCompact=false,navigationFrame=0;
const desktopNavigation=window.matchMedia('(min-width:681px)');
function updateNavigation(){
 navigationFrame=0;
 const expanded=document.querySelector('.sidebar'),compact=document.querySelector('.compact-navigation');
 if(!expanded||!compact)return;
 let next=navigationCompact;
 if(!desktopNavigation.matches||document.body.classList.contains('onboarding-open'))next=false;
 else if(window.scrollY>64)next=true;
 else if(window.scrollY<16)next=false;
 navigationCompact=next;
 // These changes only affect a fixed overlay. The original header stays in flow.
 const visible=compact.classList.contains('is-visible');
 if(visible!==next){compact.classList.toggle('is-visible',next);compact.toggleAttribute('inert',!next);compact.setAttribute('aria-hidden',String(!next));}
 expanded.toggleAttribute('inert',next);expanded.setAttribute('aria-hidden',String(next));
}
function requestNavigationUpdate(){if(!navigationFrame)navigationFrame=requestAnimationFrame(updateNavigation);}
window.addEventListener('scroll',requestNavigationUpdate,{passive:true});
window.addEventListener('resize',requestNavigationUpdate);
new MutationObserver(requestNavigationUpdate).observe(document.body,{attributes:true,attributeFilter:['class']});
const renderBeforeStickyNavigation=render;
render=function(){renderBeforeStickyNavigation();updateNavigation();};
updateNavigation();
