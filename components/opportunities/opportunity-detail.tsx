'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, BadgeCheck, CalendarClock, CheckCircle2, Circle, MapPin, Users, Wallet, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import type { Opportunity } from '@/lib/data/platform'
import { Badge, Card, CardHeader, Field, Modal, Progress, formatDate, inputClass } from '@/components/pt/ui'
import { Button } from '@/components/ui/button'

export function OpportunityDetail({ o }: { o: Opportunity }) {
  const { appliedOpps, applyOpp } = usePlaytrace()
  const [open, setOpen] = useState(false)
  const applied = appliedOpps.includes(o.id)
  const eligibility = o.eligibility.map((e, i) => ({ text: e, met: !(o.match < 80 && i === o.eligibility.length - 1) }))

  return (
    <div className="flex flex-col gap-6">
      <Link href="/app/opportunities" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All opportunities
      </Link>

      <section className="grid-lines relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground md:p-10">
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="gold">{o.category}</Badge>
            <Badge tone="ink" className="border border-ink-border">{o.sport === 'Any' ? 'All sports' : o.sport}</Badge>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight md:text-5xl">{o.title}</h1>
          <p className="text-lg text-ink-muted">{o.org}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-gold" />
              <dt className="sr-only">Value</dt>
              <dd>{o.value}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-ink-muted" />
              <dd>{o.location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-ink-muted" />
              <dd>Closes {formatDate(o.deadline)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-ink-muted" />
              <dd>{o.applicants.toLocaleString('en-IN')} applicants</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-pretty text-lg leading-relaxed">{o.summary}</p>
          </Card>
          <Card>
            <CardHeader title="Eligibility" description="Checked against your verified PLAYTRACE profile" />
            <ul className="flex flex-col gap-3 p-5">
              {eligibility.map((e) => (
                <li key={e.text} className="flex items-start gap-3 text-sm">
                  {e.met ? <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Met" /> : <XCircle className="size-5 shrink-0 text-destructive" aria-label="Not yet met" />}
                  {e.text}
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader title="What you’ll need" />
              <ul className="flex flex-col gap-3 p-5">
                {o.requirements.map((r) => (
                  <li key={r} className="flex items-center gap-3 text-sm">
                    <BadgeCheck className="size-4 text-gold" /> {r}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader title="Selection process" />
              <ol className="flex flex-col gap-3 p-5">
                {o.process.map((p, i) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    {applied && i === 0 ? <CheckCircle2 className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}
                    <span className={cn(applied && i === 0 && 'font-medium')}>{p}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Your match</span>
                <span className="tabular font-display text-4xl font-bold">{o.match}%</span>
              </div>
              <Progress value={o.match} tone={o.match >= 85 ? 'gold' : 'primary'} label="Match" />
              <p className="text-xs text-muted-foreground">Based on sport, level, verified achievements and location.</p>
            </div>
            {applied ? (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
                <CheckCircle2 className="size-5" /> Application submitted — under screening
              </div>
            ) : (
              <Button size="lg" className="h-12 text-base" onClick={() => setOpen(true)}>
                Apply now
              </Button>
            )}
            <Button variant="outline" size="lg" className="h-10" onClick={() => toast.success('Saved to your opportunities')}>
              Save for later
            </Button>
          </Card>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Apply — ${o.title}`} description={o.org}>
        <form
          className="flex flex-col gap-4 p-5"
          onSubmit={(e) => {
            e.preventDefault()
            applyOpp(o.id)
            setOpen(false)
            toast.success('Application submitted', { description: `${o.org} will review your verified profile.` })
          }}
        >
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <img src="/images/athlete-basketball.png" alt="" className="size-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Ananya Rao</p>
              <p className="text-xs text-muted-foreground">Verified profile · 14 achievements attached</p>
            </div>
            <BadgeCheck className="size-5 text-gold" />
          </div>
          <Field label="Why are you a fit?">
            <textarea required rows={4} className={cn(inputClass, 'h-auto py-2')} placeholder="Tell the selectors about your goals and recent form…" />
          </Field>
          <Field label="Highlight reel link (optional)">
            <input className={inputClass} placeholder="Defaults to your top PLAYTRACE highlight" />
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-0.5 accent-primary" />
            <span>I consent to sharing my verified profile and contact details with {o.org}.</span>
          </label>
          <Button type="submit" size="lg" className="h-10">
            Submit application
          </Button>
        </form>
      </Modal>
    </div>
  )
}
