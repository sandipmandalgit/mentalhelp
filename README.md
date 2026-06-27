# MannMitra · मन मित्र

> **A quiet, GenAI-powered companion for Indian students preparing for high-stakes entrance exams (NEET, JEE, UPSC, CAT, GATE, CUET).**
>
> MannMitra reads what students journal about their day and surfaces **hidden stress triggers and emotional patterns standard mood trackers miss** — then offers one tiny, culturally-grounded intervention per entry. Once a week, it writes them a letter from themselves, five years in the future, after they've crossed the exam.

---

## ⚡ Run it (60 seconds)

```bash
npm install
cp .env.example .env.local
# open .env.local and paste your Gemini API key from
# https://aistudio.google.com/apikey
npm run dev
```

App opens at `http://localhost:5173`. Comes pre-seeded with a believable NEET-aspirant's week so the dashboard and Letter from Future You demo instantly.

---

## 🧭 What's in here

Three things that no generic "AI mood tracker" does:

1. **Per-entry analysis** — Gemini reads each journal entry and returns the *hidden trigger* underneath (not "you're stressed" but *"fear of disappointing your father about NEET results"*), plus a 60-second intervention grounded in Indian student life — chai breaks, calling your sibling — not "light a candle and meditate."

2. **Pattern Dashboard** — synthesizes the last 7+ entries and surfaces the **one pattern the student probably hasn't noticed themselves**. ("Your worst entries cluster around Sunday nights — likely because Monday means a new mock cycle.") This is the literal ask of the challenge: *patterns standard trackers miss*.

3. **Letter from Future You** — the emotional centerpiece. Gemini reads the entries and writes a 150-word letter from the student, 5 years from now, after they've cracked the exam. References specific worries by name. Reveals with a typewriter animation. **This is the demo moment.**

Plus: voice journaling (Web Speech API, Indian English), keyword + AI-flagged crisis detection with **real Indian helplines** (Tele-MANAS 14416, iCall, Vandrevala Foundation), exam-target switcher, and a paper-and-ink design that doesn't look like every other wellness app.

---

## 🎤 60-second demo script

1. **Open the app.** "This is MannMitra — मन मित्र, mind-friend. A GenAI companion for Indian students prepping for entrance exams." *(point at handwritten font)* "The student's own words render in handwriting. The AI replies in print. Two voices, two pens."
2. **Scroll to Patterns dashboard.** "Pre-seeded with a week from a NEET aspirant. The AI's read all of it. The big black card here is the *one pattern they haven't named themselves* — Sunday-night dread, comparison to a friend named Aman. Standard mood trackers can't do this."
3. **Click Letter from Future You.** Wait for it to type out. "This is written as them, by them, five years from now. It references Aman by name. It references the night they sat at the chai stall lying about a fever. It's not generic. This is a person who remembers exactly what tonight felt like."
4. **Scroll back up, write a new entry live.** Mood + a sentence about stress. Hit Save & reflect. "And every entry triggers fresh analysis with a hidden trigger and a 60-second action."
5. **(If asked about safety):** "The app scans every entry for crisis language and surfaces actual Indian helplines — Tele-MANAS, iCall, Vandrevala. Not a Western therapy bot. Built for this audience."

---

## 🧱 Stack

- **Vite + React 18** — fast dev, single-page, no router needed
- **Gemini 2.5 Flash** via REST with `responseSchema` for reliable structured JSON
- **Tailwind via CDN** with custom design tokens (warm paper, deep ink, lamp teal)
- **Google Fonts**: Fraunces (serif), Inter (sans), Kalam (handwriting — designed for Indian scripts)
- **Web Speech API** with `en-IN` locale for voice journaling
- **localStorage** for entries — no backend, no signup, instant demo

Production would proxy Gemini calls through a backend; for this hackathon the key sits in `.env.local` and is included in the client bundle, which is the standard practical tradeoff and worth calling out if a judge asks.

---

## 🪶 Design notes

The aesthetic isn't the default "calm pastel wellness app" — it's late-night-diary. Warm off-white paper, deep ink, one quiet banker's-lamp teal accent. The signature move: the student's text renders in **Kalam** (a Google font designed for Indian handwriting), the AI's voice renders in **Fraunces serif**. The visual conversation tells you which voice you're reading.

Built solo in 2 hours.
