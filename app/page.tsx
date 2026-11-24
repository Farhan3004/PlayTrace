import { Hero } from '@/components/landing/hero'
import { SiteNav } from '@/components/landing/site-nav'
import { Ecosystem, FinalCta, Footer, Modules, Proof, SportsMarquee, Story } from '@/components/landing/sections'

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <SportsMarquee />
        <Story />
        <Proof />
        <Ecosystem />
        <Modules />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
