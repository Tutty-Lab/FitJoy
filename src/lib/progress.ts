import { useSyncExternalStore } from 'react'
import { workouts } from '../data/workouts'

// Completed workout days and the dates they were done, persisted locally until there is a backend.
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

let cache = { completed: read<number>(KEY), dates: read<string>(DATES_KEY) }

const today = () => new Date().toLocaleDateString('en-CA')

export function completeDay(day: number) {
  const date = today()
  if (cache.completed.includes(day) && cache.dates.includes(date)) return
  cache = {
    completed: cache.completed.includes(day) ? cache.completed : [...cache.completed, day].sort((a, b) => a - b),
    dates: cache.dates.includes(date) ? cache.dates : [...cache.dates, date],
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(cache.completed))
    localStorage.setItem(DATES_KEY, JSON.stringify(cache.dates))
  } catch {
    // storage unavailable: keep in-memory
  }
  listeners.forEach(l => l())
}

// Consecutive days with a workout, ending today (or yesterday, so the streak survives until tonight).
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

export function useCompleted() {
  const { completed, dates } = useSyncExternalStore(
    cb => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => cache,
  )
  // Days unlock in order: the current day is the first one not yet completed.
  const current = Array.from({ length: 22 }, (_, i) => i + 1).find(d => !completed.includes(d)) ?? 22
  const statusOf = (day: number) => (completed.includes(day) ? 'completed' : day === current ? 'current' : 'locked') as 'completed' | 'current' | 'locked'
  const done = workouts.filter(w => completed.includes(w.day))
  const xp = done.length * 60
  return {
    completed,
    current,
    statusOf,
    streak: streakOf(dates),
    doneToday: dates.includes(today()),
    mins: done.reduce((s, w) => s + w.mins, 0),
    kcal: done.reduce((s, w) => s + w.kcal, 0),
    xp,
    level: 1 + Math.floor(xp / 240),
    levelPct: ((xp % 240) / 240) * 100,
  }
}
