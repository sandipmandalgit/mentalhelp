import { useEffect, useMemo, useState } from 'react'
import MoodCheckIn from './components/MoodCheckIn'
import JournalEntry from './components/JournalEntry'
import AnalysisCard from './components/AnalysisCard'
import PatternDashboard from './components/PatternDashboard'
import FutureLetter from './components/FutureLetter'
import CrisisCard, { detectCrisis } from './components/CrisisCard'
import { analyzeEntry } from './lib/gemini'
import { loadEntries, saveEntries, loadConfig, saveConfig, clearAll } from './lib/storage'

const EXAMS = ['NEET', 'JEE', 'UPSC', 'CAT', 'GATE', 'CUET', 'Board Exams']

export default function App({ user, onSignOut }) {
  const firstName = user?.name?.trim().split(/\s+/)[0]
  // — config / api key —
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const [config, setConfig] = useState(() => loadConfig())

  // — entries —
  const [entries, setEntries] = useState(() => loadEntries() ?? [])
  useEffect(() => saveEntries(entries), [entries])
  useEffect(() => saveConfig(config), [config])

  // — current draft —
  const [mood, setMood] = useState(null)
  const [moodLabel, setMoodLabel] = useState(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [crisis, setCrisis] = useState(false)

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 5) return 'It\'s late'
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    if (h < 21) return 'Good evening'
    return 'Late hours again'
  }, [])

  async function submitEntry() {
    if (!mood || text.trim().length < 8) return
    setBusy(true); setError(null)

    // Local keyword scan first — runs even if API fails
    const localCrisis = detectCrisis(text)
    if (localCrisis) setCrisis(true)

    try {
      const analysis = await analyzeEntry({
        entry: text,
        moodLabel,
        examTarget: config.examTarget
      })
      const newEntry = {
        id: 'e' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        moodScore: mood,
        moodLabel,
        text,
        analysis
      }
      setEntries(prev => [...prev, newEntry])
      setCurrentAnalysis(analysis)
      if (analysis.crisis_flag) setCrisis(true)
      // soft-clear draft but keep visible analysis
      setText(''); setMood(null); setMoodLabel(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Setup screen only in local dev with no key ────────────────────────────
  // In production the serverless proxy (/api/gemini) holds the key, so the
  // browser doesn't need one — never block the deployed app.
  if (import.meta.env.DEV && !apiKey) return <SetupScreen />

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight text-ink">
              MannMitra<span className="text-lamp">.</span>
            </h1>
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-faded mt-1">
              मन मित्र · your mind's quiet friend
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={config.examTarget}
              onChange={(e) => setConfig({ ...config, examTarget: e.target.value })}
              className="text-xs font-sans bg-transparent border border-divider rounded-full px-3 py-1.5 text-faded hover:border-lamp focus:outline-none focus:border-lamp cursor-pointer"
            >
              {EXAMS.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-xs font-sans text-faded hover:text-rust"
              >
                sign out
              </button>
            )}
          </div>
        </div>

        <nav className="flex gap-6 mt-8 text-sm font-sans">
          <button onClick={() => scrollTo('tonight')} className="text-ink hover:text-lamp">Tonight</button>
          <button onClick={() => scrollTo('patterns')} className="text-faded hover:text-lamp">Patterns</button>
          <button onClick={() => scrollTo('future')} className="text-faded hover:text-lamp">Future you</button>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">
        {/* ── TONIGHT ──────────────────────────────────────────────────────── */}
        <section id="tonight" className="pt-8">
          <div className="fade-in">
            <p className="font-serif text-xs tracking-[0.2em] uppercase text-faded mb-2">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-1">
              {greeting}{firstName ? `, ${firstName}` : ''}.
            </h2>
            <p className="font-serif text-2xl text-faded italic">
              Tell tonight to the page.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            <MoodCheckIn
              value={mood}
              onChange={(score, label) => { setMood(score); setMoodLabel(label) }}
            />

            <JournalEntry
              value={text}
              onChange={setText}
              onSubmit={submitEntry}
              busy={busy}
              disabled={!mood}
            />

            {!mood && (
              <p className="text-xs text-faded font-sans italic">Pick a mood above, then write — even one sentence counts.</p>
            )}

            {error && (
              <div className="rounded-xl border border-rust/40 bg-rust/[0.04] p-4 text-sm font-sans text-ink">
                Something went sideways calling Gemini: <span className="text-rust">{error}</span>
              </div>
            )}

            {crisis && <CrisisCard onDismiss={() => setCrisis(false)} />}

            {currentAnalysis && <AnalysisCard analysis={currentAnalysis} />}
          </div>
        </section>

        {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
        <div className="my-20 flex items-center gap-4 text-faded">
          <div className="flex-1 hairline" />
          <span className="font-serif italic text-sm">across the week</span>
          <div className="flex-1 hairline" />
        </div>

        {/* ── PATTERNS ─────────────────────────────────────────────────────── */}
        <section id="patterns">
          <PatternDashboard entries={entries} examTarget={config.examTarget} />
        </section>

        {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
        <div className="my-20 flex items-center gap-4 text-faded">
          <div className="flex-1 hairline" />
          <span className="font-serif italic text-sm">a letter, then sleep</span>
          <div className="flex-1 hairline" />
        </div>

        {/* ── FUTURE LETTER ────────────────────────────────────────────────── */}
        <section id="future">
          <FutureLetter entries={entries} examTarget={config.examTarget} />
        </section>

        {/* ── ENTRY LIST (collapsed) ───────────────────────────────────────── */}
        <section className="mt-24">
          <EntriesList entries={entries} onClear={() => {
            if (confirm('Clear all entries? This cannot be undone.')) {
              clearAll(); setEntries([])
            }
          }} />
        </section>

        <footer className="mt-24 text-center">
          <p className="font-serif italic text-faded text-sm">
            MannMitra is a companion, not a clinician.<br/>
            If you're in crisis, call <a className="text-lamp underline underline-offset-4" href="tel:14416">Tele-MANAS · 14416</a>.
          </p>
        </footer>
      </main>
    </div>
  )
}

// ── Entries list (collapsed, expandable) ───────────────────────────────────
function EntriesList({ entries, onClear }) {
  const [open, setOpen] = useState(false)
  if (entries.length === 0) return null
  const sorted = [...entries].slice().reverse()
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-xs font-sans uppercase tracking-[0.2em] text-faded hover:text-lamp"
      >
        {open ? '— hide' : '+ show'} {entries.length} past entries
      </button>
      {open && (
        <div className="mt-6 space-y-3 fade-in">
          {sorted.map(e => (
            <details key={e.id} className="rounded-xl border border-divider bg-paper/60 p-4">
              <summary className="cursor-pointer flex items-baseline justify-between gap-3">
                <span className="font-serif text-ink">{e.date}</span>
                <span className="text-xs text-faded font-sans">{e.moodLabel}</span>
              </summary>
              <p className="font-hand text-base text-ink mt-3 whitespace-pre-wrap">{e.text}</p>
            </details>
          ))}
          <button
            onClick={onClear}
            className="text-xs font-sans text-rust/70 hover:text-rust underline-offset-4 hover:underline mt-3"
          >
            clear all entries
          </button>
        </div>
      )}
    </div>
  )
}

// ── Setup screen if no API key ─────────────────────────────────────────────
function SetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center fade-in">
        <h1 className="font-serif text-4xl text-ink mb-3">MannMitra<span className="text-lamp">.</span></h1>
        <p className="font-serif italic text-faded mb-8">One small setup, then we can begin.</p>
        <div className="rounded-xl border border-divider bg-paper/60 p-6 text-left font-sans text-sm text-ink space-y-3">
          <p>Create a file at the project root named <code className="bg-divider/40 px-1.5 py-0.5 rounded">.env.local</code>:</p>
          <pre className="bg-ink text-paper p-3 rounded text-xs overflow-x-auto">VITE_GEMINI_API_KEY=your_key_here</pre>
          <p className="text-faded text-xs">Get a key from <span className="text-lamp">aistudio.google.com/apikey</span>. Then restart <code className="bg-divider/40 px-1 rounded">npm run dev</code>.</p>
        </div>
      </div>
    </div>
  )
}
