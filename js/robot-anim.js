/* =====================================================================
   GoSafe Global – Robot Animation v3
   - Slower, natural walk gait
   - Arms grip ladder rails; step-by-step rung climbing
   ===================================================================== */
(function () {
  'use strict';

  document.head.insertAdjacentHTML('beforeend', `<style>
  #gs-robo-wrap{position:fixed;bottom:24px;right:24px;z-index:9997;pointer-events:none;flex-direction:column;align-items:center;display:none}

  .gs-robo-bubble{font-family:'Inter',sans-serif;font-size:12px;font-weight:700;padding:5px 12px;border-radius:12px;border:2px solid #f59e0b;background:#fff;color:#4c1d95;white-space:nowrap;margin-bottom:7px;box-shadow:0 3px 14px rgba(0,0,0,.22);position:relative;transform:scale(0);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
  .gs-robo-bubble.show{transform:scale(1)}
  .gs-robo-bubble::after{content:'';position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#f59e0b;border-bottom:0}

  .gs-robo{display:flex;flex-direction:column;align-items:center;width:44px;filter:drop-shadow(0 6px 14px rgba(109,40,217,.55))}
  .gs-robo-ant{width:2px;height:10px;background:#f59e0b;border-radius:2px;position:relative}
  .gs-robo-ant::before{content:'';position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:7px;height:7px;background:#ef4444;border-radius:50%;box-shadow:0 0 7px rgba(239,68,68,.9);animation:gs-ant-blink 1.5s ease-in-out infinite}
  @keyframes gs-ant-blink{0%,100%{opacity:1}50%{opacity:.2}}
  .gs-robo-head{width:32px;height:26px;background:linear-gradient(135deg,#7c3aed,#4c1d95);border-radius:9px;border:2px solid #f59e0b;display:flex;align-items:center;justify-content:center;gap:5px;position:relative}
  .gs-robo-eye{width:6px;height:7px;background:#60a5fa;border-radius:2px;box-shadow:0 0 6px rgba(96,165,250,.9);animation:gs-eye-blink 4s ease-in-out infinite}
  .gs-robo-eye:last-of-type{animation-delay:.2s}
  @keyframes gs-eye-blink{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(.06)}}
  .gs-robo-mouth{position:absolute;bottom:4px;width:12px;height:3px;background:#f59e0b;border-radius:2px}
  .gs-robo-neck{width:7px;height:4px;background:#5b21b6}
  .gs-robo-mid{display:flex;align-items:center;gap:2px}
  .gs-robo-arm{width:8px;height:20px;background:linear-gradient(180deg,#7c3aed,#5b21b6);border-radius:4px;border:1px solid rgba(245,158,11,.5);transform-origin:top center}
  .gs-robo-torso{width:36px;height:30px;background:linear-gradient(135deg,#6d28d9,#4c1d95);border-radius:6px;border:2px solid #f59e0b;display:flex;align-items:center;justify-content:center}
  .gs-robo-orb{width:14px;height:14px;background:radial-gradient(circle at 35% 35%,#fde68a,#f59e0b 60%,#d97706);border-radius:50%;box-shadow:0 0 10px rgba(245,158,11,.9);animation:gs-orb-pulse 2s ease-in-out infinite}
  @keyframes gs-orb-pulse{0%,100%{box-shadow:0 0 10px rgba(245,158,11,.9)}50%{box-shadow:0 0 20px rgba(245,158,11,1)}}
  .gs-robo-legs{display:flex;gap:7px;margin-top:1px}
  .gs-leg-l,.gs-leg-r{display:flex;flex-direction:column;align-items:center;transform-origin:top center}
  .gs-robo-thigh{width:11px;height:13px;background:linear-gradient(180deg,#5b21b6,#4c1d95);border-radius:3px 3px 0 0;border:1px solid rgba(245,158,11,.4)}
  .gs-robo-shin{width:10px;height:12px;background:linear-gradient(180deg,#4c1d95,#3b0e8c);border-radius:0 0 3px 3px;border:1px solid rgba(245,158,11,.3)}
  .gs-robo-foot{width:14px;height:5px;background:#f59e0b;border-radius:3px;margin-top:-1px;box-shadow:0 2px 5px rgba(245,158,11,.5)}

  /* ════════════════════════════════════════════
     WALK – slower, natural 0.85s gait cycle
  ════════════════════════════════════════════ */
  #gs-robo-wrap.walk .gs-robo{animation:gs-body-bob .85s ease-in-out infinite}
  @keyframes gs-body-bob{
    0%,100%{transform:translateY(0) rotate(1.5deg)}
    25%,75%{transform:translateY(-2px) rotate(0.5deg)}
    50%    {transform:translateY(1px) rotate(-1deg)}
  }
  #gs-robo-wrap.walk .gs-leg-l{animation:gs-gait-l .85s ease-in-out infinite}
  @keyframes gs-gait-l{
    0%  {transform:rotate(-22deg)}
    18% {transform:rotate(-8deg)}
    45% {transform:rotate(22deg)}
    65% {transform:rotate(16deg)}
    82% {transform:rotate(2deg)}
    100%{transform:rotate(-22deg)}
  }
  #gs-robo-wrap.walk .gs-leg-r{animation:gs-gait-r .85s ease-in-out infinite}
  @keyframes gs-gait-r{
    0%  {transform:rotate(22deg)}
    18% {transform:rotate(16deg)}
    45% {transform:rotate(-22deg)}
    65% {transform:rotate(-8deg)}
    82% {transform:rotate(22deg)}
    100%{transform:rotate(22deg)}
  }
  #gs-robo-wrap.walk .gs-arm-l{animation:gs-arm-swing-r .85s ease-in-out infinite}
  #gs-robo-wrap.walk .gs-arm-r{animation:gs-arm-swing-l .85s ease-in-out infinite}
  @keyframes gs-arm-swing-l{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}
  @keyframes gs-arm-swing-r{0%,100%{transform:rotate(20deg)}50%{transform:rotate(-20deg)}}

  /* ════════════════════════════════════════════
     KICK – wind-up → explosive kick → hold
  ════════════════════════════════════════════ */
  #gs-robo-wrap.kick .gs-leg-r{animation:gs-kick-leg .65s ease-in-out forwards}
  #gs-robo-wrap.kick .gs-arm-l{animation:gs-kick-arm .65s ease-in-out forwards}
  #gs-robo-wrap.kick .gs-robo{animation:gs-kick-lean .65s ease-in-out forwards}
  @keyframes gs-kick-leg{
    0%  {transform:rotate(0)}
    20% {transform:rotate(-30deg)}
    55% {transform:rotate(72deg)}
    70% {transform:rotate(72deg)}
    100%{transform:rotate(0)}
  }
  @keyframes gs-kick-arm{
    0%  {transform:rotate(0)}
    20% {transform:rotate(35deg)}
    55% {transform:rotate(-18deg)}
    100%{transform:rotate(0)}
  }
  @keyframes gs-kick-lean{
    0%  {transform:rotate(0)}
    20% {transform:rotate(-5deg)}
    55% {transform:rotate(8deg)}
    100%{transform:rotate(0)}
  }

  /* ════════════════════════════════════════════
     CLIMB – arms GRIP rails, legs step rung-by-rung
     CSS cycle = 0.5s to match JS step interval
  ════════════════════════════════════════════ */

  /* Subtle side-sway of body while climbing */
  #gs-robo-wrap.climb .gs-robo{animation:gs-climb-sway .5s ease-in-out infinite}
  @keyframes gs-climb-sway{
    0%,100%{transform:translateX(-1.5px) rotate(-1.5deg)}
    50%    {transform:translateX(1.5px)  rotate(1.5deg)}
  }

  /* LEFT ARM: grips high rail → slides down as body rises → releases → re-grips */
  #gs-robo-wrap.climb .gs-arm-l{animation:gs-grip-l .5s ease-in-out infinite}
  @keyframes gs-grip-l{
    0%  {transform:rotate(-82deg)}  /* arm UP, gripping rail above */
    40% {transform:rotate(-82deg)}  /* holding tight */
    50% {transform:rotate(-38deg)}  /* body rose — arm slides down rail */
    90% {transform:rotate(-38deg)}  /* still gripping at lower position */
    100%{transform:rotate(-82deg)}  /* snap: reaches up for next rung */
  }
  /* RIGHT ARM: offset half-cycle (grips while left releases) */
  #gs-robo-wrap.climb .gs-arm-r{animation:gs-grip-r .5s ease-in-out infinite}
  @keyframes gs-grip-r{
    0%  {transform:rotate(-38deg)}
    40% {transform:rotate(-38deg)}
    50% {transform:rotate(-82deg)}
    90% {transform:rotate(-82deg)}
    100%{transform:rotate(-38deg)}
  }

  /* LEFT LEG: knee lifts → foot plants on rung → push */
  #gs-robo-wrap.climb .gs-leg-l{animation:gs-rung-l .5s ease-in-out infinite}
  @keyframes gs-rung-l{
    0%  {transform:rotate(-32deg)}  /* knee up — stepping */
    40% {transform:rotate(-32deg)}  /* mid-step */
    55% {transform:rotate(6deg)}    /* foot planted, pushing down */
    90% {transform:rotate(6deg)}    /* planted */
    100%{transform:rotate(-32deg)}  /* lifts again */
  }
  /* RIGHT LEG: offset */
  #gs-robo-wrap.climb .gs-leg-r{animation:gs-rung-r .5s ease-in-out infinite}
  @keyframes gs-rung-r{
    0%  {transform:rotate(6deg)}
    40% {transform:rotate(6deg)}
    55% {transform:rotate(-32deg)}
    90% {transform:rotate(-32deg)}
    100%{transform:rotate(6deg)}
  }

  /* ════════════════════════════════════════════
     WAVE
  ════════════════════════════════════════════ */
  #gs-robo-wrap.wave .gs-arm-r{animation:gs-wave .4s ease-in-out 5 alternate}
  @keyframes gs-wave{from{transform:rotate(-8deg)}to{transform:rotate(68deg)}}

  /* ════════════════════════════════════════════
     LADDER
  ════════════════════════════════════════════ */
  #gs-ladder-el{position:fixed;right:46px;z-index:9996;pointer-events:none;display:none;flex-direction:column;justify-content:space-between;width:28px}
  .gs-post{position:absolute;top:0;bottom:0;width:3px;border-radius:2px;background:linear-gradient(180deg,rgba(245,158,11,.95),rgba(217,119,6,.5))}
  .gs-post.l{left:0}.gs-post.r{right:0}
  .gs-ladder-rung{width:100%;height:4px;background:#f59e0b;border-radius:2px;box-shadow:0 2px 5px rgba(245,158,11,.55);transform:scaleX(0);transition:transform .1s ease-out;position:relative;z-index:1}
  .gs-ladder-rung.show{transform:scaleX(1)}

  /* ════════════════════════════════════════════
     BURST RING
  ════════════════════════════════════════════ */
  #gs-burst-ring{position:fixed;bottom:14px;right:14px;width:76px;height:76px;border-radius:50%;border:3px solid #f59e0b;pointer-events:none;opacity:0;z-index:10001}
  #gs-burst-ring.pop{animation:gs-burst .5s ease-out forwards}
  @keyframes gs-burst{0%{transform:scale(1);opacity:1}100%{transform:scale(3);opacity:0}}
  </style>`);

  /* ── HTML ── */
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
    ${Array.from({length:RUNGS},(_,i)=>`<div class="gs-ladder-rung" data-i="${i}"></div>`).join('')}
  </div>
  <div id="gs-burst-ring"></div>`);

  /* ── Refs ── */
  const launcher = document.getElementById('gs-chat-launcher');
  const wrap     = document.getElementById('gs-robo-wrap');
  const bubble   = document.getElementById('gs-robo-bubble');
  const ladderEl = document.getElementById('gs-ladder-el');
  const burstEl  = document.getElementById('gs-burst-ring');
  const rungs    = Array.from(ladderEl.querySelectorAll('.gs-ladder-rung'));
  if (!launcher || !wrap) return;

  /* ── Helpers ── */
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

  /* ── Phase 1: Walk left → kick WhatsApp → walk home ── */
  async function phase1(){
    if(chatOpen())return;
    doBurst();
    wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
    showBot();await sleep(350);

    const waBtn=document.querySelector('.whatsapp-float');
    let destRight=waBtn?(window.innerWidth-waBtn.getBoundingClientRect().right-4):window.innerWidth-200;
    destRight=Math.max(destRight,4);

    const travelPx=window.innerWidth-24-destRight-44;
    const walkDur=Math.max(travelPx/80,1.5); // slower: 80px/s

    wrap.style.transform='scaleX(-1)';
    setMode('walk');
    wrap.style.transition=`right ${walkDur}s linear`;
    wrap.style.right=destRight+'px';
    await sleep(walkDur*1000+80);

    setMode('');wrap.style.transform='scaleX(-1)';await sleep(80);
    setMode('kick');
    if(waBtn){
      waBtn.style.transition='transform .15s ease';
      waBtn.style.transform='translateX(18px) rotate(10deg)';
      setTimeout(()=>{waBtn.style.transform='translateX(-6px) rotate(-4deg)'},190);
      setTimeout(()=>{waBtn.style.transform='translateX(4px)'},340);
      setTimeout(()=>{waBtn.style.transform='';waBtn.style.transition=''},490);
    }
    await sleep(800);

    setMode('');wrap.style.transform='scaleX(1)';await sleep(80);
    setMode('walk');
    wrap.style.transition=`right ${walkDur}s linear`;
    wrap.style.right='24px';
    await sleep(walkDur*1000+80);

    setMode('');doBurst();await sleep(350);hideBot();
    await sleep(2000);
  }

  /* ── Phase 2: Ladder climb step-by-step ── */
  async function phase2(){
    if(chatOpen())return;

    const headerEl=document.getElementById('header')||document.querySelector('header');
    const headerBot=headerEl?headerEl.getBoundingClientRect().bottom:80;
    const ROBOT_H=110;
    const climbPx=Math.max(window.innerHeight-24-ROBOT_H-headerBot-10,180);

    ladderEl.style.height=climbPx+'px';
    ladderEl.style.bottom=(24+ROBOT_H)+'px';
    ladderEl.style.display='flex';

    // Reveal rungs bottom → top
    for(const r of [...rungs].reverse()){r.classList.add('show');await sleep(55)}
    await sleep(300);
    if(chatOpen()){await retractLadder();return}

    // Materialise
    doBurst();
    wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
    showBot();await sleep(350);

    /* ── Step-by-step climb UP ── */
    // Each step = one rung. CSS animation cycle = 0.5s, so step interval = 500ms
    const STEP_DUR_MS  = 320;  // time to move up one rung (transition)
    const STEP_HOLD_MS = 180;  // pause on rung (gripping)
    const stepPx = climbPx / RUNGS;

    setMode('climb');
    for(let i=1; i<=RUNGS; i++){
      if(chatOpen()) break;
      wrap.style.transition=`bottom ${STEP_DUR_MS}ms ease-in-out`;
      wrap.style.bottom=(24 + i*stepPx)+'px';
      await sleep(STEP_DUR_MS + STEP_HOLD_MS);
    }

    // Say Hii! at the top
    setMode('');
    bubble.classList.add('show');
    setMode('wave');
    await sleep(2000);
    bubble.classList.remove('show');
    setMode('');
    await sleep(200);

    /* ── Step-by-step climb DOWN ── */
    setMode('climb');
    for(let i=RUNGS-1; i>=0; i--){
      wrap.style.transition=`bottom ${STEP_DUR_MS}ms ease-in-out`;
      wrap.style.bottom=(24 + i*stepPx)+'px';
      await sleep(STEP_DUR_MS + STEP_HOLD_MS);
    }

    setMode('');doBurst();await sleep(350);hideBot();
    await retractLadder();
    await sleep(2000);
  }

  async function retractLadder(){
    for(const r of rungs){r.classList.remove('show');await sleep(40)}
    ladderEl.style.display='none';
  }

  /* ── Main loop ── */
  async function loop(){
    await sleep(3500);
    while(true){
      if(!chatOpen())await phase1();else{await sleep(1200);continue}
      if(!chatOpen())await phase2();else await sleep(1200);
    }
  }
  loop();
})();
