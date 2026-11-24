'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUp, Bot, CalendarClock, ClipboardCheck, Copy, Info, Megaphone, PiggyBank, RotateCcw, ShieldAlert, Sparkles, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { events } from '@/lib/data/events'
import { Badge, Card, Progress, inputClass } from '@/components/pt/ui'

type Artifact =
  | { kind: 'schedule'; rows: { time: string; court1: string; court2: string }[] }
  | { kind: 'staffing'; rows: { role: string; count: number; shift: string }[] }
  | { kind: 'budget'; rows: { item: string; amount: number }[] }
  | { kind: 'checklist'; rows: { item: string; level: 'High' | 'Medium' | 'Low' }[] }
  | { kind: 'message'; title: string; body: string }

type Msg = { id: string; role: 'user' | 'assistant'; text: string; artifact?: Artifact; done?: boolean }

const suggestions = [
  { icon: CalendarClock, label: 'Build a day-1 match schedule', prompt: 'Build a day-1 match schedule for two courts' },
  { icon: Users, label: 'Plan volunteer staffing', prompt: 'How many volunteers do I need and for which roles?' },
  { icon: PiggyBank, label: 'Draft a budget', prompt: 'Draft a budget for the event' },
  { icon: ShieldAlert, label: 'Run a risk check', prompt: 'What are the main risks and safety checks?' },
  { icon: Megaphone, label: 'Write a team announcement', prompt: 'Write an announcement to all teams about accreditation' },
]

function respond(prompt: string, eventName: string): Omit<Msg, 'id' | 'role'> {
  const p = prompt.toLowerCase()
  if (p.includes('schedule') || p.includes('fixture')) {
    return {
      text: `Here's a draft day-1 schedule for ${eventName}. I've kept 30-minute buffers between games on the same court and made sure no team plays consecutive slots. Women's Senior games are front-loaded so the evening ceremony isn't delayed.`,
      artifact: {
        kind: 'schedule',
        rows: [
          { time: '10:00', court1: 'Blaze vs Waves (WS)', court2: 'Hawks vs Tide (MS)' },
          { time: '11:30', court1: 'Heat vs Royals (WS)', court2: 'Gulls vs Mavericks (MS)' },
          { time: '13:00', court1: 'Lunch & court reset', court2: 'Lunch & court reset' },
          { time: '14:00', court1: 'Blaze vs Heat (WS)', court2: 'Tide vs Gulls (MS)' },
          { time: '15:30', court1: 'Royals vs Waves (WS)', court2: 'Hawks vs Mavericks (MS)' },
          { time: '18:00', court1: 'Opening ceremony', court2: '—' },
        ],
      },
    }
  }
  if (p.includes('volunteer') || p.includes('staff')) {
    return {
      text: 'Based on 32 teams, ~2,400 expected spectators per day and two courts, this is the staffing level I would plan for. Roles working with U-19 athletes are flagged as requiring a completed safeguarding check.',
      artifact: {
        kind: 'staffing',
        rows: [
          { role: 'Accreditation desk', count: 6, shift: '07:00–12:00' },
          { role: 'Table officials', count: 8, shift: '09:30–18:00' },
          { role: 'Crowd & ushering', count: 14, shift: '16:00–21:30' },
          { role: 'Athlete liaison (safeguarding req.)', count: 5, shift: '08:00–16:00' },
          { role: 'Medical support', count: 4, shift: '08:00–20:00' },
          { role: 'Media crew', count: 4, shift: '17:00–22:00' },
        ],
      },
    }
  }
  if (p.includes('budget') || p.includes('cost')) {
    return {
      text: 'A lean four-day budget. The largest line is venue hire; I would negotiate a multi-day rate and offset with the two confirmed sponsors. Projected entry revenue at current registrations covers about 38% of costs.',
      artifact: {
        kind: 'budget',
        rows: [
          { item: 'Venue hire (4 days)', amount: 480000 },
          { item: 'Prize pool', amount: 500000 },
          { item: 'Officials & referees', amount: 160000 },
          { item: 'Medical & safety', amount: 90000 },
          { item: 'Streaming & media', amount: 140000 },
          { item: 'Volunteer meals & kit', amount: 70000 },
        ],
      },
    }
  }
  if (p.includes('risk') || p.includes('safety') || p.includes('weather')) {
    return {
      text: 'These are the risks I would prioritise. None of them block the event, but the two high items need an owner assigned this week.',
      artifact: {
        kind: 'checklist',
        rows: [
          { item: 'Safeguarding: 2 athlete liaisons have not completed checks', level: 'High' },
          { item: 'Peak crowd at 18:00 exceeds Gate A throughput — open Gate C', level: 'High' },
          { item: 'Only one ambulance on standby during finals', level: 'Medium' },
          { item: 'Wi-Fi capacity for live scoring at 2,400 spectators', level: 'Medium' },
          { item: 'Heat: hydration stations at courtside', level: 'Low' },
        ],
      },
    }
  }
  if (p.includes('announce') || p.includes('message') || p.includes('email') || p.includes('write')) {
    return {
      text: 'Here is a short, clear announcement. You can copy it, or send it from the Event Console announcements tab.',
      artifact: {
        kind: 'message',
        title: 'Accreditation opens Thursday 07:00 at Gate A',
        body: `Hi teams — accreditation for ${eventName} opens at 07:00 on Thursday at Gate A. Please bring: your team's PLAYTRACE QR code, photo ID for every player, and age proof for U-19 rosters. Kit checks run alongside accreditation. Your first game time is in the Fixtures tab. See you on court.`,
      },
    }
  }
  return {
    text: `I can help plan and run ${eventName}. Try asking me to build a schedule, plan volunteer staffing, draft a budget, run a risk check, or write an announcement. In this prototype my replies are generated from local templates, so they are illustrative rather than live.`,
  }
}

