'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlaytraceProvider, usePlaytrace } from '@/lib/store'
import { visibleGroups } from '@/lib/nav'
import { Logo, Modal } from '@/components/pt/ui'
import { Sidebar, SidebarNav, isActive } from './sidebar'
import { Topbar } from './topbar'
import { CommandSearch } from './command-search'

function MobileTabBar({ onMore }: { onMore: () => void }) {
  const pathname = usePathname()
  const { role } = usePlaytrace()
  const items = visibleGroups(role)
    .flatMap((g) => g.items)
    .filter((i) => i.mobile)
    .slice(0, 4)

  return (
    <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active ? 'text-gold' : 'text-ink-muted')}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          )
        })}
        <li>
          <button onClick={onMore} className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted">
            <MoreHorizontal className="size-5" />
            More
          </button>
        </li>
      </ul>
    </nav>
  )
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenSearch={() => setSearchOpen(true)} onOpenMobileNav={() => setMobileNav(true)} />
        <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-28 pt-6 md:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>
      <MobileTabBar onMore={() => setMobileNav(true)} />
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Modal open={mobileNav} onClose={() => setMobileNav(false)} title="Menu" side="left" className="bg-sidebar text-sidebar-foreground [&>div:first-child]:border-sidebar-border">
        <div className="flex flex-col gap-6 p-4">
          <Logo tone="light" />
          <SidebarNav onNavigate={() => setMobileNav(false)} />
        </div>
      </Modal>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PlaytraceProvider>
      <ShellInner>{children}</ShellInner>
    </PlaytraceProvider>
  )
}
