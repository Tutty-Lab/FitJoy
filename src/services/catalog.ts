import { baseWorkouts, CATALOG_KEY, type Workout } from '../data/workouts'
import { pushCatalog } from './remote'
import type { ProgramDay } from '../data/program'

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

// Gleichgewichts-Code: per-day text overrides (day 1–90) and program settings (day 0) share the same store.
type DayPatch = Partial<Pick<ProgramDay, 'begruessung' | 'affirmation' | 'bonusImpuls' | 'bonusUebung'>> & { video?: string }

export function getDayOverride(day: number): DayPatch {
  return (read()[day] ?? {}) as DayPatch
}

// Replaces the day's override; fields equal to the Excel text are dropped so a later re-import still shows through.
export function saveDay(day: number, patch: DayPatch) {
  const o = read()
  const programKeys = ['begruessung', 'affirmation', 'bonusImpuls', 'bonusUebung', 'video']
  // Keep unrelated legacy fields (old lesson model) out of the way; only program fields are written.
  const clean = Object.fromEntries(Object.entries(patch).filter(([k, v]) => programKeys.includes(k) && v !== undefined && v !== ''))
  if (Object.keys(clean).length === 0) delete o[day]
  else o[day] = clean as Partial<Workout>
  write(o)
  return pushCatalog(day, o[day] ?? null)
}
