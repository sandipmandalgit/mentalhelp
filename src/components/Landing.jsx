// Landing / intro page. The first thing a new visitor sees before signing in.

const PILLARS = [
  {
    kicker: 'Reads between the lines',
    title: 'The trigger underneath',
    body: 'Not "you seem stressed." MannMitra names the specific thing you haven\'t — fear of disappointing your father, the friend whose rank you keep checking — and gives you one 60-second thing to do about it.'
  },
  {
    kicker: 'Across the week',
    title: 'Patterns you can\'t see yourself',
    body: 'It reads your last several entries together and surfaces the one pattern standard mood trackers miss — the Sunday-night dread, the days your sleep breaks before a mock.'
  },
  {
    kicker: 'The quiet centerpiece',
    title: 'A letter from future you',
    body: 'Once you\'ve written enough, it writes you a letter — as yourself, five years from now, on the far side of the exam. It remembers exactly what tonight felt like.'
  }
]

export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-8 flex items-center justify-between">
        <div>
          <span className="font-serif text-2xl text-ink">MannMitra<span className="text-lamp">.</span></span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-sm font-sans text-faded hover:text-lamp"
        >
          Sign in
        </button>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8">
        <section className="pt-20 sm:pt-28 fade-in">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-faded mb-5">
            मन मित्र · your mind's quiet friend
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] text-ink max-w-2xl">
            A companion for the nights the exam feels louder than you.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-faded italic mt-6 max-w-xl leading-snug">
            Write down your day. MannMitra reads what you couldn't say out loud —
            and reminds you who you'll be after all this.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-ink text-paper font-sans text-sm tracking-wide hover:bg-lamp"
            >
              Begin tonight
            </button>
            <span className="text-xs font-sans text-faded">
              No signup. Nothing leaves your device. Free.
            </span>
          </div>

          <p className="mt-6 text-sm font-sans text-faded">
            Built for students preparing for <span className="text-ink">NEET, JEE, UPSC, CAT, GATE, CUET</span> &amp; boards.
          </p>
        </section>

        {/* ── Pillars ────────────────────────────────────────────────────── */}
        <section className="mt-28 grid sm:grid-cols-3 gap-6 stagger">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-divider bg-paper/60 p-6">
              <p className="text-xs font-sans uppercase tracking-[0.18em] text-lamp mb-3">{p.kicker}</p>
              <h3 className="font-serif text-xl text-ink leading-snug mb-3">{p.title}</h3>
              <p className="text-sm font-sans text-faded leading-relaxed">{p.body}</p>
            </div>
          ))}
        </section>

        {/* ── Safety note ────────────────────────────────────────────────── */}
        <section className="mt-20">
          <div className="rounded-2xl border border-divider p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <p className="font-serif text-lg text-ink leading-snug max-w-xl">
              MannMitra is a companion, not a clinician. Every entry is quietly checked for crisis
              language and points to <span className="text-lamp">real Indian helplines</span> — Tele-MANAS, iCall, Vandrevala.
            </p>
            <a
              href="tel:14416"
              className="shrink-0 text-sm font-sans text-lamp underline underline-offset-4 hover:text-lampSoft"
            >
              Tele-MANAS · 14416
            </a>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────────────────────── */}
        <section className="mt-24 mb-28 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6">Tell tonight to the page.</h2>
          <button
            onClick={onGetStarted}
            className="px-7 py-3 rounded-full bg-ink text-paper font-sans text-sm tracking-wide hover:bg-lamp"
          >
            Begin tonight
          </button>
        </section>

        <footer className="pb-12 text-center">
          <p className="font-serif italic text-faded text-sm">MannMitra · मन मित्र</p>
        </footer>
      </main>
    </div>
  )
}
