'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Briefcase, CalendarClock, CheckCircle2, GraduationCap, Handshake, MapPin, Search, Trophy, Users, Gamepad2, Megaphone, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { opportunities, type Opportunity } from '@/lib/data/platform'
import { Badge, Card, Chip, PageHeader, Progress, formatDate, inputClass } from '@/components/pt/ui'

const catIcon: Record<Opportunity['category'], typeof Briefcase> = {
  Trials: Trophy,
  Scholarship: GraduationCap,
  Sponsorship: Megaphone,
  'Pro Contract': Handshake,
  Coaching: Dumbbell,
  Internship: Briefcase,
  'Esports Roster': Gamepad2,
}
const cats = ['All', ...Object.keys(catIcon)] as const

export function OpportunitiesView() {
  const { appliedOpps } = usePlaytrace()
  const [cat, setCat] = useState<(typeof cats)[number]>('All')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'match' | 'deadline' | 'applicants'>('match')

  const list = useMemo(
    () =>
      opportunities
        .filter((o) => cat === 'All' || o.category === cat)
        .filter((o) => !q || `${o.title} ${o.org} ${o.sport} ${o.location}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (sort === 'match' ? b.match - a.match : sort === 'deadline' ? a.deadline.localeCompare(b.deadline) : a.applicants - b.applicants)),
    [cat, q, sort],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Opportunities"
        title="Your next opportunity, matched to your proof"
        description="Trials, scholarships, sponsorships, contracts and roles. Match scores use your verified achievements and eligibility — never pay-to-rank."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gold/20 text-gold-foreground">
            <Trophy className="size-5" />
          </span>
          <div>
            <p className="tabular font-display text-2xl font-bold">{opportunities.filter((o) => o.match >= 85).length}</p>
            <p className="text-sm text-muted-foreground">Strong matches (85%+)</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <CalendarClock className="size-5" />
          </span>
          <div>
            <p className="tabular font-display text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Closing in 3 weeks</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="tabular font-display text-2xl font-bold">{appliedOpps.length}</p>
            <p className="text-sm text-muted-foreground">Applications submitted</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search organisation, sport, location" className={cn(inputClass, 'pl-9')} aria-label="Search opportunities" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={cn(inputClass, 'md:w-48')} aria-label="Sort">
          <option value="match">Best match</option>
          <option value="deadline">Closing soonest</option>
          <option value="applicants">Fewest applicants</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {list.map((o) => {
          const Icon = catIcon[o.category]
          const applied = appliedOpps.includes(o.id)
          return (
            <li key={o.id}>
              <Link href={`/app/opportunities/${o.id}`} className="group block">
                <Card className="flex flex-col gap-4 p-5 transition-shadow group-hover:shadow-lg md:flex-row md:items-center">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-gold">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="primary">{o.category}</Badge>
                      {applied && (
                        <Badge tone="success">
                          <CheckCircle2 className="size-3" /> Applied
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{o.title}</h3>
                    <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{o.org}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" /> {o.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" /> {o.applicants.toLocaleString('en-IN')} applicants
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-6 md:w-80">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Profile match</span>
                        <span className="tabular font-semibold">{o.match}%</span>
                      </div>
                      <Progress value={o.match} tone={o.match >= 85 ? 'gold' : 'primary'} label={`${o.title} match`} />
                      <p className="text-xs text-muted-foreground">
                        {o.value} · closes {formatDate(o.deadline, { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
      {list.length === 0 && <Card className="p-12 text-center text-muted-foreground">No opportunities match your filters.</Card>}
    </div>
  )
}
