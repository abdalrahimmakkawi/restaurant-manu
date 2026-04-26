# Nusantara Dish Manager 🍽️

**Dish Information Management System** — Shenyang Aerospace University  
Student: CHEBLI IBRAHIM ALEX (毕瑞) | ID: 245152011801

Built with React 19 + TypeScript + Firebase (Firestore + Auth) + Tailwind CSS v4.

---

## Features (All 10 from spec)

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | Login with username/password | Firebase Auth (email + Google OAuth) |
| 2 | Add new dish | Slide-out form panel → Firestore |
| 3 | Delete dish | Table row delete with confirmation |
| 4 | Modify dish | Edit button → pre-filled form panel |
| 5 | Display all dishes | Inventory table with all fields |
| 6 | Search by name or ID | Real-time search filter in toolbar |
| 7 | Sort by price ascending | Column sort toggle (any column) |
| 8 | Count by type | Analytics bar chart in Overview |
| 9 | Import from file | CSV upload in Data Management |
| 10 | Store in database | Firebase Firestore (real-time sync) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local and add your Gemini key (optional)
cp .env.example .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## First Time Setup

1. Open the app → click **Create Account** to register
2. After login, go to **Data Management** tab
3. Click **"Add All 33 Sample Dishes"** to populate with real Indonesian food data
4. Navigate to **Inventory** or **Overview** to see the data

---

## Dish Data (33 Authentic Indonesian Dishes)

All prices are in **IDR (Indonesian Rupiah)**:

| Category | Dishes | Price Range |
|----------|--------|-------------|
| Ayam | 3 dishes | Rp 28.000 – 38.000 |
| Sapi | 3 dishes | Rp 48.000 – 62.000 |
| Ikan | 3 dishes | Rp 35.000 – 48.000 |
| Udang | 3 dishes | Rp 42.000 – 55.000 |
| Tempe | 3 dishes | Rp 12.000 – 18.000 |
| Tahu | 3 dishes | Rp 10.000 – 16.000 |
| Telur | 3 dishes | Rp 12.000 – 20.000 |
| Kambing | 3 dishes | Rp 52.000 – 65.000 |
| Minuman | 3 dishes | Rp 5.000 – 15.000 |
| Kue & Dessert | 3 dishes | Rp 8.000 – 35.000 |
| Nasi | 3 dishes | Rp 5.000 – 25.000 |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4, Framer Motion
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Icons**: Lucide React

## Firebase Config

Already configured in `src/lib/firebase.ts` using the provided credentials.  
Firestore database: `ai-studio-c0c13f44-f062-4b12-ac12-eab5b335bd90`
