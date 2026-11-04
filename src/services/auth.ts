import { api, apiEnabled, getToken, setToken } from '../lib/api'
import { saveProfile } from '../lib/profile'
import { reloadProgress } from '../lib/progress'
import { cacheUser, clearLocalUser, pullUser } from './remote'

// Auth service. With the API: real email/password accounts stored in Neon. Without it: the local
// MVP behaviour (any email signs in on this device).

export type AuthResult = { ok: true } | { ok: false; error: string }
type AuthResponse = { token: string; user: Parameters<typeof cacheUser>[0] }

const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong')

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!apiEnabled) {
    saveProfile({ email, name: email.split('@')[0] })
    return { ok: true }
  }
  try {
    const r = await api<AuthResponse>('auth/login', { method: 'POST', body: { email, password } })
    setToken(r.token)
    await pullUser()
    reloadProgress()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: message(e) }
  }
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  if (!apiEnabled) {
    saveProfile({ name, email, onboarded: false })
    return { ok: true }
  }
  try {
    const r = await api<AuthResponse>('auth/signup', { method: 'POST', body: { name, email, password } })
    setToken(r.token)
    cacheUser(r.user)
    reloadProgress()
    saveProfile({ name, email, onboarded: false })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: message(e) }
  }
}

// Permanently deletes the account on the server (when signed in there), then this device's copy.
export async function deleteAccount(): Promise<AuthResult> {
  try {
    if (apiEnabled && getToken()) await api('me', { method: 'DELETE' })
    setToken(null)
    clearLocalUser()
    localStorage.removeItem('fitjoy.firedReminders')
    reloadProgress()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: message(e) }
  }
}

// Tokens are stateless, so signing out is dropping it from this device.
export async function signOutEverywhere() {
  setToken(null)
  clearLocalUser()
  reloadProgress()
}
