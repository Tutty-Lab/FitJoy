import { baseWorkouts, CATALOG_KEY, type Workout } from '../data/workouts'
import { pushCatalog } from './remote'

// Workout catalog service. Overrides are cached in localStorage and mirrored to the
// `workout_overrides` table when Supabase is configured (see docs/ARCHITECTURE.md).

type Overrides = Record<number, Partial<Workout>>

function read(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_KEY) ?? '{}') as Overrides
  } catch {
    return {}
  }
}

function write(o: Overrides) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(o))
}

export function listWorkouts(): Workout[] {
  const o = read()
  return baseWorkouts.map(w => ({ ...w, ...o[w.day] }))
}

export function getWorkout(day: number): Workout | undefined {
  return listWorkouts().find(w => w.day === day)
}

export function isEdited(day: number) {
  return day in read()
}

export function saveWorkout(day: number, patch: Partial<Workout>) {
  const o = read()
  o[day] = { ...o[day], ...patch }
  write(o)
  return pushCatalog(day, o[day])
}

export function resetWorkout(day: number) {
  const o = read()
  delete o[day]
  write(o)
  return pushCatalog(day, null)
}
