import { api, apiEnabled, getToken, setToken } from '../lib/api'
import { saveProfile } from '../lib/profile'
import { reloadProgress } from '../lib/progress'
import { applyTheme } from '../lib/theme'
import { cacheUser, clearLocalUser, pullUser } from './remote'

// Username/password accounts in Neon; legacy emails still work for sign-in.

export type AuthResult = { ok: true } | { ok: false; error: string }
type AuthResponse = { token: string; user: Parameters<typeof cacheUser>[0] }

const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong')

export async function signIn(username: string, password: string): Promise<AuthResult> {
  if (!apiEnabled) {
    saveProfile({ username, email: '', name: username })
    return { ok: true }
  }
  try {
    const r = await api<AuthResponse>('auth/login', { method: 'POST', body: { username, password } })
    setToken(r.token)
    if (!await pullUser()) {
      setToken(null)
      return { ok: false, error: 'Could not load your account. Please try again.' }
    }
    applyTheme()
    reloadProgress()
    return { ok: true }
  } catch (e) {
    return { ok: false, error: message(e) }
  }
}

export async function signUp(name: string, username: string, password: string): Promise<AuthResult> {
  if (!apiEnabled) {
    saveProfile({ name, username: username.trim().toLowerCase(), email: '', onboarded: false })
    return { ok: true }
  }
  try {
    const r = await api<AuthResponse>('auth/signup', { method: 'POST', body: { name, username, password } })
    setToken(r.token)
    cacheUser(r.user)
    reloadProgress()
    saveProfile({ name, username: username.trim().toLowerCase(), email: '', onboarded: false })
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
