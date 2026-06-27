// Sign-in / onboarding. No backend — this creates a local session on the device
// and seeds the journal's exam target. Email is optional and never sent anywhere.

import { useState } from 'react'
import { loadConfig, saveConfig } from '../lib/storage'

const EXAMS = ['NEET', 'JEE', 'UPSC', 'CAT', 'GATE', 'CUET', 'Board Exams']

export default function Login({ onLogin, onBack }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [exam, setExam] = useState('NEET')
  const [error, setError] = useState(null)

  function submit(e) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Tell me what to call you — even a first name.')
      return
    }
    const cfg = loadConfig()
    saveConfig({ ...cfg, examTarget: exam, name: name.trim() })
    onLogin({ name: name.trim(), email: email.trim(), examTarget: exam })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="max-w-4xl w-full mx-auto px-6 sm:px-8 pt-8 flex items-center justify-between">
        <span className="font-serif text-2xl text-ink">MannMitra<span className="text-lamp">.</span></span>
        {onBack && (
          <button onClick={onBack} className="text-sm font-sans text-faded hover:text-lamp">
            ← back
          </button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md fade-in">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-faded mb-3">
            One small setup, then we begin
          </p>
          <h1 className="font-serif text-4xl text-ink leading-tight mb-2">
            Welcome in.
          </h1>
          <p className="font-serif text-lg text-faded italic mb-8">
            Nothing here leaves your device. This is just for you.
          </p>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block font-serif text-sm text-faded uppercase tracking-wide mb-2">
                What should I call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null) }}
                placeholder="Your name"
                autoFocus
                className="w-full p-3.5 rounded-xl border border-divider bg-paper/60 font-hand text-lg text-ink placeholder:text-faded/50 placeholder:font-sans placeholder:text-base focus:border-lamp focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-serif text-sm text-faded uppercase tracking-wide mb-2">
                Email <span className="normal-case tracking-normal text-faded/70">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3.5 rounded-xl border border-divider bg-paper/60 font-sans text-base text-ink placeholder:text-faded/50 focus:border-lamp focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-serif text-sm text-faded uppercase tracking-wide mb-2">
                What are you preparing for?
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-divider bg-paper/60 font-sans text-base text-ink focus:border-lamp focus:outline-none cursor-pointer"
              >
                {EXAMS.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>

            {error && <p className="text-rust text-sm font-sans">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-ink text-paper font-sans text-sm tracking-wide hover:bg-lamp"
            >
              Enter MannMitra
            </button>
          </form>

          <p className="text-xs font-sans text-faded text-center mt-6 leading-relaxed">
            There's no password to forget. Your entries and session stay in this browser,
            on this device — clear them anytime.
          </p>
        </div>
      </main>
    </div>
  )
}
