'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, BadgeCheck, Check, ExternalLink, FileText, Image as ImageIcon, Info, Loader2, Plus, ScanSearch, ShieldCheck, Upload, Video, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { discoverProfiles, type Achievement, type VerificationStatus } from '@/lib/data/athletes'
import { roles } from '@/lib/nav'
import { Avatar, Badge, Card, CardHeader, Chip, Field, Modal, PageHeader, StatusBadge, Tabs, formatDate, inputClass } from '@/components/pt/ui'
import { Button } from '@/components/ui/button'

const evidenceIcon = { certificate: FileText, video: Video, scoresheet: FileText, photo: ImageIcon, link: ExternalLink }

function AddAchievement({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addAchievement } = usePlaytrace()
  const [files, setFiles] = useState<string[]>([])
  const [checking, setChecking] = useState(false)

  return (
    <Modal open={open} onClose={onClose} title="Submit an achievement" description="Attach evidence. An authorised verifier will review your submission.">
      <form
        className="flex flex-col gap-4 p-5"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          setChecking(true)
          setTimeout(() => {
            const a: Achievement = {
              id: `ach-${Date.now()}`,
              athleteId: 'ananya-rao',
              title: String(fd.get('title')),
              event: String(fd.get('event')),
              date: String(fd.get('date')) || '2026-10-01',
              level: fd.get('level') as Achievement['level'],
              result: String(fd.get('result')),
              status: 'pending',
              evidence: files.length ? files.map((f) => ({ type: 'certificate' as const, label: f })) : [{ type: 'link' as const, label: 'Official results link' }],
            }
            addAchievement(a)
            setChecking(false)
            setFiles([])
            onClose()
            toast.success('Submitted for verification', { description: 'Automated pre-check found no inconsistencies. A human verifier will review it.' })
          }, 1400)
        }}
      >
        <Field label="Achievement title">
          <input name="title" required className={inputClass} placeholder="e.g. State Championship — Gold" />
        </Field>
        <Field label="Event or competition">
          <input name="event" required className={inputClass} placeholder="e.g. Karnataka State Senior Championship 2026" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date">
            <input name="date" type="date" className={inputClass} />
          </Field>
          <Field label="Level">
            <select name="level" className={inputClass} defaultValue="State">
              {['District', 'State', 'National', 'International', 'Collegiate', 'Pro League'].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Result">
            <input name="result" className={inputClass} placeholder="Gold / 3rd / 22 pts" />
          </Field>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Evidence</span>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center text-sm text-muted-foreground hover:border-primary hover:bg-accent/40">
            <Upload className="size-6" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Choose files</span> — certificate, scoresheet, photo or video
            </span>
            <input type="file" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
          </label>
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((f) => (
                <li key={f} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                  <FileText className="size-3" /> {f}
                </li>
              ))}
            </ul>
          )}
          <p className="flex gap-2 rounded-lg bg-accent/50 p-3 text-xs text-accent-foreground">
            <Info className="size-4 shrink-0" /> Files stay in this browser for the prototype. Production uploads are encrypted and only shared with assigned verifiers.
          </p>
        </div>
        <Button type="submit" size="lg" className="h-10" disabled={checking}>
          {checking ? (
            <>
              <Loader2 className="animate-spin" /> Running pre-check…
            </>
          ) : (
            'Submit for verification'
          )}
        </Button>
      </form>
    </Modal>
  )
}

