import { L } from './i18n'
// Client for the FitJoy API (Vercel Functions in /api backed by Neon Postgres).
// Set VITE_BACKEND=neon to use it; otherwise the app runs on the local (localStorage) adapter.
export const apiEnabled = import.meta.env.VITE_BACKEND === 'neon'

// Native builds (Capacitor) have no /api of their own, so they call the deployed API.
const BASE = import.meta.env.VITE_API_URL ?? ''

const TOKEN_KEY = 'fitjoy.token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string | null) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}/api/${path}`, {
    method: init.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, localizeError((data as { error?: string }).error ?? L(`Anfrage fehlgeschlagen (${res.status})`, `Yêu cầu thất bại (${res.status})`)))
  return data as T
}

// Server messages are English; show them in the app language.
const ERRORS: Record<string, [string, string]> = {
  'This username is already taken': ['Dieser Benutzername ist schon vergeben', 'Tên đăng nhập này đã có người dùng'],
  'Invalid invitation': ['Ungültige Einladung', 'Lời mời không hợp lệ'],
  'Sign in required': ['Bitte melde dich an', 'Vui lòng đăng nhập'],
  'Enter your invitation code': ['Gib deinen Einladungscode ein', 'Nhập mã mời của bạn'],
  'This invitation is no longer available': ['Diese Einladung ist nicht mehr verfügbar', 'Lời mời này không còn hiệu lực'],
  'Server error': ['Serverfehler – bitte versuch es später noch einmal', 'Lỗi máy chủ – vui lòng thử lại sau'],
  'Username is required and must be 64 characters or fewer': ['Benutzername fehlt oder ist länger als 64 Zeichen', 'Cần nhập tên đăng nhập, tối đa 64 ký tự'],
  'Password is required': ['Bitte gib ein Passwort ein', 'Vui lòng nhập mật khẩu'],
  'Wrong username or password': ['Benutzername oder Passwort ist falsch', 'Sai tên đăng nhập hoặc mật khẩu'],
  'Too many attempts. Try again in 15 minutes.': ['Zu viele Versuche. Versuch es in 15 Minuten erneut.', 'Thử quá nhiều lần. Vui lòng thử lại sau 15 phút.'],
  'Your program access is already active.': ['Dein Zugang ist bereits aktiv.', 'Quyền truy cập của bạn đã được kích hoạt.'],
  'This account belongs to another organization. Contact support.': ['Dieses Konto gehört zu einer anderen Organisation. Bitte wende dich an den Support.', 'Tài khoản này thuộc tổ chức khác. Vui lòng liên hệ hỗ trợ.'],
  'Code is invalid, expired or already used.': ['Der Code ist ungültig, abgelaufen oder schon benutzt.', 'Mã không hợp lệ, đã hết hạn hoặc đã được dùng.'],
  'Account not found': ['Konto nicht gefunden', 'Không tìm thấy tài khoản'],
}
function localizeError(msg: string) {
  const t = ERRORS[msg]
  return t ? L(t[0], t[1]) : msg
}
