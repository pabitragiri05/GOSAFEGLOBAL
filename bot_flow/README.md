# bot_flow/ Directory

This directory contains the **local development** version of the GoSafe chatbot.

## Files

| File | Purpose |
|------|---------|
| `app (1).py` | Flask app for local dev testing of the chatbot API |
| `bot_flow.json` | Chatbot conversation flow definition |
| `_archive/` | Legacy/prototype files (not in use) |

## Production Files

The **production** (Vercel-deployed) version lives in:
- `api/index.py` — deployed as a Python Serverless Function
- `api/bot_flow.json` — conversation flow used in production

## Running Locally

```bash
# Install deps
pip install flask flask-cors python-dotenv

# Copy env template and fill in your credentials
cp .env.example .env

# Start the local dev server
cd bot_flow
python "app (1).py"
# Open http://127.0.0.1:5000
```

> **Note:** Never commit your `.env` file. See `.env.example` for required variable names.
