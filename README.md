# SecureWealth Twin

**Intelligent Wealth Growth with Built-in Fraud Protection**

A dual-purpose banking platform that combines AI-powered wealth advisory with mandatory cyber-security and fraud protection — built for the PSB Hackathon Series 2026.

---

## Problem Statement

Banks face a dual responsibility: help customers grow wealth intelligently **and** protect that wealth from fraud. *SecureWealth Twin* acts as a virtual financial twin that learns user behavior, provides personalized recommendations, and embeds a mandatory fraud-protection layer around all critical wealth actions.

**Key capabilities:**
- Analyze spending, saving, and investment habits
- Provide goal-based investment guidance (SIPs, tax-saving, portfolio rebalancing)
- Study market/economic trends for strategic recommendations
- Integrate with Account Aggregator for full financial picture
- Compute full net worth (property, gold, vehicles)
- **Mandatory wealth protection checks** before high-value actions

---

## Project Structure

```
Final PSB/
├── server.js              # Express backend (AI API proxy + static server)
├── index.html             # Main frontend SPA (vanilla JS)
├── .env.example           # Environment variable template (no secrets)
├── .gitignore
├── package.json           # Backend dependencies
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker (offline caching)
│
├── js/                    # Frontend JavaScript modules
│   ├── app.js             # Main application controller
│   ├── wealth-engine.js   # Financial data & simulation engine
│   ├── risk-engine.js     # Fraud risk assessment engine
│   ├── ai-config.js       # AI backend configuration
│   ├── ai-clients.js      # AI orchestrator & backend client
│   ├── calculators.js     # Financial calculators (SIP, EMI, retirement)
│   ├── notifications.js   # Notification system
│   └── translations.js    # Multi-language support
│
├── css/
│   └── style.css          # Custom styles (Tailwind + custom)
│
├── assets/                # PWA icons (72px - 512px)
│
├── api/                   # Static API fallbacks
│   └── health.json        # Health check fallback for static hosting
│
└── client/                # React + TypeScript frontend (advanced)
    ├── src/
    │   ├── App.tsx         # Main React application
    │   ├── main.tsx        # Entry point
    │   ├── store/          # Zustand state management
    │   ├── components/     # 30+ feature components
    │   │   ├── ai/         # WealthTwin AI chat
    │   │   ├── protection/ # Fraud checks, panic button, OTP simulation
    │   │   ├── dashboard/  # Net worth cards, KYC status
    │   │   ├── goals/      # Goal tracking
    │   │   ├── portfolio/  # Portfolio management
    │   │   ├── forecast/   # Scenario & what-if simulators
    │   │   ├── compliance/ # Privacy center, consent management
    │   │   └── ...         # 20+ more component groups
    │   ├── hooks/          # Custom React hooks
    │   ├── types/          # TypeScript type definitions
    │   └── utils/          # Utility functions
    ├── vite.config.ts
    └── package.json
```

---

## 📱 Android Mobile App (APK)

The app is built with **Capacitor** — wrapping the web app in a native Android shell.

### Option A: Cloud Build (No local setup needed — FREE)

1. Push this code to a GitHub repository
2. Go to your repo → **Actions** tab
3. Select **Build Android APK** workflow
4. Click **Run workflow** → wait ~5 minutes
5. Download the APK from the **Artifacts** section

The APK is automatically built on every push to `main`/`master` that changes frontend files.

### Option B: Local Build (Requires Android Studio)

```bash
# 1. Install Android Studio from https://developer.android.com/studio
#    During installation, install Android SDK for API 34+

# 2. Set environment variables (or run the build script)
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"

# 3. Build APK (one command)
node scripts\copy-to-www.js
npx cap sync android
cd android
gradlew assembleDebug

# Or use the PowerShell script:
powershell -File scripts\build-apk.ps1
```

The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

### Pushing Updates to Installed App

After installing the APK on your phone, every time you open the app it:
1. Checks your server for new code (via Service Worker)
2. Shows **"New version available!"** banner
3. Tap **Update** to instantly apply changes

No app store re-submission needed — updates flow directly from your server.

### How OTA Updates Work

```
You update code on server → User opens app → SW detects new version
→ "Update" banner shown → User taps → App reloads with latest code
```

This works because the native app bundles only a thin WebView shell. All actual content loads from (or syncs with) your server on every launch.

---

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### 1. Clone & Install

```bash
cd "Final PSB"
npm install
```

