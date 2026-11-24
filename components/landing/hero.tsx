'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, BadgeCheck, Play } from 'lucide-react'

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false })

function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setOk(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const webgl = useWebGL()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const words = 'Every Game Has a Story.'.split(' ')
  const words2 = 'Every Athlete Deserves a Stage.'.split(' ')

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-ink-foreground">
      <img src="/images/hero-arena.png" alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,var(--ink)_70%)]" aria-hidden />
      <div className="grid-lines absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />

      <motion.div style={reduced ? undefined : { y: sceneY, opacity: sceneOpacity }} className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:left-[34%] lg:[mask-image:linear-gradient(to_right,transparent,black_22%,black_92%,transparent)]">
        {webgl ? (
          <HeroScene reduced={reduced} />
        ) : webgl === false ? (
          <div className="flex size-full items-center justify-center [perspective:1200px]">
            <div className="size-[28rem] rounded-full border border-primary/40 [transform:rotateX(68deg)]" />
          </div>
        ) : null}
      </motion.div>

      <motion.div style={reduced ? undefined : { y: textY }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 lg:justify-center lg:pb-24">
        <div className="pointer-events-none flex max-w-2xl flex-col gap-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink-border bg-ink/60 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur"
          >
            <BadgeCheck className="size-3.5 text-gold" aria-hidden />
            Your journey. Your proof. Your next opportunity.
          </motion.p>

          <h1 className="text-balance font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}{' '}
                </motion.span>
              ))}
            </span>
            <span className="block text-ink-muted">
              {words2.map((w, i) => (
                <motion.span
                  key={i}
                  className={`mr-[0.22em] inline-block ${w.startsWith('Stage') ? 'text-gold' : ''}`}
                  initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}{' '}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="max-w-xl text-pretty text-lg leading-relaxed text-ink-muted"
          >
            PLAYTRACE connects athletes, teams, coaches, scouts and event organisers through one intelligent sports and esports ecosystem.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            className="pointer-events-auto flex flex-wrap items-center gap-3"
          >
            <Link href="/app" className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
              Explore PLAYTRACE
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/app/community" className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-border px-6 text-sm font-semibold text-ink-foreground transition-colors hover:bg-ink-foreground/10">
              Join the Community
            </Link>
            <a href="#story" className="inline-flex h-12 items-center gap-2 px-2 text-sm font-medium text-ink-muted hover:text-ink-foreground">
              <Play className="size-4" aria-hidden /> See how it works
            </a>
          </motion.div>
        </div>

        <motion.dl
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-ink-border pt-6 text-sm"
        >
          <div>
            <dt className="text-ink-muted">Sports & esports</dt>
            <dd className="font-display text-lg font-semibold">One verified identity</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Achievements</dt>
            <dd className="font-display text-lg font-semibold">Human-verified</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Events</dt>
            <dd className="font-display text-lg font-semibold">Run end-to-end</dd>
          </div>
        </motion.dl>
      </motion.div>
    </section>
  )
}
