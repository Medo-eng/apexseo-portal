import { useCallback, type CSSProperties, type MouseEvent } from 'react'

export function useSpotlight() {
  const onMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  const style = undefined as CSSProperties | undefined

  return { onMove, style }
}
