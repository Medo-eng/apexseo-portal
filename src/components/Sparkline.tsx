interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
}

export function Sparkline({
  data,
  width = 56,
  height = 18,
  className = 'stroke-apex-emerald',
}: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 1

  const coords = data.map((value, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad
    const y = height - pad - ((value - min) / range) * (height - pad * 2)
    return { x, y }
  })

  const points = coords.map((c) => `${c.x},${c.y}`).join(' ')
  const area = `M ${coords[0].x},${height} L ${points} L ${coords[coords.length - 1].x},${height} Z`
  const last = coords[coords.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <polyline
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={className}
        style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.6))' }}
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="2"
        className="fill-apex-emerald"
        style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.9))' }}
      />
    </svg>
  )
}
