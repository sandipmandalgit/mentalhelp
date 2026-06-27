import { useEffect, useRef, useState } from 'react'
import { letterFromFuture } from '../lib/gemini'

export default function FutureLetter({ entries, examTarget }) {
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [shown, setShown] = useState('')
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  async function generate() {
    if (entries.length === 0) {
      setError('Write an entry first — future-you needs something to remember.')
      return
    }
    setLoading(true); setError(null); setLetter(''); setShown('')
    try {
      const { letter: txt } = await letterFromFuture({ entries, examTarget })
      setLetter(txt)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // typewriter reveal
  useEffect(() => {
    if (!letter) return
    setShown('')
    let i = 0
    const step = () => {
      i += 2 // 2 chars per tick for natural cadence
      setShown(letter.slice(0, i))
      if (i < letter.length) timerRef.current = setTimeout(step, 22)
    }
    step()
    return () => clearTimeout(timerRef.current)
  }, [letter])

  const isTyping = letter && shown.length < letter.length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-ink">A letter from you, five years from now</h2>
        <p className="text-sm text-faded font-sans mt-1">
          Future-you reads what you wrote this week and writes back.
        </p>
      </div>

      {!letter && !loading && (
        <button
          onClick={generate}
          className="px-5 py-2.5 rounded-full border border-lamp text-lamp hover:bg-lamp hover:text-paper font-sans text-sm tracking-wide"
        >
          Read the letter
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-faded font-sans text-sm">
          <span className="w-2 h-2 rounded-full bg-lamp animate-pulse" />
          Future-you is writing this carefully…
        </div>
      )}

      {error && <p className="text-rust text-sm font-sans">{error}</p>}

      {letter && (
        <div className="fade-up">
          <div className="rounded-xl border border-divider bg-paper/40 p-7 sm:p-9">
            <p className={`font-hand text-xl leading-relaxed text-ink whitespace-pre-wrap ${isTyping ? 'caret' : ''}`}>
              {shown}
            </p>
          </div>
          {!isTyping && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={generate}
                className="text-xs font-sans text-faded hover:text-lamp underline underline-offset-4"
              >
                rewrite
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(letter)}
                className="text-xs font-sans text-faded hover:text-lamp underline underline-offset-4"
              >
                copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
