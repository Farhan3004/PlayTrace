import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { events, getEvent } from '@/lib/data/events'
import { EventDetail } from '@/components/events/event-detail'

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: getEvent(id)?.name ?? 'Event' }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEvent(id)
  if (!event) notFound()
  return <EventDetail event={event} />
}
