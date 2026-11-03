// Local-only persistence until there is a backend.
export type Profile = {
  name: string
  email: string
  goal?: string
  activity?: string
  focus?: string[]
  height?: number
  weight?: number
  waist?: number
  goalWeight?: number
  hip?: number
  workoutTime?: string
  reminders?: boolean[]
  onboarded?: boolean
  pushAlerts?: boolean
  chime?: boolean
  darkMode?: boolean
  reminderTimes?: string[]
  history?: Measurement[]
  photos?: { before?: string; after?: string }
}

export type Measurement = { date: string; weight: number; waist: number; hip: number }

// Records today's body measurements, replacing any entry already logged today.
export function logMeasurement(m: Omit<Measurement, 'date'>): Profile {
  const date = new Date().toISOString().slice(0, 10)
  const history = (loadProfile()?.history ?? []).filter(h => h.date !== date)
  return saveProfile({ ...m, history: [...history, { date, ...m }] })
}

const KEY = 'fitjoy.profile'

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Profile) : null
  } catch {
    return null
  }
}

export function saveProfile(patch: Partial<Profile>): Profile {
  const next = { ...(loadProfile() ?? { name: '', email: '' }), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage unavailable: keep going in-memory
  }
  return next
}

export function signOut() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
