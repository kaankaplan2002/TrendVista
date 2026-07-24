# ⚡ TrendVista AI — Next-Gen Social Trend Operating System

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-00D2FF?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**TrendVista AI** is a state-of-the-art, closed-loop AI platform designed for content creators, agencies, and enterprise brands. It captures early viral signals across **TikTok**, **Instagram Reels**, and **YouTube Shorts**, translating raw social velocity data into tailored video script formats, high-CTR hook ideas, and actionable campaign intelligence.

---

## 🌟 Key Features

### 📊 1. Real-Time Social Trend Radar
- **Multi-Category Coverage:** 30+ sample trends updated across 6 core niches (*Beauty & Skincare, Tech & AI, Fashion & Style, Gaming & Esports, Food & Gastronomy, Health & Fitness*).
- **Global Signal Intelligence:** Filter trends by country (*US, TR, GB, DE*) and platform (*TikTok, Instagram Reels, YouTube Shorts*).
- **Match Affinity Score:** AI-calculated compatibility score (e.g. 96% match) with lifecycle stage indicators (*Early Signal, Accelerating, Peak, Maturing*).

### 🤖 2. AI Content Creation Studio
- **Automated Script Generation:** 3-step structured video scripts including *Visual Cues, Audio Direction, and Voiceover Transcripts*.
- **Tone Personalization:** Energetic, Minimalist, Educational, Storytelling, or Sales-driven tone selections.
- **Auto Captions & Hashtag Packs:** Platform-optimized captions and viral tag bundles ready to copy & publish.

### 🎵 3. Viral Audio & Music Lab
- **Trending Audio Tracker:** Track rising 15-second audio clips and sound effects across social platforms.
- **Live Soundwave Preview:** Interactive audio playback with direct one-click export into the AI Content Studio.

### 🪝 4. Viral Hook Bank
- **High-CTR Hook Archive:** Filterable repository of battle-tested video hooks (*Curiosity & Mystery, Negative Hook, Transformation, Secret & Hack*).
- **One-Click Script Integration:** Send selected hooks directly into script generators for instant video production.

### 💼 5. Brand Campaign Hub
- **AI Brief Writer:** Generate 1-minute creator campaign briefs based on product URLs or target demographics.
- **Influencer Matchmaker:** AI-recommended creator profiles with reach projections and engagement analytics.
- **Brand Safety Analysis:** AI risk assessment scoring before sponsoring viral trends.

### 🌐 6. Multi-Lingual & Globalized Engine
- **10 Supported Languages:** Seamless real-time UI & data translation for *English (EN), Turkish (TR), German (DE), French (FR), Spanish (ES), Italian (IT), Russian (RU), Japanese (JA), Chinese (ZH), and Arabic (AR)*.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite JS) |
| **Styling & Aesthetics** | Custom Vanilla CSS (Glassmorphism & Cyberpunk Neon Theme) |
| **Icons & UI** | Lucide React Icons & Canvas Confetti |
| **State & Auth** | Supabase Authentication & React Context (Demo Mode Fallback) |
| **AI Integration** | Google Gemini 1.5 Pro / Flash API Integration |
| **Export Engines** | jsPDF + html2canvas for PDF Invoices & Campaign Brief Exports |
| **Payment Gateway** | iyzico Checkout Modal Simulator |

---

## 📁 Project Architecture

```
TrendVista/
├── public/
│   ├── favicon.svg
│   └── manifest.json         # PWA Manifest Configuration
├── src/
│   ├── assets/               # Brand & Graphic Assets
│   ├── components/
│   │   ├── LandingPage.jsx         # Hero, Trend Widget, Chatbot, Testimonials, 4-Col Footer
│   │   ├── CreatorWorkspace.jsx    # Live Radar, Studio, Hook Bank, Audio Lab, Settings
│   │   ├── BrandWorkspace.jsx      # Campaign Brief Generator & Creator Matchmaking
│   │   ├── NotificationCenter.jsx  # Top Navigation Notification Center Dropdown
│   │   ├── UserProfileModal.jsx    # Custom Avatar Uploader & Account Settings
│   │   ├── LegalNoticeModal.jsx    # Privacy Policy, KVKK, Terms Popups
│   │   └── IyzicoModal.jsx         # Subscription Checkout Modal
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication Provider
│   ├── lib/
│   │   ├── gemini.js               # AI Script & Hook Generator Engine
│   │   ├── pdfExporter.js          # Client-side PDF Generation Engine
│   │   ├── socialTrendFetcher.js   # Hybrid Realtime Trend Aggregator
│   │   └── voiceoverPlayer.js      # Speech Synthesis Web API
│   ├── App.jsx                     # Root Application & Multi-Lingual Provider
│   └── main.jsx                    # Application Entry Point
├── index.html                      # HTML5 Entry Point
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js** `>= 18.0.0`
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kaankaplan2002/TrendVista.git
   cd TrendVista
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional for AI API / Supabase):**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Launch local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy

- Full compliance with international Data Protection Policies (GDPR / KVKK).
- Interactive modals provided for **Privacy Policy**, **KVKK Notice**, and **Terms of Service**.
- Client-side token storage & zero data exposure on public routes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>TrendVista AI</b> — Empowering Creators & Brands with Real-Time Viral Signals.
</p>