function ReviewPanel({ a, onDecision }: { a: Achievement; onDecision: () => void }) {
  const { setAchievementStatus, role } = usePlaytrace()
  const [note, setNote] = useState('')
  const athlete = discoverProfiles.find((p) => p.id === a.athleteId)
  const reviewer = roles.find((r) => r.id === role)!
  const canDecide = role === 'organiser' || role === 'admin' || role === 'coach'

  const decide = (status: VerificationStatus, msg: string) => {
    setAchievementStatus(a.id, status, status === 'verified' ? `${reviewer.persona} (${reviewer.label})` : undefined)
    toast.success(msg)
    setNote('')
    onDecision()
  }

  return (
    <Card className="flex flex-col">
      <div className="flex flex-col gap-4 border-b p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={athlete?.image} initials={athlete?.initials ?? '?'} size={44} alt="" />
            <div>
              <p className="font-semibold">{athlete?.name}</p>
              <p className="text-xs text-muted-foreground">
                {athlete?.sport} · {athlete?.city}
              </p>
            </div>
          </div>
          <StatusBadge status={a.status} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{a.title}</h2>
          <p className="text-sm text-muted-foreground">
            {a.event} · {formatDate(a.date)}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Level</dt>
            <dd className="font-medium">{a.level}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Result</dt>
            <dd className="font-medium">{a.result}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Evidence</dt>
            <dd className="font-medium">{a.evidence.length} items</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 border-b p-5">
        <h3 className="text-sm font-semibold">Evidence</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {a.evidence.map((e) => {
            const Icon = evidenceIcon[e.type]
            return (
              <li key={e.label}>
                <button onClick={() => toast('Evidence viewer opens here in production')} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:border-foreground/30">
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{e.label}</span>
                    <span className="text-xs capitalize text-muted-foreground">{e.type}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-b p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ScanSearch className="size-4 text-primary" /> Automated consistency check
          <Badge tone="outline">Advisory only</Badge>
        </h3>
        {a.aiFlag ? (
          <p className="flex gap-2 rounded-lg bg-gold/15 p-3 text-sm text-gold-foreground">
            <AlertTriangle className="size-4 shrink-0" /> {a.aiFlag}
          </p>
        ) : (
          <p className="flex gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
            <Check className="size-4 shrink-0" /> No inconsistencies detected across dates, issuer and totals.
          </p>
        )}
        <p className="text-xs text-muted-foreground">Simulated locally for this prototype. Automated checks can never approve or reject an achievement — only an authorised verifier can.</p>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {a.status === 'verified' || a.status === 'rejected' ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            {a.status === 'verified' ? `Verified by ${a.verifiedBy}` : 'Rejected — athlete notified with reviewer notes.'}
          </p>
        ) : canDecide ? (
          <>
            <Field label="Reviewer notes" hint={`Signed as ${reviewer.persona} · ${reviewer.label}. Your name is attached to this decision.`}>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={cn(inputClass, 'h-auto py-2')} placeholder="Explain your decision for the audit trail…" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button size="lg" className="h-10 bg-gold px-4 text-gold-foreground hover:bg-gold/90" onClick={() => decide('verified', 'Achievement verified')}>
                <BadgeCheck /> Approve & verify
              </Button>
              <Button size="lg" variant="outline" className="h-10 px-4" onClick={() => decide('in-review', 'More evidence requested from athlete')}>
                Request evidence
              </Button>
              <Button size="lg" variant="destructive" className="h-10 px-4" onClick={() => decide('rejected', 'Achievement rejected')}>
                <X /> Reject
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Switch to an Organiser, Coach or Admin role to review submissions.</p>
        )}
      </div>
    </Card>
  )
}

export function AchievementsView() {
  const { achievements, role } = usePlaytrace()
  const isReviewer = role === 'organiser' || role === 'admin' || role === 'coach'
  const [mode, setMode] = useState<'mine' | 'review'>(isReviewer ? 'review' : 'mine')
  const [filter, setFilter] = useState<'all' | VerificationStatus>('all')
  const [adding, setAdding] = useState(false)

  const list = useMemo(() => {
    const base = mode === 'mine' ? achievements.filter((a) => a.athleteId === 'ananya-rao') : achievements
    return filter === 'all' ? base : base.filter((a) => a.status === filter)
  }, [achievements, mode, filter])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = list.find((a) => a.id === selectedId) ?? list[0]

  const counts = (s: VerificationStatus) => (mode === 'mine' ? achievements.filter((a) => a.athleteId === 'ananya-rao') : achievements).filter((a) => a.status === s).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Achievements & verification"
        title={mode === 'mine' ? 'Your proof, on the record' : 'Verification console'}
        description={
          mode === 'mine'
            ? 'Submit achievements with evidence. Gold badges are issued only after an authorised human verifier approves them.'
            : 'Review evidence, consider automated flags, and make the final call. Every decision is signed and auditable.'
        }
        actions={
          <>
            <Tabs
              value={mode}
              onChange={(m) => {
                setMode(m)
                setSelectedId(null)
              }}
              tabs={[
                { id: 'mine', label: 'My submissions' },
                { id: 'review', label: 'Review queue' },
              ]}
            />
            {mode === 'mine' && (
              <Button size="lg" className="h-10 px-4" onClick={() => setAdding(true)}>
                <Plus /> Add achievement
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(['verified', 'in-review', 'pending', 'rejected'] as VerificationStatus[]).map((s) => (
          <Card key={s} className="flex items-center justify-between p-4">
            <StatusBadge status={s} />
            <span className="tabular font-display text-2xl font-bold">{counts(s)}</span>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'in-review', 'verified', 'rejected'] as const).map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'in-review' ? 'In review' : f[0].toUpperCase() + f.slice(1)}
          </Chip>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="overflow-hidden">
          <CardHeader title={`${list.length} achievements`} className="pb-4" />
          <ul className="flex flex-col divide-y border-t">
            {list.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">Nothing here yet.</li>}
            {list.map((a) => {
              const p = discoverProfiles.find((x) => x.id === a.athleteId)
              return (
                <li key={a.id}>
                  <button
                    onClick={() => setSelectedId(a.id)}
                    aria-pressed={selected?.id === a.id}
                    className={cn('flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/60', selected?.id === a.id && 'bg-accent/50')}
                  >
                    <Avatar src={p?.image} initials={p?.initials ?? '?'} size={36} alt="" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {mode === 'review' && `${p?.name} · `}
                        {a.event}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={a.status} />
                      {a.aiFlag && a.status !== 'verified' && (
                        <span className="flex items-center gap-1 text-[11px] text-gold-foreground">
                          <AlertTriangle className="size-3 text-gold" /> flag
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
        {selected ? <ReviewPanel key={selected.id} a={selected} onDecision={() => undefined} /> : <Card className="p-10 text-center text-muted-foreground">Select an achievement</Card>}
      </div>

      <AddAchievement open={adding} onClose={() => setAdding(false)} />
    </div>
  )
}
