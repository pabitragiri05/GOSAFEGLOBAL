import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid

# ==========================================
# 1. CONFIGURATION — set via environment variables
# ==========================================
# Local dev: copy .env.example to .env and fill in values
# See api/index.py for the production Vercel-deployed version

SMTP_SERVER     = "smtp.gmail.com"
SMTP_PORT       = 465
SENDER_EMAIL    = os.environ.get("GOSAFE_SENDER_EMAIL", "")
SENDER_PASSWORD = os.environ.get("GOSAFE_SENDER_PASSWORD", "")
ALL_MAILS_TO    = os.environ.get("GOSAFE_RECIPIENT_EMAIL", SENDER_EMAIL)

# ── Email Routing Table ────────────────────
EMAIL_ROUTING = {
    "submit_lead_to_crm": {
        "to": ALL_MAILS_TO,
        "subject": "🎯 New Quote Request — GoSafe Chatbot"
    },
    "schedule_demo_and_notify_sales": {
        "to": ALL_MAILS_TO,
        "subject": "📅 New Demo Booking — GoSafe Chatbot"
    },
    "create_support_ticket": {
        "to": ALL_MAILS_TO,
        "subject": "🔧 New Support Ticket — GoSafe Chatbot"
    },
    "trigger_instant_sales_notification": {
        "to": ALL_MAILS_TO,
        "subject": "📞 Urgent Sales Contact Request — GoSafe Chatbot"
    },
    "redirect_to_whatsapp": {
        "to": ALL_MAILS_TO,
        "subject": "💬 WhatsApp Redirect — GoSafe Chatbot"
    },
}

app = Flask(__name__)
CORS(app)

# In-memory session store (use Redis / DB in production)
SESSIONS = {}


# ==========================================
# 2. CHATBOT ENGINE
# ==========================================

class GoSafeChatbotAPI:
    def __init__(self, json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            self.data = json.load(f)['chatbot']

        self.all_steps = {}
        for step in self.data.get('steps', []):
            self.all_steps[step['id']] = step
        for path in self.data.get('paths', []):
            for step in path.get('steps', []):
                self.all_steps[step['id']] = step

        self.path_starts = {
            path['id']: path['steps'][0]['id']
            for path in self.data.get('paths', [])
            if path.get('steps')
        }

    def send_email(self, action_name, session_data):
        routing = EMAIL_ROUTING.get(action_name)
        if not routing:
            print(f"[Email] No routing found for action: {action_name}")
            return

        recipient = routing["to"]
        subject   = routing["subject"]
        print(f"[Email] Sending '{subject}' → {recipient}")

        user_data    = session_data.get('user_data', {})
        chat_history = session_data.get('chat_history', [])

        details_rows = "".join(
            f"<tr><td style='padding:6px 12px;font-weight:600;color:#1a0050;background:#f0ebff;'>"
            f"{k.replace('_',' ').title()}</td>"
            f"<td style='padding:6px 12px;border-bottom:1px solid #eee;'>{v}</td></tr>"
            for k, v in user_data.items()
        )

        transcript_html = "".join(
            f"<div style='margin:6px 0; padding: 8px 14px; border-radius:10px; "
            f"background:{'#f0ebff' if line.startswith('Bot:') else '#e8fff9'}; "
            f"color:#333;font-size:14px;'>"
            f"<b>{'🤖 ' if line.startswith('Bot:') else '👤 '}"
            f"{'GoSafe Bot' if line.startswith('Bot:') else 'User'}:</b> "
            f"{line.split(':', 1)[1].strip()}</div>"
            for line in chat_history
        )

        html_body = f"""
        <html><body style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#333;">
          <div style="background:linear-gradient(135deg,#1a0050,#2d0080);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:22px;">GoSafeGlobal Chatbot Lead</h2>
            <p style="color:rgba(255,255,255,.65);margin:6px 0 0;font-size:14px;">{subject}</p>
          </div>
          <div style="padding:24px 32px;background:#fff;border:1px solid #eee;">
            <h3 style="color:#1a0050;margin:0 0 16px;">📋 Captured Information</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
              {details_rows if details_rows else "<tr><td style='color:#999;padding:8px;'>No structured data captured.</td></tr>"}
            </table>
            <h3 style="color:#1a0050;margin:0 0 14px;">💬 Full Conversation Transcript</h3>
            <div style="background:#fafafa;border-radius:10px;padding:16px;">
              {transcript_html if transcript_html else "<p style='color:#999;font-size:14px;'>No transcript available.</p>"}
            </div>
          </div>
          <div style="padding:16px 32px;background:#f9f7ff;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none;">
            <p style="font-size:12px;color:#999;margin:0;">
              Sent automatically by GoSafeGlobal Website Chatbot &bull;
              Reply to this email to follow up with the lead.
            </p>
          </div>
        </html></body>"""

        msg = MIMEMultipart("alternative")
        msg['From']    = SENDER_EMAIL
        msg['To']      = recipient
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))

        try:
            if not SENDER_EMAIL or not SENDER_PASSWORD:
                print("⚠️  Email credentials not set in environment — skipping send.")
                print(f"   Would have sent to: {recipient}")
                print(f"   Subject:           {subject}")
                return

            import ssl
            ctx = ssl.create_default_context()
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=ctx) as server:
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)
            print(f"✅ Email sent to {recipient}")
        except Exception as e:
            print(f"❌ Email send failed: {e}")

    def get_next_step_id(self, current_step, user_choice_idx=None):
        if user_choice_idx is not None and 'options' in current_step:
            try:
                chosen = current_step['options'][int(user_choice_idx)]
                if 'next_step' in chosen:
                    target = chosen['next_step']
                    return self.path_starts.get(target, target)
            except (ValueError, IndexError):
                pass

        target = current_step.get('next_step')
        return self.path_starts.get(target, target) if target else None


