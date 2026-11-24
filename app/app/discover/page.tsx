import { Suspense } from 'react'
import type { Metadata } from 'next'
import { DiscoverView } from '@/components/discover/discover-view'

export const metadata: Metadata = { title: 'Discover' }

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverView />
    </Suspense>
  )
}
