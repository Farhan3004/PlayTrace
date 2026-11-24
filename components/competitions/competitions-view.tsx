'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Crown, Medal, Swords, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { competitions, type Competition } from '@/lib/data/platform'
import { Badge, Card, CardHeader, PageHeader, Tabs } from '@/components/pt/ui'
import { BarTrend } from '@/components/pt/charts'
import { Button } from '@/components/ui/button'

type Tab = 'bracket' | 'standings' | 'stats'

function Bracket({ c }: { c: Competition }) {
  const reduced = useReducedMotion()
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-10 p-1">
        {c.bracket.map((round, ri) => (
          <div key={round.round} className="flex w-64 flex-col">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{round.round}</p>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {round.matches.map((m, mi) => {
                const done = m.sa !== undefined && m.sb !== undefined
                const aWin = done && !m.live && (m.sa ?? 0) > (m.sb ?? 0)
                const bWin = done && !m.live && (m.sb ?? 0) > (m.sa ?? 0)
                return (
                  <motion.div
                    key={mi}
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ri * 0.12 + mi * 0.05 }}
                    className="relative"
                  >
                    <div className={cn('overflow-hidden rounded-xl border bg-card', m.live && 'border-destructive/50 ring-2 ring-destructive/15')}>
                      {[
                        [m.a, m.sa, aWin],
                        [m.b, m.sb, bWin],
                      ].map(([name, score, win], i) => (
                        <div key={i} className={cn('flex items-center justify-between gap-2 px-3 py-2.5 text-sm', i === 0 && 'border-b', win && 'bg-gold/10')}>
                          <span className={cn('flex items-center gap-1.5 truncate', win ? 'font-semibold' : name === 'TBD' ? 'text-muted-foreground' : '')}>
                            {win && <Crown className="size-3.5 shrink-0 text-gold" aria-label="Winner" />}
                            {name as string}
                          </span>
                          <span className="tabular font-display font-bold">{score ?? '–'}</span>
                        </div>
                      ))}
                    </div>
                    {m.live && (
                      <span className="absolute -top-2 right-2 flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                        <span className="size-1.5 animate-live rounded-full bg-primary-foreground" /> Live
                      </span>
                    )}
                    {ri < c.bracket.length - 1 && <span className="absolute -right-10 top-1/2 h-px w-10 bg-border" aria-hidden />}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
        <div className="flex w-48 flex-col items-center justify-center gap-3 rounded-2xl bg-ink p-6 text-center text-ink-foreground">
          <Trophy className="size-10 text-gold" />
          <p className="text-xs uppercase tracking-wider text-ink-muted">Champion</p>
          <p className="font-display text-lg font-bold">To be decided</p>
          <p className="text-xs text-ink-muted">{c.prize}</p>
        </div>
      </div>
    </div>
  )
}

function Standings({ c }: { c: Competition }) {
  const esports = c.sport === 'BGMI'
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">#</th>
            <th className="px-5 py-3 font-medium">{c.sport === 'Badminton' ? 'Player' : 'Team'}</th>
            <th className="px-5 py-3 text-right font-medium">{esports ? 'Matches' : 'P'}</th>
            <th className="px-5 py-3 text-right font-medium">{esports ? 'Wins' : 'W'}</th>
            <th className="px-5 py-3 text-right font-medium">{esports ? 'Points' : 'Pts'}</th>
            <th className="px-5 py-3 font-medium">Form</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {c.leaderboard.map((r) => (
            <tr key={r.name} className={cn(r.rank <= 3 && 'bg-gold/5')}>
              <td className="px-5 py-3">
                <span className={cn('flex size-7 items-center justify-center rounded-full font-display text-xs font-bold', r.rank === 1 ? 'bg-gold text-gold-foreground' : r.rank <= 3 ? 'bg-ink text-ink-foreground' : 'bg-muted')}>{r.rank}</span>
              </td>
              <td className="px-5 py-3 font-medium">{r.name}</td>
              <td className="tabular px-5 py-3 text-right">{r.played}</td>
              <td className="tabular px-5 py-3 text-right">{r.won}</td>
              <td className="tabular px-5 py-3 text-right font-display font-bold">{r.points}</td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  {r.form.map((f, i) => (
                    <span
                      key={i}
                      className={cn('flex size-5 items-center justify-center rounded text-[10px] font-bold', f === 'W' ? 'bg-success/15 text-success' : f === 'L' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground')}
                    >
                      {esports && f === 'D' ? '·' : f}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CompetitionsView() {
  const reduced = useReducedMotion()
  const [id, setId] = useState(competitions[0].id)
  const [tab, setTab] = useState<Tab>('bracket')
  const [followed, setFollowed] = useState<string[]>([])
  const c = competitions.find((x) => x.id === id)!

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Competitions" title="Live competitions, sport and esport" description="Brackets, standings and live scores — every result verified at source and written to athlete profiles." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {competitions.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            aria-pressed={id === x.id}
            className={cn('group relative h-36 overflow-hidden rounded-2xl text-left text-ink-foreground ring-offset-2 ring-offset-background transition-shadow', id === x.id ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-border')}
          >
            <img src={x.image || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" aria-hidden />
            <div className="relative flex h-full flex-col justify-between p-4">
              <Badge tone={x.status === 'Live' ? 'danger' : 'ink'} className="w-fit">
                {x.status === 'Live' && <span className="size-1.5 animate-live rounded-full bg-destructive" />}
                {x.status}
              </Badge>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold">{x.sport}</p>
                <p className="font-display font-bold leading-tight">{x.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section key={c.id} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0 }} className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink text-ink-foreground">
            <div className="grid-lines absolute inset-0 opacity-50" aria-hidden />
            <svg viewBox="0 0 400 200" className="absolute -right-10 top-0 h-full opacity-20" aria-hidden>
              <rect x="10" y="10" width="380" height="180" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="200" y1="10" x2="200" y2="190" stroke="currentColor" strokeWidth="2" />
              <circle cx="200" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M10 60 h60 v80 h-60 M390 60 h-60 v80 h60" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-10">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {c.sport} · {c.stage}
                </p>
                <h2 className="text-balance text-3xl font-bold md:text-5xl">{c.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" /> {c.teams} {c.sport === 'Badminton' ? 'players' : 'teams'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Trophy className="size-4 text-gold" /> {c.prize}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="h-10 px-4"
                onClick={() => {
                  setFollowed((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))
                  toast.success(followed.includes(c.id) ? 'Unfollowed' : 'Following — you’ll get live score alerts')
                }}
              >
                {followed.includes(c.id) ? 'Following' : 'Follow competition'}
              </Button>
            </div>
          </div>

          <Tabs<Tab>
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'bracket', label: 'Bracket' },
              { id: 'standings', label: 'Standings' },
              { id: 'stats', label: 'Stats' },
            ]}
          />

          {tab === 'bracket' && (
            <Card className="p-5">
              <Bracket c={c} />
            </Card>
          )}
          {tab === 'standings' && (
            <Card className="overflow-hidden">
              <Standings c={c} />
            </Card>
          )}
          {tab === 'stats' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader title="Points by competitor" />
                <div className="p-5 pt-3">
                  <BarTrend data={c.leaderboard.map((r) => ({ name: r.name.split(' ')[0], points: r.points }))} x="name" series={[{ key: 'points', name: 'Points' }]} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Tournament leaders" />
                <ul className="flex flex-col gap-4 p-5">
                  {[
                    { icon: Medal, label: c.sport === 'BGMI' ? 'Most finishes' : 'Top scorer', value: c.sport === 'BGMI' ? 'Viper · 38' : 'Ananya Rao · 19.1' },
                    { icon: Swords, label: c.sport === 'BGMI' ? 'Most damage' : 'Most assists', value: c.sport === 'BGMI' ? 'Phantom · 9,820' : 'Ananya Rao · 9.4' },
                    { icon: Crown, label: 'Unbeaten', value: c.leaderboard[0].name },
                  ].map((l) => (
                    <li key={l.label} className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-gold/20 text-gold-foreground">
                        <l.icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">{l.label}</p>
                        <p className="font-semibold">{l.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  )
}
