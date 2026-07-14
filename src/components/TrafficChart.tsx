import { useMemo, useState, type CSSProperties } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import clsx from 'clsx'
import {
  Activity,
  Check,
  Leaf,
  LineChart as LineChartIcon,
  MousePointerClick,
} from 'lucide-react'
import type { ChartPoint } from '../data/metrics'
import { formatNumber } from '../data/metrics'
import { useSpotlight } from '../hooks/useSpotlight'

interface TrafficChartProps {
  data: ChartPoint[]
  refreshing: boolean
}

interface LegendKey {
  key: 'organic' | 'paid'
  label: string
  color: string
  glow: string
  icon: typeof Leaf
}

const LEGENDS: LegendKey[] = [
  {
    key: 'organic',
    label: 'Organic Traffic',
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.45)',
    icon: Leaf,
  },
  {
    key: 'paid',
    label: 'Paid Clicks',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.4)',
    icon: MousePointerClick,
  },
]

function CustomTooltip({
  active,
  payload,
  label,
  visible,
}: {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; value?: number; color?: string }>
  label?: string
  visible: Record<'organic' | 'paid', boolean>
}) {
  if (!active || !payload?.length) return null

  const rows = payload.filter((p) => {
    const key = String(p.dataKey)
    return (key === 'organic' || key === 'paid') && visible[key]
  })

  if (!rows.length) return null

  return (
    <div className="min-w-[190px] rounded-2xl border border-white/10 bg-[#0a101c]/92 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <p className="mb-2.5 font-metric text-[11px] font-medium uppercase tracking-[0.14em] text-apex-muted">
        {label}
      </p>
      <div className="space-y-2">
        {rows.map((row) => {
          const key = String(row.dataKey)
          const isOrganic = key === 'organic'
          const Icon = isOrganic ? Leaf : MousePointerClick
          const name = isOrganic ? 'Organic Traffic' : 'Paid Clicks'
          return (
            <div key={key} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: row.color }}
                />
                <span className="text-xs text-slate-300">{name}</span>
              </div>
              <span className="font-metric text-sm font-semibold text-apex-text">
                {formatNumber(row.value ?? 0)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TrafficChart({ data, refreshing }: TrafficChartProps) {
  const { onMove } = useSpotlight()
  const [visible, setVisible] = useState<Record<'organic' | 'paid', boolean>>({
    organic: true,
    paid: true,
  })

  const chartData = useMemo(() => data, [data])
  const chartKey = useMemo(
    () => `${data.length}-${data[0]?.organic ?? 0}-${data.at(-1)?.paid ?? 0}`,
    [data],
  )

  function toggle(key: 'organic' | 'paid') {
    setVisible((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (!next.organic && !next.paid) return prev
      return next
    })
  }

  return (
    <section
      onMouseMove={onMove}
      className="spotlight-card glass-panel relative overflow-hidden rounded-2xl"
    >
      {refreshing && (
        <div
          className="absolute inset-0 z-10 bg-apex-bg/40 backdrop-blur-[3px] animate-pulse-overlay"
          aria-busy="true"
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 z-0 h-56 w-56 rounded-full bg-apex-indigo/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/3 z-0 h-48 w-48 rounded-full bg-apex-emerald/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-3 border-b border-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-apex-text">
            <LineChartIcon className="h-4 w-4 text-apex-indigo" />
            Traffic Overview
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-apex-emerald">
            <Activity className="h-3.5 w-3.5" />
            Live metrics
          </span>
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Chart series"
        >
          {LEGENDS.map((legend) => {
            const on = visible[legend.key]
            const Icon = legend.icon
            return (
              <button
                key={legend.key}
                type="button"
                onClick={() => toggle(legend.key)}
                aria-pressed={on}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-300',
                  on
                    ? 'border-white/10 bg-white/[0.06] text-apex-text shadow-[0_0_24px_var(--glow)]'
                    : 'border-slate-800 bg-transparent text-slate-500 opacity-55',
                )}
                style={on ? ({ '--glow': legend.glow } as CSSProperties) : undefined}
              >
                <span
                  className={clsx(
                    'flex h-5 w-5 items-center justify-center rounded-md transition-all duration-300',
                    on ? 'text-white' : 'text-slate-500',
                  )}
                  style={on ? { background: legend.color } : undefined}
                >
                  {on ? (
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                </span>
                {legend.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        key={chartKey}
        className="relative z-10 h-[280px] w-full px-2 pb-2 pt-2 sm:h-[320px] sm:px-3"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="organicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="55%" stopColor="#6366F1" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="paidFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.28} />
                <stop offset="60%" stopColor="#10B981" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <filter id="glowIndigo" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              stroke="rgba(148,163,184,0.08)"
              strokeDasharray="2 8"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: '#64748b',
                fontSize: 11,
                fontFamily: 'Outfit',
              }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(30,41,59,0.9)' }}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              tick={{
                fill: '#64748b',
                fontSize: 11,
                fontFamily: 'Outfit',
              }}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
              }
            />
            <Tooltip
              content={<CustomTooltip visible={visible} />}
              cursor={{
                stroke: '#818cf8',
                strokeWidth: 1.5,
                strokeDasharray: '5 5',
                strokeOpacity: 0.85,
              }}
            />
            {visible.organic && (
              <Area
                type="monotone"
                dataKey="organic"
                stroke="none"
                fill="url(#organicFill)"
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              />
            )}
            {visible.paid && (
              <Area
                type="monotone"
                dataKey="paid"
                stroke="none"
                fill="url(#paidFill)"
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              />
            )}
            <Line
              type="monotone"
              dataKey="organic"
              name="Organic Traffic"
              stroke="#818cf8"
              strokeWidth={2.75}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#6366F1',
                stroke: '#070a12',
                strokeWidth: 3,
              }}
              hide={!visible.organic}
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
              filter="url(#glowIndigo)"
              style={{
                opacity: visible.organic ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
            <Line
              type="monotone"
              dataKey="paid"
              name="Paid Clicks"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#10B981',
                stroke: '#070a12',
                strokeWidth: 3,
              }}
              hide={!visible.paid}
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
              filter="url(#glowEmerald)"
              style={{
                opacity: visible.paid ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
