import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  Gauge,
  LogOut,
  Menu,
  Settings,
  User,
} from 'lucide-react'
import clsx from 'clsx'
import type { TimeRange } from '../data/metrics'

const RANGES: TimeRange[] = ['24h', '7d', '30d', '90d']

interface FilterBarProps {
  range: TimeRange
  onRangeChange: (range: TimeRange) => void
  onOpenSidebar: () => void
  pageTitle: string
}

export function FilterBar({
  range,
  onRangeChange,
  onOpenSidebar,
  pageTitle,
}: FilterBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Map<TimeRange, HTMLButtonElement>>(new Map())
  const [pill, setPill] = useState({ left: 0, width: 0 })

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useLayoutEffect(() => {
    const track = trackRef.current
    const btn = btnRefs.current.get(range)
    if (!track || !btn) return
    const trackRect = track.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setPill({
      left: btnRect.left - trackRect.left,
      width: btnRect.width,
    })
  }, [range])

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#070a12]/72 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-xl border border-white/10 bg-apex-card/80 p-2.5 text-apex-muted transition-all hover:border-apex-indigo/40 hover:text-apex-text lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-apex-muted">
              <Gauge className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Command center
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-apex-text sm:text-[1.75rem]">
              {pageTitle}
            </h1>
            <p className="mt-0.5 text-sm text-apex-muted">
              Monitor traffic, keywords, and ranking health
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div
            ref={trackRef}
            role="group"
            aria-label="Time range"
            className="range-pill-track relative flex items-center rounded-2xl border border-white/10 bg-apex-card/70 p-1 shadow-inner shadow-black/20"
          >
            <span
              className="range-pill-active"
              style={{ left: pill.left, width: pill.width }}
              aria-hidden
            />
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                ref={(el) => {
                  if (el) btnRefs.current.set(r, el)
                  else btnRefs.current.delete(r)
                }}
                onClick={() => onRangeChange(r)}
                className={clsx(
                  'relative z-10 rounded-xl px-3.5 py-2 font-metric text-xs font-semibold transition-colors duration-200',
                  range === r
                    ? 'text-white'
                    : 'text-apex-muted hover:text-apex-text',
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="relative rounded-xl border border-white/10 bg-apex-card/80 p-2.5 text-apex-muted transition-all hover:border-apex-indigo/40 hover:text-apex-text"
            aria-label="3 unread notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-apex-crimson px-1 font-metric text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="group flex items-center gap-2.5 rounded-2xl border border-white/10 bg-apex-card/80 py-1.5 pl-1.5 pr-3 transition-all hover:border-apex-indigo/35"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-apex-indigo to-indigo-800 font-metric text-xs font-bold text-white shadow-[0_0_18px_rgba(99,102,241,0.35)]">
                JR
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-apex-text">Jordan Rhea</p>
                <p className="text-[11px] font-medium text-apex-muted">
                  Owner · Pro
                </p>
              </div>
              <ChevronDown
                className={clsx(
                  'h-3.5 w-3.5 text-apex-muted transition-transform duration-300',
                  menuOpen && 'rotate-180',
                )}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 animate-fade-in-up overflow-hidden rounded-2xl border border-white/10 bg-[#121826]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
              >
                {[
                  { icon: User, label: 'Profile' },
                  { icon: Settings, label: 'Account settings' },
                  { icon: LogOut, label: 'Sign out' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-apex-muted transition-colors hover:bg-white/5 hover:text-apex-text"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
