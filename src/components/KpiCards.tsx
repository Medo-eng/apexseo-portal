import { useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  CircleHelp,
  Gauge,
  Leaf,
  Target,
  Wallet,
  Zap,
} from 'lucide-react'
import type { KpiMetrics } from '../data/metrics'
import { formatCurrency, formatNumber } from '../data/metrics'
import { useCountUp } from '../hooks/useCountUp'
import { useSpotlight } from '../hooks/useSpotlight'
import { Sparkline } from './Sparkline'

interface KpiCardsProps {
  kpi: KpiMetrics
  refreshing: boolean
}

function SpotlightShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const { onMove } = useSpotlight()
  return (
    <article
      onMouseMove={onMove}
      className={`spotlight-card glass-panel rounded-2xl p-4 ${className}`}
    >
      {children}
    </article>
  )
}

export function KpiCards({ kpi, refreshing }: KpiCardsProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const traffic = useCountUp(kpi.organicTraffic, 1000, 0, !refreshing)
  const position = useCountUp(kpi.avgPosition, 900, 1, !refreshing)
  const authority = useCountUp(kpi.domainAuthority, 1000, 0, !refreshing)
  const budget = useCountUp(kpi.adBudgetSaved, 1100, 2, !refreshing)

  return (
    <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {refreshing && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-apex-bg/45 backdrop-blur-[3px] animate-pulse-overlay"
          aria-live="polite"
          aria-busy="true"
        />
      )}

      <SpotlightShell>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-apex-muted">
            <Leaf className="h-3.5 w-3.5 text-apex-emerald" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Organic Traffic
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-apex-indigo/15 px-1.5 py-0.5 text-[10px] font-semibold text-apex-indigo">
            <ArrowUpRight className="h-3 w-3" />
            Live
          </span>
        </div>
        <p className="mt-3 font-metric text-3xl font-semibold tracking-tight text-apex-text sm:text-[2.15rem]">
          {formatNumber(traffic)}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-apex-emerald/30 bg-apex-emerald/10 px-2.5 py-1">
          <span className="font-metric text-[11px] font-medium text-apex-emerald">
            +{kpi.organicTrafficChange}% vs last month
          </span>
          <Sparkline data={kpi.sparkline} />
        </div>
      </SpotlightShell>

      <SpotlightShell>
        <div className="flex items-center gap-2 text-apex-muted">
          <Target className="h-3.5 w-3.5 text-apex-indigo" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
            Average Position
          </p>
        </div>
        <p className="mt-3 font-metric text-3xl font-semibold tracking-tight text-apex-text sm:text-[2.15rem]">
          {position.toFixed(1)}
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-apex-emerald/30 bg-apex-emerald/10 px-2.5 py-1">
          <ArrowUpRight className="h-3 w-3 text-apex-emerald" />
          <span className="font-metric text-[11px] font-medium text-apex-emerald">
            +{kpi.avgPositionChange.toFixed(1)}
          </span>
          <span className="text-[11px] text-apex-muted">improvement</span>
        </div>
      </SpotlightShell>

      <SpotlightShell>
        <div className="flex items-center gap-2 text-apex-muted">
          <Gauge className="h-3.5 w-3.5 text-indigo-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
            Domain Authority
          </p>
        </div>
        <p className="mt-3 font-metric text-3xl font-semibold tracking-tight text-apex-text sm:text-[2.15rem]">
          {authority}
          <span className="text-base font-medium text-apex-muted">/100</span>
        </p>
        <div className="mt-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-white/5">
            <div
              key={kpi.domainAuthority}
              className="progress-bar-fill relative h-full rounded-full bg-gradient-to-r from-apex-indigo via-indigo-400 to-emerald-400"
              style={{ width: `${kpi.domainAuthority}%` }}
            >
              <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-40" />
            </div>
          </div>
          <p className="mt-2 font-metric text-[11px] text-apex-muted">
            Healthy range · Industry avg 38
          </p>
        </div>
      </SpotlightShell>

      <SpotlightShell className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-apex-muted">
            <Wallet className="h-3.5 w-3.5 text-amber-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Ad Budget Saved
            </p>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="About ad budget saved"
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(true)}
              onBlur={() => setTooltipOpen(false)}
              className="rounded-md p-0.5 text-apex-muted transition-colors hover:text-apex-text"
            >
              <CircleHelp className="h-3.5 w-3.5" />
            </button>
            {tooltipOpen && (
              <div
                role="tooltip"
                className="absolute right-0 top-full z-20 mt-2 w-56 animate-fade-in-up rounded-xl border border-slate-700/80 bg-[#0c1220]/95 px-3 py-2.5 text-xs leading-relaxed text-slate-300 shadow-2xl backdrop-blur-md"
              >
                Estimated PPC spend avoided by ranking organically for tracked
                keywords in the selected period.
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 font-metric text-3xl font-semibold tracking-tight text-apex-text sm:text-[2.15rem]">
          {formatCurrency(budget)}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-apex-muted">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          Paid clicks replaced by organic wins
        </div>
      </SpotlightShell>
    </div>
  )
}
