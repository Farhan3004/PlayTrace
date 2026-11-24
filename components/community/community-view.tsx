'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BadgeCheck, CalendarDays, Dumbbell, Flag, Heart, HelpCircle, MapPin, MessageCircle, Search, Send, Share2, Trophy, Users, Medal } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { groups, posts as seed, type Post } from '@/lib/data/platform'
import { Avatar, Badge, Card, CardHeader, Chip, PageHeader, formatNumber } from '@/components/pt/ui'
import { Button } from '@/components/ui/button'

const kinds: { id: Post['kind']; icon: typeof Trophy }[] = [
  { id: 'Result', icon: Trophy },
  { id: 'Training', icon: Dumbbell },
  { id: 'Looking for team', icon: Search },
  { id: 'Question', icon: HelpCircle },
  { id: 'Milestone', icon: Medal },
]

const meetups = [
  { title: 'Sunday 3v3 pickup', where: 'Cubbon Park courts, Bengaluru', when: 'Sun · 07:00', going: 18 },
  { title: 'BGMI scrim night (T2)', where: 'Online · Discord', when: 'Wed · 21:00', going: 64 },
  { title: 'Women’s football open session', where: 'Cooperage Ground, Mumbai', when: 'Sat · 06:30', going: 32 },
]

export function CommunityView() {
  const reduced = useReducedMotion()
  const [posts, setPosts] = useState(seed)
  const [liked, setLiked] = useState<string[]>([])
  const [joined, setJoined] = useState<string[]>([])
  const [filter, setFilter] = useState<'All' | Post['kind']>('All')
  const [text, setText] = useState('')
  const [kind, setKind] = useState<Post['kind']>('Training')
  const [sport, setSport] = useState<Post['sport']>('Basketball')
  const [openComments, setOpenComments] = useState<string | null>(null)

  const list = posts.filter((p) => filter === 'All' || p.kind === filter)

  const publish = () => {
    if (!text.trim()) return
    setPosts((p) => [{ id: `p${Date.now()}`, author: 'Ananya Rao', role: 'Basketball · National', sport, time: 'now', kind, body: text.trim(), likes: 0, comments: 0, verified: true, initials: 'AR' }, ...p])
    setText('')
    toast.success('Posted to the community')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Community" title="The locker room for Indian sport" description="Results, training, team-finding and real questions from athletes, coaches and organisers. No vanity metrics — just the game." />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex gap-3">
              <Avatar src="/images/athlete-basketball.png" initials="AR" size={40} alt="" />
              <label htmlFor="composer" className="sr-only">
                Share an update
              </label>
              <textarea id="composer" value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Share a result, a training block, or ask the community…" className="flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {kinds.map((k) => (
                  <button key={k.id} onClick={() => setKind(k.id)} aria-pressed={kind === k.id} className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', kind === k.id ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                    <k.icon className="size-3.5" /> {k.id}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select value={sport} onChange={(e) => setSport(e.target.value as Post['sport'])} className="h-8 rounded-md border bg-card px-2 text-xs" aria-label="Sport tag">
                  {['Basketball', 'Football', 'Badminton', 'BGMI', 'Athletics', 'General'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <Button onClick={publish} disabled={!text.trim()}>
                  <Send /> Post
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Chip active={filter === 'All'} onClick={() => setFilter('All')}>
              All
            </Chip>
            {kinds.map((k) => (
              <Chip key={k.id} active={filter === k.id} onClick={() => setFilter(k.id)}>
                <k.icon className="size-3.5" /> {k.id}
              </Chip>
            ))}
          </div>

          <ul className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {list.map((p) => {
                const isLiked = liked.includes(p.id)
                const K = kinds.find((k) => k.id === p.kind)!
                return (
                  <motion.li key={p.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="flex flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={p.initials} size={40} src={p.author === 'Ananya Rao' ? '/images/athlete-basketball.png' : p.author === 'Meera Iyer' ? '/images/athlete-badminton.png' : p.author === 'Arjun Menon' ? '/images/athlete-football.png' : p.author.includes('Viper') ? '/images/athlete-esports.png' : undefined} alt="" />
                          <div>
                            <p className="flex items-center gap-1 text-sm font-semibold">
                              {p.author} {p.verified && <BadgeCheck className="size-4 text-gold" aria-label="Verified" />}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.role} · {p.time}
                            </p>
                          </div>
                        </div>
                        <Badge tone={p.kind === 'Looking for team' ? 'primary' : p.kind === 'Milestone' || p.kind === 'Result' ? 'gold' : 'neutral'}>
                          <K.icon className="size-3" /> {p.kind}
                        </Badge>
                      </div>
                      <p className="text-pretty leading-relaxed">{p.body}</p>
                      <div className="flex items-center gap-1 border-t pt-3 text-sm text-muted-foreground">
                        <button
                          onClick={() => setLiked((l) => (l.includes(p.id) ? l.filter((x) => x !== p.id) : [...l, p.id]))}
                          aria-pressed={isLiked}
                          className={cn('flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted', isLiked && 'text-primary')}
                        >
                          <Heart className={cn('size-4', isLiked && 'fill-current')} /> {formatNumber(p.likes + (isLiked ? 1 : 0))}
                          <span className="sr-only">likes</span>
                        </button>
                        <button onClick={() => setOpenComments(openComments === p.id ? null : p.id)} aria-expanded={openComments === p.id} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted">
                          <MessageCircle className="size-4" /> {formatNumber(p.comments)}
                          <span className="sr-only">comments</span>
                        </button>
                        <button onClick={() => toast.success('Link copied')} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted">
                          <Share2 className="size-4" /> <span className="hidden sm:inline">Share</span>
                        </button>
                        <button onClick={() => toast('Reported to moderators. Thank you.')} className="ml-auto rounded-md p-1.5 hover:bg-muted" aria-label="Report post">
                          <Flag className="size-4" />
                        </button>
                      </div>
                      {openComments === p.id && (
                        <form
                          className="flex gap-2"
                          onSubmit={(e) => {
                            e.preventDefault()
                            setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, comments: x.comments + 1 } : x)))
                            e.currentTarget.reset()
                            toast.success('Comment added')
                          }}
                        >
                          <input required name="c" placeholder="Write a comment…" className="h-9 flex-1 rounded-lg border bg-card px-3 text-sm outline-none focus:border-primary" aria-label="Comment" />
                          <Button type="submit" size="lg">
                            Reply
                          </Button>
                        </form>
                      )}
                    </Card>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Groups" />
            <ul className="flex flex-col gap-3 p-5">
              {groups.map((g) => (
                <li key={g.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-gold">
                      <Users className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(g.members + (joined.includes(g.name) ? 1 : 0))} members</p>
                    </div>
                  </div>
                  <Button size="sm" variant={joined.includes(g.name) ? 'secondary' : 'outline'} onClick={() => setJoined((j) => (j.includes(g.name) ? j.filter((x) => x !== g.name) : [...j, g.name]))}>
                    {joined.includes(g.name) ? 'Joined' : 'Join'}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Play near you" description="Community meetups this week" />
            <ul className="flex flex-col gap-4 p-5">
              {meetups.map((m) => (
                <li key={m.title} className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{m.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {m.where}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="size-3" /> {m.when} · {m.going} going
                  </p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold">Community standards</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Respect every athlete. No harassment, no unverified claims about others, and extra care around minors. Reports are reviewed by people within 24 hours.</p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
