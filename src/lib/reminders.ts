import { useEffect } from 'react'
import { loadProfile, saveProfile } from './profile'
import { L } from './i18n'

export const DEFAULT_TIMES = ['06:30', '12:15', '20:00']
const SLOT_NAMES = [L('Morgens', 'Buổi sáng'), L('Mittags', 'Buổi trưa'), L('Abends', 'Buổi tối')]
const FIRED_KEY = 'fitjoy.firedReminders'

export function playChime() {
  try {
    const ctx = new AudioContext()
    ;[880, 1175, 1568].forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = f
      g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + i * 0.12)
      o.stop(ctx.currentTime + i * 0.12 + 0.4)
    })
  } catch {
    // audio unavailable
  }
}

// Asks for notification permission the first time the user turns a reminder on.
export function ensureNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {})
  }
}

function alreadyFired(id: string) {
  try {
    const fired = JSON.parse(localStorage.getItem(FIRED_KEY) ?? '[]') as string[]
    if (fired.includes(id)) return true
    // Keep only today's entries so the list never grows.
    const today = id.slice(0, 10)
    localStorage.setItem(FIRED_KEY, JSON.stringify([...fired.filter(f => f.startsWith(today)), id]))
    return false
  } catch {
    return false
  }
}

function fire(slot: number, chime: boolean) {
  if (chime) playChime()
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Vestibu • ${SLOT_NAMES[slot]} ⏰`, {
      body: L('Zeit für deine Gleichgewichts-Minute 🌱', 'Đến giờ tập 1 phút thăng bằng rồi 🌱'),
      icon: '/icon.png',
      tag: `fitjoy-${slot}`,
    })
  }
}

// Fires the user's enabled reminders at their set times while the app is open.
// Background delivery (app closed) needs Capacitor Local Notifications on iOS.
export function useReminderScheduler() {
  useEffect(() => {
    const check = () => {
      const p = loadProfile()
      // Self-test the user postponed with "Später erinnern".
      if (p && !p.checks?.start && p.checkReminderAt && Date.now() >= Date.parse(p.checkReminderAt)) {
        saveProfile({ checkReminderAt: undefined })
        if (p.chime ?? true) playChime()
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(L('Hallo, hier ist Vestibu 👋', 'Xin chào, mình là Vestibu 👋'), { body: L('Dein Selbsttest wartet auf dich. Mach dir kurz 3 Meter Platz, schnapp dir einen Stuhl und nimm dir eine halbe Stunde Ruhe nur für dich.', 'Bài tự kiểm tra đang chờ bạn. Dọn khoảng 3 mét trống, chuẩn bị một chiếc ghế và dành nửa tiếng yên tĩnh cho riêng mình.'), icon: '/icon.png', tag: 'vestibu-check' })
        }
      }
      if (!p?.onboarded) return
      const times = p.reminderTimes ?? DEFAULT_TIMES
      const enabled = p.reminders ?? [true, true, true]
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const date = now.toLocaleDateString('en-CA')
      times.forEach((t, i) => {
        if (enabled[i] && t === hhmm && !alreadyFired(`${date}-${i}`)) fire(i, p.chime ?? true)
      })
    }
    check()
    const id = setInterval(check, 20_000)
    return () => clearInterval(id)
  }, [])
}
