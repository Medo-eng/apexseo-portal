import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  ArrowDownRight,
  ArrowUpRight,
  FileSearch,
  HeartPulse,
  KeyRound,
  Link2,
  SearchCheck,
  TriangleAlert,
} from 'lucide-react'
import { Atmosphere } from './components/Atmosphere'
import { FilterBar } from './components/FilterBar'
import { KpiCards } from './components/KpiCards'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { Sidebar, type NavId } from './components/Sidebar'
import { TrafficChart } from './components/TrafficChart'
import { getDashboardData, type TimeRange } from './data/metrics'
import { useSpotlight } from './hooks/useSpotlight'

const PAGE_TITLES: Record<NavId, string> = {
  overview: 'Overview',
  keywords: 'Keyword Tracker',
  audit: 'Site Audit',
  competitors: 'Competitor Analysis',
  settings: 'Settings',
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

const KEYWORDS = [
  { kw: 'best local seo tools', pos: 4, delta: 6 },
  { kw: 'small business website traffic', pos: 9, delta: 3 },
  { kw: 'organic rank tracker', pos: 11, delta: -1 },
  { kw: 'domain authority checker', pos: 15, delta: 2 },
]

const HEALTH = [
  {
    label: 'Indexable pages',
    value: '248',
    tone: 'neutral' as const,
    icon: FileSearch,
  },
  {
    label: 'Crawl errors',
    value: '3',
    tone: 'warn' as const,
    icon: TriangleAlert,
  },
  {
    label: 'Core Web Vitals',
    value: 'Good',
    tone: 'good' as const,
    icon: HeartPulse,
  },
  {
    label: 'Backlinks (new)',
    value: '+27',
    tone: 'good' as const,
    icon: Link2,
  },
]

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<NavId>('overview')
  const [range, setRange] = useState<TimeRange>('30d')
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState(() => getDashboardData('30d'))
  const keywordsSpotlight = useSpotlight()
  const healthSpotlight = useSpotlight()

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialLoading(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isDesktop) setMobileOpen(false)
  }, [isDesktop])

  const sidebarCollapsed = isDesktop ? collapsed : false
  const sidebarOffset = isDesktop ? (collapsed ? 76 : 256) : 0

  const fetchForRange = useCallback((next: TimeRange) => {
    setRefreshing(true)
    window.setTimeout(() => {
      setData(getDashboardData(next))
      setRange(next)
      setRefreshing(false)
    }, 700)
  }, [])

  const handleNavigate = (id: NavId) => {
    setActiveNav(id)
    setMobileOpen(false)
  }

  const placeholderCopy = useMemo(
    () => ({
      keywords:
        'Keyword Tracker demo view — connect Search Console to track rankings in production.',
      audit:
        'Site Audit demo view — crawl health, Core Web Vitals, and indexation issues land here.',
      competitors:
        'Competitor Analysis demo view — side-by-side SERP share and keyword gap charts.',
      settings:
        'Settings demo view — workspace members, alert thresholds, and data sources.',
    }),
    [],
  )

  return (
    <div className="min-h-screen text-apex-text">
      <Atmosphere />

      {isDesktop && (
        <Sidebar
          collapsed={sidebarCollapsed}
          active={activeNav}
          onToggle={() => setCollapsed((v) => !v)}
          onNavigate={handleNavigate}
        />
      )}

      {!isDesktop && (
        <>
          <div
            className={clsx(
              'fixed inset-0 z-40 bg-black/65 backdrop-blur-md transition-opacity duration-300',
              mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={() => setMobileOpen(false)}
            aria-hidden={!mobileOpen}
          />
          <div
            className={clsx(
              'fixed inset-y-0 left-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              mobileOpen ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            <Sidebar
              collapsed={false}
              active={activeNav}
              onToggle={() => setMobileOpen(false)}
              onNavigate={handleNavigate}
            />
          </div>
        </>
      )}

      <div
        className="relative min-h-screen transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ paddingLeft: sidebarOffset }}
      >
        <FilterBar
          range={range}
          onRangeChange={fetchForRange}
          onOpenSidebar={() => setMobileOpen(true)}
          pageTitle={PAGE_TITLES[activeNav]}
        />

        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
          {initialLoading ? (
            <LoadingSkeleton />
          ) : activeNav === 'overview' ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <KpiCards kpi={data.kpi} refreshing={refreshing} />
                <TrafficChart data={data.chart} refreshing={refreshing} />
              </div>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div
                  onMouseMove={keywordsSpotlight.onMove}
                  className="spotlight-card glass-panel rounded-2xl p-5 lg:col-span-2 animate-fade-in-up"
                  style={{ animationDelay: '360ms' }}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-apex-text">
                      <KeyRound className="h-4 w-4 text-apex-indigo" />
                      Top Moving Keywords
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-apex-muted">
                      <SearchCheck className="h-3.5 w-3.5" />
                      Rank delta
                    </span>
                  </div>
                  <p className="text-sm text-apex-muted">
                    Rank deltas over the selected window
                  </p>
                  <ul className="mt-5 space-y-2">
                    {KEYWORDS.map((row, i) => (
                      <li
                        key={row.kw}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-transparent bg-white/[0.02] px-3.5 py-3 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                        style={{ animationDelay: `${400 + i * 60}ms` }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="font-metric text-[11px] font-medium text-slate-500">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                            {row.kw}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-metric text-xs text-apex-muted">
                            #{row.pos}
                          </span>
                          <span
                            className={clsx(
                              'inline-flex items-center gap-0.5 rounded-lg px-2 py-1 font-metric text-xs font-semibold',
                              row.delta >= 0
                                ? 'bg-apex-emerald/12 text-apex-emerald'
                                : 'bg-apex-crimson/12 text-apex-crimson',
                            )}
                          >
                            {row.delta >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(row.delta)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  onMouseMove={healthSpotlight.onMove}
                  className="spotlight-card glass-panel rounded-2xl p-5 animate-fade-in-up"
                  style={{ animationDelay: '420ms' }}
                >
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-apex-text">
                    <HeartPulse className="h-4 w-4 text-apex-emerald" />
                    Health Snapshot
                  </h3>
                  <p className="mt-1 text-sm text-apex-muted">
                    Quick signals for this demo workspace
                  </p>
                  <dl className="mt-5 space-y-2.5">
                    {HEALTH.map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent px-3.5 py-3 transition-colors hover:border-white/10"
                        >
                          <dt className="flex items-center gap-2 text-sm text-apex-muted">
                            <Icon
                              className={clsx(
                                'h-3.5 w-3.5',
                                item.tone === 'good' && 'text-apex-emerald',
                                item.tone === 'warn' && 'text-amber-400',
                                item.tone === 'neutral' && 'text-apex-indigo',
                              )}
                            />
                            {item.label}
                          </dt>
                          <dd
                            className={clsx(
                              'font-metric text-sm font-semibold',
                              item.tone === 'good' && 'text-apex-emerald',
                              item.tone === 'warn' && 'text-amber-400',
                              item.tone === 'neutral' && 'text-apex-text',
                            )}
                          >
                            {item.value}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              </section>
            </div>
          ) : (
            <div className="animate-fade-in-up rounded-2xl border border-dashed border-white/15 bg-apex-card/40 px-6 py-20 text-center backdrop-blur-md">
              <p className="font-display text-2xl font-bold text-apex-text">
                {PAGE_TITLES[activeNav]}
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-apex-muted">
                {placeholderCopy[activeNav]}
              </p>
              <button
                type="button"
                onClick={() => setActiveNav('overview')}
                className="mt-8 rounded-xl bg-gradient-to-r from-apex-indigo to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.4)] transition-transform hover:scale-[1.02]"
              >
                Back to Overview
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