bot = GoSafeChatbotAPI("bot_flow.json")


# ==========================================
# 3. API ENDPOINTS
# ==========================================

@app.route('/')
def home():
    return "🚀 GoSafeGlobal Chatbot API is running!"


@app.route('/api/chat', methods=['POST'])
def chat():
    data       = request.json or {}
    session_id = data.get('session_id')
    user_input = data.get('user_input')

    if not session_id or session_id not in SESSIONS:
        session_id = str(uuid.uuid4())
        SESSIONS[session_id] = {
            'current_step_id': "step_1_welcome",
            'user_data':       {},
            'chat_history':    [],
        }
        step = bot.all_steps["step_1_welcome"]
        SESSIONS[session_id]['chat_history'].append(f"Bot: {step['bot_message']}")
        return jsonify({"session_id": session_id, "step": step})

    session         = SESSIONS[session_id]
    current_step_id = session['current_step_id']
    current_step    = bot.all_steps.get(current_step_id)

    if not current_step:
        return jsonify({"error": "Invalid step"}), 400

    input_type = current_step.get('input_type', 'none')

    if "options" in current_step and user_input is not None:
        try:
            label = current_step['options'][int(user_input)]['label']
            session['chat_history'].append(f"User: {label}")
            if 'field' in current_step:
                session['user_data'][current_step['field']] = label
        except Exception:
            session['chat_history'].append(f"User: {user_input}")
    elif input_type in ("text", "email", "phone") and user_input is not None:
        session['chat_history'].append(f"User: {user_input}")
        if 'field' in current_step:
            session['user_data'][current_step['field']] = user_input
        elif 'fields' in current_step:
            for f in current_step['fields']:
                if f not in session['user_data']:
                    session['user_data'][f] = user_input
                    break

    if "options" in current_step:
        next_step_id = bot.get_next_step_id(current_step, user_choice_idx=user_input)
    else:
        next_step_id = bot.get_next_step_id(current_step)

    if not next_step_id or next_step_id not in bot.all_steps:
        return jsonify({
            "session_id": session_id,
            "step": {"bot_message": "Thank you for chatting with us! Have a great day. 👋", "input_type": "none"}
        })

    session['current_step_id'] = next_step_id
    next_step = dict(bot.all_steps[next_step_id])

    try:
        next_step['bot_message'] = next_step.get('bot_message', '').format(**session['user_data'])
    except KeyError:
        pass

    session['chat_history'].append(f"Bot: {next_step.get('bot_message', '')}")

    if 'action' in next_step:
        bot.send_email(next_step['action'], session)

    return jsonify({"session_id": session_id, "step": next_step})


@app.route('/api/end_chat', methods=['POST'])
def end_chat():
    data       = request.json or {}
    session_id = data.get('session_id')

    if not session_id or session_id not in SESSIONS:
        return jsonify({"status": "no_session"}), 200

    session = SESSIONS[session_id]
    history_text = " ".join(session.get('chat_history', []))
    action = "submit_lead_to_crm"

    if "demo" in history_text.lower() or "book" in history_text.lower():
        action = "schedule_demo_and_notify_sales"
    elif "support" in history_text.lower() or "issue" in history_text.lower():
        action = "create_support_ticket"
    elif "sales" in history_text.lower() or "call" in history_text.lower():
        action = "trigger_instant_sales_notification"

    bot.send_email(action, session)
    return jsonify({"status": "email_sent", "action": action})


if __name__ == '__main__':
    print("=" * 50)
    print("  GoSafeGlobal Chatbot API  (local dev)")
    print("  http://127.0.0.1:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)