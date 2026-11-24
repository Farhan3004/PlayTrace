'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { achievements as seedAchievements, type Achievement, type VerificationStatus } from './data/athletes'
import type { Role } from './nav'

type Store = {
  role: Role
  setRole: (r: Role) => void
  registeredEvents: string[]
  registerEvent: (id: string) => void
  appliedOpps: string[]
  applyOpp: (id: string) => void
  savedProfiles: string[]
  toggleSaved: (id: string) => void
  achievements: Achievement[]
  addAchievement: (a: Achievement) => void
  setAchievementStatus: (id: string, status: VerificationStatus, reviewer?: string) => void
  following: string[]
  toggleFollow: (id: string) => void
}

const Ctx = createContext<Store | null>(null)

export function PlaytraceProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('athlete')
  const [registeredEvents, setRegistered] = useState<string[]>([])
  const [appliedOpps, setApplied] = useState<string[]>([])
  const [savedProfiles, setSaved] = useState<string[]>(['meera-iyer'])
  const [following, setFollowing] = useState<string[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>(seedAchievements)

  useEffect(() => {
    const stored = window.localStorage.getItem('pt-role') as Role | null
    if (stored) setRoleState(stored)
  }, [])

  const setRole = useCallback((r: Role) => {
    setRoleState(r)
    window.localStorage.setItem('pt-role', r)
  }, [])

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const value = useMemo<Store>(
    () => ({
      role,
      setRole,
      registeredEvents,
      registerEvent: (id) => setRegistered((p) => (p.includes(id) ? p : [...p, id])),
      appliedOpps,
      applyOpp: (id) => setApplied((p) => (p.includes(id) ? p : [...p, id])),
      savedProfiles,
      toggleSaved: toggle(setSaved),
      following,
      toggleFollow: toggle(setFollowing),
      achievements,
      addAchievement: (a) => setAchievements((p) => [a, ...p]),
      setAchievementStatus: (id, status, reviewer) =>
        setAchievements((p) => p.map((a) => (a.id === id ? { ...a, status, verifiedBy: reviewer ?? a.verifiedBy } : a))),
    }),
    [role, setRole, registeredEvents, appliedOpps, savedProfiles, following, achievements],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePlaytrace() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePlaytrace must be used within PlaytraceProvider')
  return ctx
}
