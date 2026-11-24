'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/pt/ui'

const links = [
  { href: '#story', label: 'Platform' },
  { href: '#proof', label: 'Verification' },
  { href: '#ecosystem', label: 'Who it\u2019s for' },
  { href: '#modules', label: 'Modules' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-colors duration-300', scrolled || open ? 'border-b border-ink-border bg-ink/85 backdrop-blur-md' : 'bg-transparent')}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="PLAYTRACE home">
          <Logo tone="light" />
        </Link>
        <nav aria-label="Website" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-muted transition-colors hover:text-ink-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/app" className="rounded-full px-4 py-2 text-sm font-medium text-ink-foreground hover:bg-ink-foreground/10">
            Sign in
          </Link>
          <Link href="/app" className="rounded-full bg-ink-foreground px-4 py-2 text-sm font-semibold text-ink">
            Open platform
          </Link>
        </div>
        <button className="rounded-md p-2 text-ink-foreground md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav aria-label="Website mobile" className="flex flex-col gap-1 border-t border-ink-border px-5 pb-6 pt-3 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-ink-foreground hover:bg-ink-foreground/10">
              {l.label}
            </a>
          ))}
          <Link href="/app" className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">
            Open platform
          </Link>
        </nav>
      )}
    </header>
  )
}
