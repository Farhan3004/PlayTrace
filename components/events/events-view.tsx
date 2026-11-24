'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, CalendarDays, CheckCircle2, MapPin, Search, Trophy, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { events } from '@/lib/data/events'
import { Badge, Card, Chip, PageHeader, Progress, formatDate, inputClass } from '@/components/pt/ui'

const sportFilters = ['All', ...Array.from(new Set(events.map((e) => e.sport)))]

export function EventsView() {
  const reduced = useReducedMotion()
  const { registeredEvents } = usePlaytrace()
  const [sport, setSport] = useState('All')
  const [q, setQ] = useState('')
  const [fee, setFee] = useState<'any' | 'free'>('any')
  const [sort, setSort] = useState<'date' | 'prize' | 'spots'>('date')

  const list = useMemo(
    () =>
      events
        .filter((e) => sport === 'All' || e.sport === sport)
        .filter((e) => fee === 'any' || e.fee === 'Free')
        .filter((e) => !q || `${e.name} ${e.city} ${e.venue}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (sort === 'date' ? a.start.localeCompare(b.start) : sort === 'spots' ? b.capacity - b.registered - (a.capacity - a.registered) : b.prize.length - a.prize.length)),
    [sport, q, fee, sort],
  )
  const [featured, ...rest] = list

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Events" title="Compete. Showcase. Get seen." description="Tournaments, trials, ranking events and festivals — every result flows back into verified athlete profiles." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or venue" className={cn(inputClass, 'pl-9')} aria-label="Search events" />
        </div>
        <select value={fee} onChange={(e) => setFee(e.target.value as 'any' | 'free')} className={cn(inputClass, 'md:w-40')} aria-label="Entry fee">
          <option value="any">Any entry fee</option>
          <option value="free">Free entry</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={cn(inputClass, 'md:w-44')} aria-label="Sort events">
          <option value="date">Soonest first</option>
          <option value="spots">Most spots left</option>
          <option value="prize">Biggest prize</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sportFilters.map((s) => (
          <Chip key={s} active={sport === s} onClick={() => setSport(s)}>
            {s}
          </Chip>
        ))}
      </div>

      {featured && (
        <Link href={`/app/events/${featured.id}`} className="group relative block overflow-hidden rounded-3xl bg-ink text-ink-foreground">
          <img src={featured.image || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" aria-hidden />
          <div className="relative flex min-h-80 flex-col justify-end gap-4 p-6 md:p-10">
            <div className="flex flex-wrap gap-2">
              <Badge tone={featured.status === 'Live' ? 'danger' : 'gold'}>
                {featured.status === 'Live' && <span className="size-1.5 animate-live rounded-full bg-destructive" />}
                {featured.status}
              </Badge>
              <Badge tone="ink" className="border border-ink-border">{featured.sport}</Badge>
              {registeredEvents.includes(featured.id) && (
                <Badge tone="success">
                  <CheckCircle2 className="size-3" /> Registered
                </Badge>
              )}
            </div>
            <h2 className="max-w-2xl text-balance text-3xl font-bold md:text-5xl">{featured.name}</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> {formatDate(featured.start, { day: 'numeric', month: 'short' })} – {formatDate(featured.end)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {featured.venue}, {featured.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="size-4 text-gold" /> {featured.prize}
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rest.map((e, i) => {
          const pct = (e.registered / e.capacity) * 100
          return (
            <motion.div key={e.id} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/app/events/${e.id}`} className="group block h-full">
                <Card className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-lg">
                  <div className="relative h-40 overflow-hidden bg-ink">
                    <img src={e.image || '/placeholder.svg'} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <Badge tone={e.status === 'Live' ? 'danger' : e.status === 'Closing soon' ? 'gold' : 'ink'}>{e.status}</Badge>
                      {registeredEvents.includes(e.id) && <Badge tone="success">Registered</Badge>}
                    </div>
                    <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-card text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{e.sport}</p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug">{e.name}</h3>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4" /> {formatDate(e.start, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4" /> {e.city}
                      </span>
                    </div>
                    <div className="mt-auto flex flex-col gap-2 border-t pt-3">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="size-3.5" /> {e.registered}/{e.capacity}
                        </span>
                        <span className="font-semibold">{e.fee}</span>
                      </div>
                      <Progress value={pct} tone={pct >= 90 ? 'gold' : 'primary'} label="Capacity filled" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
      {list.length === 0 && <Card className="p-12 text-center text-muted-foreground">No events match. Try another sport or clear the search.</Card>}
    </div>
  )
}
