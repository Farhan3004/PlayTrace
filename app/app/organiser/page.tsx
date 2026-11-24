import type { Metadata } from 'next'
import { OrganiserConsole } from '@/components/organiser/organiser-console'

export const metadata: Metadata = { title: 'Event Console' }

export default function OrganiserPage() {
  return <OrganiserConsole />
}
