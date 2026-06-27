import { useState } from 'react'

const MOODS = [
  { score: 1, emoji: '😞', label: 'awful' },
  { score: 2, emoji: '😕', label: 'low' },
  { score: 3, emoji: '😐', label: 'okay' },
  { score: 4, emoji: '🙂', label: 'good' },
  { score: 5, emoji: '😊', label: 'bright' }
]

export default function MoodCheckIn({ value, onChange }) {
  const [hover, setHover] = useState(null)
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-serif text-faded text-sm tracking-wide uppercase">How is tonight feeling</p>
        <span className="text-xs text-faded font-sans">
          {hover != null
            ? MOODS[hover].label
            : value
              ? MOODS.find(m => m.score === value)?.label
              : 'pick one'}
        </span>
      </div>
      <div className="flex gap-2">
        {MOODS.map((m, i) => {
          const selected = value === m.score
          return (
            <button
              key={m.score}
              onClick={() => onChange(m.score, m.label)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              aria-label={m.label}
              className={`flex-1 aspect-square text-3xl rounded-xl border ${
                selected
                  ? 'border-lamp bg-lamp/5 scale-105'
                  : 'border-divider hover:border-lamp/40 hover:bg-lamp/[0.02]'
              }`}
            >
              <span className={selected ? '' : 'opacity-60'}>{m.emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
