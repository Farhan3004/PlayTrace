import type { Metadata } from 'next'
import { OperationsView } from '@/components/operations/operations-view'

export const metadata: Metadata = { title: 'Event-day Operations' }

export default function OperationsPage() {
  return <OperationsView />
}
