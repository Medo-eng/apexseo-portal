import { useEffect, useState } from 'react'

export function useCountUp(
  target: number,
  duration = 900,
  decimals = 0,
  enabled = true,
) {
  const [value, setValue] = useState(enabled ? 0 : target)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()
    const from = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      const next = from + (target - from) * eased
      setValue(Number(next.toFixed(decimals)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, decimals, enabled])

  return value
}
