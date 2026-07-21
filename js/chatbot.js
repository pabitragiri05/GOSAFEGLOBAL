// ================================================================
//  GoSafe Global – Chatbot Widget Script
//  Extracted from index.html inline <script> block
// ================================================================

(function() {
  const API = '/api/chat';
  let gsSessionId = null, gsIsOpen = false, gsStarted = false;
  const gsPopup    = document.getElementById('gs-chat-popup');
  const gsLauncher = document.getElementById('gs-chat-launcher');
  const gsMsgs     = document.getElementById('gs-chat-messages');
  const gsTxtInput = document.getElementById('gs-user-input');
  const gsSendBtn  = document.getElementById('gs-send-btn');

  window.gsToggleChat = function() {
    gsIsOpen = !gsIsOpen;
    gsPopup.classList.toggle('gs-active', gsIsOpen);
    document.getElementById('gs-launcher-icon').textContent = gsIsOpen ? '✕' : '🤖';
    gsLauncher.querySelector('.gs-notif-dot')?.remove();
    if (gsIsOpen && !gsStarted) { gsStarted = true; gsCallAPI(null); }
    if (gsIsOpen) setTimeout(() => gsMsgs.scrollTop = gsMsgs.scrollHeight, 100);
  };

  window.gsResetChat = function() {
    gsSessionId = null; gsStarted = false;
    gsMsgs.innerHTML = '<div class="gs-day-label">Today</div>';
    gsDisableInput(); gsCallAPI(null);
  };

  function gsShowTyping(cb, delay) {
    delay = delay || 850;
    const row = document.createElement('div');
    row.className = 'gs-typing-row'; row.id = 'gs-typing';
    row.innerHTML = '<div class="gs-bot-avatar-sm">🤖</div><div class="gs-typing-dots"><span></span><span></span><span></span></div>';
    gsMsgs.appendChild(row);
    gsMsgs.scrollTop = gsMsgs.scrollHeight;
    setTimeout(function() { row.remove(); cb(); }, delay);
  }

  function gsAddBot(html) {
    const row = document.createElement('div');
    row.className = 'gs-msg-row gs-bot';
    row.innerHTML = '<div class="gs-bot-avatar-sm">🤖</div><div class="gs-bubble gs-bot">' + html + '</div>';
    gsMsgs.appendChild(row);
    gsMsgs.scrollTop = gsMsgs.scrollHeight;
  }

  function gsAddUser(text) {
    const row = document.createElement('div');
    row.className = 'gs-msg-row gs-user';
    row.innerHTML = '<div class="gs-bubble gs-user">' + gsEsc(text) + '</div>';
    gsMsgs.appendChild(row);
    gsMsgs.scrollTop = gsMsgs.scrollHeight;
  }

  function gsEsc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function gsRenderOptions(options) {
    const wrap = document.createElement('div');
    wrap.className = 'gs-options-wrap';
    options.forEach(function(opt, idx) {
      const btn = document.createElement('button');
      btn.className = 'gs-opt-btn'; btn.textContent = opt.label;
      btn.onclick = function() {
        wrap.querySelectorAll('.gs-opt-btn').forEach(function(b) { b.disabled = true; });
        btn.classList.add('gs-selected');
        gsAddUser(opt.label); gsCallAPI(idx);
      };
      wrap.appendChild(btn);
    });
    gsMsgs.appendChild(wrap);
    gsMsgs.scrollTop = gsMsgs.scrollHeight;
  }

  function gsRenderContinue() {
    const btn = document.createElement('button');
    btn.className = 'gs-continue-btn'; btn.textContent = 'Continue →';
    btn.onclick = function() { btn.disabled = true; gsCallAPI(null); };
    gsMsgs.appendChild(btn);
    gsMsgs.scrollTop = gsMsgs.scrollHeight;
  }

  function gsRenderWhatsApp(url) {
    gsAddBot('Our team is ready to help you on WhatsApp!<br/><br/><a class="gs-whatsapp-btn" href="' + url + '" target="_blank"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Chat on WhatsApp</a>');
  }

  function gsEnableInput(ph) { gsTxtInput.disabled = false; gsSendBtn.disabled = false; gsTxtInput.placeholder = ph || 'Type here…'; gsTxtInput.focus(); }
  function gsDisableInput() { gsTxtInput.disabled = true; gsSendBtn.disabled = true; gsTxtInput.value = ''; gsTxtInput.placeholder = 'Type your message…'; }

  window.gsSendTyped = function() {
    const val = gsTxtInput.value.trim(); if (!val) return;
    gsAddUser(val); gsDisableInput(); gsCallAPI(val);
  };
  gsTxtInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') gsSendTyped(); });

  async function gsCallAPI(userInput) {
    gsDisableInput();
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput, session_id: gsSessionId })
      });
      const data = await res.json();
      gsSessionId = data.session_id;
      gsShowTyping(function() { gsRenderStep(data.step); }, 700 + Math.random() * 400);
    } catch(e) {
      gsShowTyping(function() { gsAddBot('⚠️ Unable to connect. Please try WhatsApp below or call us directly.'); }, 600);
    }
  }

  const GS_END_IDS = ['p2_step_9_close','p3_step_5_close','p4_step_5_close','p5_close'];

  function gsRenderStep(step) {
    if (step.id === 'p5_step_2c_whatsapp') {
      gsAddBot(gsEsc(step.bot_message));
      gsRenderWhatsApp(step.whatsapp_url || 'https://wa.me/918512020020');
      return;
    }
    if (step.contact_info) {
      const ci = step.contact_info;
      gsAddBot(gsEsc(step.bot_message) + '<br/><br/>📞 ' + ci.phone + '<br/>✉️ ' + ci.email + '<br/>📍 ' + ci.address + '<br/>🌐 <a href="' + ci.website + '" target="_blank" style="color:#f59e0b">' + ci.website + '</a>');
      if (step.follow_up) setTimeout(function() { gsShowTyping(function() { gsAddBot(gsEsc(step.follow_up)); }, 700); }, 400);
      setTimeout(function() { gsCallAPI(null); }, 1500);
      return;
    }
    gsAddBot(gsEsc(step.bot_message));
    if (step.options && step.options.length > 0) { setTimeout(function() { gsRenderOptions(step.options); }, 200); return; }
    const itype = step.input_type || 'none';
    if (itype === 'text' || itype === 'email' || itype === 'phone') {
      const ph = { text: 'Type your response…', email: 'your@email.com', phone: '+91 XXXXX XXXXX' };
      setTimeout(function() { gsEnableInput(ph[itype]); }, 150);
      return;
    }
    if (GS_END_IDS.includes(step.id)) {
      const notice = document.createElement('div');
      notice.className = 'gs-chat-end-notice';
      notice.textContent = '✓ Done! Our team will be in touch soon.';
      gsMsgs.appendChild(notice);
      gsMsgs.scrollTop = gsMsgs.scrollHeight;
      return;
    }
    setTimeout(function() { gsRenderContinue(); }, 200);
  }
})();
