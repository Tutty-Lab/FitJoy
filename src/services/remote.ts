import { api, apiEnabled, getToken, setToken } from '../lib/api'

// Server adapter (FitJoy API on Vercel + Neon). The app reads from localStorage as a fast local
// cache; these functions keep that cache and the database in step. Every function is a no-op
// when the API is not enabled.

const KEYS = { profile: 'fitjoy.profile', completed: 'fitjoy.completed', dates: 'fitjoy.activeDates', catalog: 'fitjoy.catalog' }

type ServerUser = { email: string; name: string; role: 'user' | 'admin'; data: Record<string, unknown> }

const signedIn = () => apiEnabled && !!getToken()

let profileTimer: ReturnType<typeof setTimeout> | undefined
// Debounced so rapid +/- taps send one write. Photos stay on the device (too big for a row).
export function pushProfile(p: { name: string; email: string; photos?: unknown } & Record<string, unknown>) {
  if (!signedIn()) return
  clearTimeout(profileTimer)
  profileTimer = setTimeout(() => {
    const { photos: _photos, role: _role, email: _email, ...data } = p
    api('me', { method: 'PUT', body: { name: p.name, data } }).catch(console.error)
  }, 600)
}

export async function pushCompletion(day: number, date: string) {
  if (!signedIn()) return
  await api('completions', { method: 'POST', body: { day, date } }).catch(console.error)
}

// Writes a signed-in user's server state into the local cache.
export function cacheUser(user: ServerUser, completed: number[] = [], dates: string[] = []) {
  const local = JSON.parse(localStorage.getItem(KEYS.profile) ?? '{}')
  localStorage.setItem(KEYS.profile, JSON.stringify({ ...user.data, photos: local.photos, name: user.name, email: user.email, role: user.role }))
  localStorage.setItem(KEYS.completed, JSON.stringify(completed))
  localStorage.setItem(KEYS.dates, JSON.stringify(dates))
}

// Refreshes the cache from the server. Returns the user's role, or null if signed out.
export async function pullUser(): Promise<'user' | 'admin' | null> {
  if (!signedIn()) return null
  try {
    const me = await api<{ user: ServerUser; completed: number[]; dates: string[] }>('me')
    cacheUser(me.user, me.completed, me.dates)
    return me.user.role
  } catch (e) {
    // An expired or revoked token signs the device out.
    if ((e as { status?: number }).status === 401) {
      setToken(null)
      clearLocalUser()
    }
    return null
  }
}

export async function pullCatalog() {
  if (!apiEnabled) return
  try {
    localStorage.setItem(KEYS.catalog, JSON.stringify(await api('catalog')))
  } catch {
    // keep the cached catalog when offline
  }
}

export async function pushCatalog(day: number, data: object | null) {
  if (!apiEnabled) return
  if (data === null) await api(`catalog?day=${day}`, { method: 'DELETE' })
  else await api('catalog', { method: 'PUT', body: { day, data } })
}

export function clearLocalUser() {
  for (const k of [KEYS.profile, KEYS.completed, KEYS.dates]) localStorage.removeItem(k)
}
