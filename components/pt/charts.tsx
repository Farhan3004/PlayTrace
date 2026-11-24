'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axis = { stroke: 'var(--muted-foreground)', fontSize: 12, tickLine: false, axisLine: false }

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="tabular font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export function AreaTrend({
  data,
  x,
  series,
  height = 240,
}: {
  data: Record<string, any>[]
  x: string
  series: { key: string; name: string; color?: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -4, right: 8, top: 8 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? `var(--chart-${i + 1})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color ?? `var(--chart-${i + 1})`} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} width={44} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)' }} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? `var(--chart-${i + 1})`}
            strokeWidth={2.2}
            fill={`url(#fill-${s.key})`}
            strokeDasharray={i > 0 ? '4 4' : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarTrend({
  data,
  x,
  series,
  height = 240,
  stacked,
  layout = 'horizontal',
}: {
  data: Record<string, any>[]
  x: string
  series: { key: string; name: string; color?: string }[]
  height?: number
  stacked?: boolean
  layout?: 'horizontal' | 'vertical'
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ left: layout === 'vertical' ? 8 : -4, right: 8, top: 8 }}>
        <CartesianGrid vertical={layout === 'vertical'} horizontal={layout === 'horizontal'} stroke="var(--border)" />
        {layout === 'horizontal' ? (
          <>
            <XAxis dataKey={x} {...axis} />
            <YAxis {...axis} width={44} />
          </>
        ) : (
          <>
            <XAxis type="number" {...axis} />
            <YAxis type="category" dataKey={x} {...axis} width={96} />
          </>
        )}
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color ?? `var(--chart-${i + 1})`}
            radius={stacked ? 0 : 4}
            stackId={stacked ? 'a' : undefined}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function LineTrend({
  data,
  x,
  series,
  height = 200,
}: {
  data: Record<string, any>[]
  x: string
  series: { key: string; name: string; color?: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} width={44} />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color ?? `var(--chart-${i + 1})`} strokeWidth={2.2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SkillRadar({ data, height = 260 }: { data: { skill: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
        <Radar dataKey="value" name="Rating" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.22} strokeWidth={2} />
        <Tooltip content={<ChartTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function Donut({ data, height = 200 }: { data: { name: string; value: number }[]; height?: number }) {
  const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--muted)']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ScoreRing({ value, max = 1000, size = 120, label = 'Trace Score' }: { value: number; max?: number; size?: number; label?: string }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  const pct = value / max
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} of ${max}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular font-display text-2xl font-bold leading-none">{value}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      </div>
    </div>
  )
}
