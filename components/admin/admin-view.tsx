'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, Ban, Check, CheckCircle2, Database, Flag, Lock, Search, Server, ShieldCheck, UserCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { Avatar, Badge, Card, CardHeader, PageHeader, Stat, StatusBadge, Tabs, inputClass } from '@/components/pt/ui'
import { AreaTrend } from '@/components/pt/charts'
import { Button } from '@/components/ui/button'

type Tab = 'overview' | 'users' | 'verifiers' | 'moderation' | 'audit' | 'settings'

const seedUsers = [
  { id: 'u1', name: 'Ananya Rao', email: 'ananya@…', role: 'Athlete', status: 'Active', joined: 'Mar 2024', flags: 0 },
  { id: 'u2', name: 'Priya Nair', email: 'priya@hoopsindia…', role: 'Scout', status: 'Active', joined: 'Jan 2025', flags: 0 },
  { id: 'u3', name: 'KSBA Events', email: 'events@ksba…', role: 'Organiser', status: 'Active', joined: 'Nov 2023', flags: 0 },
  { id: 'u4', name: 'Sahil Khan', email: 'sahil.k@…', role: 'Athlete', status: 'Under review', joined: 'Oct 2026', flags: 3 },
  { id: 'u5', name: 'Sahil K', email: 'sahilk22@…', role: 'Athlete', status: 'Under review', joined: 'Nov 2026', flags: 2 },
  { id: 'u6', name: 'Isha Kulkarni', email: 'isha@…', role: 'Volunteer', status: 'Active', joined: 'Jun 2024', flags: 0 },
  { id: 'u7', name: 'Quick Trials Pvt', email: 'hr@quicktrials…', role: 'Organiser', status: 'Suspended', joined: 'Sep 2026', flags: 7 },
]

const seedVerifiers = [
  { id: 'vf1', org: 'Telangana Badminton Association', contact: 'S. Rao, Secretary', sport: 'Badminton', docs: 'Affiliation letter, BAI registration' },
  { id: 'vf2', org: 'Kerala Football Association', contact: 'M. Thomas, Competitions', sport: 'Football', docs: 'AIFF affiliation, signatory list' },
  { id: 'vf3', org: 'Skyesports Operations', contact: 'R. Mehta, Ops Lead', sport: 'BGMI', docs: 'Krafton partner certificate' },
]

const seedReports = [
  { id: 'rp1', target: 'Post by “Quick Trials Pvt”', reason: 'Asks athletes for trial fees via UPI', count: 14, severity: 'High' },
  { id: 'rp2', target: 'Comment on Tanvi Joshi post', reason: 'Harassment', count: 3, severity: 'High' },
  { id: 'rp3', target: 'Profile “Sahil K”', reason: 'Possible duplicate / impersonation', count: 2, severity: 'Medium' },
  { id: 'rp4', target: 'Event “Mega Cricket Cup”', reason: 'Venue not confirmed', count: 1, severity: 'Low' },
]

const audit = [
  { t: '18:02', who: 'Platform Ops', what: 'Suspended organiser “Quick Trials Pvt” — fee scam reports' },
  { t: '17:41', who: 'BFI Official', what: 'Verified achievement ach-1 for Ananya Rao' },
  { t: '17:12', who: 'KSBA Events', what: 'Published fixtures for South Zone Hoops Invitational' },
  { t: '16:55', who: 'System', what: 'AI consistency flag raised on ach-8 (metadata date mismatch)' },
  { t: '16:30', who: 'Platform Ops', what: 'Approved verifier: Karnataka State Basketball Assoc.' },
]

