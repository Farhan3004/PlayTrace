'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, BadgeCheck, Briefcase, CalendarCheck, Check, ChevronDown, Eye, LogOut, Menu, Search, Settings, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { roles } from '@/lib/nav'
import { notifications as seed } from '@/lib/data/platform'
import { usePlaytrace } from '@/lib/store'
import { Avatar, Popover } from '@/components/pt/ui'

const notifIcon = { verify: BadgeCheck, opportunity: Briefcase, scout: Eye, event: CalendarCheck } as const

export function Topbar({ onOpenSearch, onOpenMobileNav }: { onOpenSearch: () => void; onOpenMobileNav: () => void }) {
  const { role, setRole } = usePlaytrace()
  const router = useRouter()
  const [items, setItems] = useState(seed)
  const unread = items.filter((i) => i.unread).length
  const r = roles.find((x) => x.id === role)!

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md md:px-6">
      <button onClick={onOpenMobileNav} className="rounded-lg p-2 hover:bg-muted lg:hidden" aria-label="Open navigation">
        <Menu className="size-5" />
      </button>

      <button
        onClick={onOpenSearch}
        className="flex h-10 flex-1 items-center gap-2 rounded-lg border bg-card px-3 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/30 md:max-w-md"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="truncate">Search athletes, events, opportunities…</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-sans text-[11px] md:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <Popover
          label="Switch role"
          className="w-72 p-2"
          trigger={({ open, toggle, id }) => (
            <button
              onClick={toggle}
              aria-expanded={open}
              aria-controls={id}
              className="hidden h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium hover:border-foreground/30 sm:flex"
            >
              <span className="size-2 rounded-full bg-primary" aria-hidden />
              {r.label}
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          )}
        >
          {(close) => (
            <div className="flex flex-col">
              <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Switch role</p>
              {roles.map((x) => (
                <button
                  key={x.id}
                  onClick={() => {
                    setRole(x.id)
                    close()
                    router.push('/app')
                    toast.success(`Now viewing PLAYTRACE as ${x.label}`)
                  }}
                  className={cn('flex items-center gap-3 rounded-lg p-2 text-left hover:bg-muted', x.id === role && 'bg-muted')}
                >
                  <Avatar initials={x.initials} size={32} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-medium">{x.label}</span>
                    <span className="truncate text-xs text-muted-foreground">{x.blurb}</span>
                  </span>
                  {x.id === role && <Check className="size-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </Popover>

        <Popover
          label="Notifications"
          className="w-[min(22rem,calc(100vw-2rem))]"
          trigger={({ open, toggle, id }) => (
            <button onClick={toggle} aria-expanded={open} aria-controls={id} className="relative rounded-lg p-2.5 hover:bg-muted" aria-label={`Notifications, ${unread} unread`}>
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unread}</span>}
            </button>
          )}
        >
          {() => (
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <p className="font-semibold">Notifications</p>
                <button className="text-xs font-medium text-primary hover:underline" onClick={() => setItems((p) => p.map((i) => ({ ...i, unread: false })))}>
                  Mark all read
                </button>
              </div>
              <ul className="max-h-96 overflow-y-auto">
                {items.map((n) => {
                  const Icon = notifIcon[n.kind as keyof typeof notifIcon]
                  return (
                    <li key={n.id} className={cn('flex gap-3 border-b p-4 last:border-0', n.unread && 'bg-accent/40')}>
                      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', n.kind === 'verify' ? 'bg-gold/20 text-gold-foreground' : 'bg-accent text-accent-foreground')}>
                        <Icon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.body}</p>
                        <p className="text-xs text-muted-foreground">{n.time} ago</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </Popover>

        <Popover
          label="Profile menu"
          className="w-64 p-2"
          trigger={({ open, toggle, id }) => (
            <button onClick={toggle} aria-expanded={open} aria-controls={id} className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-border" aria-label="Open profile menu">
              <Avatar initials={r.initials} src={role === 'athlete' ? '/images/athlete-basketball.png' : undefined} size={36} />
            </button>
          )}
        >
          {(close) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-3 border-b p-2 pb-3">
                <Avatar initials={r.initials} src={role === 'athlete' ? '/images/athlete-basketball.png' : undefined} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.persona}</p>
                  <p className="text-xs text-muted-foreground">{r.label} account</p>
                </div>
              </div>
              <div className="flex flex-col py-1">
                <Link onClick={close} href={role === 'athlete' ? '/app/athletes/ananya-rao' : '/app/discover'} className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                  <UserRound className="size-4" /> {role === 'athlete' ? 'View my profile' : 'Browse profiles'}
                </Link>
                <Link onClick={close} href="/app/analytics" className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                  <Settings className="size-4" /> Insights & settings
                </Link>
                <div className="sm:hidden">
                  <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</p>
                  <div className="flex flex-wrap gap-1 px-2 pb-2">
                    {roles.map((x) => (
                      <button
                        key={x.id}
                        onClick={() => {
                          setRole(x.id)
                          close()
                          router.push('/app')
                        }}
                        className={cn('rounded-full border px-2.5 py-1 text-xs', x.id === role ? 'border-foreground bg-foreground text-background' : '')}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Link onClick={close} href="/" className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted">
                  <LogOut className="size-4" /> Back to website
                </Link>
              </div>
            </div>
          )}
        </Popover>
      </div>
    </header>
  )
}
