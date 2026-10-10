# ✈️ BEEMVOY — Mobile-First AI Travel Planner

BEEMVOY is a mobile-first travel MVP designed to turn natural language travel prompts into fully synchronized, day-by-day itineraries. Built with Next.js, Tailwind CSS, Supabase, Gemini, and SerpApi, it offers a seamless travel planning experience locked to a sleek mobile viewport.

---

## 📱 Core Features ("Core 5 Scope")

1. **AUTH-01 / AUTH-02 (Authentication & Onboarding):** Mandatory Supabase OAuth / Email Sign-In with interactive traveler preference selection (Budget, Pace, Interests).
2. **HOME-01 (Natural Language Search):** AI-powered prompt input for instant itinerary generation (e.g., *"3 days in Goa under ₹15,000"*).
3. **FLT-01 (Flight Search):** Scannable flight cards with distinct **Best**, **Cheapest**, and **Fastest** badges.
4. **HOT-01 (Hotel Search):** Curated hotel stays with nightly rates, total pricing, amenities, and guest ratings.
5. **ITN-01 (Interactive Itinerary):** A chronological vertical timeline uniting booked flights, hotel stays, and local activities into a single canonical Trip state.

---

## 🛠️ Tech Stack

* **Framework:** React / Next.js
* **Styling:** Tailwind CSS (Lilac Haven Design Tokens)
* **Authentication & Database:** Supabase
* **Search Proxy:** Server-side SerpApi Proxy (`/api/search`)
* **AI Generation:** Google Gemini API

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/pnpm installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/neelabhx/beemvoy.git
cd beemvoy
