'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, BadgeCheck, CheckCircle2, Clock, GraduationCap, HandHeart, Languages, MapPin, Search, ShieldCheck, Star, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { shifts as seedShifts, volunteers as seedVolunteers, type Volunteer } from '@/lib/data/platform'
import { Avatar, Badge, Card, CardHeader, Modal, PageHeader, Progress, Stat, Tabs, inputClass } from '@/components/pt/ui'
import { Button } from '@/components/ui/button'

type Tab = 'roster' | 'shifts' | 'training' | 'safety'

const training = [
  { course: 'Safeguarding children & vulnerable adults', required: 'Roles with minors', duration: '45 min', completion: 72 },
  { course: 'Emergency & evacuation procedures', required: 'All volunteers', duration: '20 min', completion: 91 },
  { course: 'Basic first aid', required: 'Medical & zone leads', duration: '3 hrs', completion: 58 },
  { course: 'FIBA table officiating', required: 'Table officials', duration: '2 hrs', completion: 80 },
  { course: 'Accessibility & inclusive welcome', required: 'Front-of-house', duration: '30 min', completion: 66 },
]

export function VolunteersView() {
  const { role } = usePlaytrace()
  const isOrganiser = role === 'organiser' || role === 'admin'
  const [tab, setTab] = useState<Tab>(isOrganiser ? 'roster' : 'shifts')
  const [vols, setVols] = useState(seedVolunteers)
  const [shifts, setShifts] = useState(seedShifts)
  const [requested, setRequested] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Volunteer | null>(null)

  const list = useMemo(() => vols.filter((v) => `${v.name} ${v.role} ${v.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase())), [vols, q])
  const setStatus = (id: string, status: Volunteer['status']) => setVols((p) => p.map((v) => (v.id === id ? { ...v, status } : v)))

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-ink text-ink-foreground">
        <img src="/images/volunteers.png" alt="" className="absolute inset-0 size-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" aria-hidden />
        <div className="relative flex flex-col gap-4 p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Volunteer network</p>
          <h1 className="max-w-xl text-balance text-3xl font-bold md:text-5xl">The people who make game day happen.</h1>
          <p className="max-w-lg text-ink-muted">{isOrganiser ? 'Recruit, schedule, train and protect your volunteer crew for South Zone Hoops Invitational.' : 'Find shifts, complete training and build a recognised record of your hours.'}</p>
        </div>
      </section>

      <Card className="grid grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Active volunteers', value: String(vols.filter((v) => v.status !== 'Applied' && v.status !== 'Invited').length), hint: `${vols.length} in pool` },
          { label: 'Shift fill rate', value: `${Math.round((shifts.reduce((s, x) => s + x.filled, 0) / shifts.reduce((s, x) => s + x.needed, 0)) * 100)}%` },
          { label: 'Safeguarding cleared', value: `${vols.filter((v) => v.safeguarding).length}/${vols.length}` },
          { label: 'Hours this season', value: vols.reduce((s, v) => s + v.hours, 0).toLocaleString('en-IN') },
        ].map((k, i) => (
          <Stat key={k.label} {...k} className={cn('border-b p-5 md:border-b-0', i > 0 && 'md:border-l', i % 2 === 1 && 'border-l')} />
        ))}
      </Card>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'roster', label: 'Roster', count: vols.length },
          { id: 'shifts', label: 'Shifts', count: shifts.length },
          { id: 'training', label: 'Training' },
          { id: 'safety', label: 'Safety & safeguarding' },
        ]}
      />

      {tab === 'roster' && (
        <Card>
          <div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, role or skill" className={cn(inputClass, 'pl-9')} aria-label="Search volunteers" />
            </div>
            {isOrganiser && (
              <Button size="lg" className="h-10" onClick={() => toast.success('Invite link copied — share with your network')}>
                <UserPlus /> Invite volunteers
              </Button>
            )}
          </div>
          <ul className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
            {list.map((v) => (
              <li key={v.id} className="bg-card">
                <button onClick={() => setSelected(v)} className="flex w-full flex-col gap-3 p-5 text-left hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <Avatar initials={v.initials} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 font-semibold">
                        {v.name} {v.safeguarding && <ShieldCheck className="size-4 text-success" aria-label="Safeguarding cleared" />}
                      </p>
                      <p className="text-sm text-muted-foreground">{v.role}</p>
                    </div>
                    <Badge tone={v.status === 'Checked in' ? 'success' : v.status === 'Confirmed' ? 'primary' : v.status === 'On break' ? 'gold' : 'neutral'}>{v.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {v.skills.map((s) => (
                      <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {v.hours} hrs
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="size-3 text-gold" /> {v.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" /> {v.city}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'shifts' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shifts.map((s) => {
            const open = s.needed - s.filled
            const isReq = requested.includes(s.id)
            return (
              <Card key={s.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{s.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.zone} · Thu 4 Dec
                    </p>
                  </div>
                  <Badge tone={open === 0 ? 'gold' : 'primary'}>{open === 0 ? 'Full' : `${open} open`}</Badge>
                </div>
                <p className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" /> {s.time}
                </p>
                <Progress value={(s.filled / s.needed) * 100} tone={open === 0 ? 'gold' : 'primary'} label={`${s.role} filled`} />
                {isOrganiser ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-10"
                    disabled={open === 0}
                    onClick={() => {
                      setShifts((p) => p.map((x) => (x.id === s.id ? { ...x, filled: x.needed } : x)))
                      toast.success(`Auto-filled ${open} spots from qualified volunteers`)
                    }}
                  >
                    {open === 0 ? 'Fully staffed' : 'Auto-fill from pool'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="h-10"
                    disabled={open === 0 || isReq}
                    onClick={() => {
                      setRequested((p) => [...p, s.id])
                      toast.success('Shift requested — the organiser will confirm')
                    }}
                  >
                    {isReq ? (
                      <>
                        <CheckCircle2 /> Requested
                      </>
                    ) : open === 0 ? (
                      'Full'
                    ) : (
                      'Request shift'
                    )}
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'training' && (
        <Card>
          <CardHeader title="Training modules" description="Completion across your volunteer pool" />
          <ul className="flex flex-col divide-y p-5">
            {training.map((t) => (
              <li key={t.course} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <GraduationCap className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{t.course}</p>
                    <p className="text-xs text-muted-foreground">
                      Required for: {t.required} · {t.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:w-72">
                  <Progress value={t.completion} tone={t.completion > 85 ? 'gold' : 'primary'} label={`${t.course} completion`} />
                  <span className="tabular w-10 text-sm font-semibold">{t.completion}%</span>
                  <Button size="sm" variant="outline" onClick={() => toast.success(isOrganiser ? 'Reminder sent to incomplete volunteers' : 'Module started')}>
                    {isOrganiser ? 'Remind' : 'Start'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'safety' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Safeguarding status" description="Volunteers working with U-19 athletes must be cleared." />
            <ul className="flex flex-col divide-y p-5">
              {vols.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={v.initials} size={32} />
                    <div>
                      <p className="text-sm font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.role}</p>
                    </div>
                  </div>
                  {v.safeguarding ? (
                    <Badge tone="success">
                      <ShieldCheck className="size-3" /> Cleared
                    </Badge>
                  ) : (
                    <Badge tone="danger">
                      <AlertTriangle className="size-3" /> Not cleared
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Safety procedures" />
            <ul className="flex flex-col gap-4 p-5 text-sm">
              {[
                ['Two-adult rule', 'No volunteer is ever alone with a minor athlete. Athlete liaisons work in pairs.'],
                ['Uncleared volunteers', 'Automatically restricted from roles involving minors, changing areas and transport.'],
                ['Incident reporting', 'Any concern is logged in Event-day Ops and escalated to the designated safeguarding officer within 15 minutes.'],
                ['Welfare officer', 'Fatima Sheikh · on site 08:00–20:00 · Medical bay'],
                ['Emergency', 'Radio channel 1 · Ambulance at Gate B · Nearest hospital: Bowring, 2.1 km'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <ShieldCheck className="size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} description={selected ? `${selected.role} · ${selected.city}` : ''} side="right">
        {selected && (
          <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={selected.initials} size={64} />
              <div className="flex flex-col gap-1">
                <Badge tone={selected.safeguarding ? 'success' : 'danger'}>{selected.safeguarding ? 'Safeguarding cleared' : 'Safeguarding pending'}</Badge>
                <p className="flex items-center gap-1 text-sm">
                  <Star className="size-4 text-gold" /> {selected.rating} from {selected.events} events
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground">Hours</dt>
                <dd className="tabular font-display text-xl font-bold">{selected.hours}</dd>
              </div>
              <div className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground">Events</dt>
                <dd className="tabular font-display text-xl font-bold">{selected.events}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2 text-sm">
              <p className="flex items-center gap-2">
                <HandHeart className="size-4 text-muted-foreground" /> {selected.skills.join(', ')}
              </p>
              <p className="flex items-center gap-2">
                <Languages className="size-4 text-muted-foreground" /> {selected.languages.join(', ')}
              </p>
            </div>
            {selected.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.badges.map((b) => (
                  <Badge key={b} tone="gold">
                    <BadgeCheck className="size-3" /> {b}
                  </Badge>
                ))}
              </div>
            )}
            {isOrganiser && (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="lg"
                  className="h-10"
                  onClick={() => {
                    setStatus(selected.id, 'Confirmed')
                    setSelected(null)
                    toast.success(`${selected.name} confirmed`)
                  }}
                >
                  Confirm for event
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setStatus(selected.id, 'Checked in')
                    setSelected(null)
                    toast.success(`${selected.name} checked in`)
                  }}
                >
                  Check in
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
