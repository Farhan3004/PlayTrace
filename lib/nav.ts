import {
  Activity,
  Bot,
  CalendarDays,
  Compass,
  Gauge,
  HandHeart,
  LayoutDashboard,
  Medal,
  MessagesSquare,
  PlusSquare,
  Radio,
  ShieldCheck,
  Swords,
  Briefcase,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'athlete' | 'coach' | 'scout' | 'organiser' | 'volunteer' | 'admin'

export const roles: { id: Role; label: string; persona: string; initials: string; blurb: string }[] = [
  { id: 'athlete', label: 'Athlete', persona: 'Ananya Rao', initials: 'AR', blurb: 'Build your verified sporting CV' },
  { id: 'coach', label: 'Coach', persona: 'R. Srinivasan', initials: 'RS', blurb: 'Manage squads and endorse athletes' },
  { id: 'scout', label: 'Scout', persona: 'Priya Nair', initials: 'PN', blurb: 'Discover and shortlist verified talent' },
  { id: 'organiser', label: 'Organiser', persona: 'KSBA Events', initials: 'KE', blurb: 'Run events end-to-end' },
  { id: 'volunteer', label: 'Volunteer', persona: 'Isha Kulkarni', initials: 'IK', blurb: 'Find shifts and log hours' },
  { id: 'admin', label: 'Admin', persona: 'Platform Ops', initials: 'PO', blurb: 'Govern trust, safety and growth' },
]

export type NavItem = { href: string; label: string; icon: LucideIcon; roles: Role[] | 'all'; mobile?: boolean }
export type NavGroup = { label: string; items: NavItem[] }

const ALL = 'all' as const

export const navGroups: NavGroup[] = [
  {
    label: 'Play',
    items: [
      { href: '/app', label: 'Dashboard', icon: LayoutDashboard, roles: ALL, mobile: true },
      { href: '/app/athletes/ananya-rao', label: 'My Profile', icon: UserRound, roles: ['athlete'] },
      { href: '/app/achievements', label: 'Achievements', icon: Medal, roles: ['athlete', 'coach', 'organiser', 'admin'] },
      { href: '/app/discover', label: 'Discover', icon: Compass, roles: ALL, mobile: true },
      { href: '/app/events', label: 'Events', icon: CalendarDays, roles: ALL, mobile: true },
      { href: '/app/competitions', label: 'Competitions', icon: Swords, roles: ALL },
      { href: '/app/opportunities', label: 'Opportunities', icon: Briefcase, roles: ['athlete', 'coach', 'scout', 'admin'] },
      { href: '/app/community', label: 'Community', icon: MessagesSquare, roles: ALL, mobile: true },
    ],
  },
  {
    label: 'Organise',
    items: [
      { href: '/app/organiser', label: 'Event Console', icon: Gauge, roles: ['organiser', 'admin'] },
      { href: '/app/organiser/create', label: 'Create Event', icon: PlusSquare, roles: ['organiser', 'admin'] },
      { href: '/app/assistant', label: 'AI Assistant', icon: Bot, roles: ALL },
      { href: '/app/volunteers', label: 'Volunteers', icon: HandHeart, roles: ['organiser', 'volunteer', 'admin'] },
      { href: '/app/operations', label: 'Event-day Ops', icon: Radio, roles: ['organiser', 'volunteer', 'admin'] },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/app/analytics', label: 'Analytics', icon: Activity, roles: ['athlete', 'coach', 'scout', 'organiser', 'admin'] },
      { href: '/app/admin', label: 'Admin', icon: ShieldCheck, roles: ['admin'] },
    ],
  },
]

export function visibleGroups(role: Role) {
  return navGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles === 'all' || i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0)
}

export const allNavItems = navGroups.flatMap((g) => g.items)
