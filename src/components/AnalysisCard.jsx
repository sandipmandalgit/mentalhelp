export default function AnalysisCard({ analysis }) {
  if (!analysis) return null
  const { detected_emotions, hidden_trigger, supportive_reflection, intervention } = analysis

  return (
    <div className="fade-up mt-8 space-y-6">
      <div className="hairline" />

      <div className="font-serif text-faded text-xs tracking-[0.2em] uppercase">MannMitra writes back</div>

      <p className="font-serif text-xl leading-relaxed text-ink">
        {supportive_reflection}
      </p>

      <div className="flex flex-wrap gap-2">
        {detected_emotions?.map((e, i) => (
          <span key={i} className="px-3 py-1 text-xs font-sans rounded-full border border-divider text-faded bg-paper">
            {e}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-divider bg-paper/60 p-5 stagger">
        <p className="text-xs font-sans uppercase tracking-wider text-lamp mb-2">What I notice underneath</p>
        <p className="font-serif text-lg text-ink leading-snug">{hidden_trigger}</p>
      </div>

      <div className="rounded-xl border border-lamp/30 bg-lamp/[0.04] p-5">
        <p className="text-xs font-sans uppercase tracking-wider text-lamp mb-2">A small thing to try — 60 seconds</p>
        <p className="font-serif text-lg text-ink mb-3">{intervention.title}</p>
        <p className="text-sm text-faded font-sans mb-4">{intervention.description}</p>
        <ol className="space-y-2">
          {intervention.steps?.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm font-sans text-ink">
              <span className="font-serif text-lamp">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
