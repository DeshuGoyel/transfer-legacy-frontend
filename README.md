# Transfer Legacy — Frontend Web Application

<div align="center">

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node Version](https://img.shields.io/badge/Node.js-20_LTS-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Post-Quantum Security](https://img.shields.io/badge/Security-ML--KEM--768_Ready-critical.svg?style=flat-square)](https://csrc.nist.gov/pubs/fips/203/final)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg?style=flat-square)](#license)

**Protect the legacy. Transfer the access.**  
The premier zero-knowledge digital asset inheritance, liveness attestation, and estate continuity platform.

[Live Platform](https://transferlegacy.com) • [Detailed Architecture](project-detailed.md) • [Design System](DESIGN.md) • [Backend Repository](https://github.com/ItsMeVikashKumarSingh/transfer-legacy-backend)

</div>

---

## 📌 Overview

**Transfer Legacy** solves the critical, multi-billion-dollar vulnerability in digital asset succession. Trillions of dollars in cryptocurrency, private keys, financial credentials, business continuity instructions, and legal directives are permanently lost each year due to sudden incapacitation, memory loss, or death.

Transfer Legacy bridges this gap through a cryptographic fortress:
- **Zero-Knowledge Architecture:** Master keys and sensitive payloads are encrypted purely on your client device using AES-256-GCM / Argon2id before ever touching the network. We cannot view, access, or decrypt your vault.
- **Liveness Detection (Dead Man's Switch):** Automated heartbeat signals monitor activity across configurable time windows with progressive grace periods and multi-channel alerts.
- **M-of-N Guardian Governance:** Release authorization requires multi-signature challenge attestation from trusted guardians based on a configurable quorum threshold.
- **Post-Quantum Forward Secrecy:** Integrated with NIST-standardized **ML-KEM-768** key encapsulation to protect long-term inheritance payloads against harvest-now-decrypt-later quantum threats.

---

## ✨ Key Features

### 🔐 1. Zero-Knowledge Digital Inheritance Vault
- Securely store seed phrases, hardware wallet backups, master passwords, server keys, corporate directives, and personal letters.
- **Client-Side Envelope Encryption:** Data is encrypted via AES-256-GCM with keys derived using Argon2id. Only ciphertext and cryptographic metadata reach the server.
- **IndexedDB Hardware Isolation:** Local device signing keys are safely persisted in non-extractable IndexedDB storage, preventing cross-site scripting extraction.

### ⏱️ 2. Smart Liveness Heartbeats
- Periodic check-in triggers (e.g., 30, 60, 90, 180 days) via Email, SMS, and OneSignal Web Push notifications.
- Escalated grace periods before any claim protocol can activate.
- Streak tracking and instant single-click dashboard check-ins.

### 🛡️ 3. M-of-N Guardian Quorum & Heir Portal
- Assign trusted family members, legal counsel, or institutional fiduciaries as guardians and heirs.
- Cryptographic Shamir's secret sharing and multi-signature quorum (e.g., 2-of-3, 3-of-5).
- Challenge-response attestation flow with rate-limited, tamper-evident claim processing.

### 🤖 4. AI Legacy Planner & Guided Recovery
- **AI Estate Audit:** Powered by Google Gemini 2.5 Flash to scan asset configurations, calculate digital estate readiness scores, and detect coverage blind spots.
- **Heir Guidance System:** Step-by-step interactive recovery wizard tailored for non-technical family members to safely claim and unwrap legacy directives.

### 🌐 5. SEO, Content & Global Legal Engine
- **Dynamic Content & Blog Engine:** Integrated markdown-based blog (`/blog`, `/blog/:slug`) with category filtering, reading time calculation, and verified E-E-A-T author schema.
- **Competitor Comparisons:** Direct feature matrices comparing Transfer Legacy against DGLegacy, Inheriti, and traditional probate wills.
- **Regional Compliance Hubs:** Region-specific estate law guides for the United States (RUFADAA), United Kingdom, India (IT Act & Digital Succession), and the UAE (DIFC Wills).
- **Interactive Financial Tools:** Inheritance Tax Calculator, Digital Asset ROI Calculator, and Crypto Risk Estimator.
- **GEO / AI Citability:** Complete structured `llms.txt` and `llms-full.txt` knowledge dossiers optimized for LLM search engines (Perplexity, Gemini, ChatGPT).

### ⚙️ 6. Operations & Admin Management
- Live database integration for real-time user management, active plan subscriptions, and coupon validations.
- Audit trails, contact message processing, waitlist toggles, and system health telemetry.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) + Rollup |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Lucide Icons |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **3D & Animation** | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Spline](https://spline.design/), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| **Cryptography** | Web Crypto API (AES-256-GCM), Argon2id, `@noble/ciphers`, ML-KEM-768 |
| **Push Notifications**| [OneSignal SDK](https://onesignal.com/) |
| **Testing** | Playwright, Cucumber BDD, Vitest |
| **Deployment** | Cloudflare Pages, Vercel, Netlify |

---

## 📂 Project Architecture

```
Transfer Legacy-frontend/
├── public/                       # Static public assets
│   ├── images/                   # Visuals, author badges, and brand assets
│   ├── llms.txt                  # Concise AI / search agent context dossier
│   ├── llms-full.txt             # Exhaustive enterprise knowledge base for LLMs
│   ├── robots.txt                # Search engine crawler policies
│   └── sitemap.xml               # Canonical XML sitemap index
├── src/
│   ├── assets/                   # Bundled icons and logos
│   ├── components/               # Modular UI components
│   │   ├── admin/                # Operations and back-office management views
│   │   ├── ai/                   # AI Legacy Planner modal and assistant
│   │   ├── auth/                 # Login, Signup, MFA, Password reset flows
│   │   ├── dashboard/            # Vault overview, assets, guardians, heartbeats
│   │   ├── layout/               # Navigation, Footer, Theme toggle, Notification drawer
│   │   ├── legal/                # Terms of Service, Privacy Policy, Compliance
│   │   ├── seo/                  # Dynamic Meta tags, JSON-LD Schemas, Analytics
│   │   └── ui/                   # Reusable atomics (buttons, modals, badges, cards)
│   ├── data/                     # Blog articles, comparison data, legal templates
│   ├── hooks/                    # Custom React hooks (auth, theme, sound, responsive)
│   ├── lib/                      # API clients, AEAD wrappers, OneSignal integration
│   ├── pages/                    # Routed page views (Landing, Pillars, Tools, Blog)
│   ├── services/                 # Backend API services, Supabase, crypto orchestration
│   ├── store/                    # Zustand global application state slices
│   ├── tests/                    # Unit and integration test suites
│   ├── utils/                    # Formatting, date arithmetic, cryptographic helpers
│   ├── App.tsx                   # Main route tree with lazy loading & route guards
│   └── main.tsx                  # Application bootstrap entrypoint
├── .node-version                 # Locked to Node 20 LTS
├── .nvmrc                        # Node Version Manager config (20)
├── package.json                  # Dependencies, build scripts, and engine constraints
└── vite.config.ts                # Vite build and development configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v20.x LTS` (strictly recommended; see `.nvmrc`)
- **Package Manager:** `npm` (v10 or higher)

```bash
# Verify your active Node and npm versions
node -v   # Expected: v20.x.x
npm -v    # Expected: 10.x.x
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github-vikash:DeshuGoyel/transfer-legacy-frontend.git
   cd transfer-legacy-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to configure your API endpoints and third-party service keys (see reference below).

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   The local application will be accessible at: `http://localhost:5173`

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint for the Transfer Legacy backend API | `http://localhost:8080/v1` |
| `VITE_SERVER_AEAD_KEY` | Hex or Base64 key for app-layer client-server AEAD envelope | `001122...` |
| `VITE_ONESIGNAL_APP_ID` | Application ID for OneSignal web push notifications | `your-onesignal-app-id` |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 measurement tag | `G-XXXXXXXXXX` |
| `VITE_WAITLIST_ENABLED` | Toggle public waitlist onboarding mode (`true`/`false`) | `false` |

---

## 🧪 Available Scripts

```bash
# Start local development server with Hot Module Replacement (HMR)
npm run dev

# Compile TypeScript and build production bundle into /dist
npm run build

# Preview the local production build
npm run preview

# Execute ESLint static analysis
npm run lint

# Run Playwright end-to-end test suites
npx playwright test

# Run Cucumber BDD feature specifications
npm run test:e2e
```

---

## 🔒 Security & Threat Model

Transfer Legacy operates on the uncompromising principle that **the client is the ultimate cryptographic boundary**:

1. **Master Key Non-Custody:** Master secrets are computed purely in browser memory from your passphrase and salt via Argon2id. The raw master key is never transmitted or stored on any server.
2. **Subkey Derivation:** Discrete subkeys are derived for:
   - Data encryption (`AES-256-GCM`)
   - Device signature authentication (`Ed25519`)
   - Guardian fragment shares (`Shamir's Secret Sharing`)
3. **Replay & Tamper Defense:** All state-changing API payloads carry an HMAC request signature, unique `x-nonce`, sequence number `x-seq`, and monotonic timestamp `x-timestamp`.
4. **Post-Quantum Defense:** Support for NIST FIPS 203 ML-KEM-768 key encapsulation ensures that encrypted vaults remain mathematically impenetrable even against future cryptanalytically relevant quantum computers (CRQCs).

---

## 🚢 Deployment

The frontend builds to a standard, static Single-Page Application (`dist/`) suitable for global Edge CDN hosting:

- **Cloudflare Pages:** Build command `npm run build`, build output directory `dist`. Node 20 is automatically detected via `.nvmrc` and `.node-version`.
- **Vercel:** Fully supported via `vercel.json` rewrite routing.
- **Netlify:** Supported via `netlify.toml` with Single-Page Application rewrite rules.

---

## 📄 License & Attribution

Copyright © 2026 Transfer Legacy Global. All rights reserved.  
Unauthorized copying, reverse engineering, or redistribution of this software is strictly prohibited.
