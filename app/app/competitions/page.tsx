import type { Metadata } from 'next'
import { CompetitionsView } from '@/components/competitions/competitions-view'

export const metadata: Metadata = { title: 'Competitions' }

export default function CompetitionsPage() {
  return <CompetitionsView />
}
