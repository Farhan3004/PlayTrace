'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { visibleGroups, roles } from '@/lib/nav'
import { usePlaytrace } from '@/lib/store'
import { Logo, TraceMark } from '@/components/pt/ui'

export function isActive(pathname: string, href: string) {
  if (href === '/app') return pathname === '/app'
  if (href === '/app/organiser') return pathname === '/app/organiser'
  return pathname === href || pathname.startsWith(href + '/')
}

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { role } = usePlaytrace()
  const groups = visibleGroups(role)

  return (
    <nav aria-label="Main" className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g.label} className="flex flex-col gap-1">
          {!collapsed && <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{g.label}</p>}
          {g.items.map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0',
                  active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                )}
              >
                {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold" aria-hidden />}
                <Icon className={cn('size-[18px] shrink-0', active ? 'text-gold' : 'text-ink-muted group-hover:text-sidebar-accent-foreground')} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && <span className="sr-only">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { role } = usePlaytrace()
  const r = roles.find((x) => x.id === role)!

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 lg:flex',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-sidebar-border', collapsed ? 'justify-center' : 'px-5')}>
        <Link href="/" aria-label="PLAYTRACE home">
          {collapsed ? <TraceMark className="size-8" /> : <Logo tone="light" />}
        </Link>
      </div>
      <div className={cn('flex-1 overflow-y-auto py-5', collapsed ? 'px-3' : 'px-3')}>
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className="flex flex-col gap-3 border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs text-ink-muted">Viewing as</p>
            <p className="text-sm font-semibold text-sidebar-accent-foreground">{r.label}</p>
            <p className="text-xs text-ink-muted">{r.blurb}</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', collapsed && 'justify-center px-0')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  )
}
