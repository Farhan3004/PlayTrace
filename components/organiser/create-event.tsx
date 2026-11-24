'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Loader2, MapPin, PartyPopper, Plus, ShieldCheck, Sparkles, Trash2, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge, Card, Chip, Field, PageHeader, inputClass } from '@/components/pt/ui'
import { Button, buttonVariants } from '@/components/ui/button'

type Draft = {
  name: string
  sport: string
  format: string
  level: string
  description: string
  start: string
  end: string
  venue: string
  city: string
  categories: { name: string; capacity: number }[]
  fee: number
  prize: string
  closes: string
  requireVerified: boolean
  ageProof: boolean
  safeguarding: boolean
  medical: boolean
  rules: string
  roles: { role: string; count: number }[]
}

const initial: Draft = {
  name: '',
  sport: 'Basketball',
  format: 'Group + Knockout',
  level: 'Open',
  description: '',
  start: '',
  end: '',
  venue: '',
  city: '',
  categories: [
    { name: 'Men’s Senior', capacity: 16 },
    { name: 'Women’s Senior', capacity: 16 },
  ],
  fee: 2500,
  prize: '',
  closes: '',
  requireVerified: true,
  ageProof: true,
  safeguarding: true,
  medical: true,
  rules: '',
  roles: [
    { role: 'Accreditation', count: 4 },
    { role: 'Table officials', count: 6 },
    { role: 'Medical support', count: 2 },
  ],
}

const steps = ['Basics', 'Date & venue', 'Categories', 'Registration', 'Rules & safety', 'Volunteers', 'Review']
const sports = ['Basketball', 'Football', 'Badminton', 'BGMI', 'Athletics', 'Cricket', 'Valorant', 'Kabaddi']

function validate(step: number, d: Draft) {
  if (step === 0 && d.name.trim().length < 4) return 'Give your event a name (at least 4 characters).'
  if (step === 1 && (!d.start || !d.end || !d.venue || !d.city)) return 'Add dates, venue and city.'
  if (step === 1 && d.end < d.start) return 'End date must be on or after the start date.'
  if (step === 2 && d.categories.length === 0) return 'Add at least one category.'
  return null
}

