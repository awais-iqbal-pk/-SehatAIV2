# ╔══════════════════════════════════════════════════════════════╗
# ║            SEHAT AI v2.0 — OFFICIAL DOCUMENTATION            ║
# ║         Pakistan's AI Health Assistant — FYP + Business     ║
# ║           Built Solo by: Awais Iqbal (@awais-iqbal-pk)      ║
# ╚══════════════════════════════════════════════════════════════╝

> [!IMPORTANT]
> **GitHub Repository:** [https://github.com/awais-iqbal-pk/-SehatAIV2](https://github.com/awais-iqbal-pk/-SehatAIV2)
> All rights reserved. Built as a Solo Final Year Project (FYP).

## ═══════════════════════════════════════════════════════════════
## WHAT THIS PROJECT IS
## ═══════════════════════════════════════════════════════════════

Sehat AI is a comprehensive AI-powered health assistant application tailored for Pakistan. 
Developed exclusively by **Awais Iqbal**, this project integrates cutting-edge AI orchestration 
(Gemini, GPT, DeepSeek, Qwen) to provide medical insights, medicine scanning, and doctor appointments 
in both Urdu and English.

## ═══════════════════════════════════════════════════════════════
## COMPLETE FILE STRUCTURE
## ═══════════════════════════════════════════════════════════════

SehatAIV2/
├── backend/                         Node.js + Express server
│   ├── server.js                    Main entry point
│   ├── .env                         ← (IGNORED FOR SECURITY)
│   ├── models/                      MongoDB Schemas
│   ├── routes/                      API Endpoints
│   ├── middleware/                  Auth & Security
│   └── utils/                       Multi-AI Engine & Scrapers
│
└── mobile/                          React Native + Expo app
    ├── App.js                       Navigation Logic
    ├── src/
    │   ├── screens/                 35+ Specialized Screens
    │   ├── components/              UI Modules
    │   ├── store/                   Zustand State Management
    │   └── i18n/                    Urdu & English Localization

## ═══════════════════════════════════════════════════════════════
## CORE FEATURES (100% Solo Development)
## ═══════════════════════════════════════════════════════════════

✅ **Advanced AI Engine**: Intelligent fallback across 4 major AI models.
✅ **Local Context**: Full support for Urdu language and Pakistani health helplines.
✅ **Medicine Intelligence**: AI-based scanning and OpenFDA search.
✅ **Doctor Appointment System**: Complete booking flow for Pakistani doctors.
✅ **Health Tracking**: Dedicated modules for Pregnancy, Elderly Care, and Mental Health.
✅ **Financial System**: Subscription tiers with local payment method support (PKR).

## ═══════════════════════════════════════════════════════════════
## SETUP INSTRUCTIONS
## ═══════════════════════════════════════════════════════════════

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file (see documentation for keys)
4. `npm start`

### 2. Mobile App Setup
1. `cd mobile`
2. `npm install`
3. Update `BASE_URL` in `src/utils/api.js` to your Local IP.
4. `npx expo start`

## ═══════════════════════════════════════════════════════════════
## CREDITS & OWNERSHIP
## ═══════════════════════════════════════════════════════════════

This project was conceived, designed, and developed entirely by:
**Awais Iqbal**
- **Role**: Lead Full-Stack Developer & AI Architect
- **GitHub**: [@awais-iqbal-pk](https://github.com/awais-iqbal-pk)
- **Institution**: UET Lahore

"The best way to predict the future is to build it." — Alan Kay
