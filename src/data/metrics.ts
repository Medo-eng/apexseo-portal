export type TimeRange = '24h' | '7d' | '30d' | '90d'

export interface ChartPoint {
  label: string
  organic: number
  paid: number
}

export interface KpiMetrics {
  organicTraffic: number
  organicTrafficChange: number
  avgPosition: number
  avgPositionChange: number
  domainAuthority: number
  adBudgetSaved: number
  sparkline: number[]
}

export interface DashboardData {
  kpi: KpiMetrics
  chart: ChartPoint[]
}

function seededNoise(seed: number, i: number): number {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function buildSeries(
  count: number,
  baseOrganic: number,
  basePaid: number,
  volatility: number,
  seed: number,
  labelFn: (i: number) => string,
): ChartPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i / 3.2) * volatility
    const drift = i * (volatility * 0.08)
    const n1 = seededNoise(seed, i) * volatility * 0.6
    const n2 = seededNoise(seed + 7, i) * volatility * 0.45
    return {
      label: labelFn(i),
      organic: Math.round(baseOrganic + wave + drift + n1),
      paid: Math.round(basePaid + wave * 0.45 - drift * 0.25 + n2),
    }
  })
}

const RANGE_CONFIG: Record<
  TimeRange,
  {
    kpi: KpiMetrics
    chartFactory: () => ChartPoint[]
  }
> = {
  '24h': {
    kpi: {
      organicTraffic: 1842,
      organicTrafficChange: 6.4,
      avgPosition: 11.8,
      avgPositionChange: 0.4,
      domainAuthority: 42,
      adBudgetSaved: 86.5,
      sparkline: [42, 48, 45, 52, 49, 58, 61, 55, 63, 68, 72, 70],
    },
    chartFactory: () =>
      buildSeries(24, 70, 28, 18, 24, (i) => `${String(i).padStart(2, '0')}:00`),
  },
  '7d': {
    kpi: {
      organicTraffic: 11240,
      organicTrafficChange: 9.1,
      avgPosition: 12.1,
      avgPositionChange: 1.2,
      domainAuthority: 42,
      adBudgetSaved: 312.0,
      sparkline: [120, 132, 128, 145, 160, 152, 175],
    },
    chartFactory: () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return buildSeries(7, 1400, 520, 220, 7, (i) => days[i])
    },
  },
  '30d': {
    kpi: {
      organicTraffic: 48291,
      organicTrafficChange: 14.2,
      avgPosition: 12.4,
      avgPositionChange: 3.1,
      domainAuthority: 42,
      adBudgetSaved: 1240.0,
      sparkline: [820, 860, 840, 910, 980, 1020, 990, 1080, 1140, 1200, 1180, 1260],
    },
    chartFactory: () =>
      buildSeries(30, 1500, 560, 280, 30, (i) => `Day ${i + 1}`),
  },
  '90d': {
    kpi: {
      organicTraffic: 142870,
      organicTrafficChange: 22.8,
      avgPosition: 13.6,
      avgPositionChange: 4.8,
      domainAuthority: 44,
      adBudgetSaved: 3680.0,
      sparkline: [2100, 2300, 2200, 2500, 2700, 2600, 2900, 3100, 3000, 3300, 3500, 3400],
    },
    chartFactory: () =>
      buildSeries(90, 1400, 500, 320, 90, (i) => `W${Math.floor(i / 7) + 1}`),
  },
}

export function getDashboardData(range: TimeRange): DashboardData {
  const config = RANGE_CONFIG[range]
  return {
    kpi: config.kpi,
    chart: config.chartFactory(),
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
