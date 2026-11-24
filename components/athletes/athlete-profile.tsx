'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { BadgeCheck, Bookmark, BookmarkCheck, Download, ExternalLink, FileText, GraduationCap, Languages, MapPin, MessageSquare, Play, Quote, Share2, Shield, UserPlus, UserCheck, Video } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { athletes, type Athlete } from '@/lib/data/athletes'
import { Avatar, Badge, Card, CardHeader, Field, Modal, StatusBadge, Tabs, formatDate, formatNumber, inputClass } from '@/components/pt/ui'
import { AreaTrend, ScoreRing, SkillRadar } from '@/components/pt/charts'
import { Button } from '@/components/ui/button'

type Tab = 'overview' | 'achievements' | 'timeline' | 'media' | 'endorsements'

const statLabel: Record<string, string> = {
  Basketball: 'Points per game',
  Football: 'Goal contributions',
  Badminton: 'Win rate %',
  BGMI: 'K/D ratio',
}

export function AthleteProfile({ athlete }: { athlete: Athlete }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [contact, setContact] = useState(false)
  const reduced = useReducedMotion()
  const { achievements, savedProfiles, toggleSaved, following, toggleFollow } = usePlaytrace()
  const mine = achievements.filter((a) => a.athleteId === athlete.id)
  const saved = savedProfiles.includes(athlete.id)
  const isFollowing = following.includes(athlete.id)

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Sample profiles" className="flex gap-2 overflow-x-auto pb-1">
        {athletes.map((a) => (
          <Link
            key={a.id}
            href={`/app/athletes/${a.id}`}
            aria-current={a.id === athlete.id ? 'page' : undefined}
            className={cn('flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm', a.id === athlete.id ? 'border-foreground bg-foreground text-background' : 'bg-card hover:border-foreground/30')}
          >
            <Avatar src={a.image} initials={a.name[0]} size={26} />
            {a.sport}
          </Link>
        ))}
      </nav>

      <section className="relative overflow-hidden rounded-3xl bg-ink text-ink-foreground">
        <img src={athlete.cover || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" aria-hidden />
        <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-end">
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] w-40 overflow-hidden rounded-2xl ring-1 ring-ink-border md:w-52"
          >
            <img src={athlete.image || '/placeholder.svg'} alt={`Portrait of ${athlete.name}`} className="size-full object-cover" />
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-gold-foreground">
              <BadgeCheck className="size-3.5" /> ID verified
            </span>
          </motion.div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="ink" className="border border-ink-border">{athlete.sport}</Badge>
              <Badge tone="ink" className="border border-ink-border">{athlete.level}</Badge>
              <Badge tone="gold">{athlete.availability}</Badge>
            </div>
            <div>
              <h1 className="text-balance text-4xl font-bold leading-none md:text-6xl">{athlete.name}</h1>
              <p className="mt-2 text-lg text-ink-muted">
                {athlete.position} · {athlete.club}
              </p>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {athlete.city}, {athlete.state}
              </span>
              <span>Age {athlete.age}</span>
              <span>{athlete.handle}</span>
              <span>{formatNumber(athlete.followers)} followers</span>
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="lg" className="h-10 px-4" onClick={() => toggleFollow(athlete.id)}>
                {isFollowing ? <UserCheck /> : <UserPlus />} {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-10 border-ink-border bg-transparent px-4 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                onClick={() => {
                  toggleSaved(athlete.id)
                  toast.success(saved ? 'Removed from shortlist' : 'Added to shortlist')
                }}
              >
                {saved ? <BookmarkCheck /> : <Bookmark />} {saved ? 'Shortlisted' : 'Shortlist'}
              </Button>
              <Button size="lg" variant="outline" className="h-10 border-ink-border bg-transparent px-4 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground" onClick={() => setContact(true)}>
                <MessageSquare /> Contact
              </Button>
              <Button size="lg" variant="ghost" className="h-10 px-3 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground" onClick={() => toast.success('Sporting CV PDF prepared (prototype)')} aria-label="Download CV">
                <Download />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-10 px-3 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast.success('Profile link copied')
                }}
                aria-label="Share profile"
              >
                <Share2 />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6 lg:flex-col lg:items-end">
            <ScoreRing value={athlete.traceScore} size={128} />
            <div className="text-sm lg:text-right">
              <p className="flex items-center gap-1 font-semibold lg:justify-end">
                <BadgeCheck className="size-4 text-gold" /> {athlete.verifiedCount} verified
              </p>
              <p className="text-ink-muted">achievements on record</p>
            </div>
          </div>
        </div>
        <dl className="relative grid grid-cols-2 border-t border-ink-border md:grid-cols-4">
          {athlete.stats.map((s, i) => (
            <div key={s.label} className={cn('flex flex-col gap-1 p-5 md:px-10', i > 0 && 'md:border-l md:border-ink-border', i % 2 === 1 && 'border-l border-ink-border')}>
              <dt className="text-xs uppercase tracking-wider text-ink-muted">{s.label}</dt>
              <dd className="flex items-baseline gap-2">
                <span className="tabular font-display text-3xl font-bold">{s.value}</span>
                {s.delta && <span className="text-xs font-semibold text-gold">{s.delta}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'achievements', label: 'Achievements', count: mine.length || athlete.verifiedCount },
          { id: 'timeline', label: 'Career' },
          { id: 'media', label: 'Media', count: athlete.media.length },
          { id: 'endorsements', label: 'Endorsements', count: athlete.endorsements.length },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          {tab === 'overview' && (
            <>
              <Card>
                <CardHeader title="About" />
                <p className="p-5 pt-3 text-pretty leading-relaxed text-muted-foreground">{athlete.bio}</p>
              </Card>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader title={statLabel[athlete.sport] ?? 'Performance'} description="Monthly, 2026 season vs league average" />
                  <div className="p-5 pt-3">
                    <AreaTrend data={athlete.season} x="month" series={[{ key: 'value', name: athlete.name.split(' ')[0] }, { key: 'avg', name: 'League avg', color: 'var(--chart-4)' }]} height={220} />
                  </div>
                </Card>
                <Card>
                  <CardHeader title="Skill assessment" description="Coach-rated, verified" />
                  <SkillRadar data={athlete.skills} height={250} />
                </Card>
              </div>
              <Card>
                <CardHeader title="Verified highlights" action={<button className="text-sm font-medium text-primary hover:underline" onClick={() => setTab('achievements')}>View all</button>} />
                <ul className="grid gap-3 p-5 sm:grid-cols-2">
                  {athlete.timeline.slice(0, 4).map((t) => (
                    <li key={t.title} className="flex gap-3 rounded-xl border p-4">
                      <BadgeCheck className="size-5 shrink-0 text-gold" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.year} · {t.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}

          {tab === 'achievements' && (
            <Card>
              <CardHeader title="Achievement record" description="Only gold-badged items have been approved by an authorised verifier." />
              <ul className="flex flex-col divide-y p-5">
                {(mine.length
                  ? mine
                  : athlete.timeline.map((t, i) => ({ id: String(i), title: t.title, event: t.detail, date: `${t.year}-06-01`, status: 'verified' as const, verifiedBy: 'Official federation', evidence: [{ type: 'certificate' as const, label: 'Certificate' }] }))
                ).map((a) => (
                  <li key={a.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', a.status === 'verified' ? 'bg-gold/20 text-gold-foreground' : 'bg-muted text-muted-foreground')}>
                        <Shield className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{a.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {a.event} · {formatDate(a.date)}
                        </p>
                        {a.verifiedBy && a.status === 'verified' && <p className="text-xs text-muted-foreground">Verified by {a.verifiedBy}</p>}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {a.evidence.map((e) => (
                            <span key={e.label} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {e.type === 'video' ? <Video className="size-3" /> : e.type === 'link' ? <ExternalLink className="size-3" /> : <FileText className="size-3" />}
                              {e.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tab === 'timeline' && (
            <Card>
              <CardHeader title="Career timeline" />
              <ol className="relative flex flex-col gap-8 p-6 pl-12">
                <span className="absolute bottom-8 left-[27px] top-8 w-px bg-border" aria-hidden />
                {athlete.timeline.map((t, i) => (
                  <motion.li
                    key={t.title}
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative flex flex-col gap-1"
                  >
                    <span className={cn('absolute -left-[29px] top-1 size-3.5 rounded-full ring-4 ring-card', i === 0 ? 'bg-primary' : 'bg-gold')} aria-hidden />
                    <span className="font-display text-sm font-semibold text-primary">{t.year}</span>
                    <h3 className="text-lg font-semibold">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.detail}</p>
                  </motion.li>
                ))}
              </ol>
            </Card>
          )}

          {tab === 'media' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {athlete.media.map((m, i) => (
                <button key={m.title} onClick={() => toast('Video player opens here in production')} className="group overflow-hidden rounded-xl border bg-card text-left">
                  <div className="relative aspect-video overflow-hidden bg-ink">
                    <img src={i === 0 ? athlete.image : athlete.cover} alt="" className="size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-ink-foreground/90 text-ink transition-transform group-hover:scale-110">
                        <Play className="size-5 translate-x-0.5" />
                      </span>
                    </span>
                    <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs text-ink-foreground">{m.duration}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <Badge tone="primary" className="w-fit">{m.type}</Badge>
                    <p className="text-sm font-semibold">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.views} views</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'endorsements' && (
            <div className="grid gap-4 md:grid-cols-2">
              {athlete.endorsements.map((e) => (
                <Card key={e.name} className="flex flex-col gap-4 p-6">
                  <Quote className="size-6 text-gold" aria-hidden />
                  <p className="text-pretty text-lg leading-relaxed">{e.quote}</p>
                  <div className="flex items-center gap-3">
                    <Avatar initials={e.name.split(' ').map((w) => w[0]).slice(-2).join('')} size={36} />
                    <div>
                      <p className="text-sm font-semibold">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.role}</p>
                    </div>
                    <BadgeCheck className="ml-auto size-5 text-gold" aria-label="Verified endorser" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Profile details" />
            <dl className="grid grid-cols-2 gap-4 p-5">
              {athlete.physicals.map((p) => (
                <div key={p.label}>
                  <dt className="text-xs text-muted-foreground">{p.label}</dt>
                  <dd className="font-medium">{p.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 border-t p-5 text-sm">
              <p className="flex items-start gap-2">
                <GraduationCap className="size-4 shrink-0 text-muted-foreground" /> {athlete.education}
              </p>
              <p className="flex items-start gap-2">
                <Languages className="size-4 shrink-0 text-muted-foreground" /> {athlete.languages.join(', ')}
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Similar athletes" />
            <ul className="flex flex-col gap-3 p-5">
              {athletes
                .filter((a) => a.id !== athlete.id)
                .map((a) => (
                  <li key={a.id}>
                    <Link href={`/app/athletes/${a.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <Avatar src={a.image} initials={a.name[0]} size={40} alt="" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.sport} · {a.position}
                        </p>
                      </div>
                      <span className="tabular font-display text-sm font-semibold">{a.traceScore}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>
        </aside>
      </div>

      <Modal open={contact} onClose={() => setContact(false)} title={`Contact ${athlete.name.split(' ')[0]}`} description="Messages to athletes under 18 are copied to a registered guardian.">
        <form
          className="flex flex-col gap-4 p-5"
          onSubmit={(e) => {
            e.preventDefault()
            setContact(false)
            toast.success('Message sent via PLAYTRACE inbox')
          }}
        >
          <Field label="Purpose">
            <select className={inputClass} defaultValue="trial">
              <option value="trial">Trial invitation</option>
              <option value="scholarship">Scholarship enquiry</option>
              <option value="sponsor">Sponsorship</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Message">
            <textarea required rows={4} className={cn(inputClass, 'h-auto py-2')} placeholder="Introduce yourself and your organisation…" />
          </Field>
          <Button type="submit" size="lg" className="h-10">
            Send message
          </Button>
        </form>
      </Modal>
    </div>
  )
}
