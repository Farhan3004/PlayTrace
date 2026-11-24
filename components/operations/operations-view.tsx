'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Ambulance, CheckCircle2, CloudSun, DoorOpen, Pause, Play, Plus, Radio, ScanLine, Send, Thermometer, Users, Wind } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge, Field, Modal, inputClass } from '@/components/pt/ui'
import { LineTrend } from '@/components/pt/charts'
import { Button } from '@/components/ui/button'

type Court = { id: string; name: string; a: string; b: string; sa: number; sb: number; q: number; clock: number; status: 'Live' | 'Break' | 'Final' }
type Incident = { id: string; time: string; zone: string; type: string; severity: 'High' | 'Medium' | 'Low'; status: 'Open' | 'Assigned' | 'Resolved'; note: string }

const initialCourts: Court[] = [
  { id: 'c1', name: 'Centre Court', a: 'Chennai Heat', b: 'Mysuru Royals', sa: 54, sb: 49, q: 3, clock: 412, status: 'Live' },
  { id: 'c2', name: 'Court 2', a: 'Madurai Mavericks', b: 'Goa Gulls', sa: 31, sb: 36, q: 2, clock: 128, status: 'Live' },
  { id: 'c3', name: 'Court 3', a: 'Mysuru U-19', b: 'Vizag U-19', sa: 22, sb: 18, q: 2, clock: 0, status: 'Break' },
  { id: 'c4', name: 'Court 4', a: 'Bengaluru Blaze', b: 'Vizag Waves', sa: 88, sb: 61, q: 4, clock: 0, status: 'Final' },
]

const initialIncidents: Incident[] = [
  { id: 'i1', time: '17:42', zone: 'Stand N', type: 'Crowd congestion', severity: 'Medium', status: 'Assigned', note: 'Queue at concessions blocking aisle 4. Isha K. assigned.' },
  { id: 'i2', time: '17:20', zone: 'Court 2', type: 'Player injury', severity: 'High', status: 'Resolved', note: 'Ankle sprain, Goa Gulls #7. Treated by medical team, cleared.' },
  { id: 'i3', time: '16:55', zone: 'Gate A', type: 'Accreditation', severity: 'Low', status: 'Resolved', note: 'Two lanyards reprinted for Kochi Tide staff.' },
]

