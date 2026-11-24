'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, CheckCircle2, Clock, Eye, Flag, HandHeart, MapPin, Plus, ShieldAlert, Sparkles, Star, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { roles } from '@/lib/nav'
import { athletes, discoverProfiles } from '@/lib/data/athletes'
import { events } from '@/lib/data/events'
import { opportunities, platformGrowth, shifts, volunteers, sportMix } from '@/lib/data/platform'
import { Avatar, Badge, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge, formatDate } from '@/components/pt/ui'
import { AreaTrend, BarTrend, Donut, ScoreRing, SkillRadar } from '@/components/pt/charts'
import { buttonVariants } from '@/components/ui/button'

const cta = cn(buttonVariants({ size: 'lg' }), 'h-10 px-4')
const ctaOutline = cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'h-10 px-4')

function Kpis({ items }: { items: { label: string; value: string; delta?: string; hint?: string }[] }) {
  return (
    <Card className="grid grid-cols-2 md:grid-cols-4">
      {items.map((k, i) => (
        <Stat key={k.label} {...k} className={cn('p-5', i < 2 && 'border-b md:border-b-0', i > 0 && 'md:border-l', i % 2 === 1 && 'border-l')} />
      ))}
    </Card>
  )
}

function EventList({ ids }: { ids?: string[] }) {
  const list = ids ? events.filter((e) => ids.includes(e.id)) : events.slice(0, 3)
  return (
    <ul className="flex flex-col divide-y">
      {list.map((e) => (
        <li key={e.id}>
          <Link href={`/app/events/${e.id}`} className="flex items-center gap-4 py-3 hover:opacity-80">
            <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-ink py-1.5 text-ink-foreground">
              <span className="text-[10px] uppercase">{formatDate(e.start, { month: 'short' })}</span>
              <span className="font-display text-lg font-bold leading-none">{formatDate(e.start, { day: 'numeric' })}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{e.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden /> {e.city} · {e.sport}
              </p>
            </div>
            <Badge tone={e.status === 'Live' ? 'danger' : e.status === 'Closing soon' ? 'gold' : 'neutral'}>{e.status}</Badge>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function AthleteDashboard() {
  const me = athletes[0]
  const { achievements, registeredEvents } = usePlaytrace()
  const mine = achievements.filter((a) => a.athleteId === me.id)
  const views = [
    { week: 'W1', views: 42, scouts: 3 },
    { week: 'W2', views: 58, scouts: 5 },
    { week: 'W3', views: 51, scouts: 4 },
    { week: 'W4', views: 87, scouts: 9 },
    { week: 'W5', views: 96, scouts: 11 },
    { week: 'W6', views: 124, scouts: 14 },
  ]
  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl bg-ink text-ink-foreground">
        <img src={me.cover || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-5">
            <Avatar src={me.image} initials="AR" size={72} alt={me.name} className="ring-2 ring-gold" />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-ink-muted">Good evening,</p>
              <h1 className="text-3xl font-bold md:text-4xl">Ananya Rao</h1>
              <p className="text-sm text-ink-muted">
                {me.position} · {me.club} · <span className="text-gold">{me.availability}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ScoreRing value={me.traceScore} size={112} />
            <div className="hidden flex-col gap-2 text-sm sm:flex">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-gold" /> {mine.filter((a) => a.status === 'verified').length} verified achievements
              </span>
              <span className="flex items-center gap-2 text-ink-muted">
                <Eye className="size-4" /> 14 scout views this week
              </span>
              <Link href="/app/athletes/ananya-rao" className="flex items-center gap-1 font-semibold text-ink-foreground hover:underline">
                View public profile <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Kpis
        items={[
          { label: 'Points / game', value: '17.4', delta: '+2.1', hint: 'vs last season' },
          { label: 'Profile views', value: '458', delta: '+38%', hint: '30 days' },
          { label: 'Opportunity matches', value: '6', hint: '2 above 90%' },
          { label: 'Profile strength', value: '86%', hint: 'Add 1 video to reach 92%' },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Season performance" description="Points per game against league average" action={<Badge tone="primary">2026 season</Badge>} />
          <div className="p-5 pt-4">
            <AreaTrend data={me.season} x="month" series={[{ key: 'value', name: 'PPG' }, { key: 'avg', name: 'League avg', color: 'var(--chart-4)' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Skill profile" description="Coach-assessed, verified Feb 2026" />
          <div className="p-2">
            <SkillRadar data={me.skills} height={250} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Verification status"
            action={
              <Link href="/app/achievements" className="text-sm font-medium text-primary hover:underline">
                Manage
              </Link>
            }
          />
          <ul className="flex flex-col gap-3 p-5">
            {mine.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.event}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Top opportunity matches" description="Ranked by verified eligibility" />
          <ul className="flex flex-col gap-4 p-5">
            {opportunities
              .filter((o) => o.sport === 'Basketball' || o.sport === 'Any')
              .slice(0, 3)
              .map((o) => (
                <li key={o.id}>
                  <Link href={`/app/opportunities/${o.id}`} className="flex flex-col gap-2 hover:opacity-80">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{o.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.org} · closes {formatDate(o.deadline, { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <span className="tabular text-sm font-semibold">{o.match}%</span>
                    </div>
                    <Progress value={o.match} tone={o.match > 85 ? 'gold' : 'primary'} label={`${o.title} match`} />
                  </Link>
                </li>
              ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Who’s watching" description="Profile views and scout visits" />
          <div className="p-5 pt-3">
            <BarTrend data={views} x="week" series={[{ key: 'views', name: 'Views' }, { key: 'scouts', name: 'Scouts', color: 'var(--chart-2)' }]} height={190} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Your upcoming events"
          description={registeredEvents.length ? 'Registered via PLAYTRACE' : 'Recommended for your sport and level'}
          action={
            <Link href="/app/events" className="text-sm font-medium text-primary hover:underline">
              Browse events
            </Link>
          }
        />
        <div className="px-5 pb-2">
          <EventList ids={registeredEvents.length ? registeredEvents : ['south-zone-hoops', 'national-sports-day-run', 'delhi-athletics-meet']} />
        </div>
      </Card>
    </div>
  )
}

function CoachDashboard() {
  const squad = [athletes[0], ...discoverProfiles.filter((p) => p.sport === 'Basketball' && p.kind === 'Athlete')].slice(0, 1)
  const roster = [
    { name: 'Ananya Rao', pos: 'PG', load: 82, status: 'Ready', trend: '+4' },
    { name: 'Kavya Shetty', pos: 'SG', load: 74, status: 'Ready', trend: '+1' },
    { name: 'Tara D’Souza', pos: 'SF', load: 91, status: 'High load', trend: '+9' },
    { name: 'Nandini Gowda', pos: 'PF', load: 40, status: 'Rehab', trend: '-12' },
    { name: 'Riya Menon', pos: 'C', load: 68, status: 'Ready', trend: '+2' },
  ]
  const load = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ day: d, skill: [40, 55, 30, 60, 45, 70, 10][i], conditioning: [30, 20, 45, 25, 35, 20, 5][i] }))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Coach workspace"
        title="Bengaluru Blaze — Women’s Senior"
        description={`Squad of 14 · next fixture vs Chennai Heat on 6 Dec · ${squad.length} endorsement request pending`}
        actions={
          <>
            <Link href="/app/achievements" className={ctaOutline}>
              Review endorsements
            </Link>
            <Link href="/app/events" className={cta}>
              Enter a tournament
            </Link>
          </>
        }
      />
      <Kpis
        items={[
          { label: 'Squad readiness', value: '86%', delta: '+5%', hint: 'this week' },
          { label: 'Avg training load', value: '71', hint: 'AU, target 65–75' },
          { label: 'Win rate', value: '83%', delta: '+12%', hint: 'season' },
          { label: 'Athletes verified', value: '12/14', hint: '2 pending' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Weekly training load" description="Skill vs conditioning minutes" />
          <div className="p-5 pt-4">
            <BarTrend data={load} x="day" stacked series={[{ key: 'skill', name: 'Skill' }, { key: 'conditioning', name: 'Conditioning', color: 'var(--chart-2)' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Endorsement requests" />
          <ul className="flex flex-col gap-4 p-5">
            {[
              { n: 'Ananya Rao', t: 'Pro League Captaincy' },
              { n: 'Kavya Shetty', t: 'State U-23 selection' },
            ].map((r) => (
              <li key={r.t} className="flex flex-col gap-2 rounded-lg border p-3">
                <p className="text-sm font-medium">{r.n}</p>
                <p className="text-xs text-muted-foreground">{r.t}</p>
                <div className="flex gap-2">
                  <button onClick={() => toast.success(`Endorsed ${r.n}`)} className={cn(buttonVariants({ size: 'sm' }))}>
                    Endorse
                  </button>
                  <button onClick={() => toast('Request sent back for more evidence')} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
                    Ask for evidence
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Roster status" />
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Athlete</th>
                <th className="pb-3 font-medium">Pos</th>
                <th className="pb-3 font-medium">Load</th>
                <th className="pb-3 font-medium">Trend</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roster.map((r) => (
                <tr key={r.name}>
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3 text-muted-foreground">{r.pos}</td>
                  <td className="w-48 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={r.load} tone={r.load > 85 ? 'gold' : 'primary'} label={`${r.name} load`} />
                      <span className="tabular w-8 text-xs">{r.load}</span>
                    </div>
                  </td>
                  <td className={cn('tabular py-3 text-xs font-semibold', r.trend.startsWith('-') ? 'text-destructive' : 'text-success')}>{r.trend}</td>
                  <td className="py-3">
                    <Badge tone={r.status === 'Ready' ? 'success' : r.status === 'Rehab' ? 'danger' : 'gold'}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function ScoutDashboard() {
  const { savedProfiles } = usePlaytrace()
  const fresh = discoverProfiles.filter((p) => p.kind === 'Athlete').sort((a, b) => b.traceScore - a.traceScore).slice(0, 6)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Scout workspace"
        title="Verified talent, ranked for you"
        description="Alerts for women’s basketball guards and BGMI IGLs across South and West India."
        actions={
          <Link href="/app/discover" className={cta}>
            Open discovery <ArrowRight className="size-4" />
          </Link>
        }
      />
      <Kpis
        items={[
          { label: 'Shortlisted', value: String(savedProfiles.length + 11), hint: 'across 3 lists' },
          { label: 'New verified talent', value: '38', delta: '+14', hint: 'this week' },
          { label: 'Trials scheduled', value: '4', hint: 'next 30 days' },
          { label: 'Avg Trace Score', value: '861', hint: 'of your shortlist' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Rising athletes" description="Highest Trace Score growth in the last 90 days" />
          <ul className="grid gap-3 p-5 sm:grid-cols-2">
            {fresh.map((p) => (
              <li key={p.id}>
                <Link href={athletes.some((a) => a.id === p.id) ? `/app/athletes/${p.id}` : '/app/discover'} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-foreground/30">
                  <Avatar src={p.image} initials={p.initials} size={44} alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.sport} · {p.tag} · {p.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular font-display font-bold">{p.traceScore}</p>
                    <p className="flex items-center justify-end gap-0.5 text-[11px] text-gold-foreground">
                      <BadgeCheck className="size-3 text-gold" /> {p.verified}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Talent pool by sport" description="Verified athletes in your regions" />
          <div className="p-5">
            <Donut data={sportMix.map((s) => ({ name: s.sport, value: s.value }))} />
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {sportMix.map((s, i) => (
                <li key={s.sport} className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--muted)'][i] }} />
                  {s.sport} <span className="ml-auto tabular font-medium text-foreground">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Upcoming scouting events" />
        <div className="px-5 pb-2">
          <EventList ids={['south-zone-hoops', 'kerala-u19-football', 'bgmi-campus-clash']} />
        </div>
      </Card>
    </div>
  )
}

function OrganiserDashboard() {
  const regs = ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29', 'Nov 5'].map((w, i) => ({ week: w, registrations: [40, 88, 140, 210, 320, 412][i], revenue: [0.2, 0.5, 0.8, 1.2, 1.7, 2.2][i] }))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Organiser workspace"
        title="KSBA Events"
        description="3 live events · South Zone Hoops Invitational starts in 25 days"
        actions={
          <>
            <Link href="/app/assistant" className={ctaOutline}>
              <Sparkles className="size-4" /> Ask the assistant
            </Link>
            <Link href="/app/organiser/create" className={cta}>
              <Plus className="size-4" /> Create event
            </Link>
          </>
        }
      />
      <Kpis
        items={[
          { label: 'Registrations', value: '1,451', delta: '+28%', hint: 'last 30 days' },
          { label: 'Revenue', value: '₹2.2L', delta: '+18%', hint: 'net of fees' },
          { label: 'Volunteer fill rate', value: '82%', hint: '31 of 41 shifts' },
          { label: 'Pending approvals', value: '17', hint: 'teams & achievements' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Registrations" description="South Zone Hoops Invitational" />
          <div className="p-5 pt-4">
            <AreaTrend data={regs} x="week" series={[{ key: 'registrations', name: 'Registrations' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Today’s checklist" />
          <ul className="flex flex-col gap-3 p-5 text-sm">
            {[
              { t: 'Approve 12 team rosters', done: false },
              { t: 'Publish group-stage fixtures', done: false },
              { t: 'Confirm medical partner', done: true },
              { t: 'Fill 5 ushering shifts', done: false },
              { t: 'Send venue map to teams', done: true },
            ].map((c) => (
              <li key={c.t} className="flex items-center gap-3">
                {c.done ? <CheckCircle2 className="size-5 text-success" /> : <span className="size-5 rounded-full border-2" aria-hidden />}
                <span className={c.done ? 'text-muted-foreground line-through' : ''}>{c.t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Your events" action={<Link href="/app/organiser" className="text-sm font-medium text-primary hover:underline">Open console</Link>} />
          <div className="px-5 pb-2">
            <EventList ids={['south-zone-hoops', 'hyderabad-open-badminton', 'national-sports-day-run']} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Volunteer coverage" action={<Link href="/app/volunteers" className="text-sm font-medium text-primary hover:underline">Manage</Link>} />
          <ul className="flex flex-col gap-3 p-5">
            {shifts.slice(0, 5).map((s) => (
              <li key={s.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span>{s.role}</span>
                  <span className="tabular text-muted-foreground">
                    {s.filled}/{s.needed}
                  </span>
                </div>
                <Progress value={(s.filled / s.needed) * 100} tone={s.filled === s.needed ? 'gold' : 'primary'} label={s.role} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function VolunteerDashboard() {
  const me = volunteers[0]
  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl bg-ink text-ink-foreground">
        <img src="/images/volunteers.png" alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="relative flex flex-col gap-4 p-6 md:p-8">
          <p className="text-sm text-ink-muted">Volunteer · Zone Lead</p>
          <h1 className="text-3xl font-bold md:text-4xl">Welcome back, Isha</h1>
          <div className="flex flex-wrap gap-2">
            {me.badges.map((b) => (
              <Badge key={b} tone="gold">
                <Star className="size-3" /> {b}
              </Badge>
            ))}
          </div>
        </div>
      </section>
      <Kpis
        items={[
          { label: 'Hours logged', value: String(me.hours), delta: '+12', hint: 'this month' },
          { label: 'Events', value: String(me.events) },
          { label: 'Rating', value: me.rating.toFixed(1), hint: 'from organisers' },
          { label: 'Next shift', value: '07:00', hint: 'Thu 4 Dec · Gate A' },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="My upcoming shifts" />
          <ul className="flex flex-col divide-y px-5 pb-2">
            {[
              { e: 'South Zone Hoops', r: 'Zone Lead — Gate A', t: 'Thu 4 Dec · 07:00–15:00' },
              { e: 'South Zone Hoops', r: 'Zone Lead — Stands N', t: 'Sat 6 Dec · 15:00–21:30' },
              { e: 'Community Sports Festival', r: 'Crowd lead', t: 'Sun 1 Feb · 06:00–13:00' },
            ].map((s) => (
              <li key={s.t} className="flex items-center gap-3 py-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <HandHeart className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{s.r}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.e} · {s.t}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Open shifts near you" action={<Link href="/app/volunteers" className="text-sm font-medium text-primary hover:underline">See all</Link>} />
          <ul className="flex flex-col gap-3 p-5">
            {shifts
              .filter((s) => s.filled < s.needed)
              .map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{s.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.zone} · {s.time} · {s.needed - s.filled} spots
                    </p>
                  </div>
                  <button onClick={() => toast.success(`Requested: ${s.role}`)} className={cn(buttonVariants({ size: 'sm' }))}>
                    Request
                  </button>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { achievements } = usePlaytrace()
  const queue = achievements.filter((a) => a.status === 'pending' || a.status === 'in-review')
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform operations"
        title="Trust, safety & growth"
        description="All systems operational · prototype environment with simulated data"
        actions={
          <Link href="/app/admin" className={cta}>
            Open admin console
          </Link>
        }
      />
      <Kpis
        items={[
          { label: 'Active athletes', value: '168K', delta: '+19%', hint: 'MoM' },
          { label: 'Verifications / mo', value: '15.6K', delta: '+22%' },
          { label: 'Verification queue', value: String(queue.length), hint: 'awaiting human review' },
          { label: 'Open reports', value: '9', hint: '2 high priority' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Platform growth" description="Athletes (K) and monthly events" />
          <div className="p-5 pt-4">
            <AreaTrend data={platformGrowth} x="month" series={[{ key: 'athletes', name: 'Athletes (K)' }, { key: 'events', name: 'Events', color: 'var(--chart-2)' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Needs attention" />
          <ul className="flex flex-col gap-3 p-5 text-sm">
            <li className="flex gap-3">
              <ShieldAlert className="size-5 shrink-0 text-destructive" />
              <span>Duplicate account suspected for “Sahil Khan” — 2 profiles share a phone number.</span>
            </li>
            <li className="flex gap-3">
              <Flag className="size-5 shrink-0 text-gold" />
              <span>3 AI flags on certificates from Rajasthan Kabaddi League.</span>
            </li>
            <li className="flex gap-3">
              <Users className="size-5 shrink-0 text-primary" />
              <span>12 verifier applications from state associations.</span>
            </li>
            <li className="flex gap-3">
              <Clock className="size-5 shrink-0 text-muted-foreground" />
              <span>Median verification time is 31h (target 24h).</span>
            </li>
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Verification queue" action={<Link href="/app/achievements" className="text-sm font-medium text-primary hover:underline">Review all</Link>} />
        <ul className="flex flex-col divide-y px-5 pb-2">
          {queue.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {discoverProfiles.find((p) => p.id === a.athleteId)?.name} · {a.event}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {a.aiFlag && (
                  <Badge tone="gold">
                    <Flag className="size-3" /> AI flag
                  </Badge>
                )}
                <StatusBadge status={a.status} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export function RoleDashboard() {
  const { role } = usePlaytrace()
  const map = {
    athlete: AthleteDashboard,
    coach: CoachDashboard,
    scout: ScoutDashboard,
    organiser: OrganiserDashboard,
    volunteer: VolunteerDashboard,
    admin: AdminDashboard,
  }
  const C = map[role]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" aria-hidden /> Monday, 9 November 2026 · Viewing as {roles.find((r) => r.id === role)?.label}
      </div>
      <C />
    </div>
  )
}
