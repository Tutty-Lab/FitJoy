import { useSyncExternalStore } from 'react'
import { PROGRAM_DAYS, SESSIONS_PER_DAY } from '../data/program'
import { loadProfile, saveProfile } from './profile'
import { pushCompletion } from '../services/remote'

// Completed program days and the dates they were done, cached locally and mirrored to the server when configured.
// A day counts as completed after at least one base-exercise session.
const KEY = 'fitjoy.completed'
const DATES_KEY = 'fitjoy.activeDates'
const listeners = new Set<() => void>()

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]
  } catch {
    return []
  }
}

let cache = { completed: read<number>(KEY), dates: read<string>(DATES_KEY), version: 0 }

export const today = () => new Date().toLocaleDateString('en-CA')

function notify() {
  cache = { ...cache, version: cache.version + 1 }
  listeners.forEach(l => l())
}

export function completeDay(day: number) {
  const date = today()
  if (cache.completed.includes(day) && cache.dates.includes(date)) return
  cache = {
    ...cache,
    completed: cache.completed.includes(day) ? cache.completed : [...cache.completed, day].sort((a, b) => a - b),
    dates: cache.dates.includes(date) ? cache.dates : [...cache.dates, date],
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(cache.completed))
    localStorage.setItem(DATES_KEY, JSON.stringify(cache.dates))
  } catch {
    // storage unavailable: keep in-memory
  }
  pushCompletion(day, date)
  notify()
}

// Re-reads the cache after a sign-in pulled this user's history from the server.
export function reloadProgress() {
  cache = { ...cache, completed: read<number>(KEY), dates: read<string>(DATES_KEY) }
  notify()
}

// Consecutive days with a session, ending today (or yesterday, so the streak survives until tonight).
function streakOf(dates: string[]) {
  const set = new Set(dates)
  const d = new Date()
  if (!set.has(d.toLocaleDateString('en-CA'))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(d.toLocaleDateString('en-CA'))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

// Number of base-exercise sessions (0–3) done for a program day.
export function sessionsDone(day: number) {
  return (loadProfile()?.lessonCompletions ?? []).filter(k => k.startsWith(`${day}:`)).length
}

export function useCompleted() {
  const { completed, dates } = useSyncExternalStore(
    cb => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => cache,
  )
  const dayDates = loadProfile()?.dayDates ?? {}
  const firstOpen = Array.from({ length: PROGRAM_DAYS }, (_, i) => i + 1).find(d => !completed.includes(d))
  // Advent calendar: the next door opens once the previous day has a session AND a new calendar day has begun.
  const prev = (firstOpen ?? PROGRAM_DAYS + 1) - 1
  const waiting = firstOpen !== undefined && prev >= 1 && dayDates[prev] === today()
  const current = firstOpen === undefined ? PROGRAM_DAYS : waiting ? prev : firstOpen
  const statusOf = (day: number) =>
    (day === current && !completed.includes(day) ? 'current' : completed.includes(day) ? 'completed' : 'locked') as 'completed' | 'current' | 'locked'
  return {
    completed,
    current,
    // True when today's door is done and tomorrow's is still closed.
    waitingForTomorrow: waiting,
    finished: completed.length >= PROGRAM_DAYS,
    statusOf,
    streak: streakOf(dates),
    doneToday: dates.includes(today()),
  }
}

// Records one session (1–3) of the base exercise; the first one completes and dates the day.
export function completeLesson(day: number, session: number) {
  const p = loadProfile()
  const key = `${day}:${Math.min(SESSIONS_PER_DAY, Math.max(1, session))}`
  const dayDates = { ...(p?.dayDates ?? {}) }
  dayDates[day] ??= today()
  saveProfile({ lessonCompletions: [...new Set([...(p?.lessonCompletions ?? []), key])], dayDates })
  completeDay(day)
  notify()
}