const zones = [
  { zone: 'Gate A', cap: 600 },
  { zone: 'Stand North', cap: 1400 },
  { zone: 'Stand South', cap: 1400 },
  { zone: 'Concourse', cap: 800 },
  { zone: 'Fan zone', cap: 500 },
]

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function OperationsView() {
  const [live, setLive] = useState(true)
  const [courts, setCourts] = useState(initialCourts)
  const [incidents, setIncidents] = useState(initialIncidents)
  const [checkins, setCheckins] = useState(2184)
  const [occupancy, setOccupancy] = useState([410, 1180, 1020, 520, 310])
  const [series, setSeries] = useState(Array.from({ length: 12 }, (_, i) => ({ t: `${17}:${String(i * 5).padStart(2, '0')}`, people: 1800 + i * 40 + Math.round(Math.random() * 60) })))
  const [log, setLog] = useState(false)
  const [broadcast, setBroadcast] = useState('')
  const [now, setNow] = useState('18:04:12')

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => {
      const d = new Date()
      setNow(`18:${String(4 + (d.getSeconds() % 50 === 0 ? 1 : 0)).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`)
      setCourts((cs) =>
        cs.map((c) => {
          if (c.status !== 'Live') return c
          const scoreA = Math.random() < 0.18 ? (Math.random() < 0.3 ? 3 : 2) : 0
          const scoreB = Math.random() < 0.16 ? (Math.random() < 0.3 ? 3 : 2) : 0
          return { ...c, sa: c.sa + scoreA, sb: c.sb + scoreB, clock: Math.max(0, c.clock - 2) }
        }),
      )
      setCheckins((n) => n + Math.round(Math.random() * 6))
      setOccupancy((o) => o.map((v, i) => Math.max(0, Math.min(zones[i].cap, v + Math.round((Math.random() - 0.4) * 18)))))
      setSeries((s) => {
        const last = s[s.length - 1]
        const [h, m] = last.t.split(':').map(Number)
        const nm = (m + 5) % 60
        return [...s.slice(1), { t: `${nm === 0 ? h + 1 : h}:${String(nm).padStart(2, '0')}`, people: Math.max(1500, last.people + Math.round((Math.random() - 0.35) * 80)) }]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [live])

  useEffect(() => {
    if (!live) return
    const id = setTimeout(() => {
      setIncidents((p) => [
        { id: `i${Date.now()}`, time: '18:06', zone: 'Concourse', type: 'Lost child', severity: 'High', status: 'Open', note: 'Reported at info desk. Description shared on radio ch. 2. Two-adult rule applies.' },
        ...p,
      ])
      toast.warning('New high-severity incident · Concourse')
    }, 9000)
    return () => clearTimeout(id)
  }, [live])

  const open = incidents.filter((i) => i.status !== 'Resolved').length

  return (
    <div className="-mx-4 -mt-6 min-h-full bg-ink px-4 pb-10 pt-6 text-ink-foreground md:-mx-6 md:px-6 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span className={cn('size-2 rounded-full', live ? 'animate-live bg-destructive' : 'bg-ink-muted')} /> Event-day operations · Day 2
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">South Zone Hoops — Control Room</h1>
            <p className="text-sm text-ink-muted">Kanteerava Indoor Stadium · Simulated live data · {now} IST</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" variant="outline" className="h-10 border-ink-border bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground" onClick={() => setLive((l) => !l)}>
              {live ? <Pause /> : <Play />} {live ? 'Pause feed' : 'Resume feed'}
            </Button>
            <Button size="lg" className="h-10 bg-destructive text-ink-foreground hover:bg-destructive/90" onClick={() => setLog(true)}>
              <Plus /> Log incident
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border md:grid-cols-4">
          {[
            { icon: ScanLine, label: 'Checked in', value: checkins.toLocaleString('en-IN'), sub: 'of 3,200 tickets' },
            { icon: Users, label: 'In venue now', value: occupancy.reduce((a, b) => a + b, 0).toLocaleString('en-IN'), sub: 'capacity 4,700' },
            { icon: AlertTriangle, label: 'Open incidents', value: String(open), sub: `${incidents.length} today` },
            { icon: CheckCircle2, label: 'Volunteers on duty', value: '34/38', sub: '4 on break' },
          ].map((k) => (
            <div key={k.label} className="flex flex-col gap-2 bg-ink p-5">
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-muted">
                <k.icon className="size-4" /> {k.label}
              </span>
              <span className="tabular font-display text-3xl font-bold">{k.value}</span>
              <span className="text-xs text-ink-muted">{k.sub}</span>
            </div>
          ))}
        </div>

        <section aria-label="Live courts" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courts.map((c) => (
            <div key={c.id} className="flex flex-col gap-4 rounded-2xl border border-ink-border bg-sidebar-accent/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{c.name}</span>
                <Badge tone={c.status === 'Live' ? 'danger' : c.status === 'Final' ? 'gold' : 'neutral'}>
                  {c.status === 'Live' && <span className="size-1.5 animate-live rounded-full bg-destructive" />}
                  {c.status === 'Live' ? `Q${c.q} · ${fmt(c.clock)}` : c.status === 'Break' ? `Q${c.q} break` : 'Final'}
                </Badge>
              </div>
              {[
                [c.a, c.sa],
                [c.b, c.sb],
              ].map(([n, s], i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className={cn('truncate text-sm', (i === 0 ? c.sa > c.sb : c.sb > c.sa) ? 'font-semibold' : 'text-ink-muted')}>{n}</span>
                  <span className="tabular font-display text-3xl font-bold">{s}</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="flex flex-col rounded-2xl border border-ink-border xl:col-span-2">
            <div className="flex items-center justify-between border-b border-ink-border p-5">
              <h2 className="text-base font-semibold">Incident log</h2>
              <span className="text-xs text-ink-muted">{open} open</span>
            </div>
            <ul className="flex max-h-[420px] flex-col divide-y divide-ink-border overflow-y-auto" aria-live="polite">
              {incidents.map((i) => (
                <li key={i.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className={cn('mt-1 size-2.5 shrink-0 rounded-full', i.severity === 'High' ? 'bg-destructive' : i.severity === 'Medium' ? 'bg-gold' : 'bg-ink-muted')} aria-hidden />
                    <div>
                      <p className="text-sm font-semibold">
                        {i.type} <span className="font-normal text-ink-muted">· {i.zone} · {i.time}</span>
                      </p>
                      <p className="text-sm text-ink-muted">{i.note}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-5 sm:pl-0">
                    <Badge tone={i.status === 'Resolved' ? 'success' : i.status === 'Assigned' ? 'primary' : 'danger'}>{i.status}</Badge>
                    {i.status !== 'Resolved' && (
                      <button
                        onClick={() => {
                          setIncidents((p) => p.map((x) => (x.id === i.id ? { ...x, status: x.status === 'Open' ? 'Assigned' : 'Resolved' } : x)))
                          toast.success(i.status === 'Open' ? 'Assigned to nearest zone lead' : 'Incident resolved')
                        }}
                        className="rounded-md border border-ink-border px-2 py-1 text-xs hover:bg-ink-foreground/10"
                      >
                        {i.status === 'Open' ? 'Assign' : 'Resolve'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-ink-border p-5">
            <h2 className="text-base font-semibold">Crowd density</h2>
            <ul className="flex flex-col gap-3">
              {zones.map((z, idx) => {
                const pct = (occupancy[idx] / z.cap) * 100
                return (
                  <li key={z.zone} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <DoorOpen className="size-4 text-ink-muted" /> {z.zone}
                      </span>
                      <span className={cn('tabular text-xs', pct > 85 ? 'font-semibold text-destructive' : 'text-ink-muted')}>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sidebar-accent">
                      <div className={cn('h-full rounded-full transition-all duration-1000', pct > 85 ? 'bg-destructive' : pct > 65 ? 'bg-gold' : 'bg-primary')} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="rounded-xl bg-sidebar-accent/60 p-3 [&_.recharts-cartesian-axis-tick_text]:fill-[var(--ink-muted)]">
              <p className="mb-1 text-xs text-ink-muted">Attendance, last hour</p>
              <LineTrend data={series} x="t" series={[{ key: 'people', name: 'In venue', color: 'var(--gold)' }]} height={130} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="flex flex-col gap-3 rounded-2xl border border-ink-border p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <CloudSun className="size-5 text-gold" /> Conditions
            </h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <Thermometer className="mb-1 size-4 text-ink-muted" />
                <p className="font-semibold">27°C</p>
                <p className="text-xs text-ink-muted">Indoor 24°C</p>
              </div>
              <div>
                <Wind className="mb-1 size-4 text-ink-muted" />
                <p className="font-semibold">9 km/h</p>
                <p className="text-xs text-ink-muted">NE</p>
              </div>
              <div>
                <CloudSun className="mb-1 size-4 text-ink-muted" />
                <p className="font-semibold">10%</p>
                <p className="text-xs text-ink-muted">Rain</p>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-ink-border p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Ambulance className="size-5 text-destructive" /> Medical & emergency
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-ink-muted">
              <li>Medical bay: 2 physios, 1 doctor · 0 patients</li>
              <li>Ambulance on standby at Gate B</li>
              <li>Safeguarding officer: Fatima Sheikh</li>
            </ul>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-ink-border p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Radio className="size-5 text-primary" /> Broadcast to crew
            </h2>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!broadcast.trim()) return
                toast.success('Broadcast sent to 38 volunteers & 12 officials')
                setBroadcast('')
              }}
            >
              <label htmlFor="bc" className="sr-only">
                Broadcast message
              </label>
              <input id="bc" value={broadcast} onChange={(e) => setBroadcast(e.target.value)} placeholder="e.g. Open Gate C now" className="h-10 flex-1 rounded-lg border border-ink-border bg-transparent px-3 text-sm outline-none placeholder:text-ink-muted focus:border-primary" />
              <Button type="submit" size="icon-lg" className="size-10" aria-label="Send broadcast">
                <Send />
              </Button>
            </form>
          </section>
        </div>
      </div>

      <Modal open={log} onClose={() => setLog(false)} title="Log an incident" description="High-severity incidents alert the duty manager immediately.">
        <form
          className="flex flex-col gap-4 p-5"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            setIncidents((p) => [
              { id: `i${Date.now()}`, time: now.slice(0, 5), zone: String(fd.get('zone')), type: String(fd.get('type')), severity: fd.get('severity') as Incident['severity'], status: 'Open', note: String(fd.get('note')) },
              ...p,
            ])
            setLog(false)
            toast.success('Incident logged')
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <select name="type" className={inputClass}>
                {['Player injury', 'Spectator medical', 'Crowd congestion', 'Safeguarding concern', 'Security', 'Facility issue', 'Lost child'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Zone">
              <select name="zone" className={inputClass}>
                {[...zones.map((z) => z.zone), 'Centre Court', 'Court 2', 'Court 3', 'Court 4'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Severity">
            <select name="severity" className={inputClass} defaultValue="Medium">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </Field>
          <Field label="Details">
            <textarea name="note" required rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="What happened, who is involved, actions taken…" />
          </Field>
          <Button type="submit" size="lg" className="h-10">
            Log incident
          </Button>
        </form>
      </Modal>
    </div>
  )
}
