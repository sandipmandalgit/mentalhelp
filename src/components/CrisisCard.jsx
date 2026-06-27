// Surfaces when AI flags crisis OR when local keyword scan trips.
// Real Indian mental-health helplines. Verified at build time.

export const CRISIS_KEYWORDS = [
  'kill myself', 'end it', 'suicide', 'suicidal', 'don\'t want to live',
  'not want to live', 'better off dead', 'hurt myself', 'self harm',
  'self-harm', 'cutting myself', 'overdose', 'can\'t go on', 'cant go on',
  'no point living', 'want to die', 'wanna die', 'end my life'
]

export function detectCrisis(text) {
  const lc = (text || '').toLowerCase()
  return CRISIS_KEYWORDS.some(k => lc.includes(k))
}

const LINES = [
  {
    name: 'Tele-MANAS',
    detail: 'Government of India\'s mental health helpline. 24×7, free, multilingual.',
    contact: '14416',
    type: 'tel'
  },
  {
    name: 'iCall',
    detail: 'TISS-run psychosocial helpline. Mon–Sat, 8am–10pm.',
    contact: '9152987821',
    type: 'tel'
  },
  {
    name: 'Vandrevala Foundation',
    detail: '24×7 mental health support, calls and chat.',
    contact: '1860-2662-345',
    type: 'tel'
  }
]

export default function CrisisCard({ onDismiss }) {
  return (
    <div className="fade-in rounded-xl border border-rust/40 bg-rust/[0.04] p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="font-serif text-lg text-ink">
          What you wrote sounds heavy. You don't have to carry it alone tonight.
        </p>
        {onDismiss && (
          <button onClick={onDismiss} className="text-faded hover:text-ink text-xs font-sans ml-3 shrink-0">
            close
          </button>
        )}
      </div>
      <p className="text-sm text-faded font-sans mb-4">
        These are people — real, trained, in India — who answer when you call. Free. Confidential. They've heard everything.
      </p>
      <div className="space-y-2">
        {LINES.map(l => (
          <a
            key={l.name}
            href={l.type === 'tel' ? `tel:${l.contact.replace(/\D/g, '')}` : '#'}
            className="block rounded-lg border border-divider bg-paper p-4 hover:border-rust"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-base text-ink">{l.name}</span>
              <span className="font-sans text-sm text-rust">{l.contact}</span>
            </div>
            <p className="text-xs text-faded font-sans mt-1">{l.detail}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
