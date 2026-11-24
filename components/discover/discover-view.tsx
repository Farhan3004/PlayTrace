'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { BadgeCheck, Bookmark, BookmarkCheck, LayoutGrid, List, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { athletes, discoverProfiles, type ProfileLite } from '@/lib/data/athletes'
import { Avatar, Badge, Card, Chip, Modal, PageHeader, Tabs, inputClass } from '@/components/pt/ui'
import { ScoreRing } from '@/components/pt/charts'
import { Button, buttonVariants } from '@/components/ui/button'

type Kind = 'All' | ProfileLite['kind']
const kinds: Kind[] = ['All', 'Athlete', 'Team', 'Coach', 'Scout', 'Venue']
const sports = Array.from(new Set(discoverProfiles.map((p) => p.sport)))
const states = Array.from(new Set(discoverProfiles.map((p) => p.state))).sort()

type Filters = { sports: string[]; state: string; gender: string; minScore: number; verifiedOnly: boolean; availability: string }
const initial: Filters = { sports: [], state: 'All', gender: 'All', minScore: 0, verifiedOnly: false, availability: 'All' }

function FilterPanel({ f, setF }: { f: Filters; setF: (f: Filters) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Sport</legend>
        <div className="flex flex-wrap gap-2">
          {sports.map((s) => (
            <Chip key={s} active={f.sports.includes(s)} onClick={() => setF({ ...f, sports: f.sports.includes(s) ? f.sports.filter((x) => x !== s) : [...f.sports, s] })}>
              {s}
            </Chip>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">State</span>
        <select className={inputClass} value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}>
          <option>All</option>
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Category</legend>
        <div className="flex flex-wrap gap-2">
          {['All', 'Women', 'Men', 'Mixed'].map((g) => (
            <Chip key={g} active={f.gender === g} onClick={() => setF({ ...f, gender: g })}>
              {g}
            </Chip>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className="flex justify-between text-sm font-semibold">
          Minimum Trace Score <span className="tabular text-primary">{f.minScore}</span>
        </span>
        <input type="range" min={0} max={950} step={25} value={f.minScore} onChange={(e) => setF({ ...f, minScore: Number(e.target.value) })} className="accent-primary" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Availability</span>
        <select className={inputClass} value={f.availability} onChange={(e) => setF({ ...f, availability: e.target.value })}>
          {['All', 'Open to trials', 'Open to offers', 'Recruiting', 'Signed', 'Exploring'].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <BadgeCheck className="size-4 text-gold" /> 5+ verified achievements
        </span>
        <input type="checkbox" checked={f.verifiedOnly} onChange={(e) => setF({ ...f, verifiedOnly: e.target.checked })} className="size-4 accent-primary" />
      </label>
      <Button variant="ghost" onClick={() => setF(initial)}>
        Reset filters
      </Button>
    </div>
  )
}

function ProfileCard({ p, onPreview, view }: { p: ProfileLite; onPreview: () => void; view: 'grid' | 'list' }) {
  const { savedProfiles, toggleSaved } = usePlaytrace()
  const saved = savedProfiles.includes(p.id)
  return (
    <Card className={cn('group relative flex overflow-hidden transition-shadow hover:shadow-lg', view === 'grid' ? 'flex-col' : 'flex-row items-center')}>
      <button onClick={onPreview} className={cn('flex flex-1 text-left', view === 'grid' ? 'flex-col' : 'items-center gap-4 p-4')} aria-label={`Preview ${p.name}`}>
        {view === 'grid' ? (
          <div className="relative h-36 overflow-hidden bg-ink">
            {p.image ? (
              <img src={p.image || '/placeholder.svg'} alt="" className="size-full object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="grid-lines flex size-full items-center justify-center">
                <span className="font-display text-4xl font-bold text-ink-foreground/80">{p.initials}</span>
              </div>
            )}
            <Badge tone="ink" className="absolute left-3 top-3">{p.kind}</Badge>
          </div>
        ) : (
          <Avatar src={p.image} initials={p.initials} size={48} alt="" />
        )}
        <div className={cn('flex flex-1 flex-col gap-1', view === 'grid' && 'p-4')}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold leading-tight">{p.name}</p>
            {p.traceScore > 0 && <span className="tabular font-display text-sm font-bold">{p.traceScore}</span>}
          </div>
          <p className="text-sm text-muted-foreground">
            {p.sport} · {p.tag}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {p.city}, {p.state}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={p.availability.startsWith('Open') || p.availability === 'Recruiting' ? 'success' : 'neutral'}>{p.availability}</Badge>
            {p.verified > 0 && (
              <Badge tone="gold">
                <BadgeCheck className="size-3" /> {p.verified}
              </Badge>
            )}
          </div>
        </div>
      </button>
      <button
        onClick={() => {
          toggleSaved(p.id)
          toast.success(saved ? `Removed ${p.name}` : `Shortlisted ${p.name}`)
        }}
        className={cn('flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur', view === 'grid' ? 'absolute right-3 top-3' : 'mr-4')}
        aria-label={saved ? `Remove ${p.name} from shortlist` : `Shortlist ${p.name}`}
        aria-pressed={saved}
      >
        {saved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
      </button>
    </Card>
  )
}

export function DiscoverView() {
  const params = useSearchParams()
  const reduced = useReducedMotion()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [kind, setKind] = useState<Kind>('All')
  const [f, setF] = useState<Filters>(initial)
  const [sort, setSort] = useState<'score' | 'verified' | 'name'>('score')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [preview, setPreview] = useState<ProfileLite | null>(null)
  const [mobileFilters, setMobileFilters] = useState(false)

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return discoverProfiles
      .filter((p) => kind === 'All' || p.kind === kind)
      .filter((p) => !term || `${p.name} ${p.sport} ${p.city} ${p.tag} ${p.state}`.toLowerCase().includes(term))
      .filter((p) => !f.sports.length || f.sports.includes(p.sport))
      .filter((p) => f.state === 'All' || p.state === f.state)
      .filter((p) => f.gender === 'All' || p.gender === f.gender)
      .filter((p) => p.traceScore >= f.minScore || p.kind === 'Venue')
      .filter((p) => !f.verifiedOnly || p.verified >= 5)
      .filter((p) => f.availability === 'All' || p.availability === f.availability)
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'verified' ? b.verified - a.verified : b.traceScore - a.traceScore))
  }, [q, kind, f, sort])

  const activeCount = f.sports.length + (f.state !== 'All' ? 1 : 0) + (f.gender !== 'All' ? 1 : 0) + (f.minScore > 0 ? 1 : 0) + (f.verifiedOnly ? 1 : 0) + (f.availability !== 'All' ? 1 : 0)
  const full = preview ? athletes.find((a) => a.id === preview.id) : undefined

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Discover" title="Find verified talent, teams and people" description="Search across athletes, clubs, coaches, scouts and venues. Rankings use verified data only." />

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “point guard Karnataka” or “BGMI IGL”"
            className={cn(inputClass, 'h-12 rounded-xl pl-12 text-base')}
            aria-label="Search profiles"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Clear search">
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={kind} onChange={setKind} tabs={kinds.map((k) => ({ id: k, label: k === 'All' ? 'All' : `${k}s`, count: k === 'All' ? discoverProfiles.length : discoverProfiles.filter((p) => p.kind === k).length }))} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" className="h-10 lg:hidden" onClick={() => setMobileFilters(true)}>
              <SlidersHorizontal /> Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={cn(inputClass, 'w-auto')}>
              <option value="score">Trace Score</option>
              <option value="verified">Most verified</option>
              <option value="name">Name A–Z</option>
            </select>
            <div className="flex rounded-lg border bg-card p-0.5">
              <button onClick={() => setView('grid')} aria-pressed={view === 'grid'} className={cn('rounded-md p-2', view === 'grid' && 'bg-muted')} aria-label="Grid view">
                <LayoutGrid className="size-4" />
              </button>
              <button onClick={() => setView('list')} aria-pressed={view === 'list'} className={cn('rounded-md p-2', view === 'list' && 'bg-muted')} aria-label="List view">
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <Card className="sticky top-24 p-5">
            <p className="mb-4 flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && <Badge tone="primary">{activeCount}</Badge>}
            </p>
            <FilterPanel f={f} setF={setF} />
          </Card>
        </aside>
        <section aria-live="polite" className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> results
          </p>
          {results.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-12 text-center">
              <Search className="size-8 text-muted-foreground" />
              <p className="font-semibold">No profiles match those filters</p>
              <Button variant="outline" onClick={() => { setF(initial); setQ(''); setKind('All') }}>
                Clear everything
              </Button>
            </Card>
          ) : (
            <div className={cn('grid gap-4', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
              <AnimatePresence mode="popLayout">
                {results.map((p) => (
                  <motion.div key={p.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                    <ProfileCard p={p} view={view} onPreview={() => setPreview(p)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      <Modal open={mobileFilters} onClose={() => setMobileFilters(false)} title="Filters" side="right">
        <div className="p-5">
          <FilterPanel f={f} setF={setF} />
          <Button size="lg" className="mt-4 h-10 w-full" onClick={() => setMobileFilters(false)}>
            Show {results.length} results
          </Button>
        </div>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name ?? ''} description={preview ? `${preview.kind} · ${preview.sport} · ${preview.city}` : ''} side="right">
        {preview && (
          <div className="flex flex-col gap-5 p-5">
            <div className="relative h-48 overflow-hidden rounded-xl bg-ink">
              {preview.image ? <img src={preview.image || '/placeholder.svg'} alt={preview.name} className="size-full object-cover object-top" /> : <div className="grid-lines flex size-full items-center justify-center font-display text-5xl font-bold text-ink-foreground">{preview.initials}</div>}
            </div>
            {preview.traceScore > 0 && (
              <div className="flex items-center gap-4">
                <ScoreRing value={preview.traceScore} size={88} />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="flex items-center gap-1 font-semibold">
                    <BadgeCheck className="size-4 text-gold" /> {preview.verified} verified records
                  </span>
                  <span className="text-muted-foreground">{preview.level}</span>
                  <span className="text-muted-foreground">{preview.tag}</span>
                </div>
              </div>
            )}
            {full ? (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">{full.bio}</p>
                <dl className="grid grid-cols-2 gap-3">
                  {full.stats.map((s) => (
                    <div key={s.label} className="rounded-lg border p-3">
                      <dt className="text-xs text-muted-foreground">{s.label}</dt>
                      <dd className="tabular font-display text-xl font-bold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/app/athletes/${full.id}`} className={cn(buttonVariants({ size: 'lg' }), 'h-10')}>
                  Open full profile
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {preview.kind === 'Team' && `${preview.name} competes at ${preview.level} level and is currently ${preview.availability.toLowerCase()}: ${preview.tag}.`}
                  {preview.kind === 'Coach' && `${preview.level} certified coach based in ${preview.city}. ${preview.tag}.`}
                  {preview.kind === 'Scout' && `Talent scout for ${preview.level}, focused on ${preview.sport.toLowerCase()} across ${preview.state} and neighbouring regions.`}
                  {preview.kind === 'Venue' && `${preview.level}. ${preview.tag}. Available for tournament bookings through PLAYTRACE.`}
                  {preview.kind === 'Athlete' && `${preview.tag} from ${preview.city}. ${preview.availability}.`}
                </p>
                <Button size="lg" className="h-10" onClick={() => toast.success(`Connection request sent to ${preview.name}`)}>
                  {preview.kind === 'Venue' ? 'Request booking' : 'Connect'}
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
