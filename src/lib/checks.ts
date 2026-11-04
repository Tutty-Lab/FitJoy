import { loadProfile, saveProfile } from './profile'
import { PROGRAM_DAYS } from '../data/balanceCheck'

export type Entry = { value: string; safety: number | null; notes: string[]; comment: string }
export type Check = { date: string; entries: Record<string, Entry> }
export type Phase = 'start' | 'end'

export const emptyEntry = (): Entry => ({ value: '', safety: null, notes: [], comment: '' })
export const todayKey = () => new Date().toLocaleDateString('en-CA')

export function saveCheck(phase: Phase, check: Check) {
  const checks = { ...(loadProfile()?.checks ?? {}), [phase]: check }
  return saveProfile({ checks, onboarded: true })
}

// Program day (1–22) counted from the date of the first check.
export function programDay() {
  const start = loadProfile()?.checks?.start?.date
  if (!start) return 0
  const diff = Math.floor((new Date(todayKey()).getTime() - new Date(start).getTime()) / 86400000)
  return Math.min(PROGRAM_DAYS, diff + 1)
}

export function toggleDaily(slot: number) {
  const daily = { ...(loadProfile()?.daily ?? {}) }
  const d = [...(daily[todayKey()] ?? [false, false, false])]
  d[slot] = !d[slot]
  daily[todayKey()] = d
  return saveProfile({ daily })
}
