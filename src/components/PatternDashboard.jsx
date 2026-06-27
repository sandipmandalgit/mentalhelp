import { useEffect, useState } from 'react'
import { findPatterns } from '../lib/gemini'

export default function PatternDashboard({ entries, examTarget }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function run() {
    if (entries.length === 0) return
    setLoading(true); setError(null)
    try {
      const result = await findPatterns({ entries, examTarget })
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // auto-run on mount if there's enough data
  useEffect(() => { if (entries.length >= 2) run() /* eslint-disable-next-line */ }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl text-ink">Patterns this week</h2>
        <button
          onClick={run}
          disabled={loading || entries.length === 0}
          className="text-xs font-sans text-faded hover:text-lamp underline-offset-4 hover:underline disabled:opacity-30"
        >
          {loading ? 'reading…' : data ? 'reanalyze' : 'analyze'}
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-faded font-sans text-sm">No entries yet. Patterns appear once you've written a few.</p>
      )}

      {loading && !data && (
        <div className="space-y-3">
          <SkeletonLine /><SkeletonLine /><SkeletonLine width="70%" />
        </div>
      )}

      {error && <p className="text-rust text-sm font-sans">{error}</p>}

      {data && (
        <div className="space-y-6 stagger">
          {/* The headline insight — the thing standard trackers miss */}
          <div className="rounded-xl bg-ink text-paper p-6">
            <p className="text-xs font-sans uppercase tracking-[0.2em] opacity-60 mb-3">What you may not have noticed</p>
            <p className="font-serif text-xl leading-snug">{data.one_insight}</p>
          </div>

          {/* Top triggers */}
          <div>
            <p className="font-serif text-faded text-xs tracking-[0.2em] uppercase mb-4">Recurring triggers</p>
            <div className="space-y-3">
              {data.top_triggers?.map((t, i) => (
                <div key={i} className="rounded-xl border border-divider bg-paper/60 p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="font-serif text-lg text-ink">{t.trigger}</p>
                    <span className="text-xs font-sans text-lamp shrink-0 ml-3">{t.frequency}</span>
                  </div>
                  <p className="text-sm text-faded font-sans italic">{t.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arc + strength */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-divider p-4">
              <p className="text-xs font-sans uppercase tracking-wider text-faded mb-2">The arc</p>
              <p className="font-serif text-ink text-base leading-snug">{data.emotional_arc}</p>
            </div>
            <div className="rounded-xl border border-lamp/30 bg-lamp/[0.04] p-4">
              <p className="text-xs font-sans uppercase tracking-wider text-lamp mb-2">What you're doing right</p>
              <p className="font-serif text-ink text-base leading-snug">{data.gentle_strength}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SkeletonLine({ width = '100%' }) {
  return <div className="h-3 rounded bg-divider/60 animate-pulse" style={{ width }} />
}
