'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronDown, Clock, MapPin, ShieldCheck, Ticket, Trophy, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import type { PTEvent } from '@/lib/data/events'
import { Badge, Card, CardHeader, Field, Modal, Progress, Tabs, formatDate, inputClass } from '@/components/pt/ui'
import { Button } from '@/components/ui/button'

type Tab = 'overview' | 'schedule' | 'rules' | 'faq'

function RegisterFlow({ event, open, onClose }: { event: PTEvent; open: boolean; onClose: () => void }) {
  const { registerEvent } = usePlaytrace()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState(event.categories[0])
  const [agree, setAgree] = useState(false)
  const steps = ['Category', 'Details', 'Confirm']

  const close = () => {
    onClose()
    setTimeout(() => setStep(0), 300)
  }

  return (
    <Modal open={open} onClose={close} title={`Register — ${event.name}`} description={`${event.fee} · ${event.venue}`}>
      <div className="flex flex-col gap-5 p-5">
        <ol className="flex items-center gap-2" aria-label="Registration progress">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold', i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground')}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn('text-xs font-medium', i === step ? 'text-foreground' : 'text-muted-foreground')}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Choose a category</legend>
            {event.categories.map((c) => (
              <label key={c} className={cn('flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm', category === c && 'border-primary bg-accent/40')}>
                {c}
                <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="accent-primary" />
              </label>
            ))}
          </fieldset>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
              <ShieldCheck className="size-4 shrink-0" /> Your verified PLAYTRACE ID will be shared with the organiser.
            </div>
            <Field label="Team / display name">
              <input className={inputClass} defaultValue="Bengaluru Blaze" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact phone">
                <input className={inputClass} defaultValue="+91 98450 12345" inputMode="tel" />
              </Field>
              <Field label="Emergency contact">
                <input className={inputClass} placeholder="Name & phone" />
              </Field>
            </div>
            <Field label="Medical notes (optional)" hint="Shared only with the medical team on site.">
              <input className={inputClass} placeholder="Allergies, conditions…" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col divide-y rounded-lg border text-sm">
              {[
                ['Event', event.name],
                ['Category', category],
                ['Dates', `${formatDate(event.start)} – ${formatDate(event.end)}`],
                ['Entry fee', event.fee],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 p-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-primary" />
              <span>I agree to the event rules, code of conduct and safeguarding policy.</span>
            </label>
            <p className="text-xs text-muted-foreground">Prototype: no payment is taken.</p>
          </div>
        )}

        <div className="flex justify-between gap-2">
          <Button variant="ghost" size="lg" className="h-10" onClick={() => (step === 0 ? close() : setStep(step - 1))}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          {step < 2 ? (
            <Button size="lg" className="h-10 px-5" onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-10 px-5"
              disabled={!agree}
              onClick={() => {
                registerEvent(event.id)
                close()
                toast.success('Registration confirmed', { description: `${event.name} · ${category}` })
              }}
            >
              Confirm registration
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export function EventDetail({ event }: { event: PTEvent }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [open, setOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const { registeredEvents } = usePlaytrace()
  const registered = registeredEvents.includes(event.id)
  const full = event.registered >= event.capacity
  const pct = (event.registered / event.capacity) * 100

  return (
    <div className="flex flex-col gap-6">
      <Link href="/app/events" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All events
      </Link>

      <section className="relative overflow-hidden rounded-3xl bg-ink text-ink-foreground">
        <img src={event.image || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden />
        <div className="relative flex min-h-[22rem] flex-col justify-end gap-5 p-6 md:p-10">
          <div className="flex flex-wrap gap-2">
            <Badge tone={event.status === 'Live' ? 'danger' : 'gold'}>{event.status}</Badge>
            <Badge tone="ink" className="border border-ink-border">{event.sport}</Badge>
            <Badge tone="ink" className="border border-ink-border">{event.level}</Badge>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.02] md:text-6xl">{event.name}</h1>
          <p className="text-ink-muted">Organised by {event.organiser}</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Tabs<Tab>
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'rules', label: 'Rules' },
              { id: 'faq', label: 'FAQ' },
            ]}
          />
          {tab === 'overview' && (
            <>
              <Card className="p-6">
                <p className="text-pretty text-lg leading-relaxed">{event.summary}</p>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader title="Categories" />
                  <ul className="flex flex-wrap gap-2 p-5">
                    {event.categories.map((c) => (
                      <li key={c}>
                        <Badge tone="outline">{c}</Badge>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <CardHeader title="Partners" />
                  <ul className="flex flex-wrap gap-4 p-5">
                    {event.sponsors.map((s) => (
                      <li key={s} className="font-display text-lg font-bold text-muted-foreground">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              <Card>
                <CardHeader title="Venue" />
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="grid-lines relative flex h-36 flex-1 items-center justify-center overflow-hidden rounded-xl bg-ink sm:max-w-xs">
                    <MapPin className="size-8 text-gold" aria-hidden />
                    <span className="sr-only">Map placeholder for {event.venue}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">{event.city}, India</p>
                    <p className="text-sm text-muted-foreground">Accessible entrances · Medical bay · Parking</p>
                  </div>
                </div>
              </Card>
            </>
          )}
          {tab === 'schedule' && (
            <div className="flex flex-col gap-4">
              {event.schedule.map((d) => (
                <Card key={d.day}>
                  <CardHeader title={d.day} />
                  <ol className="flex flex-col gap-3 p-5">
                    {d.items.map((it) => (
                      <li key={it.title} className="flex items-center gap-4">
                        <span className="tabular flex w-16 items-center gap-1 font-display text-sm font-semibold text-primary">
                          <Clock className="size-3.5" />
                          {it.time}
                        </span>
                        <span className="text-sm">{it.title}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
            </div>
          )}
          {tab === 'rules' && (
            <Card>
              <CardHeader title="Rules & eligibility" />
              <ul className="flex flex-col gap-3 p-5">
                {event.rules.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <CheckCircle2 className="size-5 shrink-0 text-primary" /> {r}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {tab === 'faq' && (
            <Card className="divide-y">
              {event.faq.map((f, i) => (
                <div key={f.q}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i} className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium">
                    {f.q}
                    <ChevronDown className={cn('size-4 shrink-0 transition-transform', faqOpen === i && 'rotate-180')} />
                  </button>
                  {faqOpen === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="flex flex-col gap-5 p-5">
            <dl className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-muted-foreground" />
                <div>
                  <dt className="sr-only">Dates</dt>
                  <dd className="font-medium">
                    {formatDate(event.start, { weekday: 'short', day: 'numeric', month: 'short' })} – {formatDate(event.end, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-muted-foreground" />
                <dd className="font-medium">
                  {event.venue}, {event.city}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="size-5 text-gold" />
                <dd className="font-medium">Prize: {event.prize}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Ticket className="size-5 text-muted-foreground" />
                <dd className="font-medium">Entry: {event.fee}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="size-4" /> Registered
                </span>
                <span className="tabular font-semibold">
                  {event.registered + (registered ? 1 : 0)} / {event.capacity}
                </span>
              </div>
              <Progress value={pct} tone={pct > 90 ? 'gold' : 'primary'} label="Capacity" />
            </div>
            {registered ? (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
                <CheckCircle2 className="size-5" /> You&apos;re registered. See you there.
              </div>
            ) : (
              <Button size="lg" className="h-12 text-base" disabled={full || event.status === 'Completed'} onClick={() => setOpen(true)}>
                {full ? 'Event full — join waitlist' : 'Register now'}
              </Button>
            )}
            {full && !registered && (
              <Button variant="outline" size="lg" className="h-10" onClick={() => toast.success('Added to waitlist')}>
                Join waitlist
              </Button>
            )}
          </Card>
        </aside>
      </div>

      <RegisterFlow event={event} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