function ArtifactView({ a }: { a: Artifact }) {
  if (a.kind === 'schedule')
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Court 1</th>
              <th className="pb-2 font-medium">Court 2</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {a.rows.map((r) => (
              <tr key={r.time}>
                <td className="tabular py-2 font-display font-semibold text-primary">{r.time}</td>
                <td className="py-2">{r.court1}</td>
                <td className="py-2">{r.court2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  if (a.kind === 'staffing') {
    const total = a.rows.reduce((s, r) => s + r.count, 0)
    return (
      <div className="flex flex-col gap-3">
        {a.rows.map((r) => (
          <div key={r.role} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span>{r.role}</span>
              <span className="tabular text-muted-foreground">
                {r.count} · {r.shift}
              </span>
            </div>
            <Progress value={(r.count / 14) * 100} label={r.role} />
          </div>
        ))}
        <p className="text-sm font-semibold">Total: {total} volunteers per day</p>
      </div>
    )
  }
  if (a.kind === 'budget') {
    const total = a.rows.reduce((s, r) => s + r.amount, 0)
    return (
      <div className="flex flex-col gap-2 text-sm">
        {a.rows.map((r) => (
          <div key={r.item} className="flex justify-between gap-4">
            <span>{r.item}</span>
            <span className="tabular font-medium">₹{r.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span className="tabular">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    )
  }
  if (a.kind === 'checklist')
    return (
      <ul className="flex flex-col gap-2">
        {a.rows.map((r) => (
          <li key={r.item} className="flex items-start justify-between gap-3 text-sm">
            <span className="flex gap-2">
              <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {r.item}
            </span>
            <Badge tone={r.level === 'High' ? 'danger' : r.level === 'Medium' ? 'gold' : 'neutral'}>{r.level}</Badge>
          </li>
        ))}
      </ul>
    )
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">{a.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{a.body}</p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(`${a.title}\n\n${a.body}`)
          toast.success('Copied to clipboard')
        }}
        className="flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <Copy className="size-3" /> Copy
      </button>
    </div>
  )
}

function Typewriter({ text, onDone, instant }: { text: string; onDone: () => void; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0)
  useEffect(() => {
    if (instant) {
      onDone()
      return
    }
    const id = setInterval(() => {
      setN((x) => {
        const next = Math.min(text.length, x + 3)
        if (next === text.length) {
          clearInterval(id)
          setTimeout(onDone, 120)
        }
        return next
      })
    }, 16)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, instant])
  return <>{text.slice(0, n)}</>
}

export function AssistantView() {
  const reduced = useReducedMotion() ?? false
  const [eventId, setEventId] = useState(events[0].id)
  const event = events.find((e) => e.id === eventId)!
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const busy = thinking || msgs.some((m) => m.role === 'assistant' && !m.done)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'end' })
  }, [msgs, thinking, reduced])

  const send = (text: string) => {
    if (!text.trim() || busy) return
    const user: Msg = { id: crypto.randomUUID(), role: 'user', text: text.trim(), done: true }
    setMsgs((m) => [...m, user])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', ...respond(text, event.name) }])
    }, 700)
  }

  const markDone = (id: string) => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, done: true } : x)))

  return (
    <div className="-mx-4 -mt-6 flex h-[calc(100dvh-4rem-5rem)] md:-mx-6 lg:-mx-8 lg:-mt-8 lg:h-[calc(100dvh-4rem)]">
      <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r bg-card p-5 xl:flex">
        <div className="flex flex-col gap-2">
          <label htmlFor="ctx-event" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Event context
          </label>
          <select id="ctx-event" value={eventId} onChange={(e) => setEventId(e.target.value)} className={inputClass}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-hidden rounded-xl bg-ink text-ink-foreground">
          <img src={event.image || '/placeholder.svg'} alt="" className="h-24 w-full object-cover opacity-70" />
          <div className="flex flex-col gap-1 p-4 text-sm">
            <p className="font-semibold">{event.name}</p>
            <p className="text-ink-muted">
              {event.city} · {event.registered}/{event.capacity} registered
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capabilities</p>
          {suggestions.map((s) => (
            <button key={s.label} onClick={() => send(s.prompt)} disabled={busy} className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted disabled:opacity-50">
              <s.icon className="size-4 text-primary" /> {s.label}
            </button>
          ))}
        </div>
        <p className="mt-auto flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0" /> Prototype mode: replies are simulated locally. No external AI service is connected.
        </p>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-ink text-gold">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h1 className="text-base font-semibold leading-tight">Event Experience Assistant</h1>
              <p className="text-xs text-muted-foreground">Simulated · planning & operations copilot</p>
            </div>
          </div>
          {msgs.length > 0 && (
            <button onClick={() => setMsgs([])} className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
              <RotateCcw className="size-4" /> New chat
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {msgs.length === 0 && (
              <div className="flex flex-col items-center gap-8 py-8 text-center">
                <motion.div initial={reduced ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex size-20 items-center justify-center rounded-3xl bg-ink">
                  <Sparkles className="size-9 text-gold" />
                </motion.div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-balance text-3xl font-bold md:text-4xl">What are we planning today?</h2>
                  <p className="text-muted-foreground">Working on: {event.name}</p>
                </div>
                <div className="grid w-full gap-3 sm:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => send(s.prompt)}
                      className={cn('flex items-center gap-3 rounded-xl border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary', i === 4 && 'sm:col-span-2')}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <s.icon className="size-4" />
                      </span>
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm text-ink-foreground">{m.text}</p>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink text-gold">
                    <Bot className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <p className="text-pretty leading-relaxed">
                      <Typewriter text={m.text} instant={reduced || !!m.done} onDone={() => markDone(m.id)} />
                    </p>
                    {m.artifact && m.done && (
                      <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="p-4">
                          <ArtifactView a={m.artifact} />
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </div>
              ),
            )}

            {thinking && (
              <div className="flex items-center gap-3" aria-live="polite">
                <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-gold">
                  <Bot className="size-4" />
                </span>
                <span className="flex gap-1" aria-label="Assistant is thinking">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-2 animate-live rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t bg-background p-4 md:px-8">
          <form
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-card p-2 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <textarea
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder="Ask about schedules, staffing, budgets, risks…"
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" disabled={!input.trim() || busy} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40" aria-label="Send message">
              <ArrowUp className="size-5" />
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">Simulated responses for demonstration. Always review plans with your operations lead.</p>
        </div>
      </section>
    </div>
  )
}
