'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Check, Download, Megaphone, Plus, Search, Send, Shuffle, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { events } from '@/lib/data/events'
import { Badge, Card, CardHeader, Field, PageHeader, Progress, Stat, Tabs, inputClass } from '@/components/pt/ui'
import { AreaTrend, BarTrend, Donut } from '@/components/pt/charts'
import { Button, buttonVariants } from '@/components/ui/button'

type Tab = 'overview' | 'registrations' | 'fixtures' | 'comms'

const seedRegs = [
  { id: 'r1', team: 'Bengaluru Blaze', cat: 'Women’s Senior', captain: 'Ananya Rao', players: 12, verified: 12, paid: true, status: 'Approved' },
  { id: 'r2', team: 'Chennai Heat', cat: 'Women’s Senior', captain: 'Lakshmi V.', players: 12, verified: 11, paid: true, status: 'Pending' },
  { id: 'r3', team: 'Kochi Tide', cat: 'Men’s Senior', captain: 'Joel Mathew', players: 11, verified: 11, paid: true, status: 'Pending' },
  { id: 'r4', team: 'Hyderabad Hawks', cat: 'Men’s Senior', captain: 'Faiz Ali', players: 12, verified: 9, paid: false, status: 'Pending' },
  { id: 'r5', team: 'Mysuru Royals', cat: 'U-19 Boys', captain: 'Pranav K.', players: 10, verified: 10, paid: true, status: 'Approved' },
  { id: 'r6', team: 'Vizag Waves', cat: 'U-19 Girls', captain: 'Sravya P.', players: 12, verified: 12, paid: true, status: 'Approved' },
  { id: 'r7', team: 'Goa Gulls', cat: 'Men’s Senior', captain: 'Ryan D’Costa', players: 12, verified: 7, paid: true, status: 'Waitlist' },
  { id: 'r8', team: 'Madurai Mavericks', cat: 'Women’s Senior', captain: 'Divya S.', players: 12, verified: 12, paid: true, status: 'Pending' },
]

const funnel = [
  { stage: 'Page views', value: 4820 },
  { stage: 'Started', value: 612 },
  { stage: 'Submitted', value: 141 },
  { stage: 'Paid', value: 118 },
  { stage: 'Approved', value: 96 },
]

