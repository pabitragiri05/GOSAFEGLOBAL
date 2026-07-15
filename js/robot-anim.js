/* =====================================================================
   GoSafe Global – Robot Animation v8
   Faster walk | Ropeway glide return | Full knee+elbow articulation
   ===================================================================== */
(function(){
'use strict';

document.head.insertAdjacentHTML('beforeend',`<style>
#gs-robo-wrap{position:fixed;bottom:24px;right:24px;z-index:9997;pointer-events:none;flex-direction:column;align-items:center;display:none}
.gs-robo-bubble{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;padding:4px 10px;border-radius:10px;border:2px solid #f59e0b;background:#fff;color:#4c1d95;white-space:nowrap;margin-bottom:6px;box-shadow:0 3px 12px rgba(0,0,0,.2);position:relative;transform:scale(0);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.gs-robo-bubble.show{transform:scale(1)}
.gs-robo-bubble::after{content:'';position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#f59e0b;border-bottom:0}

/* ── robot ── */
.gs-robo{display:flex;flex-direction:column;align-items:center;width:34px;filter:drop-shadow(0 4px 12px rgba(109,40,217,.65))}
.gs-robo-ant{width:2px;height:9px;background:#f59e0b;border-radius:2px;position:relative}
.gs-robo-ant::before{content:'';position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:7px;height:7px;background:#ef4444;border-radius:50%;box-shadow:0 0 7px rgba(239,68,68,.9);animation:gs-ant-blink 1.5s ease-in-out infinite}
@keyframes gs-ant-blink{0%,100%{opacity:1}50%{opacity:.2}}
.gs-robo-head{width:24px;height:20px;background:linear-gradient(135deg,#7c3aed,#4c1d95);border-radius:7px;border:2px solid #f59e0b;display:flex;align-items:center;justify-content:center;gap:4px;position:relative}
.gs-robo-eye{width:5px;height:6px;background:#60a5fa;border-radius:2px;box-shadow:0 0 5px rgba(96,165,250,.9);animation:gs-eye-blink 4s ease-in-out infinite}
.gs-robo-eye:last-of-type{animation-delay:.2s}
@keyframes gs-eye-blink{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(.06)}}
.gs-robo-mouth{position:absolute;bottom:4px;width:10px;height:2px;background:#f59e0b;border-radius:1px}
.gs-robo-neck{width:6px;height:4px;background:#5b21b6}
.gs-robo-mid{display:flex;align-items:flex-start;gap:2px}
.gs-robo-torso{width:28px;height:24px;background:linear-gradient(135deg,#6d28d9,#4c1d95);border-radius:6px;border:2px solid #f59e0b;display:flex;align-items:center;justify-content:center}
.gs-robo-orb{width:11px;height:11px;background:radial-gradient(circle at 35% 35%,#fde68a,#f59e0b 60%,#d97706);border-radius:50%;box-shadow:0 0 9px rgba(245,158,11,.9);animation:gs-orb-pulse 2s ease-in-out infinite}
@keyframes gs-orb-pulse{0%,100%{box-shadow:0 0 9px rgba(245,158,11,.9)}50%{box-shadow:0 0 18px rgba(245,158,11,1)}}
/* arm */
.gs-arm-wrap{transform-origin:top center;display:flex;flex-direction:column;align-items:center}
.gs-upper-arm-seg{width:6px;height:10px;background:linear-gradient(180deg,#7c3aed,#5b21b6);border-radius:3px 3px 0 0;border:1px solid rgba(245,158,11,.5)}
.gs-lower-arm-w{transform-origin:top center;display:flex;flex-direction:column;align-items:center}
.gs-lower-arm-seg{width:5px;height:9px;background:linear-gradient(180deg,#5b21b6,#4c1d95);border-radius:0 0 3px 3px;border:1px solid rgba(245,158,11,.4)}
/* leg */
.gs-robo-legs{display:flex;gap:6px;margin-top:1px}
.gs-leg-wrap{transform-origin:top center;display:flex;flex-direction:column;align-items:center}
.gs-thigh-seg{width:8px;height:12px;background:linear-gradient(180deg,#5b21b6,#4c1d95);border-radius:3px 3px 0 0;border:1px solid rgba(245,158,11,.4)}
.gs-lower-leg-w{transform-origin:top center;display:flex;flex-direction:column;align-items:center}
.gs-shin-seg{width:7px;height:11px;background:linear-gradient(180deg,#4c1d95,#3b0e8c);border-radius:0 0 3px 3px;border:1px solid rgba(245,158,11,.3)}
.gs-robo-foot{width:11px;height:4px;background:#f59e0b;border-radius:3px;margin-top:-1px;box-shadow:0 2px 4px rgba(245,158,11,.5)}

/* ══════════════════════════════════════════════
   WALK  –  0.75s gait | knee bends | elbow swings
   ══════════════════════════════════════════════ */
#gs-robo-wrap.walk .gs-robo{animation:gs-walk-bob .12s ease-in-out infinite}
@keyframes gs-walk-bob{0%,100%{transform:translateY(0) rotate(1.5deg)}25%,75%{transform:translateY(-3px) rotate(0)}50%{transform:translateY(0) rotate(-1.5deg)}}
/* Left leg hip + knee */
#gs-robo-wrap.walk .gs-leg-wrap.gs-leg-l{animation:gs-hip-l .12s ease-in-out infinite}
@keyframes gs-hip-l{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
#gs-robo-wrap.walk .gs-leg-wrap.gs-leg-l .gs-lower-leg-w{animation:gs-knee-l .12s ease-in-out infinite}
@keyframes gs-knee-l{0%{transform:rotate(5deg)}25%{transform:rotate(38deg)}50%{transform:rotate(6deg)}75%{transform:rotate(2deg)}100%{transform:rotate(5deg)}}
/* Right leg hip + knee */
#gs-robo-wrap.walk .gs-leg-wrap.gs-leg-r{animation:gs-hip-r .12s ease-in-out infinite}
@keyframes gs-hip-r{0%,100%{transform:rotate(24deg)}50%{transform:rotate(-24deg)}}
#gs-robo-wrap.walk .gs-leg-wrap.gs-leg-r .gs-lower-leg-w{animation:gs-knee-r .12s ease-in-out infinite}
@keyframes gs-knee-r{0%{transform:rotate(6deg)}25%{transform:rotate(2deg)}50%{transform:rotate(5deg)}75%{transform:rotate(38deg)}100%{transform:rotate(6deg)}}
/* Arms + elbows */
#gs-robo-wrap.walk .gs-arm-wrap.gs-arm-l{animation:gs-shoulder-l .12s ease-in-out infinite}
@keyframes gs-shoulder-l{0%,100%{transform:rotate(20deg)}50%{transform:rotate(-20deg)}}
#gs-robo-wrap.walk .gs-arm-wrap.gs-arm-l .gs-lower-arm-w{animation:gs-elbow-l .12s ease-in-out infinite}
@keyframes gs-elbow-l{0%,50%,100%{transform:rotate(12deg)}25%{transform:rotate(28deg)}75%{transform:rotate(22deg)}}
#gs-robo-wrap.walk .gs-arm-wrap.gs-arm-r{animation:gs-shoulder-r .12s ease-in-out infinite}
@keyframes gs-shoulder-r{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}
#gs-robo-wrap.walk .gs-arm-wrap.gs-arm-r .gs-lower-arm-w{animation:gs-elbow-r .12s ease-in-out infinite}
@keyframes gs-elbow-r{0%,50%,100%{transform:rotate(12deg)}25%{transform:rotate(22deg)}75%{transform:rotate(28deg)}}

/* ══════════════════════════════════════════════
   ROPEWAY  –  arms grip rope above, body hangs & sways,
               legs dangle loosely as robot glides home
   ══════════════════════════════════════════════ */
/* body hangs and sways slightly during glide */
#gs-robo-wrap.ropeway .gs-robo{animation:gs-rope-sway .9s ease-in-out infinite}
@keyframes gs-rope-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
/* BOTH arms reach UP to grip rope */
#gs-robo-wrap.ropeway .gs-arm-wrap.gs-arm-l{animation:gs-rope-arm-l .9s ease-in-out infinite}
@keyframes gs-rope-arm-l{0%,100%{transform:rotate(-88deg)}50%{transform:rotate(-82deg)}}
#gs-robo-wrap.ropeway .gs-arm-wrap.gs-arm-r{animation:gs-rope-arm-r .9s ease-in-out infinite}
@keyframes gs-rope-arm-r{0%,100%{transform:rotate(-82deg)}50%{transform:rotate(-88deg)}}
/* elbows slightly bent while gripping */
#gs-robo-wrap.ropeway .gs-arm-wrap .gs-lower-arm-w{animation:gs-rope-elbow .9s ease-in-out infinite}
@keyframes gs-rope-elbow{0%,100%{transform:rotate(28deg)}50%{transform:rotate(22deg)}}
/* legs dangle and sway loosely */
#gs-robo-wrap.ropeway .gs-leg-wrap.gs-leg-l{animation:gs-dangle-l .7s ease-in-out infinite}
@keyframes gs-dangle-l{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(6deg)}}
#gs-robo-wrap.ropeway .gs-leg-wrap.gs-leg-r{animation:gs-dangle-r .7s ease-in-out infinite}
@keyframes gs-dangle-r{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-10deg)}}
#gs-robo-wrap.ropeway .gs-leg-wrap .gs-lower-leg-w{animation:gs-dangle-knee .7s ease-in-out infinite}
@keyframes gs-dangle-knee{0%,100%{transform:rotate(20deg)}50%{transform:rotate(35deg)}}

/* ══════════════════════════════════════════════
   KICK
   ══════════════════════════════════════════════ */
#gs-robo-wrap.kick .gs-leg-wrap.gs-leg-r{animation:gs-kick-hip .65s ease-in-out forwards}
#gs-robo-wrap.kick .gs-leg-wrap.gs-leg-r .gs-lower-leg-w{animation:gs-kick-knee .65s ease-in-out forwards}
#gs-robo-wrap.kick .gs-arm-wrap.gs-arm-l{animation:gs-kick-arm .65s ease-in-out forwards}
#gs-robo-wrap.kick .gs-robo{animation:gs-kick-lean .65s ease-in-out forwards}
@keyframes gs-kick-hip{0%{transform:rotate(0)}18%{transform:rotate(-28deg)}55%{transform:rotate(65deg)}70%{transform:rotate(65deg)}100%{transform:rotate(0)}}
@keyframes gs-kick-knee{0%,18%{transform:rotate(35deg)}55%{transform:rotate(5deg)}100%{transform:rotate(0)}}
@keyframes gs-kick-arm{0%{transform:rotate(0)}18%{transform:rotate(32deg)}55%{transform:rotate(-15deg)}100%{transform:rotate(0)}}
@keyframes gs-kick-lean{0%{transform:rotate(0)}18%{transform:rotate(-5deg)}55%{transform:rotate(8deg)}100%{transform:rotate(0)}}

/* ══════════════════════════════════════════════
   CLIMB  –  0.8s contralateral | shoulder+elbow+hip+knee
   ══════════════════════════════════════════════ */
#gs-robo-wrap.climb .gs-robo{animation:gs-climb-lean .8s ease-in-out infinite}
@keyframes gs-climb-lean{0%,100%{transform:rotate(8deg) translateX(1px)}50%{transform:rotate(6deg) translateX(-1px)}}
@keyframes gs-climb-shoulder{0%{transform:rotate(-82deg)}38%{transform:rotate(-82deg)}55%{transform:rotate(-16deg)}90%{transform:rotate(-16deg)}100%{transform:rotate(-82deg)}}
@keyframes gs-climb-elbow{0%{transform:rotate(45deg)}20%{transform:rotate(20deg)}38%{transform:rotate(15deg)}55%{transform:rotate(38deg)}90%{transform:rotate(38deg)}100%{transform:rotate(45deg)}}
#gs-robo-wrap.climb .gs-arm-wrap.gs-arm-r{animation:gs-climb-shoulder .8s ease-in-out infinite 0s}
#gs-robo-wrap.climb .gs-arm-wrap.gs-arm-r .gs-lower-arm-w{animation:gs-climb-elbow .8s ease-in-out infinite 0s}
#gs-robo-wrap.climb .gs-arm-wrap.gs-arm-l{animation:gs-climb-shoulder .8s ease-in-out infinite .4s}
#gs-robo-wrap.climb .gs-arm-wrap.gs-arm-l .gs-lower-arm-w{animation:gs-climb-elbow .8s ease-in-out infinite .4s}
@keyframes gs-climb-hip{0%{transform:rotate(-32deg)}38%{transform:rotate(-32deg)}55%{transform:rotate(8deg)}90%{transform:rotate(8deg)}100%{transform:rotate(-32deg)}}
@keyframes gs-climb-knee{0%{transform:rotate(42deg)}38%{transform:rotate(42deg)}55%{transform:rotate(8deg)}90%{transform:rotate(8deg)}100%{transform:rotate(42deg)}}
#gs-robo-wrap.climb .gs-leg-wrap.gs-leg-l{animation:gs-climb-hip .8s ease-in-out infinite 0s}
#gs-robo-wrap.climb .gs-leg-wrap.gs-leg-l .gs-lower-leg-w{animation:gs-climb-knee .8s ease-in-out infinite 0s}
#gs-robo-wrap.climb .gs-leg-wrap.gs-leg-r{animation:gs-climb-hip .8s ease-in-out infinite .4s}
#gs-robo-wrap.climb .gs-leg-wrap.gs-leg-r .gs-lower-leg-w{animation:gs-climb-knee .8s ease-in-out infinite .4s}

/* ══════════════════════════════════════════════
   WAVE
   ══════════════════════════════════════════════ */
#gs-robo-wrap.wave .gs-arm-wrap.gs-arm-r{animation:gs-wave-shoulder .4s ease-in-out 5 alternate}
#gs-robo-wrap.wave .gs-arm-wrap.gs-arm-r .gs-lower-arm-w{animation:gs-wave-elbow .4s ease-in-out 5 alternate}
@keyframes gs-wave-shoulder{from{transform:rotate(-10deg)}to{transform:rotate(65deg)}}
@keyframes gs-wave-elbow{from{transform:rotate(15deg)}to{transform:rotate(45deg)}}

/* ══════════════════════════════════════════════
   LADDER – right wall edge
   ══════════════════════════════════════════════ */
#gs-ladder-el{position:fixed;right:6px;z-index:9996;pointer-events:none;display:none;flex-direction:column;justify-content:space-between;width:28px;transform:rotate(4deg);transform-origin:bottom center}
.gs-post{position:absolute;top:0;bottom:0;width:3px;border-radius:2px;background:linear-gradient(180deg,rgba(245,158,11,.95),rgba(217,119,6,.5))}
.gs-post.l{left:0}.gs-post.r{right:0}
.gs-ladder-rung{width:100%;height:4px;background:#f59e0b;border-radius:2px;box-shadow:0 2px 4px rgba(245,158,11,.55);transform:scaleX(0);transition:transform .1s ease-out;position:relative;z-index:1}
.gs-ladder-rung.show{transform:scaleX(1)}

/* ══════════════════════════════════════════════
   BURST
   ══════════════════════════════════════════════ */
#gs-burst-ring{position:fixed;bottom:14px;right:14px;width:76px;height:76px;border-radius:50%;border:3px solid #f59e0b;pointer-events:none;opacity:0;z-index:10001}
#gs-burst-ring.pop{animation:gs-burst .5s ease-out forwards}
@keyframes gs-burst{0%{transform:scale(1);opacity:1}100%{transform:scale(3);opacity:0}}
</style>`);

/* ── HTML ── */
const RUNGS=12;
document.body.insertAdjacentHTML('beforeend',`
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
      <div class="gs-arm-wrap gs-arm-l">
        <div class="gs-upper-arm-seg"></div>
        <div class="gs-lower-arm-w"><div class="gs-lower-arm-seg"></div></div>
      </div>
      <div class="gs-robo-torso"><div class="gs-robo-orb"></div></div>
      <div class="gs-arm-wrap gs-arm-r">
        <div class="gs-upper-arm-seg"></div>
        <div class="gs-lower-arm-w"><div class="gs-lower-arm-seg"></div></div>
      </div>
    </div>
    <div class="gs-robo-legs">
      <div class="gs-leg-wrap gs-leg-l">
        <div class="gs-thigh-seg"></div>
        <div class="gs-lower-leg-w"><div class="gs-shin-seg"></div><div class="gs-robo-foot"></div></div>
      </div>
      <div class="gs-leg-wrap gs-leg-r">
        <div class="gs-thigh-seg"></div>
        <div class="gs-lower-leg-w"><div class="gs-shin-seg"></div><div class="gs-robo-foot"></div></div>
      </div>
    </div>
  </div>
</div>
<div id="gs-ladder-el">
  <div class="gs-post l"></div><div class="gs-post r"></div>
  ${Array.from({length:RUNGS},()=>`<div class="gs-ladder-rung"></div>`).join('')}
</div>
<div id="gs-burst-ring"></div>`);

/* ── REFS ── */
const launcher=document.getElementById('gs-chat-launcher');
const wrap=document.getElementById('gs-robo-wrap');
const bubble=document.getElementById('gs-robo-bubble');
const ladderEl=document.getElementById('gs-ladder-el');
const burstEl=document.getElementById('gs-burst-ring');
const rungs=Array.from(ladderEl.querySelectorAll('.gs-ladder-rung'));
if(!launcher||!wrap)return;

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function doBurst(){burstEl.classList.remove('pop');void burstEl.offsetWidth;burstEl.classList.add('pop')}
function showBot(){
  launcher.style.fontSize='0';
  const d=launcher.querySelector('.gs-notif-dot');if(d)d.style.opacity='0';
  wrap.style.display='flex';
}
function hideBot(){
  wrap.style.display='none';
  launcher.style.fontSize='';
  const d=launcher.querySelector('.gs-notif-dot');if(d)d.style.opacity='';
  wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
  ['walk','kick','climb','wave','ropeway'].forEach(c=>wrap.classList.remove(c));
  bubble.classList.remove('show');
}
function setMode(m){['walk','kick','climb','wave','ropeway'].forEach(c=>wrap.classList.remove(c));if(m)wrap.classList.add(m)}
function chatOpen(){const p=document.getElementById('gs-chat-popup');return p&&p.classList.contains('gs-active')}

/* ── STEP WALK (faster: 380ms move + 380ms pause = 0.76s ≈ gait 0.75s) ── */
async function stepWalk(destRight,facingLeft){
  wrap.style.transform=facingLeft?'scaleX(-1)':'scaleX(1)';
  setMode('walk');
  const startRight=parseFloat(wrap.style.right)||24;
  const totalPx=Math.abs(startRight-destRight);
  const SPEED_PX_S=500; // 500px/s fast walk
  const dur=Math.max(totalPx/SPEED_PX_S,0.3);
  wrap.style.transition=`right ${dur}s linear`;
  wrap.style.right=destRight+'px';
  await sleep(dur*1000+60);
  setMode('');
}

/* ── ROPEWAY GLIDE RETURN ── */
async function ropewayReturn(fromRight){
  // Face right (home direction)
  wrap.style.transform='scaleX(1)';

  // Create rope/cable visual above the robot
  const ropeEl=document.createElement('div');
  const ropeRight=Math.min(fromRight,24)-10;
  const ropeWidth=Math.abs(fromRight-24)+60;
  const ropeBottomPx=24+88; // above robot (robot height ~82px + margin)
  ropeEl.style.cssText=`
    position:fixed;bottom:${ropeBottomPx}px;right:${ropeRight}px;
    width:${ropeWidth}px;height:4px;
    background:linear-gradient(90deg,rgba(245,158,11,.25) 0%,rgba(245,158,11,.9) 15%,rgba(245,158,11,.9) 85%,rgba(245,158,11,.25) 100%);
    border-radius:2px;box-shadow:0 2px 10px rgba(245,158,11,.5);
    pointer-events:none;z-index:9995;opacity:0;
    transition:opacity .35s ease;`;
  document.body.appendChild(ropeEl);

  // Fade rope in
  await sleep(30);
  ropeEl.style.opacity='1';
  await sleep(350);

  // Robot grabs rope & hangs
  setMode('ropeway');
  await sleep(400);

  // Smooth glide home along rope
  wrap.style.transition='right 2.4s cubic-bezier(.4,0,.2,1)';
  wrap.style.right='24px';
  await sleep(2500);

  // Fade rope out
  ropeEl.style.opacity='0';
  await sleep(380);
  ropeEl.remove();

  setMode('');
}

/* ── PHASE 1: Walk out → kick → ROPEWAY BACK ── */
async function phase1(){
  if(chatOpen())return;
  doBurst();
  wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
  showBot();await sleep(350);

  const waBtn=document.querySelector('.whatsapp-float');
  let destRight=waBtn?(window.innerWidth-waBtn.getBoundingClientRect().right-4):window.innerWidth-200;
  destRight=Math.max(destRight,4);

  // Walk left (step-by-step, faster)
  await stepWalk(destRight,true);

  // Kick
  wrap.style.transform='scaleX(-1)';await sleep(80);
  setMode('kick');
  if(waBtn){
    waBtn.style.transition='transform .15s ease';waBtn.style.transform='translateX(18px) rotate(10deg)';
    setTimeout(()=>{waBtn.style.transform='translateX(-6px) rotate(-4deg)'},190);
    setTimeout(()=>{waBtn.style.transform='translateX(4px)'},340);
    setTimeout(()=>{waBtn.style.transform='';waBtn.style.transition=''},490);
  }
  await sleep(800);

  // === ROPEWAY GLIDE HOME ===
  const currentRight=parseFloat(wrap.style.right)||destRight;
  await ropewayReturn(currentRight);

  doBurst();await sleep(350);hideBot();
  await sleep(2000);
}

/* ── PHASE 2: Ladder climb ── */
async function phase2(){
  if(chatOpen())return;
  const headerEl=document.getElementById('header')||document.querySelector('header');
  const headerBot=headerEl?headerEl.getBoundingClientRect().bottom:80;
  const ROBOT_H=82;
  const climbPx=Math.max(window.innerHeight-24-ROBOT_H-headerBot-10,150);
  ladderEl.style.height=climbPx+'px';ladderEl.style.bottom=(24+ROBOT_H)+'px';ladderEl.style.display='flex';
  for(const r of [...rungs].reverse()){r.classList.add('show');await sleep(55)}
  await sleep(300);
  if(chatOpen()){await retractLadder();return}
  doBurst();
  wrap.style.transition='none';wrap.style.bottom='24px';wrap.style.right='24px';wrap.style.transform='scaleX(1)';
  showBot();await sleep(350);
  const STEP_MOVE=440,STEP_GRIP=360;
  const stepPx=climbPx/RUNGS;
  setMode('climb');
  for(let i=1;i<=RUNGS;i++){
    if(chatOpen())break;
    wrap.style.transition=`bottom ${STEP_MOVE}ms ease-in-out`;
    wrap.style.bottom=(24+i*stepPx)+'px';
    await sleep(STEP_MOVE+STEP_GRIP);
  }
  setMode('');bubble.classList.add('show');setMode('wave');await sleep(2000);
  bubble.classList.remove('show');setMode('');await sleep(200);
  setMode('climb');
  for(let i=RUNGS-1;i>=0;i--){
    wrap.style.transition=`bottom ${STEP_MOVE}ms ease-in-out`;
    wrap.style.bottom=(24+i*stepPx)+'px';
    await sleep(STEP_MOVE+STEP_GRIP);
  }
  setMode('');doBurst();await sleep(350);hideBot();
  await retractLadder();await sleep(2000);
}

async function retractLadder(){
  for(const r of rungs){r.classList.remove('show');await sleep(40)}
  ladderEl.style.display='none';
}

async function loop(){
  await sleep(3500);
  while(true){
    if(!chatOpen())await phase1();else{await sleep(1200);continue}
    if(!chatOpen())await phase2();else await sleep(1200);
  }
}
loop();
})();


