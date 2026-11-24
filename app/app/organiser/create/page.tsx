import type { Metadata } from 'next'
import { CreateEvent } from '@/components/organiser/create-event'

export const metadata: Metadata = { title: 'Create Event' }

export default function CreateEventPage() {
  return <CreateEvent />
}
