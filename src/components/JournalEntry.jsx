import { useEffect, useRef, useState } from 'react'

// Web Speech API streams audio to the browser vendor's servers (Google, for
// Chrome), so most failures are environmental, not app bugs. Map the raw codes
// to something a student can actually act on.
const VOICE_ERRORS = {
  network: 'Voice couldn\'t reach the speech service. It needs an internet connection and works only in Google Chrome — Brave, Edge and Firefox usually block it. A VPN or college/office network can block it too. You can keep typing instead.',
  'not-allowed': 'Microphone access is blocked. Allow the mic for this site in your browser settings, then try again.',
  'service-not-allowed': 'Your browser won\'t allow voice transcription here. Use Google Chrome, or just type your entry.',
  'no-speech': 'I didn\'t catch anything — try speaking a little closer to the mic.',
  'audio-capture': 'No microphone found. Check that one is connected and enabled.',
  aborted: null // user stopped it; not worth showing an error
}

export default function JournalEntry({ value, onChange, onSubmit, disabled, busy }) {
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState(null)
  const recogRef = useRef(null)
  const startTextRef = useRef('')

  const supported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)

  function toggleVoice() {
    setVoiceError(null)
    if (!supported) {
      setVoiceError('Voice not supported in this browser — Chrome works best.')
      return
    }
    if (listening) {
      recogRef.current?.stop()
      return
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new Recognition()
    r.lang = 'en-IN'
    r.interimResults = true
    r.continuous = true
    startTextRef.current = value
    r.onresult = (ev) => {
      let interim = ''
      let final = ''
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const txt = ev.results[i][0].transcript
        if (ev.results[i].isFinal) final += txt
        else interim += txt
      }
      const sep = startTextRef.current && !startTextRef.current.endsWith(' ') ? ' ' : ''
      onChange((startTextRef.current + sep + final + interim).trimStart())
      if (final) startTextRef.current = (startTextRef.current + sep + final).trimStart()
    }
    r.onerror = (e) => {
      const msg = e.error in VOICE_ERRORS ? VOICE_ERRORS[e.error] : `Voice error: ${e.error}`
      if (msg) setVoiceError(msg)
      setListening(false)
    }
    r.onend = () => setListening(false)
    r.start()
    recogRef.current = r
    setListening(true)
  }

  useEffect(() => () => recogRef.current?.stop(), [])

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-serif text-faded text-sm tracking-wide uppercase">Your entry</p>
        <span className="text-xs text-faded font-sans">in your own words — or your own voice</span>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="What's on your mind tonight? Be honest with yourself — no one else is reading…"
          className="w-full min-h-[180px] p-5 pr-14 rounded-xl border border-divider bg-paper/60 font-hand text-lg leading-relaxed text-ink placeholder:text-faded/60 placeholder:font-sans placeholder:text-base resize-y focus:border-lamp"
        />
        <button
          onClick={toggleVoice}
          disabled={disabled}
          aria-label={listening ? 'Stop voice' : 'Start voice'}
          title={listening ? 'Stop' : 'Use voice'}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full border flex items-center justify-center ${
            listening ? 'bg-lamp text-paper border-lamp animate-pulse' : 'border-divider bg-paper hover:border-lamp text-faded hover:text-lamp'
          }`}
        >
          {listening ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect width="14" height="14" x="5" y="5" rx="2"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/>
            </svg>
          )}
        </button>
      </div>
      {voiceError && <p className="text-xs text-rust mt-2 font-sans">{voiceError}</p>}

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-faded font-sans">
          {value.trim().split(/\s+/).filter(Boolean).length} words
        </p>
        <button
          onClick={onSubmit}
          disabled={disabled || busy || value.trim().length < 8}
          className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-sans tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lamp"
        >
          {busy ? 'Reading what you wrote…' : 'Save & reflect'}
        </button>
      </div>
    </div>
  )
}
