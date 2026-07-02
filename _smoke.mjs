import { chromium, devices } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({...devices['iPhone 13']}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(''+e));
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(400);
const safeTop=await p.evaluate(()=>document.documentElement.style.getPropertyValue('--safe-top'));
const pad=await p.evaluate(()=>getComputedStyle(document.querySelector('.menu-overlay')).paddingTop);
// Simulate the iOS standalone fallback path: env()=0 + standalone true.
const fallback=await p.evaluate(()=>{
  Object.defineProperty(navigator,'standalone',{value:true,configurable:true});
  const probe=document.createElement('div');
  probe.style.cssText='position:fixed;left:0;width:0;height:0;visibility:hidden;top:env(safe-area-inset-top,0px)';
  document.documentElement.appendChild(probe);
  const t=probe.offsetTop; probe.remove();
  const h=Math.max(screen.height,screen.width);
  return {envTop:t, wouldUse: t===0 ? (h>=852?59:h>=812?47:20) : t, screenH:h};
});
console.log(JSON.stringify({safeTop, menuPaddingTop:pad, fallback, errs},null,2));
await b.close();