export function CreateEvent() {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(initial)
  const [error, setError] = useState<string | null>(null)
  const [drafting, setDrafting] = useState(false)
  const [published, setPublished] = useState(false)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }))

  const next = () => {
    const e = validate(step, d)
    setError(e)
    if (!e) setStep((s) => Math.min(steps.length - 1, s + 1))
  }

  const suggest = () => {
    setDrafting(true)
    setTimeout(() => {
      set(
        'description',
        `${d.name || 'This event'} brings together ${d.level.toLowerCase()} ${d.sport.toLowerCase()} talent in a ${d.format.toLowerCase()} format. Every match is stat-tracked on PLAYTRACE, results are verified by the organising body, and scouts get live access to performance data.`,
      )
      setDrafting(false)
    }, 900)
  }

  const totalCapacity = d.categories.reduce((s, c) => s + c.capacity, 0)
  const totalVolunteers = d.roles.reduce((s, r) => s + r.count, 0)

  if (published) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="flex max-w-lg flex-col items-center gap-5 p-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-gold/20 text-gold-foreground">
            <PartyPopper className="size-8" />
          </span>
          <h1 className="text-3xl font-bold">{d.name} is live</h1>
          <p className="text-muted-foreground">Registrations are open. Volunteer roles have been posted and your event appears in discovery for {d.sport.toLowerCase()} athletes.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/app/organiser" className={cn(buttonVariants({ size: 'lg' }), 'h-10 px-4')}>
              Open event console
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={() => {
                setPublished(false)
                setD(initial)
                setStep(0)
              }}
            >
              Create another
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Create event" title="Build your event" description="Seven steps from idea to published. Your progress is saved as you go." actions={<Badge tone="outline">Draft · autosaved</Badge>} />

      <nav aria-label="Steps" className="overflow-x-auto">
        <ol className="flex min-w-max items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-sm font-medium transition-colors',
                  i === step && 'border-foreground bg-foreground text-background',
                  i < step && 'bg-card hover:border-foreground/30',
                  i > step && 'bg-card text-muted-foreground',
                )}
              >
                <span className={cn('flex size-6 items-center justify-center rounded-full text-xs', i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-background text-foreground' : 'bg-muted')}>
                  {i < step ? <Check className="size-3.5" /> : i + 1}
                </span>
                {s}
              </button>
              {i < steps.length - 1 && <span className="h-px w-4 bg-border" aria-hidden />}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="flex flex-col">
          <div className="border-b p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step {step + 1} of {steps.length}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{steps[step]}</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col gap-5 p-6"
            >
              {step === 0 && (
                <>
                  <Field label="Event name">
                    <input value={d.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="e.g. Coastal Hoops Classic 2027" autoFocus />
                  </Field>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-medium">Sport</legend>
                    <div className="flex flex-wrap gap-2">
                      {sports.map((s) => (
                        <Chip key={s} active={d.sport === s} onClick={() => set('sport', s)}>
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Format">
                      <select value={d.format} onChange={(e) => set('format', e.target.value)} className={inputClass}>
                        {['Group + Knockout', 'Knockout', 'Round robin', 'League', 'Swiss', 'Battle royale points'].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Level">
                      <select value={d.level} onChange={(e) => set('level', e.target.value)} className={inputClass}>
                        {['Open', 'Grassroots', 'District', 'State', 'National', 'Collegiate', 'Pro'].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea value={d.description} onChange={(e) => set('description', e.target.value)} rows={4} className={cn(inputClass, 'h-auto py-2')} placeholder="What makes this event worth entering?" />
                  </Field>
                  <Button type="button" variant="outline" size="lg" className="h-10 w-fit" onClick={suggest} disabled={drafting}>
                    {drafting ? <Loader2 className="animate-spin" /> : <Sparkles />} Suggest a description
                  </Button>
                  <p className="-mt-3 text-xs text-muted-foreground">Suggestions are generated from a local template in this prototype.</p>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Start date">
                      <input type="date" value={d.start} onChange={(e) => set('start', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="End date">
                      <input type="date" value={d.end} min={d.start} onChange={(e) => set('end', e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Venue">
                    <input value={d.venue} onChange={(e) => set('venue', e.target.value)} className={inputClass} placeholder="e.g. Kanteerava Indoor Stadium" />
                  </Field>
                  <Field label="City">
                    <input value={d.city} onChange={(e) => set('city', e.target.value)} className={inputClass} placeholder="e.g. Bengaluru" />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Suggested PLAYTRACE venues:</span>
                    {['Kanteerava Indoor Stadium, Bengaluru', 'Gachibowli Indoor Stadium, Hyderabad', 'Balewadi Sports Complex, Pune'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          const [venue, city] = v.split(', ')
                          setD((p) => ({ ...p, venue, city }))
                        }}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs hover:bg-accent"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <ul className="flex flex-col gap-3">
                    {d.categories.map((c, i) => (
                      <li key={i} className="flex items-end gap-3">
                        <Field label={`Category ${i + 1}`}>
                          <input
                            value={c.name}
                            onChange={(e) => set('categories', d.categories.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                            className={inputClass}
                          />
                        </Field>
                        <div className="w-28">
                          <Field label="Capacity">
                            <input
                              type="number"
                              min={2}
                              value={c.capacity}
                              onChange={(e) => set('categories', d.categories.map((x, j) => (j === i ? { ...x, capacity: Number(e.target.value) } : x)))}
                              className={inputClass}
                            />
                          </Field>
                        </div>
                        <Button type="button" variant="ghost" size="icon-lg" aria-label={`Remove ${c.name}`} onClick={() => set('categories', d.categories.filter((_, j) => j !== i))}>
                          <Trash2 />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button type="button" variant="outline" size="lg" className="h-10 w-fit" onClick={() => set('categories', [...d.categories, { name: 'New category', capacity: 8 }])}>
                    <Plus /> Add category
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Total capacity: <span className="font-semibold text-foreground">{totalCapacity}</span> entries
                  </p>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Entry fee (₹)" hint="Set 0 for a free event">
                      <input type="number" min={0} value={d.fee} onChange={(e) => set('fee', Number(e.target.value))} className={inputClass} />
                    </Field>
                    <Field label="Registration closes">
                      <input type="date" value={d.closes} max={d.start} onChange={(e) => set('closes', e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Prize pool / reward">
                    <input value={d.prize} onChange={(e) => set('prize', e.target.value)} className={inputClass} placeholder="e.g. ₹3,00,000 + academy trials" />
                  </Field>
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                    <p className="font-medium">Estimated gross revenue</p>
                    <p className="tabular font-display text-2xl font-bold">₹{(d.fee * totalCapacity).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">At full capacity, before payment processing fees.</p>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  {(
                    [
                      ['requireVerified', 'Require verified PLAYTRACE ID for all participants'],
                      ['ageProof', 'Require age proof for youth categories'],
                      ['safeguarding', 'Safeguarding officer on site & DBS-equivalent checks for volunteers working with minors'],
                      ['medical', 'Medical team and emergency action plan'],
                    ] as const
                  ).map(([k, label]) => (
                    <label key={k} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4">
                      <span className="flex gap-3 text-sm">
                        <ShieldCheck className="size-5 shrink-0 text-primary" /> {label}
                      </span>
                      <input type="checkbox" checked={d[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 size-4 accent-primary" />
                    </label>
                  ))}
                  <Field label="Additional rules">
                    <textarea value={d.rules} onChange={(e) => set('rules', e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Governing rulebook, roster limits, equipment…" />
                  </Field>
                </>
              )}

              {step === 5 && (
                <>
                  <ul className="flex flex-col gap-3">
                    {d.roles.map((r, i) => (
                      <li key={i} className="flex items-center gap-3 rounded-xl border p-3">
                        <Users className="size-5 text-muted-foreground" />
                        <input value={r.role} onChange={(e) => set('roles', d.roles.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} className={cn(inputClass, 'flex-1 border-0 bg-transparent px-0')} aria-label="Role name" />
                        <div className="flex items-center gap-1">
                          <Button type="button" size="icon-sm" variant="outline" aria-label="Decrease" onClick={() => set('roles', d.roles.map((x, j) => (j === i ? { ...x, count: Math.max(1, x.count - 1) } : x)))}>
                            −
                          </Button>
                          <span className="tabular w-8 text-center font-semibold">{r.count}</span>
                          <Button type="button" size="icon-sm" variant="outline" aria-label="Increase" onClick={() => set('roles', d.roles.map((x, j) => (j === i ? { ...x, count: x.count + 1 } : x)))}>
                            +
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {['Crowd & ushering', 'Athlete liaison', 'Media crew', 'Transport', 'Scorers'].map((r) => (
                      <button key={r} type="button" onClick={() => set('roles', [...d.roles, { role: r, count: 2 }])} className="flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-sm hover:border-foreground/30">
                        <Plus className="size-3.5" /> {r}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 6 && (
                <dl className="flex flex-col divide-y rounded-xl border text-sm">
                  {[
                    ['Name', d.name],
                    ['Sport & format', `${d.sport} · ${d.format} · ${d.level}`],
                    ['Dates', d.start && d.end ? `${d.start} → ${d.end}` : '—'],
                    ['Venue', `${d.venue}, ${d.city}`],
                    ['Categories', d.categories.map((c) => `${c.name} (${c.capacity})`).join(', ')],
                    ['Entry fee', d.fee ? `₹${d.fee.toLocaleString('en-IN')}` : 'Free'],
                    ['Prize', d.prize || '—'],
                    ['Safety', [d.requireVerified && 'Verified IDs', d.ageProof && 'Age proof', d.safeguarding && 'Safeguarding', d.medical && 'Medical'].filter(Boolean).join(', ')],
                    ['Volunteers', `${totalVolunteers} across ${d.roles.length} roles`],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[140px_1fr] gap-4 p-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between border-t p-5">
            <Button variant="ghost" size="lg" className="h-10" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button size="lg" className="h-10 px-5" onClick={next}>
                Continue <ArrowRight />
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-10 bg-gold px-5 text-gold-foreground hover:bg-gold/90"
                onClick={() => {
                  setPublished(true)
                  toast.success('Event published')
                }}
              >
                <CheckCircle2 /> Publish event
              </Button>
            )}
          </div>
        </Card>

        <aside className="flex flex-col gap-3 xl:sticky xl:top-24 xl:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live preview</p>
          <Card className="overflow-hidden">
            <div className="grid-lines relative flex h-40 flex-col justify-end bg-ink p-5 text-ink-foreground">
              <Badge tone="gold" className="absolute left-4 top-4">
                Registration open
              </Badge>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">{d.sport}</p>
              <h3 className="text-xl font-bold leading-tight">{d.name || 'Your event name'}</h3>
            </div>
            <div className="flex flex-col gap-2 p-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" /> {d.start || 'Start date'} {d.end && `→ ${d.end}`}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" /> {d.venue || 'Venue'}
                {d.city && `, ${d.city}`}
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="size-4 text-gold" /> {d.prize || 'Prize pool'}
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4" /> {totalCapacity} entries · {d.fee ? `₹${d.fee.toLocaleString('en-IN')}` : 'Free'}
              </span>
              {d.description && <p className="mt-2 line-clamp-4 leading-relaxed text-foreground">{d.description}</p>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
