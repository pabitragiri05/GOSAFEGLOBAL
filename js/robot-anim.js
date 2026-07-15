/* =====================================================================
   GoSafe Global – Robot Animation
   Walk → kick WhatsApp → return → ladder climb → Hii → loop
   ===================================================================== */
(function () {
  'use strict';

  /* ── 1. CSS ── */
  document.head.insertAdjacentHTML('beforeend', `<style>
  #gs-robo-wrap{position:fixed;bottom:24px;right:24px;z-index:9997;pointer-events:none;flex-direction:column;align-items:center;display:none}
  .gs-robo-bubble{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;padding:6px 14px;border-radius:14px;border:2px solid #f59e0b;background:#fff;color:#4c1d95;white-space:nowrap;margin-bottom:8px;box-shadow:0 4px 18px rgba(0,0,0,.25);position:relative;transform:scale(0);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
  .gs-robo-bubble.show{transform:scale(1)}
  .gs-robo-bubble::after{content:'';position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);border:7px solid transparent;border-top-color:#f59e0b;border-bottom:0}
  .gs-robo{display:flex;flex-direction:column;align-items:center;width:64px;filter:drop-shadow(0 8px 18px rgba(109,40,217,.5))}
  .gs-robo-ant{width:3px;height:14px;background:#f59e0b;border-radius:2px;position:relative}
  .gs-robo-ant::before{content:'';position:absolute;top:-7px;left:50%;transform:translateX(-50%);width:10px;height:10px;background:#ef4444;border-radius:50%;box-shadow:0 0 8px rgba(239,68,68,.9);animation:gs-ant-blink 1.5s ease-in-out infinite}
  @keyframes gs-ant-blink{0%,100%{opacity:1}50%{opacity:.25}}
  .gs-robo-head{width:46px;height:38px;background:linear-gradient(135deg,#7c3aed,#4c1d95);border-radius:12px;border:2.5px solid #f59e0b;display:flex;align-items:center;justify-content:center;gap:7px;position:relative}
  .gs-robo-eye{width:9px;height:11px;background:#60a5fa;border-radius:3px;box-shadow:0 0 8px rgba(96,165,250,.9);animation:gs-eye-blink 4s ease-in-out infinite}
  .gs-robo-eye:last-of-type{animation-delay:.2s}
  @keyframes gs-eye-blink{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(.06)}}
  .gs-robo-mouth{position:absolute;bottom:6px;width:18px;height:4px;background:#f59e0b;border-radius:2px}
  .gs-robo-neck{width:10px;height:6px;background:#5b21b6}
  .gs-robo-mid{display:flex;align-items:center;gap:3px}
  .gs-robo-arm{width:11px;height:30px;background:linear-gradient(180deg,#7c3aed,#5b21b6);border-radius:5px;border:1.5px solid rgba(245,158,11,.5);transform-origin:top center}
  .gs-robo-torso{width:52px;height:44px;background:linear-gradient(135deg,#6d28d9,#4c1d95);border-radius:8px;border:2.5px solid #f59e0b;display:flex;align-items:center;justify-content:center}
  .gs-robo-orb{width:22px;height:22px;background:radial-gradient(circle at 35% 35%,#fde68a,#f59e0b 60%,#d97706);border-radius:50%;box-shadow:0 0 14px rgba(245,158,11,.9);animation:gs-orb-pulse 2s ease-in-out infinite}
  @keyframes gs-orb-pulse{0%,100%{box-shadow:0 0 14px rgba(245,158,11,.9)}50%{box-shadow:0 0 26px rgba(245,158,11,1)}}
  .gs-robo-legs{display:flex;gap:10px;margin-top:1px}
  .gs-leg-l,.gs-leg-r{display:flex;flex-direction:column;align-items:center;transform-origin:top center}
  .gs-robo-thigh{width:16px;height:20px;background:linear-gradient(180deg,#5b21b6,#4c1d95);border-radius:4px 4px 0 0;border:1.5px solid rgba(245,158,11,.4)}
  .gs-robo-shin{width:14px;height:18px;background:linear-gradient(180deg,#4c1d95,#3b0e8c);border-radius:0 0 4px 4px;border:1.5px solid rgba(245,158,11,.3)}
  .gs-robo-foot{width:20px;height:8px;background:#f59e0b;border-radius:4px;margin-top:-1px;box-shadow:0 2px 6px rgba(245,158,11,.5)}
  #gs-robo-wrap.walk .gs-leg-l{animation:gs-wl-a .32s ease-in-out infinite alternate}
  #gs-robo-wrap.walk .gs-leg-r{animation:gs-wl-b .32s ease-in-out infinite alternate}
  #gs-robo-wrap.walk .gs-arm-l{animation:gs-wl-b .32s ease-in-out infinite alternate}
  #gs-robo-wrap.walk .gs-arm-r{animation:gs-wl-a .32s ease-in-out infinite alternate}
  @keyframes gs-wl-a{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
  @keyframes gs-wl-b{from{transform:rotate(22deg)}to{transform:rotate(-22deg)}}
  #gs-robo-wrap.kick .gs-leg-r{animation:gs-kick .55s ease-in-out forwards}
  #gs-robo-wrap.kick .gs-arm-l{animation:gs-kick-arm .55s ease-in-out forwards}
  @keyframes gs-kick{0%{transform:rotate(0)}20%{transform:rotate(-25deg)}55%{transform:rotate(65deg)}100%{transform:rotate(0)}}
  @keyframes gs-kick-arm{0%{transform:rotate(0)}30%{transform:rotate(40deg)}100%{transform:rotate(0)}}
  #gs-robo-wrap.climb .gs-leg-l{animation:gs-cl-a .4s ease-in-out infinite alternate}
  #gs-robo-wrap.climb .gs-leg-r{animation:gs-cl-b .4s ease-in-out infinite alternate}
  #gs-robo-wrap.climb .gs-arm-l{animation:gs-cl-c .4s ease-in-out infinite alternate}
  #gs-robo-wrap.climb .gs-arm-r{animation:gs-cl-d .4s ease-in-out infinite alternate}
  @keyframes gs-cl-a{from{transform:rotate(-38deg)}to{transform:rotate(8deg)}}
  @keyframes gs-cl-b{from{transform:rotate(8deg)}to{transform:rotate(-38deg)}}
  @keyframes gs-cl-c{from{transform:rotate(-55deg)}to{transform:rotate(12deg)}}
  @keyframes gs-cl-d{from{transform:rotate(12deg)}to{transform:rotate(-55deg)}}
  #gs-robo-wrap.wave .gs-arm-r{animation:gs-wave .38s ease-in-out 5 alternate}
  @keyframes gs-wave{from{transform:rotate(-8deg)}to{transform:rotate(65deg)}}
  #gs-ladder-el{position:fixed;right:46px;z-index:9996;pointer-events:none;display:none;flex-direction:column;justify-content:space-between;width:32px}
  .gs-post{position:absolute;top:0;bottom:0;width:4px;border-radius:2px;background:linear-gradient(180deg,rgba(245,158,11,.95),rgba(217,119,6,.6))}
  .gs-post.l{left:0}.gs-post.r{right:0}
  .gs-ladder-rung{width:100%;height:5px;background:#f59e0b;border-radius:3px;box-shadow:0 2px 6px rgba(245,158,11,.55);transform:scaleX(0);transition:transform .1s ease-out;position:relative;z-index:1}
  .gs-ladder-rung.show{transform:scaleX(1)}
  #gs-burst-ring{position:fixed;bottom:14px;right:14px;width:84px;height:84px;border-radius:50%;border:3px solid #f59e0b;pointer-events:none;opacity:0;z-index:10001}
  #gs-burst-ring.pop{animation:gs-burst .55s ease-out forwards}
  @keyframes gs-burst{0%{transform:scale(1);opacity:1}100%{transform:scale(3.2);opacity:0}}
  </style>`);

  /* ── 2. HTML ── */
  const RUNGS = 12;
  document.body.insertAdjacentHTML('beforeend', `
  <div id="gs-robo-wrap">
    <div class="gs-robo-bubble" id="gs-robo-bubble">Hii! 👋</div>
    <div class="gs-robo">
      <div class="gs-robo-ant"></div>
      <div class="gs-robo-head">
        <div class="gs-robo-eye"></div>
        <div class="gs-robo-eye"></div>
        <div class="gs-robo-mouth"></div>
      </div>
      <div class="gs-robo-neck"></div>
      <div class="gs-robo-mid">
        <div class="gs-robo-arm gs-arm-l"></div>
        <div class="gs-robo-torso"><div class="gs-robo-orb"></div></div>
        <div class="gs-robo-arm gs-arm-r"></div>
      </div>
      <div class="gs-robo-legs">
        <div class="gs-leg-l"><div class="gs-robo-thigh"></div><div class="gs-robo-shin"></div><div class="gs-robo-foot"></div></div>
        <div class="gs-leg-r"><div class="gs-robo-thigh"></div><div class="gs-robo-shin"></div><div class="gs-robo-foot"></div></div>
      </div>
    </div>
  </div>
  <div id="gs-ladder-el">
    <div class="gs-post l"></div><div class="gs-post r"></div>
    ${Array.from({length:12},(_,i)=>`<div class="gs-ladder-rung" data-i="${i}"></div>`).join('')}
  </div>
  <div id="gs-burst-ring"></div>`);

  /* ── 3. Refs ── */
  const launcher = document.getElementById('gs-chat-launcher');
  const wrap     = document.getElementById('gs-robo-wrap');
  const bubble   = document.getElementById('gs-robo-bubble');
  const ladderEl = document.getElementById('gs-ladder-el');
  const burstEl  = document.getElementById('gs-burst-ring');
  const rungs    = Array.from(ladderEl.querySelectorAll('.gs-ladder-rung'));
  if (!launcher || !wrap) return;

  /* ── 4. Helpers ── */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function doBurst(){burstEl.classList.remove('pop');void burstEl.offsetWidth;burstEl.classList.add('pop')}
  function showBot(){launcher.style.opacity='0';launcher.style.pointerEvents='none';wrap.style.display='flex'}
  function hideBot(){
    wrap.style.display='none';
    launcher.style.opacity='1';launcher.style.pointerEvents='auto';
    wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
    ['walk','kick','climb','wave'].forEach(c=>wrap.classList.remove(c));
    bubble.classList.remove('show');
  }
  function setMode(m){['walk','kick','climb','wave'].forEach(c=>wrap.classList.remove(c));if(m)wrap.classList.add(m)}
  function chatOpen(){const p=document.getElementById('gs-chat-popup');return p&&p.classList.contains('gs-active')}

  /* ── 5. Phase 1: Walk & Kick WhatsApp ── */
  async function phase1(){
    if(chatOpen())return;
    doBurst();
    wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
    showBot();await sleep(350);
    const waBtn=document.querySelector('.whatsapp-float');
    let destRight=waBtn?(window.innerWidth-waBtn.getBoundingClientRect().right-4):window.innerWidth-200;
    destRight=Math.max(destRight,4);
    const travelPx=window.innerWidth-24-destRight-64;
    const walkDur=Math.max(travelPx/140,1.2);
    wrap.style.transform='scaleX(-1)';setMode('walk');
    wrap.style.transition=`right ${walkDur}s linear`;wrap.style.right=destRight+'px';
    await sleep(walkDur*1000+80);
    setMode('');wrap.style.transform='scaleX(-1)';await sleep(60);
    setMode('kick');
    if(waBtn){
      waBtn.style.transition='transform .15s ease';waBtn.style.transform='translateX(18px) rotate(10deg)';
      setTimeout(()=>{waBtn.style.transform='translateX(-6px) rotate(-4deg)'},180);
      setTimeout(()=>{waBtn.style.transform='translateX(4px)'},330);
      setTimeout(()=>{waBtn.style.transform='';waBtn.style.transition=''},480);
    }
    await sleep(700);
    setMode('');wrap.style.transform='scaleX(1)';await sleep(60);
    setMode('walk');wrap.style.transition=`right ${walkDur}s linear`;wrap.style.right='24px';
    await sleep(walkDur*1000+80);
    setMode('');doBurst();await sleep(350);hideBot();
    await sleep(2000);
  }

  /* ── 6. Phase 2: Ladder Climb ── */
  async function phase2(){
    if(chatOpen())return;
    const headerEl=document.getElementById('header')||document.querySelector('header');
    const headerBot=headerEl?headerEl.getBoundingClientRect().bottom:80;
    const climbPx=Math.max(window.innerHeight-24-130-headerBot-10,180);
    ladderEl.style.height=climbPx+'px';ladderEl.style.bottom=(24+130)+'px';ladderEl.style.display='flex';
    const rungDesc=[...rungs].reverse();
    for(const r of rungDesc){r.classList.add('show');await sleep(55)}
    await sleep(250);
    if(chatOpen()){await retractLadder();return}
    doBurst();
    wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
    showBot();await sleep(350);
    const climbDur=climbPx/90;
    setMode('climb');wrap.style.transition=`bottom ${climbDur}s linear`;wrap.style.bottom=(24+climbPx)+'px';
    await sleep(climbDur*1000+80);
    setMode('');bubble.classList.add('show');setMode('wave');
    await sleep(2000);
    bubble.classList.remove('show');setMode('');await sleep(200);
    setMode('climb');wrap.style.transition=`bottom ${climbDur}s linear`;wrap.style.bottom='24px';
    await sleep(climbDur*1000+80);
    setMode('');doBurst();await sleep(350);hideBot();
    await retractLadder();
    await sleep(2000);
  }

  async function retractLadder(){
    for(const r of rungs){r.classList.remove('show');await sleep(45)}
    ladderEl.style.display='none';
  }

  /* ── 7. Loop ── */
  async function loop(){
    await sleep(3500);
    while(true){
      if(!chatOpen())await phase1();else{await sleep(1200);continue}
      if(!chatOpen())await phase2();else await sleep(1200);
    }
  }
  loop();
})();