export function AdminView() {
  const { achievements } = usePlaytrace()
  const [tab, setTab] = useState<Tab>('overview')
  const [users, setUsers] = useState(seedUsers)
  const [verifiers, setVerifiers] = useState(seedVerifiers)
  const [reports, setReports] = useState(seedReports)
  const [q, setQ] = useState('')
  const [settings, setSettings] = useState({ aiFlags: true, minorsDM: true, autoHold: true, publicLeaderboards: true, maintenance: false })
  const filteredUsers = useMemo(() => users.filter((u) => `${u.name} ${u.role} ${u.email}`.toLowerCase().includes(q.toLowerCase())), [users, q])
  const queue = achievements.filter((a) => a.status === 'pending' || a.status === 'in-review')

  const latency = Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, p95: Math.round(180 + Math.sin(i / 3) * 40 + (i === 19 ? 90 : 0)) }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Admin" title="Platform administration" description="Trust & safety, verifier governance, moderation and system health." actions={<Badge tone="success"><CheckCircle2 className="size-3" /> All systems operational</Badge>} />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'Users', count: users.length },
          { id: 'verifiers', label: 'Verifiers', count: verifiers.length },
          { id: 'moderation', label: 'Moderation', count: reports.length },
          { id: 'audit', label: 'Audit log' },
          { id: 'settings', label: 'Policies' },
        ]}
      />

      {tab === 'overview' && (
        <div className="flex flex-col gap-6">
          <Card className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Verification queue', value: String(queue.length), hint: 'human review' },
              { label: 'Open reports', value: String(reports.length), hint: `${reports.filter((r) => r.severity === 'High').length} high` },
              { label: 'Pending verifiers', value: String(verifiers.length) },
              { label: 'Accounts under review', value: String(users.filter((u) => u.status === 'Under review').length) },
            ].map((k, i) => (
              <Stat key={k.label} {...k} className={cn('border-b p-5 md:border-b-0', i > 0 && 'md:border-l', i % 2 === 1 && 'border-l')} />
            ))}
          </Card>
          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title="API latency (p95, ms)" description="Last 24 hours" />
              <div className="p-5 pt-3">
                <AreaTrend data={latency} x="h" series={[{ key: 'p95', name: 'p95 ms' }]} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Services" />
              <ul className="flex flex-col gap-3 p-5 text-sm">
                {[
                  { icon: Server, n: 'Web & API', s: '99.98%' },
                  { icon: Database, n: 'Database', s: '99.99%' },
                  { icon: ShieldCheck, n: 'Verification pipeline', s: '99.95%' },
                  { icon: Activity, n: 'Live scoring', s: '99.90%' },
                  { icon: Lock, n: 'Auth', s: '100%' },
                ].map((x) => (
                  <li key={x.n} className="flex items-center gap-3">
                    <x.icon className="size-4 text-muted-foreground" />
                    <span className="flex-1">{x.n}</span>
                    <span className="tabular text-xs text-muted-foreground">{x.s}</span>
                    <span className="size-2 rounded-full bg-success" aria-label="Operational" />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <Card>
            <CardHeader title="Verification queue" action={<Link href="/app/achievements" className="text-sm font-medium text-primary hover:underline">Open console</Link>} />
            <ul className="flex flex-col divide-y px-5 pb-2">
              {queue.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.event}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.aiFlag && <Badge tone="gold"><Flag className="size-3" /> flag</Badge>}
                    <StatusBadge status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'users' && (
        <Card>
          <div className="border-b p-5">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className={cn(inputClass, 'pl-9')} placeholder="Search users" aria-label="Search users" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Flags</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={u.name.split(' ').map((w) => w[0]).slice(0, 2).join('')} size={32} />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{u.role}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                    <td className="px-5 py-3">{u.flags > 0 ? <Badge tone="danger">{u.flags}</Badge> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-5 py-3">
                      <Badge tone={u.status === 'Active' ? 'success' : u.status === 'Suspended' ? 'danger' : 'gold'}>{u.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: 'Active', flags: 0 } : x))); toast.success(`${u.name} reinstated`) }}>
                          <UserCheck /> Clear
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: 'Suspended' } : x))); toast.success(`${u.name} suspended`) }}>
                          <Ban /> Suspend
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'verifiers' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Only approved verifiers can issue gold badges. Each application requires proof of authority from a recognised federation or league.</p>
          {verifiers.length === 0 && <Card className="p-10 text-center text-muted-foreground">No pending applications.</Card>}
          {verifiers.map((v) => (
            <Card key={v.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-gold">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{v.org}</p>
                  <p className="text-sm text-muted-foreground">
                    {v.contact} · {v.sport}
                  </p>
                  <p className="text-xs text-muted-foreground">Documents: {v.docs}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="h-10" onClick={() => { setVerifiers((p) => p.filter((x) => x.id !== v.id)); toast.success(`${v.org} approved as verifier`) }}>
                  <Check /> Approve
                </Button>
                <Button size="lg" variant="outline" className="h-10" onClick={() => { setVerifiers((p) => p.filter((x) => x.id !== v.id)); toast('Application declined') }}>
                  <X /> Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'moderation' && (
        <Card>
          <ul className="flex flex-col divide-y">
            {reports.length === 0 && <li className="p-10 text-center text-muted-foreground">Queue clear.</li>}
            {reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <AlertTriangle className={cn('size-5 shrink-0', r.severity === 'High' ? 'text-destructive' : r.severity === 'Medium' ? 'text-gold' : 'text-muted-foreground')} />
                  <div>
                    <p className="font-medium">{r.target}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.reason} · {r.count} report{r.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={r.severity === 'High' ? 'danger' : r.severity === 'Medium' ? 'gold' : 'neutral'}>{r.severity}</Badge>
                  <Button size="sm" variant="destructive" onClick={() => { setReports((p) => p.filter((x) => x.id !== r.id)); toast.success('Content removed and user warned') }}>
                    Remove
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setReports((p) => p.filter((x) => x.id !== r.id)); toast('Report dismissed') }}>
                    Dismiss
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'audit' && (
        <Card>
          <ol className="flex flex-col divide-y">
            {audit.map((a) => (
              <li key={a.t + a.what} className="flex gap-4 p-5 text-sm">
                <span className="tabular w-12 shrink-0 font-display font-semibold text-muted-foreground">{a.t}</span>
                <div>
                  <p className="font-medium">{a.who}</p>
                  <p className="text-muted-foreground">{a.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {tab === 'settings' && (
        <Card className="divide-y">
          {(
            [
              ['aiFlags', 'AI consistency checks', 'Run automated checks on evidence. Results are advisory and shown to human verifiers only.'],
              ['minorsDM', 'Guardian copy for minors', 'All direct messages to users under 18 are copied to a registered guardian.'],
              ['autoHold', 'Hold payments on flagged organisers', 'Escrow event fees for organisers with 3+ open reports.'],
              ['publicLeaderboards', 'Public leaderboards', 'Show competition standings to logged-out visitors.'],
              ['maintenance', 'Maintenance mode', 'Show a banner and pause new registrations.'],
            ] as const
          ).map(([k, t, d]) => (
            <label key={k} className="flex cursor-pointer items-start justify-between gap-6 p-5">
              <span>
                <span className="block font-medium">{t}</span>
                <span className="block text-sm text-muted-foreground">{d}</span>
              </span>
              <span className="relative mt-1 inline-flex">
                <input
                  type="checkbox"
                  role="switch"
                  checked={settings[k]}
                  onChange={(e) => {
                    setSettings((s) => ({ ...s, [k]: e.target.checked }))
                    toast.success(`${t} ${e.target.checked ? 'enabled' : 'disabled'}`)
                  }}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-primary/30" />
                <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-card shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          ))}
        </Card>
      )}
    </div>
  )
}
