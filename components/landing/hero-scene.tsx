'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COBALT = '#3d5bff'
const GOLD = '#f5b301'
const CHALK = '#e8ecf5'

function trackEllipse(rx: number, rz: number, segments = 160) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(t) * rx, 0, Math.sin(t) * rz))
  }
  return pts
}

function Track() {
  const lanes = useMemo(() => Array.from({ length: 7 }, (_, i) => trackEllipse(3.2 + i * 0.22, 1.9 + i * 0.22)), [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} scale={[1.62, 1, 1]}>
        <ringGeometry args={[1.95, 3.4, 128]} />
        <meshBasicMaterial color={COBALT} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      {lanes.map((pts, i) => (
        <Line key={i} points={pts} color={i === 0 || i === 6 ? CHALK : '#8a97c9'} lineWidth={i === 0 || i === 6 ? 1.4 : 0.7} transparent opacity={i === 0 || i === 6 ? 0.55 : 0.22} />
      ))}
      {/* start line */}
      <Line points={[new THREE.Vector3(3.2, 0, 0), new THREE.Vector3(4.55, 0, 0)]} color={GOLD} lineWidth={2} transparent opacity={0.9} />
    </group>
  )
}

const milestones = [
  { t: 0.0, label: 'District', detail: 'U-16 Bengaluru Urban \u00b7 Gold', verified: true },
  { t: 0.34, label: 'State', detail: 'Karnataka Senior \u00b7 Captain', verified: true },
  { t: 0.66, label: 'National', detail: 'KIUG 2024 \u00b7 Tournament MVP', verified: true },
  { t: 1.0, label: 'Next', detail: 'Pro League trials \u00b7 94% match', verified: false },
]

type LabelRefs = React.MutableRefObject<(HTMLDivElement | null)[]>

function Trace({ reduced, labels }: { reduced: boolean; labels: LabelRefs }) {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const turns = 1.6
    const n = 60
    for (let i = 0; i <= n; i++) {
      const p = i / n
      const a = p * Math.PI * 2 * turns
      const rx = 3.9 - p * 2.4
      const rz = 2.6 - p * 1.6
      pts.push(new THREE.Vector3(Math.cos(a) * rx, p * p * 3.6 + p * 0.6, Math.sin(a) * rz))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  const tube = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.022, 10, false), [curve])
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.08, 10, false), [curve])
  const nodes = useRef<(THREE.Group | null)[]>([])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const total = tube.index ? tube.index.count : 0
  const progress = useRef(reduced ? 1 : 0)
  const runner = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (progress.current < 1) progress.current = Math.min(1, progress.current + delta * 0.32)
    const eased = 1 - Math.pow(1 - progress.current, 3)
    const count = Math.floor((total * eased) / 6) * 6
    tube.setDrawRange(0, count)
    glow.setDrawRange(0, count)
    if (runner.current) {
      const t = progress.current < 1 ? eased : (Math.sin(state.clock.elapsedTime * 0.25) * 0.5 + 0.5) * 0.999
      const pos = curve.getPointAt(reduced ? 1 : t)
      runner.current.position.copy(pos)
    }
    const { camera, size } = state
    nodes.current.forEach((node, i) => {
      const el = labels.current[i]
      if (!node || !el) return
      node.getWorldPosition(tmp)
      tmp.project(camera)
      const x = (tmp.x * 0.5 + 0.5) * size.width
      const y = (-tmp.y * 0.5 + 0.5) * size.height
      const reveal = eased >= milestones[i].t - 0.02 ? 1 : 0
      el.style.transform = `translate3d(${x + 14}px, ${y - 14}px, 0) translateY(-100%)`
      el.style.opacity = String(reveal)
    })
  })

  return (
    <group>
      <mesh geometry={glow}>
        <meshBasicMaterial color={COBALT} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#7d93ff" />
      </mesh>
      <mesh ref={runner}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {milestones.map((m, i) => {
        const pos = curve.getPointAt(m.t)
        return (
          <group
            key={m.label}
            position={pos}
            ref={(el) => {
              nodes.current[i] = el
            }}
          >
            <mesh>
              <sphereGeometry args={[m.verified ? 0.11 : 0.09, 24, 24]} />
              <meshBasicMaterial color={m.verified ? GOLD : '#ffffff'} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.26, 24, 24]} />
              <meshBasicMaterial color={m.verified ? GOLD : COBALT} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Floodlights() {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const count = 420
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 6 + Math.random() * 7
      arr[i * 3] = Math.cos(a) * r * 1.4
      arr[i * 3 + 1] = Math.random() * 6 - 1
      arr[i * 3 + 2] = Math.sin(a) * r
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.01
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={CHALK} size={0.035} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Rig({ reduced }: { reduced: boolean }) {
  const { camera, pointer } = useThree()
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (reduced) return
    const tx = pointer.x * 0.9
    const ty = 3.1 + pointer.y * 0.5
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.5, delta)
    camera.lookAt(0, 1.3, 0)
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.05
  })
  return <group ref={group} />
}

function Scene({ reduced, labels }: { reduced: boolean; labels: LabelRefs }) {
  const root = useRef<THREE.Group>(null)
  useFrame((_, d) => {
    if (!reduced && root.current) root.current.rotation.y += d * 0.06
  })
  return (
    <>
      <Rig reduced={reduced} />
      <group ref={root} position={[-0.2, -0.6, 0]} scale={0.92}>
        <Track />
        <Trace reduced={reduced} labels={labels} />
      </group>
      <Floodlights />
    </>
  )
}

export default function HeroScene({ reduced = false }: { reduced?: boolean }) {
  const labels = useRef<(HTMLDivElement | null)[]>([])
  return (
    <div className="relative size-full">
    <Canvas
      camera={{ position: [0, 3.1, 10.5], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      aria-hidden
    >
      <fog attach="fog" args={['#0b0f17', 9, 20]} />
      <Scene reduced={reduced} labels={labels} />
    </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {milestones.map((m, i) => (
          <div
            key={m.label}
            ref={(el) => {
              labels.current[i] = el
            }}
            className="absolute left-0 top-0 w-44 rounded-lg border border-white/15 bg-[#0b0f17]/80 px-3 py-2 opacity-0 backdrop-blur-md transition-opacity duration-500 will-change-transform"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: m.verified ? GOLD : '#9fb0ff' }}>
              <span className="size-1.5 rounded-full" style={{ background: m.verified ? GOLD : '#9fb0ff' }} />
              {m.verified ? `${m.label} \u00b7 Verified` : `${m.label} opportunity`}
            </div>
            <div className="mt-0.5 text-xs leading-snug text-white/85">{m.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