### 2. Configure API Keys

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your actual API keys
notepad .env
```

Get free API keys:
- **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey) (1,500 requests/day free)
- **Hugging Face**: [HF Settings](https://huggingface.co/settings/tokens) (1,000 requests/day free)

### 3. Start the Server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

### 4. React Frontend (Optional)

```bash
cd client
npm install
npm run dev
```

The React app runs on a separate port with Vite dev server.

---

## Architecture

### Security Model

```
Browser (Frontend)
    │
    │  /api/chat (POST)
    ▼
Express Server (Backend)
    │
    ├─ Rate Limiting (30 req/min per IP)
    ├─ Input Sanitization (XSS prevention)
    ├─ CORS Restriction (configurable)
    ├─ Security Headers (X-Frame-Options, CSP-ready)
    │
    ├─► Gemini API (primary)
    └─► Hugging Face API (fallback)
    
API keys NEVER reach the browser.
```

### Risk Assessment Engine

The `RiskEngine` evaluates 6 signals before any critical wealth action:

| Signal | Weight | Description |
|--------|--------|-------------|
| Device Trust | 15% | Trusted vs. new device |
| Session Behavior | 10% | Unusual login-to-action speed |
| Amount vs History | 25% | Transaction amount vs. historical average |
| OTP Pattern | 20% | Multiple attempts, first-time for action |
| Action Familiarity | 15% | New vs. familiar action type |
| Behavior Consistency | 15% | Cancel/retry patterns |

**Risk Levels:** Low (< 30) → Allow | Medium (30-60) → Warn | High (> 60) → Block

---

## Features

### Wealth Intelligence
- Net worth computation (bank accounts, investments, physical assets)
- Goal-based planning (emergency fund, home, education, retirement)
- Portfolio allocation & rebalancing recommendations
- Tax-saving suggestions (80C, 80D, 80CCD)
- SIP calculator with step-up analysis
- Retirement corpus simulator
- Market trend analysis (NIFTY, repo rate, gold, USD/INR)

### Fraud Protection
- Real-time risk scoring before transactions
- Simulated OTP verification
- Duress mode (silent alert triggering)
- Panic button with account lockdown
- Cooling-off period for high-value actions
- Scam caller ID simulation
- Behavioral biometrics monitoring

### User Experience
- Dark mode support
- Multi-language (EN/HI)
- PWA with offline support
- Notification system with simulated alerts
- Animated dashboards with Chart.js
- Mobile-responsive design
- Keyboard shortcuts

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend health check |
| POST | `/api/chat` | AI chat (proxied to Gemini/HF) |
| GET | `/*` | Serves `index.html` (SPA routing) |

### Chat Request

```json
POST /api/chat
{
  "message": "How can I save tax?",
  "history": [
    { "user": "Hello", "bot": "Hi! How can I help?" }
  ],
  "userContext": {
    "name": "Rahul",
    "income": "125000",
    "netWorth": "5200000"
  }
}
```

### Chat Response

```json
{
  "success": true,
  "response": "You can save up to ₹1.5L under 80C...",
  "source": "gemini",
  "timestamp": "2026-05-17T10:30:00.000Z"
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No* | Google Gemini API key |
| `HF_TOKEN` | No* | Hugging Face inference token |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |
| `FRONTEND_URL` | No | CORS origin in production |

*\*At least one AI provider must be configured, or the chatbot falls back to offline mode.*

---

## Security Notes

- **Never commit `.env`** — it's in `.gitignore`
- API keys are stored **server-side only** and proxied through `/api/chat`
- Input is sanitized against XSS before reaching AI APIs
- Rate limiting prevents abuse (30 req/min per IP)
- Security headers block framing, sniffing, and reflective XSS
- In production, set `NODE_ENV=production` for HSTS and restricted CORS

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Frontend (main) | Vanilla JS, Tailwind CSS, Chart.js |
| Frontend (react) | React 19, TypeScript, Vite, Zustand, Recharts, Framer Motion |
| AI | Google Gemini 2.0 Flash, Hugging Face Flan-T5 |
| PWA | Service Worker, Web App Manifest |
| Icons | Font Awesome 6, Lucide React |

---

## Development

```bash
# Run backend with auto-restart (requires nodemon)
npx nodemon server.js

# Build React frontend
cd client && npm run build

# Preview React build
cd client && npm run preview

# Lint React code
cd client && npm run lint
```

---

## License

Built for **PSB Hackathon Series 2026** — Cyber Security & Fraud in Wealth Management domain.
