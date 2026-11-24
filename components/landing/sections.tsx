'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  FileCheck2,
  Gauge,
  HandHeart,
  Radio,
  ScanSearch,
  ShieldCheck,
  Swords,
  UserCheck,
} from 'lucide-react'
import { Logo } from '@/components/pt/ui'

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const sports = ['Basketball', 'Football', 'Badminton', 'BGMI', 'Athletics', 'Cricket', 'Kabaddi', 'Valorant', 'Hockey', 'Volleyball', 'Table Tennis', 'Free Fire']

export function SportsMarquee() {
  return (
    <section aria-label="Supported sports" className="overflow-hidden border-y border-ink-border bg-ink py-5 text-ink-muted">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-xl font-medium">
        {[...sports, ...sports].map((s, i) => (
          <span key={i} className="flex items-center gap-12">
            {s}
            <span className="size-1.5 rounded-full bg-gold" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  )
}

const chapters = [
  {
    kicker: 'Your journey',
    title: 'Every match, season and milestone \u2014 traced in one place.',
    body: 'Athletes build a living sporting CV across every sport they play. Stats, timelines, highlight reels and coach endorsements, structured the way selectors actually read them.',
    image: '/images/athlete-basketball.png',
    alt: 'Basketball point guard holding a ball on court',
    ui: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Points per game · 2026</span>
          <span className="font-semibold text-success">+24%</span>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {[38, 46, 50, 44, 62, 58, 74, 66].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-primary" style={{ height: `${h}%`, opacity: 0.35 + i * 0.08 }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    kicker: 'Your proof',
    title: 'Achievements verified by people with the authority to verify them.',
    body: 'Upload certificates, scoresheets and match video. AI flags inconsistencies; an authorised federation official, organiser or coach makes the final call.',
    image: '/images/athlete-badminton.png',
    alt: 'Badminton player mid smash',
    ui: (
      <div className="flex flex-col gap-2">
        {[
          { t: 'Senior Ranking \u2014 Silver', s: 'Verified by BAI', ok: true },
          { t: 'World Juniors \u2014 QF', s: 'Verified by BWF Ops', ok: true },
          { t: 'State Open \u2014 Gold', s: 'With reviewer', ok: false },
        ].map((r) => (
          <div key={r.t} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div>
              <p className="text-sm font-medium">{r.t}</p>
              <p className="text-xs text-muted-foreground">{r.s}</p>
            </div>
            {r.ok ? <BadgeCheck className="size-5 text-gold" aria-label="Verified" /> : <span className="text-xs font-medium text-primary">In review</span>}
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: 'Your next opportunity',
    title: 'Trials, scholarships and rosters matched to what you\u2019ve proven.',
    body: 'Scouts search verified talent by sport, level and region. Athletes see opportunities ranked by real eligibility \u2014 not by who shouts loudest.',
    image: '/images/athlete-esports.png',
    alt: 'Mobile esports player on a tournament stage',
    ui: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">BGMI Academy Sub Roster</p>
            <p className="text-xs text-muted-foreground">Team Vanta · Mumbai</p>
          </div>
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-foreground">81% match</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted">
          <div className="h-full w-[81%] rounded-full bg-primary" />
        </div>
      </div>
    ),
  },
]

export function Story() {
  return (
    <section id="story" className="bg-background py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-5 md:px-8 md:gap-32">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The PLAYTRACE loop</p>
          <h2 className="text-balance text-4xl font-bold leading-tight md:text-6xl">Talent is everywhere. Proof isn&apos;t. We fix that.</h2>
        </Reveal>
        {chapters.map((c, i) => (
          <div key={c.kicker} className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <Reveal className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink">
                <img src={c.image || '/placeholder.svg'} alt={c.alt} className="size-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden />
              </div>
              <div className="absolute -bottom-8 left-6 right-6 rounded-2xl border bg-card p-4 shadow-2xl md:-right-10 md:left-auto md:w-80">{c.ui}</div>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-5 pt-8 md:pt-0">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-primary">{String(i + 1).padStart(2, '0')}</span> / {c.kicker}
              </p>
              <h3 className="text-balance text-3xl font-bold leading-tight md:text-4xl">{c.title}</h3>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">{c.body}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

const steps = [
  { icon: FileCheck2, title: 'Athlete submits', body: 'Certificate, scoresheet, video or official link attached to a claim.' },
  { icon: ScanSearch, title: 'AI cross-checks', body: 'Dates, issuers, totals and metadata compared. Inconsistencies are flagged \u2014 never auto-approved.' },
  { icon: UserCheck, title: 'Authorised human decides', body: 'A federation official, organiser or registered coach approves or rejects with notes.' },
  { icon: BadgeCheck, title: 'Gold-verified, forever', body: 'The achievement carries the verifier\u2019s name and an audit trail on the athlete\u2019s profile.' },
]

export function Proof() {
  return (
    <section id="proof" className="relative overflow-hidden bg-ink py-24 text-ink-foreground md:py-32">
      <div className="grid-lines absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Verification, done properly</p>
          <h2 className="text-balance text-4xl font-bold leading-tight md:text-5xl">The gold badge means a real person signed their name to it.</h2>
          <p className="max-w-lg text-pretty text-lg leading-relaxed text-ink-muted">
            PLAYTRACE uses AI to assist reviewers, not replace them. Every verified achievement is approved by an authorised human with an auditable decision trail.
          </p>
          <Link href="/app/achievements" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gold hover:underline">
            Open the verification console <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <ol className="relative flex flex-col gap-4">
          <span className="absolute bottom-8 left-[27px] top-8 w-px bg-ink-border" aria-hidden />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="relative flex gap-5 rounded-2xl border border-ink-border bg-ink/80 p-5 backdrop-blur">
                <span className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl ${i === 3 ? 'bg-gold text-gold-foreground' : 'bg-sidebar-accent text-ink-foreground'}`}>
                  <s.icon className="size-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

const audiences = [
  { title: 'Athletes', body: 'A verified sporting CV and opportunities matched to it.', image: '/images/athlete-football.png', href: '/app/athletes/arjun-menon', span: 'md:col-span-2 md:row-span-2' },
  { title: 'Organisers', body: 'Registrations, fixtures, volunteers and live ops.', image: '/images/event-stadium.png', href: '/app/organiser', span: 'md:col-span-2' },
  { title: 'Esports teams', body: 'Rosters, scrims and tournament proof.', image: '/images/event-esports.png', href: '/app/competitions', span: '' },
  { title: 'Volunteers', body: 'Shifts, training and recognised hours.', image: '/images/volunteers.png', href: '/app/volunteers', span: '' },
]

export function Ecosystem() {
  return (
    <section id="ecosystem" className="bg-background py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 md:px-8">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">One ecosystem</p>
            <h2 className="text-balance text-4xl font-bold leading-tight md:text-5xl">Built for everyone who makes the game happen.</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">Athletes, coaches, scouts, clubs, organisers and volunteers — each with a workspace designed for their job.</p>
        </Reveal>
        <div className="grid auto-rows-[260px] gap-4 md:grid-cols-4">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className={a.span}>
              <Link href={a.href} className="group relative flex size-full overflow-hidden rounded-3xl bg-ink">
                <img src={a.image || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
                <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 text-ink-foreground">
                  <div>
                    <h3 className="text-2xl font-bold">{a.title}</h3>
                    <p className="text-sm text-ink-muted">{a.body}</p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-foreground text-ink transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const modules = [
  { icon: CalendarDays, title: 'Event discovery', body: 'Find and register for tournaments, trials and showcases.', href: '/app/events' },
  { icon: Gauge, title: 'Event console', body: 'Multi-step creation, registrations, fixtures and payouts.', href: '/app/organiser' },
  { icon: Bot, title: 'AI event assistant', body: 'Plan schedules, staffing and comms with a simulated copilot.', href: '/app/assistant' },
  { icon: Radio, title: 'Event-day ops', body: 'Live courts, incidents, check-ins and crowd status.', href: '/app/operations' },
  { icon: Swords, title: 'Competitions', body: 'Brackets, leaderboards and live scores for sport and esport.', href: '/app/competitions' },
  { icon: HandHeart, title: 'Volunteer network', body: 'Shifts, safeguarding checks and recognised hours.', href: '/app/volunteers' },
  { icon: ShieldCheck, title: 'Trust & admin', body: 'Moderation, verifier management and platform health.', href: '/app/admin' },
  { icon: ScanSearch, title: 'Talent discovery', body: 'Filter verified athletes by sport, level and region.', href: '/app/discover' },
]

export function Modules() {
  return (
    <section id="modules" className="border-t bg-card py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 md:px-8">
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The platform</p>
          <h2 className="text-balance text-4xl font-bold leading-tight md:text-5xl">Fourteen connected modules. One login.</h2>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <Reveal key={m.title} delay={(i % 4) * 0.05} className="bg-card">
              <Link href={m.href} className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-background">
                <m.icon className="size-6 text-primary" aria-hidden />
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-1 text-lg font-semibold">
                    {m.title}
                    <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-28 text-ink-foreground md:py-36">
      <img src="/images/event-stadium.png" alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" aria-hidden />
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 text-center">
        <h2 className="text-balance text-5xl font-bold leading-[0.95] md:text-7xl">
          Your journey. Your proof. <span className="text-gold">Your next opportunity.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/app" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
            Explore PLAYTRACE <ArrowRight className="size-4" />
          </Link>
          <Link href="/app/community" className="inline-flex h-12 items-center rounded-full border border-ink-border px-6 text-sm font-semibold hover:bg-ink-foreground/10">
            Join the Community
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  const cols = [
    { title: 'Platform', links: [['Dashboard', '/app'], ['Discover', '/app/discover'], ['Events', '/app/events'], ['Competitions', '/app/competitions']] },
    { title: 'For organisers', links: [['Event console', '/app/organiser'], ['Create event', '/app/organiser/create'], ['AI assistant', '/app/assistant'], ['Operations', '/app/operations']] },
    { title: 'Community', links: [['Feed', '/app/community'], ['Opportunities', '/app/opportunities'], ['Volunteers', '/app/volunteers'], ['Verification', '/app/achievements']] },
  ]
  return (
    <footer className="border-t border-ink-border bg-ink text-ink-muted">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div className="flex flex-col gap-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm leading-relaxed">The verified sports and esports ecosystem. This is an interactive product prototype with sample data.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="flex flex-col gap-3">
            <h3 className="font-sans text-sm font-semibold text-ink-foreground">{c.title}</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {c.links.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-ink-foreground">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-ink-border px-5 py-6 text-xs md:flex-row md:px-8">
        <p>{'\u00a9'} 2026 PLAYTRACE. All rights reserved.</p>
        <p>Sample athletes, events and organisations are fictional and for demonstration.</p>
      </div>
    </footer>
  )
}
