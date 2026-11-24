import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { opportunities } from '@/lib/data/platform'
import { OpportunityDetail } from '@/components/opportunities/opportunity-detail'

export function generateStaticParams() {
  return opportunities.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: opportunities.find((o) => o.id === id)?.title ?? 'Opportunity' }
}

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const o = opportunities.find((x) => x.id === id)
  if (!o) notFound()
  return <OpportunityDetail o={o} />
}
