import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  ScanSearch,
  Settings,
  Swords,
  LayoutDashboard,
} from 'lucide-react'
import clsx from 'clsx'

export type NavId =
  | 'overview'
  | 'keywords'
  | 'audit'
  | 'competitors'
  | 'settings'

interface SidebarProps {
  collapsed: boolean
  active: NavId
  onToggle: () => void
  onNavigate: (id: NavId) => void
}

const NAV_ITEMS: {
  id: NavId
  label: string
  icon: typeof LayoutDashboard
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'keywords', label: 'Keyword Tracker', icon: KeyRound },
  { id: 'audit', label: 'Site Audit', icon: ScanSearch },
  { id: 'competitors', label: 'Competitor Analysis', icon: Swords },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({
  collapsed,
  active,
  onToggle,
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-[#0c111c]/85 backdrop-blur-2xl transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-apex-indigo/10 via-transparent to-apex-emerald/5" />

      <div
        className={clsx(
          'relative flex h-[72px] items-center border-b border-white/5 px-4',
          collapsed ? 'justify-center' : 'justify-between gap-2',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-apex-indigo via-indigo-500 to-indigo-800 shadow-[0_0_28px_rgba(99,102,241,0.45)]">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.4} />
            <span className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.25),transparent_45%)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in-up">
              <p className="truncate font-display text-base font-bold tracking-tight text-apex-text">
                ApexSEO
              </p>
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-apex-muted">
                Portal
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="rounded-lg p-1.5 text-apex-muted transition-all hover:bg-white/5 hover:text-apex-text"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="relative flex justify-center py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="rounded-lg p-1.5 text-apex-muted transition-all hover:bg-white/5 hover:text-apex-text"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="relative flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{ animationDelay: `${index * 40}ms` }}
              className={clsx(
                'nav-item group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold animate-fade-in-up',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'text-apex-text'
                  : 'text-apex-muted hover:bg-white/[0.04] hover:text-apex-text',
              )}
            >
              {isActive && (
                <>
                  <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-apex-indigo shadow-[0_0_14px_rgba(99,102,241,0.95)]" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-apex-indigo/25 via-apex-indigo/10 to-transparent" />
                </>
              )}
              <Icon
                className={clsx(
                  'relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-300',
                  isActive
                    ? 'text-apex-indigo'
                    : 'text-slate-500 group-hover:text-slate-300',
                )}
              />
              {!collapsed && (
                <span className="relative z-10 truncate tracking-tight">
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="relative border-t border-white/5 p-3">
        {!collapsed ? (
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent px-3 py-3">
            <div className="flex items-center gap-1.5 text-apex-muted">
              <Building2 className="h-3.5 w-3.5" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                Workspace
              </p>
            </div>
            <p className="mt-1.5 truncate font-display text-sm font-semibold text-apex-text">
              Acme Retail Co.
            </p>
          </div>
        ) : (
          <div
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-apex-muted"
            title="Acme Retail Co."
          >
            <Building2 className="h-4 w-4" />
          </div>
        )}
      </div>
    </aside>
  )
}
