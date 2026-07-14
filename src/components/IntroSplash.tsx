import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import clsx from 'clsx'

interface IntroSplashProps {
  onComplete: () => void
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.body.style.overflow = prevOverflow
      onComplete()
      return
    }

    const exitTimer = window.setTimeout(() => setPhase('exit'), 2400)
    const doneTimer = window.setTimeout(onComplete, 3100)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      className={clsx(
        'intro-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden',
        phase === 'exit' && 'intro-splash--exit',
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading ApexSEO Portal"
    >
      <div className="intro-splash__grid" aria-hidden />
      <div className="intro-splash__orb intro-splash__orb--a" aria-hidden />
      <div className="intro-splash__orb intro-splash__orb--b" aria-hidden />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="intro-splash__mark mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-apex-indigo via-indigo-500 to-indigo-800 shadow-[0_0_40px_rgba(99,102,241,0.55)]">
          <BarChart3 className="h-7 w-7 text-white" strokeWidth={2.4} />
          <span className="intro-splash__mark-shine" aria-hidden />
        </div>

        <p className="intro-splash__eyebrow mb-3 font-metric text-[11px] font-semibold uppercase tracking-[0.28em] text-apex-muted">
          Command center
        </p>

        <h1 className="intro-splash__title font-display text-4xl font-bold tracking-tight text-apex-text sm:text-5xl">
          <span className="intro-splash__word">Apex</span>
          <span className="intro-splash__word intro-splash__word--accent">SEO</span>
        </h1>

        <p className="intro-splash__tagline mt-3 max-w-sm text-sm text-apex-muted sm:text-base">
          Traffic, keywords, and rankings — in one calm view.
        </p>

        <div className="intro-splash__track mt-8 h-[2px] w-44 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <span className="intro-splash__bar block h-full w-full origin-left rounded-full bg-gradient-to-r from-apex-indigo via-indigo-400 to-apex-emerald" />
        </div>

        <p className="intro-splash__status mt-3 font-metric text-[11px] font-medium tracking-wide text-slate-500">
          Initializing workspace…
        </p>
      </div>

      <div className="intro-splash__wipe" aria-hidden />
    </div>
  )
}
