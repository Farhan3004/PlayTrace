'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BadgeCheck, Clock, Eye, FileEdit, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/lib/data/athletes'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border bg-card text-card-foreground', className)} {...props} />
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-5 pb-0', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

type BadgeTone = 'neutral' | 'primary' | 'gold' | 'success' | 'danger' | 'ink' | 'outline'

export function Badge({ tone = 'neutral', className, children }: { tone?: BadgeTone; className?: string; children: React.ReactNode }) {
  const tones: Record<BadgeTone, string> = {
    neutral: 'bg-muted text-muted-foreground',
    primary: 'bg-accent text-accent-foreground',
    gold: 'bg-gold text-gold-foreground',
    success: 'bg-success/12 text-success',
    danger: 'bg-destructive/10 text-destructive',
    ink: 'bg-ink text-ink-foreground',
    outline: 'border border-border text-foreground',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}

const statusMap: Record<VerificationStatus, { label: string; tone: BadgeTone; icon: typeof BadgeCheck }> = {
  verified: { label: 'Verified', tone: 'gold', icon: BadgeCheck },
  'in-review': { label: 'In review', tone: 'primary', icon: Eye },
  pending: { label: 'Pending', tone: 'neutral', icon: Clock },
  rejected: { label: 'Rejected', tone: 'danger', icon: XCircle },
  draft: { label: 'Draft', tone: 'outline', icon: FileEdit },
}

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const s = statusMap[status]
  const Icon = s.icon
  return (
    <Badge tone={s.tone}>
      <Icon className="size-3.5" aria-hidden />
      {s.label}
    </Badge>
  )
}

export function Avatar({ src, initials, size = 40, className, alt }: { src?: string; initials: string; size?: number; className?: string; alt?: string }) {
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink font-display text-ink-foreground', className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? <img src={src || '/placeholder.svg'} alt={alt ?? ''} className="size-full object-cover" /> : <span aria-hidden={!!alt}>{initials}</span>}
    </span>
  )
}

export function Progress({ value, className, tone = 'primary', label }: { value: number; className?: string; tone?: 'primary' | 'gold' | 'ink'; label?: string }) {
  const tones = { primary: 'bg-primary', gold: 'bg-gold', ink: 'bg-foreground' }
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn('h-full rounded-full transition-all duration-700', tones[tone])} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="text-pretty text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
        {description && <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Stat({ label, value, delta, hint, className }: { label: string; value: React.ReactNode; delta?: string; hint?: string; className?: string }) {
  const negative = delta?.startsWith('-')
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="tabular font-display text-2xl font-semibold">{value}</span>
      {(delta || hint) && (
        <span className="text-xs text-muted-foreground">
          {delta && <span className={cn('mr-1 font-semibold', negative ? 'text-destructive' : 'text-success')}>{delta}</span>}
          {hint}
        </span>
      )}
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  size = 'md',
}: {
  tabs: { id: T; label: React.ReactNode; count?: number }[]
  value: T
  onChange: (v: T) => void
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div role="tablist" className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1', className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            value === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="tabular rounded bg-muted px-1.5 text-[11px] text-muted-foreground">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active ? 'border-foreground bg-foreground text-background' : 'bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function Popover({
  trigger,
  children,
  align = 'end',
  className,
  label,
}: {
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => React.ReactNode
  children: (close: () => void) => React.ReactNode
  align?: 'start' | 'end'
  className?: string
  label: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o), id })}
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={label}
          className={cn(
            'absolute top-full z-50 mt-2 animate-in fade-in-0 zoom-in-95 rounded-xl border bg-popover text-popover-foreground shadow-xl',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  side,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  side?: 'right' | 'left'
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex">
      <button aria-label="Close" className="absolute inset-0 animate-in fade-in-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative z-10 flex max-h-full flex-col overflow-hidden bg-card text-card-foreground shadow-2xl outline-none',
          side === 'right' && 'ml-auto h-full w-full max-w-md animate-in slide-in-from-right',
          side === 'left' && 'mr-auto h-full w-full max-w-xs animate-in slide-in-from-left',
          !side && 'm-auto w-[calc(100%-2rem)] max-w-lg animate-in fade-in-0 zoom-in-95 rounded-2xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close dialog">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20'

export function TraceMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M7 21 L12.5 14 L17 18 L25 9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
      <circle cx="25" cy="9" r="2.4" className="fill-gold" />
    </svg>
  )
}

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <TraceMark className="size-7" />
      <span className={cn('font-display text-lg font-bold tracking-tight', tone === 'light' ? 'text-ink-foreground' : 'text-foreground')}>PLAYTRACE</span>
    </span>
  )
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return n.toLocaleString('en-IN')
}

export function formatDate(d: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(d).toLocaleDateString('en-GB', opts)
}