export function OrganiserConsole() {
  const own = events.filter((e) => ['south-zone-hoops', 'hyderabad-open-badminton', 'national-sports-day-run'].includes(e.id))
  const [eventId, setEventId] = useState(own[0].id)
  const event = own.find((e) => e.id === eventId)!
  const [tab, setTab] = useState<Tab>('overview')
  const [regs, setRegs] = useState(seedRegs)
  const [q, setQ] = useState('')
  const [fixtures, setFixtures] = useState<{ court: string; time: string; a: string; b: string }[] | null>(null)
  const [sent, setSent] = useState<{ title: string; body: string; audience: string; time: string }[]>([
    { title: 'Venue map & parking', body: 'Gate A for teams, Gate C for spectators.', audience: 'All teams', time: '2 days ago' },
  ])

  const filtered = useMemo(() => regs.filter((r) => `${r.team} ${r.captain} ${r.cat}`.toLowerCase().includes(q.toLowerCase())), [regs, q])
  const setStatus = (id: string, status: string) => setRegs((p) => p.map((r) => (r.id === id ? { ...r, status } : r)))

  const generate = () => {
    const approved = regs.filter((r) => r.status === 'Approved' || r.status === 'Pending').map((r) => r.team)
    const out: { court: string; time: string; a: string; b: string }[] = []
    const times = ['10:00', '11:30', '13:00', '14:30', '16:00']
    let k = 0
    for (let i = 0; i < approved.length; i++)
      for (let j = i + 1; j < approved.length && out.length < 10; j++) {
        out.push({ court: `Court ${(k % 2) + 1}`, time: times[Math.floor(k / 2) % times.length], a: approved[i], b: approved[j] })
        k++
      }
    setFixtures(out)
    toast.success('Fixtures generated', { description: 'No team plays back-to-back; courts balanced.' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Event console"
        title={event.name}
        description={`${event.venue}, ${event.city} · ${event.registered}/${event.capacity} registered`}
        actions={
          <>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={cn(inputClass, 'w-auto')} aria-label="Select event">
              {own.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <Link href="/app/organiser/create" className={cn(buttonVariants({ size: 'lg' }), 'h-10 px-4')}>
              <Plus className="size-4" /> New event
            </Link>
          </>
        }
      />

      <Card className="grid grid-cols-2 md:grid-cols-5">
        {[
          { label: 'Registrations', value: String(event.registered), delta: '+14', hint: 'this week' },
          { label: 'Capacity', value: `${Math.round((event.registered / event.capacity) * 100)}%` },
          { label: 'Revenue', value: '₹1.62L', delta: '+₹24K' },
          { label: 'Verified athletes', value: '94%', hint: 'of roster spots' },
          { label: 'Volunteers', value: '31/41', hint: 'shifts filled' },
        ].map((k, i) => (
          <Stat key={k.label} {...k} className={cn('border-b p-5 md:border-b-0', i > 0 && 'md:border-l', i % 2 === 1 && 'border-l')} />
        ))}
      </Card>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'registrations', label: 'Registrations', count: regs.filter((r) => r.status === 'Pending').length },
          { id: 'fixtures', label: 'Fixtures' },
          { id: 'comms', label: 'Announcements' },
        ]}
      />

      {tab === 'overview' && (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Registration velocity" description="Daily new registrations, last 14 days" />
            <div className="p-5 pt-4">
              <AreaTrend data={Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, regs: Math.round(3 + i * 0.9 + Math.sin(i) * 2) }))} x="day" series={[{ key: 'regs', name: 'Registrations' }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="By category" />
            <div className="p-5">
              <Donut data={event.categories.map((c, i) => ({ name: c, value: [38, 31, 18, 13, 9, 7, 5][i] ?? 5 }))} />
              <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                {event.categories.slice(0, 5).map((c, i) => (
                  <li key={c} className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ background: `var(--chart-${(i % 5) + 1})` }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader title="Conversion funnel" />
            <div className="p-5 pt-3">
              <BarTrend data={funnel} x="stage" layout="vertical" series={[{ key: 'value', name: 'People' }]} height={220} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Readiness" />
            <ul className="flex flex-col gap-4 p-5">
              {[
                ['Venue & courts', 100],
                ['Officials assigned', 75],
                ['Medical cover', 100],
                ['Volunteers', 76],
                ['Broadcast', 40],
              ].map(([l, v]) => (
                <li key={l as string} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{l}</span>
                    <span className="tabular text-muted-foreground">{v}%</span>
                  </div>
                  <Progress value={v as number} tone={v === 100 ? 'gold' : 'primary'} label={l as string} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'registrations' && (
        <Card>
          <div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className={cn(inputClass, 'pl-9')} placeholder="Search teams or captains" aria-label="Search registrations" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="h-10"
                onClick={() => {
                  setRegs((p) => p.map((r) => (r.status === 'Pending' && r.verified === r.players && r.paid ? { ...r, status: 'Approved' } : r)))
                  toast.success('Approved all fully verified, paid teams')
                }}
              >
                <Check /> Bulk approve verified
              </Button>
              <Button variant="outline" size="lg" className="h-10" onClick={() => toast.success('registrations.csv exported (prototype)')}>
                <Download /> Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Team</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Roster verified</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <p className="font-medium">{r.team}</p>
                      <p className="text-xs text-muted-foreground">Capt. {r.captain}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.cat}</td>
                    <td className="px-5 py-3">
                      <div className="flex w-36 items-center gap-2">
                        <Progress value={(r.verified / r.players) * 100} tone={r.verified === r.players ? 'gold' : 'primary'} label="Roster verified" />
                        <span className="tabular text-xs">
                          {r.verified}/{r.players}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">{r.paid ? <Badge tone="success">Paid</Badge> : <Badge tone="danger">Unpaid</Badge>}</td>
                    <td className="px-5 py-3">
                      <Badge tone={r.status === 'Approved' ? 'gold' : r.status === 'Rejected' ? 'danger' : r.status === 'Waitlist' ? 'outline' : 'primary'}>{r.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon-sm" variant="ghost" aria-label={`Approve ${r.team}`} onClick={() => setStatus(r.id, 'Approved')}>
                          <Check />
                        </Button>
                        <Button size="icon-sm" variant="ghost" aria-label={`Reject ${r.team}`} onClick={() => setStatus(r.id, 'Rejected')}>
                          <X />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'fixtures' && (
        <Card>
          <CardHeader
            title="Group-stage fixtures"
            description="Round-robin generator balances courts and rest time."
            action={
              <Button size="lg" className="h-10" onClick={generate}>
                <Shuffle /> {fixtures ? 'Regenerate' : 'Generate fixtures'}
              </Button>
            }
          />
          {fixtures ? (
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Court</th>
                    <th className="pb-3 font-medium">Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {fixtures.map((f, i) => (
                    <tr key={i}>
                      <td className="tabular py-3 font-display font-semibold">{f.time}</td>
                      <td className="py-3">
                        <Badge tone="outline">{f.court}</Badge>
                      </td>
                      <td className="py-3">
                        <span className="font-medium">{f.a}</span> <span className="text-muted-foreground">vs</span> <span className="font-medium">{f.b}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex gap-2">
                <Button size="lg" className="h-10" onClick={() => toast.success('Fixtures published to teams and the public event page')}>
                  Publish fixtures
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
              <Shuffle className="size-8" />
              <p>Generate a draft schedule from approved and pending teams.</p>
            </div>
          )}
        </Card>
      )}

      {tab === 'comms' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="New announcement" />
            <form
              className="flex flex-col gap-4 p-5"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                setSent((p) => [{ title: String(fd.get('title')), body: String(fd.get('body')), audience: String(fd.get('audience')), time: 'just now' }, ...p])
                e.currentTarget.reset()
                toast.success('Announcement sent')
              }}
            >
              <Field label="Audience">
                <select name="audience" className={inputClass}>
                  <option>All teams</option>
                  <option>Team managers</option>
                  <option>Volunteers</option>
                  <option>Officials</option>
                  <option>Spectators</option>
                </select>
              </Field>
              <Field label="Title">
                <input name="title" required className={inputClass} placeholder="Schedule update" />
              </Field>
              <Field label="Message">
                <textarea name="body" required rows={4} className={cn(inputClass, 'h-auto py-2')} placeholder="Write your announcement…" />
              </Field>
              <div className="flex gap-2">
                <Button type="submit" size="lg" className="h-10">
                  <Send /> Send
                </Button>
                <Link href="/app/assistant" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'h-10')}>
                  <Sparkles className="size-4" /> Draft with assistant
                </Link>
              </div>
            </form>
          </Card>
          <Card>
            <CardHeader title="Sent" />
            <ul className="flex flex-col divide-y px-5 pb-2">
              {sent.map((s, i) => (
                <li key={i} className="flex gap-3 py-4">
                  <Megaphone className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.audience} · {s.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
