'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { ArrowRight, Briefcase, CalendarDays, CornerDownLeft, Search, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { athletes, discoverProfiles } from '@/lib/data/athletes'
import { events } from '@/lib/data/events'
import { opportunities } from '@/lib/data/platform'
import { allNavItems } from '@/lib/nav'

type Result = { id: string; label: string; sub: string; href: string; group: string; icon: typeof Search }

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const all = useMemo<Result[]>(
    () => [
      ...allNavItems.map((n) => ({ id: n.href, label: n.label, sub: 'Go to page', href: n.href, group: 'Pages', icon: n.icon })),
      ...discoverProfiles.map((p) => ({
        id: p.id,
        label: p.name,
        sub: `${p.kind} · ${p.sport} · ${p.city}`,
        href: athletes.some((a) => a.id === p.id) ? `/app/athletes/${p.id}` : `/app/discover?q=${encodeURIComponent(p.name)}`,
        group: 'People & teams',
        icon: UserRound,
      })),
      ...events.map((e) => ({ id: e.id, label: e.name, sub: `${e.sport} · ${e.city}`, href: `/app/events/${e.id}`, group: 'Events', icon: CalendarDays })),
      ...opportunities.map((o) => ({ id: o.id, label: o.title, sub: `${o.org} · ${o.category}`, href: `/app/opportunities/${o.id}`, group: 'Opportunities', icon: Briefcase })),
    ],
    [],
  )

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = term ? all.filter((r) => `${r.label} ${r.sub}`.toLowerCase().includes(term)) : all.filter((r) => r.group !== 'Pages').slice(0, 8)
    return list.slice(0, 12)
  }, [q, all])

  useEffect(() => {
    if (open) {
      setQ('')
      setIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => setIndex(0), [q])

  if (!open || typeof document === 'undefined') return null

  const go = (r: Result) => {
    router.push(r.href)
    onClose()
  }

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    ;(acc[r.group] ||= []).push(r)
    return acc
  }, {})

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]">
      <button aria-label="Close search" className="absolute inset-0 animate-in fade-in-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Global search" className="relative z-10 w-full max-w-xl animate-in fade-in-0 zoom-in-95 overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-5 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndex((i) => Math.min(results.length - 1, i + 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndex((i) => Math.max(0, i - 1))
              }
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229 && results[index]) go(results[index])
            }}
            placeholder="Search athletes, teams, events, opportunities…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search PLAYTRACE"
            role="combobox"
            aria-expanded="true"
            aria-controls="pt-search-results"
          />
          <kbd className="rounded border bg-muted px-1.5 text-[11px] text-muted-foreground">ESC</kbd>
        </div>
        <div id="pt-search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No matches for “{q}”. Try a sport, city or club.</p>}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="pb-2">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
              {items.map((r) => {
                const i = results.indexOf(r)
                const Icon = r.icon
                return (
                  <button
                    key={r.group + r.id}
                    role="option"
                    aria-selected={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => go(r)}
                    className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left', i === index && 'bg-muted')}
                  >
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{r.label}</span>
                      <span className="truncate text-xs text-muted-foreground">{r.sub}</span>
                    </span>
                    {i === index ? <CornerDownLeft className="size-4 text-muted-foreground" /> : <ArrowRight className="size-4 text-transparent" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
