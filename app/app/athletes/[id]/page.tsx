import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { athletes, getAthlete } from '@/lib/data/athletes'
import { AthleteProfile } from '@/components/athletes/athlete-profile'

export function generateStaticParams() {
  return athletes.map((a) => ({ id: a.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const a = getAthlete(id)
  return { title: a ? `${a.name} — ${a.sport}` : 'Athlete' }
}

export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const athlete = getAthlete(id)
  if (!athlete) notFound()
  return <AthleteProfile athlete={athlete} />
}
