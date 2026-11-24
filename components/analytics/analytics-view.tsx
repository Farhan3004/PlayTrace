'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePlaytrace } from '@/lib/store'
import { athletes } from '@/lib/data/athletes'
import { platformGrowth, sportMix } from '@/lib/data/platform'
import { Card, CardHeader, PageHeader, Stat, Tabs } from '@/components/pt/ui'
import { AreaTrend, BarTrend, Donut, LineTrend, SkillRadar } from '@/components/pt/charts'
import { Button } from '@/components/ui/button'

type View = 'athlete' | 'events' | 'talent' | 'platform'

function KpiRow({ items }: { items: { label: string; value: string; delta?: string; hint?: string }[] }) {
  return (
    <Card className="grid grid-cols-2 md:grid-cols-4">
      {items.map((k, i) => (
        <Stat key={k.label} {...k} className={cn('border-b p-5 md:border-b-0', i > 0 && 'md:border-l', i % 2 === 1 && 'border-l')} />
      ))}
    </Card>
  )
}

function AthleteAnalytics() {
  const [id, setId] = useState(athletes[0].id)
  const a = athletes.find((x) => x.id === id)!
  const compare = a.skills.map((s) => ({ skill: s.skill, value: s.value }))
  const load = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map((w, i) => ({ week: w, load: [62, 70, 74, 68, 80, 76, 84, 72][i], recovery: [80, 74, 70, 76, 66, 72, 64, 78][i] }))
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {athletes.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} aria-pressed={id === x.id} className={cn('flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm', id === x.id ? 'border-foreground bg-foreground text-background' : 'bg-card')}>
            <img src={x.image || '/placeholder.svg'} alt="" className="size-6 rounded-full object-cover" />
            {x.name.split(' ')[0]} · {x.sport}
          </button>
        ))}
      </div>
      <KpiRow items={a.stats.map((s) => ({ label: s.label, value: s.value, delta: s.delta, hint: 'season' }))} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Performance trend" description="Monthly vs league average" />
          <div className="p-5 pt-3">
            <AreaTrend data={a.season} x="month" series={[{ key: 'value', name: a.name.split(' ')[0] }, { key: 'avg', name: 'League avg', color: 'var(--chart-4)' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Skill profile" />
          <SkillRadar data={compare} />
        </Card>
      </div>
      <Card>
        <CardHeader title="Training load vs recovery" description="Wearable data, simulated" />
        <div className="p-5 pt-3">
          <LineTrend data={load} x="week" series={[{ key: 'load', name: 'Load' }, { key: 'recovery', name: 'Recovery', color: 'var(--chart-2)' }]} height={240} />
        </div>
      </Card>
    </div>
  )
}

function EventAnalytics() {
  const attendance = ['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((d, i) => ({ day: d, attendance: [1820, 2310, 3120, 4280][i], stream: [4200, 6100, 9800, 18400][i] }))
  const revenue = [
    { source: 'Entry fees', value: 162 },
    { source: 'Tickets', value: 214 },
    { source: 'Sponsors', value: 450 },
    { source: 'Concessions', value: 88 },
  ]
  return (
    <div className="flex flex-col gap-6">
      <KpiRow
        items={[
          { label: 'Attendance', value: '11,530', delta: '+31%', hint: 'vs 2025' },
          { label: 'Stream views', value: '38.5K', delta: '+120%' },
          { label: 'Revenue', value: '₹9.1L', delta: '+18%' },
          { label: 'NPS', value: '64', hint: 'from 812 responses' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Attendance & streaming" />
          <div className="p-5 pt-3">
            <BarTrend data={attendance} x="day" series={[{ key: 'attendance', name: 'In venue' }, { key: 'stream', name: 'Stream', color: 'var(--chart-2)' }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Revenue mix (₹K)" />
          <div className="p-5">
            <Donut data={revenue.map((r) => ({ name: r.source, value: r.value }))} />
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {revenue.map((r, i) => (
                <li key={r.source} className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: `var(--chart-${i + 1})` }} />
                  {r.source}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

function TalentAnalytics() {
  const regional = [
    { region: 'Karnataka', verified: 18.2 },
    { region: 'Maharashtra', verified: 22.4 },
    { region: 'Kerala', verified: 12.1 },
    { region: 'Telangana', verified: 10.8 },
    { region: 'Delhi', verified: 14.6 },
    { region: 'Punjab', verified: 9.3 },
  ]
  return (
    <div className="flex flex-col gap-6">
      <KpiRow
        items={[
          { label: 'Verified athletes', value: '87.4K', delta: '+9.2K', hint: 'this quarter' },
          { label: 'Shortlist → trial', value: '23%', delta: '+4%' },
          { label: 'Trial → signed', value: '31%' },
          { label: 'Median Trace Score', value: '742' },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Verified talent by state (K)" />
          <div className="p-5 pt-3">
            <BarTrend data={regional} x="region" layout="vertical" series={[{ key: 'verified', name: 'Verified (K)' }]} height={260} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Sport distribution" />
          <div className="p-5 pt-3">
            <BarTrend data={sportMix} x="sport" series={[{ key: 'value', name: 'Share %', color: 'var(--chart-2)' }]} height={260} />
          </div>
        </Card>
      </div>
    </div>
  )
}

function PlatformAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <KpiRow
        items={[
          { label: 'Monthly active', value: '412K', delta: '+17%' },
          { label: 'Athletes', value: '168K', delta: '+19%' },
          { label: 'Events / month', value: '410', delta: '+15%' },
          { label: 'Verifications / month', value: '15.6K', delta: '+22%' },
        ]}
      />
      <Card>
        <CardHeader title="Ecosystem growth" description="Athletes (K), events, verifications (K)" />
        <div className="p-5 pt-3">
          <AreaTrend
            data={platformGrowth}
            x="month"
            series={[
              { key: 'athletes', name: 'Athletes (K)' },
              { key: 'verifications', name: 'Verifications (K)', color: 'var(--chart-2)' },
            ]}
            height={280}
          />
        </div>
      </Card>
      <Card>
        <CardHeader title="Events published per month" />
        <div className="p-5 pt-3">
          <BarTrend data={platformGrowth} x="month" series={[{ key: 'events', name: 'Events' }]} />
        </div>
      </Card>
    </div>
  )
}

export function AnalyticsView() {
  const { role } = usePlaytrace()
  const defaultView: View = role === 'organiser' ? 'events' : role === 'scout' ? 'talent' : role === 'admin' ? 'platform' : 'athlete'
  const [view, setView] = useState<View>(defaultView)
  const [period, setPeriod] = useState<'30d' | '90d' | 'season'>('season')
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Analytics"
        title="Insight you can act on"
        description="Performance, events, talent pipelines and platform health — sample data for demonstration."
        actions={
          <>
            <Tabs size="sm" value={period} onChange={setPeriod} tabs={[{ id: '30d', label: '30 days' }, { id: '90d', label: '90 days' }, { id: 'season', label: 'Season' }]} />
            <Button variant="outline" size="lg" className="h-10" onClick={() => toast.success('Report exported (prototype)')}>
              <Download /> Export
            </Button>
          </>
        }
      />
      <Tabs<View>
        value={view}
        onChange={setView}
        tabs={[
          { id: 'athlete', label: 'Athlete performance' },
          { id: 'events', label: 'Event performance' },
          { id: 'talent', label: 'Talent pipeline' },
          { id: 'platform', label: 'Platform' },
        ]}
      />
      {view === 'athlete' && <AthleteAnalytics />}
      {view === 'events' && <EventAnalytics />}
      {view === 'talent' && <TalentAnalytics />}
      {view === 'platform' && <PlatformAnalytics />}
    </div>
  )
}
