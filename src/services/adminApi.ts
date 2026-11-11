import { loadProfile } from '../lib/profile'
import { api, apiEnabled, setToken } from '../lib/api'
import { signIn, signOutEverywhere } from './auth'

// Admin data service. With the API: real members. Without it: the device user plus generated
// demo members, so the console has realistic numbers before a backend exists.

export type Member = {
  id: string
  name: string
  email: string
  goal: 'fat' | 'posture' | 'energy' | 'strength'
  joined: string // YYYY-MM-DD
  lastActive: string // YYYY-MM-DD
  completed: number // workouts finished, 0–22
  streak: number
  demo: boolean
}

export const GOAL_LABEL: Record<Member['goal'], string> = {
  fat: 'Burn fat',
  posture: 'Fix posture',
  energy: 'Boost energy',
  strength: 'Build strength',
}

const FIRST = ['Minh Anh', 'Bảo Ngọc', 'Quốc Huy', 'Thu Trang', 'Gia Hân', 'Đức Anh', 'Lan Chi', 'Hoàng Nam', 'Khánh Linh', 'Tuấn Kiệt', 'Mai Phương', 'Thành Đạt', 'Ngọc Hà', 'Phúc An', 'Yến Nhi', 'Minh Khoa']
const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi']
const GOALS: Member['goal'][] = ['fat', 'posture', 'energy', 'strength']

// Small deterministic PRNG so demo data is stable across reloads.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

const iso = (d: Date) => d.toLocaleDateString('en-CA')
const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return iso(d)
}

const demoMembers: Member[] = (() => {
  const r = rng(22)
  return Array.from({ length: 48 }, (_, i) => {
    const joinedAgo = Math.floor(r() * 40) + 1
    // Drop-off curve: most people finish the first few days, fewer reach day 22.
    const completed = Math.min(22, joinedAgo, Math.round(22 * Math.pow(r(), 1.6)))
    const idle = Math.floor(r() * 12)
    const first = FIRST[i % FIRST.length]
    const last = LAST[Math.floor(r() * LAST.length)]
    return {
      id: `demo-${i + 1}`,
      name: `${last} ${first}`,
      email: `${first.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '.')}${i + 1}@example.com`,
      goal: GOALS[Math.floor(r() * GOALS.length)],
      joined: daysAgo(joinedAgo),
      lastActive: daysAgo(Math.min(idle, joinedAgo)),
      completed,
      streak: idle === 0 ? Math.max(1, Math.floor(r() * Math.min(10, completed + 1))) : 0,
      demo: true,
    }
  })
})()

function deviceMember(): Member | null {
  const p = loadProfile()
  if (!p?.email && !p?.username) return null
  let completed: number[] = []
  let dates: string[] = []
  try {
    completed = JSON.parse(localStorage.getItem('fitjoy.completed') ?? '[]')
    dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]')
  } catch {
    // ignore
  }
  const sorted = [...dates].sort()
  return {
    id: 'device',
    name: p.name || p.username || p.email,
    email: p.username || p.email,
    goal: (p.goal as Member['goal']) ?? 'fat',
    joined: p.history?.[0]?.date ?? sorted[0] ?? iso(new Date()),
    lastActive: sorted[sorted.length - 1] ?? iso(new Date()),
    completed: completed.length,
    streak: 0,
    demo: false,
  }
}

// Real members from the API (admin-only endpoint).
async function remoteMembers(): Promise<Member[]> {
  const rows = await api<{ id: string; email: string; name: string; goal: Member['goal'] | null; joined: string; completed: number; dates: string[] }[]>('admin/members')
  return rows.map(r => {
    const set = new Set(r.dates)
    const d = new Date()
    if (!set.has(iso(d))) d.setDate(d.getDate() - 1)
    let streak = 0
    while (set.has(iso(d))) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return {
      id: r.id,
      name: r.name || r.email,
      email: r.email,
      goal: r.goal ?? 'fat',
      joined: r.joined,
      lastActive: r.dates[r.dates.length - 1] ?? r.joined,
      completed: r.completed,
      streak,
      demo: false,
    }
  })
}

export async function fetchMembers(): Promise<Member[]> {
  if (apiEnabled) return remoteMembers()
  const me = deviceMember()
  return me ? [me, ...demoMembers] : demoMembers
}

export function computeStats(members: Member[]) {
  const total = Math.max(1, members.length)
  const week = daysAgo(7)
  const active7 = members.filter(m => m.lastActive >= week).length
  const sessions = members.reduce((s, m) => s + m.completed, 0)
  const finishers = members.filter(m => m.completed >= 22).length
  // How many members have completed at least day N — the program's drop-off funnel.
  const funnel = Array.from({ length: 22 }, (_, i) => ({ day: i + 1, members: members.filter(m => m.completed >= i + 1).length }))
  return { total: members.length, pctBase: total, active7, sessions, finishers, funnel }
}

// Admin access. With the API: a real account whose role is 'admin' (enforced by the API).
// Without it: a demo passcode — not secure, local demo only.
const SESSION_KEY = 'fitjoy.adminSession'
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'fitjoy-admin'

export async function adminSignIn(passcodeOrEmail: string, password = ''): Promise<string | null> {
  if (!apiEnabled) {
    if (passcodeOrEmail !== PASSCODE) return 'Wrong passcode.'
    sessionStorage.setItem(SESSION_KEY, '1')
    return null
  }
  const r = await signIn(passcodeOrEmail, password)
  if (!r.ok) return r.error
  if (loadProfile()?.role !== 'admin') {
    setToken(null)
    return 'This account is not an admin.'
  }
  sessionStorage.setItem(SESSION_KEY, '1')
  return null
}

export const isAdmin = () => apiEnabled ? loadProfile()?.role === 'admin' : sessionStorage.getItem(SESSION_KEY) === '1'
export const adminSignOut = async () => {
  await signOutEverywhere()
  sessionStorage.removeItem(SESSION_KEY)
}
