// Gemini 2.5 Flash. Structured outputs via responseSchema for reliable JSON.
//
// Two paths:
//  • Production (Vercel): calls /api/gemini, a serverless proxy that holds the
//    key server-side (process.env.GEMINI_API_KEY) so it never reaches the browser.
//  • Local dev: if VITE_GEMINI_API_KEY is set in .env.local, calls Gemini
//    directly — so `npm run dev` works without running the serverless function.

const DEV_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'

async function callGeminiDirect({ prompt, schema, temperature }) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
      ...(schema && { responseSchema: schema })
    }
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${DEV_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  )
  if (!res.ok) {
    const errTxt = await res.text()
    throw new Error(`Gemini ${res.status}: ${errTxt.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty Gemini response')
  return JSON.parse(text)
}

async function callGeminiProxy({ prompt, schema, temperature }) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, schema, temperature })
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try { const e = await res.json(); if (e?.error) msg = e.error } catch { /* non-JSON error */ }
    throw new Error(msg)
  }
  return res.json()
}

async function callGemini({ prompt, schema, temperature = 0.8 }) {
  return DEV_KEY
    ? callGeminiDirect({ prompt, schema, temperature })
    : callGeminiProxy({ prompt, schema, temperature })
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ENTRY ANALYSIS — runs after each journal entry
// ─────────────────────────────────────────────────────────────────────────────

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    detected_emotions: { type: 'array', items: { type: 'string' }, maxItems: 3 },
    hidden_trigger: { type: 'string' },
    supportive_reflection: { type: 'string' },
    intervention: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        steps: { type: 'array', items: { type: 'string' }, maxItems: 4 }
      },
      required: ['title', 'description', 'steps']
    },
    crisis_flag: { type: 'boolean' }
  },
  required: ['detected_emotions', 'hidden_trigger', 'supportive_reflection', 'intervention', 'crisis_flag']
}

export async function analyzeEntry({ entry, moodLabel, examTarget }) {
  const prompt = `You are MannMitra — a wise, warm older-sibling figure to an Indian student preparing for ${examTarget || 'a competitive entrance exam'}.

You are NOT a therapist. You are a calm friend who's been through this. You speak plainly. You never use phrases like "I understand" or "that must be hard". You show you read what they wrote by referencing specific details from it.

The student just journaled:
"""
${entry}
"""
Their mood today: ${moodLabel}

Cultural context: Indian competitive-exam students live with intense parental expectations, coaching-center pressure, peer-ranking culture, and identity tied to outcomes. Don't be Western-therapy-generic. Be specific to their world.

Return JSON matching this contract:
- detected_emotions: up to 3 precise emotion words (not just "sad" — try "deflated", "resentful", "untethered")
- hidden_trigger: ONE specific underlying trigger you notice that they likely haven't named themselves. Not "stress". Try "fear of becoming invisible to your father if you don't crack NEET". One sentence, sharp.
- supportive_reflection: 1–2 sentences. Reference a SPECIFIC detail from their entry (a name, a number, a moment). No platitudes.
- intervention: one 60-second action with a title, one-sentence description, and 2–3 concrete steps. Make it culturally grounded — a chai break, calling a sibling, writing a single sentence — not "light a candle and journal".
- crisis_flag: true ONLY if the entry contains explicit suicidal ideation, self-harm, severe hopelessness, or signs of acute crisis. Otherwise false.`

  return callGemini({ prompt, schema: ANALYSIS_SCHEMA, temperature: 0.75 })
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATTERN DASHBOARD — synthesizes the last N entries
// ─────────────────────────────────────────────────────────────────────────────

const PATTERN_SCHEMA = {
  type: 'object',
  properties: {
    top_triggers: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          trigger: { type: 'string' },
          evidence: { type: 'string' },
          frequency: { type: 'string' }
        },
        required: ['trigger', 'evidence', 'frequency']
      }
    },
    emotional_arc: { type: 'string' },
    one_insight: { type: 'string' },
    gentle_strength: { type: 'string' }
  },
  required: ['top_triggers', 'emotional_arc', 'one_insight', 'gentle_strength']
}

export async function findPatterns({ entries, examTarget }) {
  const entryBlock = entries
    .slice(-10)
    .map((e, i) => `[${i + 1}] ${e.date} — mood: ${e.moodLabel}\n${e.text}`)
    .join('\n\n')

  const prompt = `You are MannMitra, analyzing patterns across an Indian student's recent journal entries. They're preparing for ${examTarget || 'a competitive entrance exam'}.

Your job: surface patterns they HAVEN'T NAMED THEMSELVES. Standard mood trackers miss this. You don't.

Entries (oldest → newest):
${entryBlock}

Return JSON:
- top_triggers: up to 3. Each = a specific recurring stress source, with evidence (when/how it showed up — quote a fragment if useful) and frequency (e.g. "appeared in 4 of 7 entries"). Be specific — not "academic pressure" but "comparison to Aman's mock scores".
- emotional_arc: 1–2 sentences on the trajectory across these entries. Honest. Not falsely cheerful.
- one_insight: the ONE pattern they probably haven't noticed themselves. Be brave. Example shape: "Your worst entries cluster around Sunday nights — likely because Monday means a new mock cycle." Make it land.
- gentle_strength: ONE specific resilient thing you notice they're doing. Quote a phrase from their own entries if you can. Make them see themselves clearly.

If there are fewer than 3 entries, still respond — just note what you can with what you have.`

  return callGemini({ prompt, schema: PATTERN_SCHEMA, temperature: 0.7 })
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LETTER FROM FUTURE YOU — the emotional centerpiece
// ─────────────────────────────────────────────────────────────────────────────

const LETTER_SCHEMA = {
  type: 'object',
  properties: { letter: { type: 'string' } },
  required: ['letter']
}

export async function letterFromFuture({ entries, examTarget }) {
  const futureRole = ({
    NEET: 'a second-year MBBS student now',
    JEE: 'a second-year IIT engineering student now',
    UPSC: 'an IAS officer in your first posting now',
    CAT: 'a first-year MBA student at an IIM now',
    GATE: 'in your dream M.Tech program now',
    CUET: 'in the central university you wanted now',
    'Board Exams': 'in your chosen college now'
  })[examTarget] || 'past this exam now, doing what you wanted to do'

  const entryBlock = entries
    .slice(-7)
    .map((e) => `(${e.date}, mood ${e.moodLabel}) ${e.text}`)
    .join('\n---\n')

  const prompt = `You are writing a letter FROM a future version of this student — 5 years from today — back to them tonight.

Future-them is ${futureRole}. They cracked the exam. They survived.

Their journal entries from the past week:
${entryBlock}

Write the letter in FIRST PERSON ("I remember…", "you don't know yet that…"). 140–180 words. Reference 2 or 3 SPECIFIC details from their entries — names, numbers, moments — so it's unmistakably written by someone who remembers exactly what tonight felt like.

Tone: warm, slightly amused, deeply tender. Not preachy. Not "everything happens for a reason". Don't promise they'll definitely crack it — instead promise that the version of them reading this letter will be okay either way, and explain why you know that.

Sign off exactly: "— You, five years from now"

Return JSON: { "letter": "..." }`

  return callGemini({ prompt, schema: LETTER_SCHEMA, temperature: 0.95 })
}
