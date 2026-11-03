import { useState } from 'react'
import { Switch, SectionTitle } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import coach from '../assets/onboarding/coach-step3.png'
import icAlarm from '../assets/onboarding/r-alarm.svg'
import icBell from '../assets/onboarding/r-bell.svg'
import icSunset from '../assets/onboarding/r-sunset.svg'
import icNote from '../assets/onboarding/r-note.svg'
import icSpeaker from '../assets/onboarding/r-speaker.svg'

const slots = [
  { title: 'Morning', name: 'Sunrise Warmup', icon: icAlarm, w: 15.975, h: 14.738, bg: 'bg-[#6ffbbe]', card: 'bg-white' },
  { title: 'Noon', name: 'Spine Alignment & Mobility', icon: icBell, w: 12, h: 15, bg: 'bg-[#dee8ff]', card: 'bg-white' },
  { title: 'Night', name: 'Deep Stretch & Rest', icon: icSunset, w: 16.5, h: 15, bg: 'bg-[#ffdcc5]', card: 'bg-white' },
]
const defaults = ['06:30', '12:15', '20:00']

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

// Minutes until the next of the enabled times, for the "next reminder" chip.
function nextUp(times: string[], on: boolean[]) {
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const mins = times.map((t, i) => (on[i] ? t.split(':').map(Number).reduce((h, m) => h * 60 + m) : null)).filter((m): m is number => m !== null)
  if (!mins.length) return null
  const diffs = mins.map(m => (m - cur + 1440) % 1440 || 1440)
  const d = Math.min(...diffs)
  return `${Math.floor(d / 60)}h ${d % 60}m`
}

export default function Reminders() {
  const p = loadProfile()
  const [times, setTimes] = useState<string[]>(p?.reminderTimes ?? defaults)
  const [on, setOn] = useState<boolean[]>(p?.reminders ?? [true, true, true])
  const [saved, setSaved] = useState(false)
  const [perm, setPerm] = useState(() => ('Notification' in window ? Notification.permission : 'unsupported'))

  const update = (t: string[], o: boolean[]) => {
    setTimes(t)
    setOn(o)
    saveProfile({ reminderTimes: t, reminders: o })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  async function allow() {
    if (!('Notification' in window)) return
    setPerm(await Notification.requestPermission())
  }

  function test() {
    playChime()
    if (perm === 'granted') new Notification('FitJoy ⏰', { body: "Time to move! Today's workout is waiting 🌱", icon: '/icon.png' })
  }

  const next = nextUp(times, on)

  return (
    <div className="stagger flex flex-col gap-5 bg-[#f9f9ff] px-4 pt-2 pb-6">
      <div className="flex gap-4 overflow-hidden rounded-2xl bg-[#e9ddff] p-4 shadow-sm">
        <div className="relative shrink-0 self-start">
          <div className="size-14 overflow-hidden rounded-full bg-[#8455ef] shadow-md">
            <img src={coach} alt="" className="size-full object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-1 rounded-full bg-[#ef8933] px-1.5 py-0.5 text-[10px] leading-[15px] text-[#5c2c00]">COACH</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#6b38d4]">3 Daily Reminders</span>
          <p className="text-sm leading-[22.75px] font-medium text-[#23005c]">
            Pick the moments that fit your day. Small, steady sessions keep your <b className="font-bold text-[#6b38d4]">streak</b> alive! ⏰🔥
          </p>
        </div>
      </div>

      {next && (
        <div className="flex items-center justify-between rounded-full bg-white px-4 py-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <span className="text-sm leading-5 font-semibold text-[#3c4a42]">Next reminder in</span>
          <span className="rounded-full bg-[rgba(111,251,190,0.4)] px-3 py-1 text-sm leading-5 font-bold text-[#006c49]">{next}</span>
        </div>
      )}

      <section className="flex flex-col gap-3">
        <SectionTitle aside={saved && <span className="text-xs leading-4 font-bold text-[#006c49]">Saved ✓</span>}>Reminder Slots</SectionTitle>
        {slots.map((s, i) => (
          <div key={s.title} className={`flex flex-col gap-3 rounded-[32px] p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${s.card} ${on[i] ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className={`flex size-11 items-center justify-center rounded-full ${s.bg}`}>
                  <img src={s.icon} alt="" style={{ width: s.w, height: s.h }} />
                </span>
                <span>
                  <span className="block text-base leading-5 font-bold">{s.title}</span>
                  <span className="block text-sm leading-5 text-[#3c4a42]">{s.name}</span>
                </span>
              </span>
              <Switch label={`${s.title} reminder`} on={on[i]} onChange={() => update(times, on.map((v, j) => (j === i ? !v : v)))} />
            </div>
            <label className="flex items-center justify-between rounded-[48px] bg-[#f0f3ff] py-1 pr-1 pl-4">
              <span className="text-sm leading-5 font-semibold text-[#3c4a42]">Time</span>
              <input
                type="time"
                value={times[i]}
                disabled={!on[i]}
                onChange={e => update(times.map((t, j) => (j === i ? e.target.value : t)), on)}
                className="rounded-full bg-white px-4 py-2 text-lg leading-6 font-bold text-[#006c49] outline-none focus:ring-2 focus:ring-brand"
              />
            </label>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Alerts</SectionTitle>
        <div className="flex flex-col gap-3 rounded-[32px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-2">
            <span>
              <span className="block text-sm leading-[18px] font-semibold">Notification permission</span>
              <span className="block text-sm leading-5 text-[#3c4a42]">
                {perm === 'granted' ? 'Allowed ✓' : perm === 'denied' ? 'Blocked in browser settings' : perm === 'unsupported' ? 'Not supported on this browser' : 'Not allowed yet'}
              </span>
            </span>
            {perm === 'default' && (
              <button onClick={allow} className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm leading-[18px] font-bold text-white">Allow</button>
            )}
          </div>
          <div className="flex items-center justify-between rounded-[48px] bg-[#f0f3ff] p-2">
            <span className="flex items-center gap-2 pr-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#e9ddff]">
                <img src={icNote} alt="" style={{ width: 9, height: 13.5 }} />
              </span>
              <span>
                <span className="block text-xs leading-4 font-semibold tracking-[0.48px]">FitJoy Playful Chime</span>
                <span className="block text-[10px] leading-[15px] font-medium text-[#3c4a42]">Tap Test to preview</span>
              </span>
            </span>
            <button onClick={test} className="flex items-center gap-1 rounded-full bg-[#e9ddff] px-3 py-1.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#23005c]">
              <img src={icSpeaker} alt="" style={{ width: 12, height: 11.667 }} />Test
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
