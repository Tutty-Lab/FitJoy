import { baseExercise, programDays } from './program'

export type Category = 'Warm-up' | 'Core & Cardio' | 'Fat Burn' | 'Recovery'

export type Step = { name: string; mins: number; note: string }

export type Workout = {
  lessons?: Partial<Workout>[]
  affirmation?: string
  bonus?: string
  day: number
  title: string
  mins: number
  kcal: number
  category: Category
  intensity: 'Gentle' | 'Moderate' | 'Intense'
  moves: number
  blurb: string
  steps: Step[]
  // Replace with each day's real workout video when available.
  video: string
}

// One entry per program day (90). Every day uses the same base exercise; day-specific texts
// (greeting, affirmation, bonus) come from program.ts. Admin overrides still layer on top.
export const baseWorkouts: Workout[] = programDays.map(d => ({
  day: d.tag,
  title: baseExercise.title,
  mins: 1,
  kcal: 0,
  category: 'Recovery' as Category,
  intensity: 'Gentle' as const,
  moves: 1,
  blurb: baseExercise.original,
  steps: baseExercise.steps.map(name => ({ name, mins: 0, note: '' })),
  affirmation: d.affirmation || undefined,
  video: baseExercise.video,
}))
// Admin edits are stored as per-day overrides and layered over the seed data at load.
export const CATALOG_KEY = 'fitjoy.catalog'
function readOverrides(): Record<number, Partial<Workout>> {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_KEY) ?? '{}')
  } catch {
    return {}
  }
}
const overrides = readOverrides()
export const workouts: Workout[] = baseWorkouts.map(w => ({ ...w, ...overrides[w.day] }))

export const categoryColor: Record<Category, string> = {
  'Warm-up': 'text-[#13707e]',
  'Core & Cardio': 'text-[#d9652c]',
  'Fat Burn': 'text-[#944a00]',
  Recovery: 'text-[#3f4a4b]',
}

export const pad = (n: number) => String(n).padStart(2, '0')
