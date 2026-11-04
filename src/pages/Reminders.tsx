import { useState } from 'react'
import { Switch, SectionTitle } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import { DEFAULT_TIMES, ensureNotificationPermission } from '../lib/reminders'
import coach from '../assets/onboarding/coach-step3.png'
import icAlarm from '../assets/onboarding/r-alarm.svg'
import icBell from '../assets/onboarding/r-bell.svg'
import icSunset from '../assets/onboarding/r-sunset.svg'

const slots = [
  { title: 'Morning', name: 'Sunrise Warmup', icon: icAlarm, w: 15.975, h: 14.738, bg: 'bg-[#ffe3d3]', card: 'bg-white' },
  { title: 'Noon', name: 'Spine Alignment & Mobility', icon: icBell, w: 12, h: 15, bg: 'bg-[#e7efee]', card: 'bg-white' },
  { title: 'Night', name: 'Deep Stretch & Rest', icon: icSunset, w: 16.5, h: 15, bg: 'bg-[#ffdcc5]', card: 'bg-white' },
]

export default function Reminders() {
  const p = loadProfile()
  const [times, setTimes] = useState<string[]>(p?.reminderTimes ?? DEFAULT_TIMES)
  const [on, setOn] = useState<boolean[]>(p?.reminders ?? [true, true, true])
  const [saved, setSaved] = useState(false)

  const update = (t: string[], o: boolean[]) => {
    setTimes(t)
    setOn(o)
    saveProfile({ reminderTimes: t, reminders: o })
    if (o.some(Boolean)) ensureNotificationPermission()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="stagger flex flex-col gap-5 bg-[#fbf8f3] px-4 pt-2 pb-6">
      <div className="flex gap-4 overflow-hidden rounded-2xl bg-[#ffece1] p-4 shadow-sm">
        <div className="relative shrink-0 self-start">
          <div className="size-14 overflow-hidden rounded-full bg-[#ee7a3f] shadow-md">
            <img src={coach} alt="" className="size-full object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-1 rounded-full bg-[#ef8933] px-1.5 py-0.5 text-[10px] leading-[15px] text-[#5c2c00]">COACH</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#d9652c]">3 Daily Reminders</span>
          <p className="text-sm leading-[22.75px] font-medium text-[#7a3412]">
            Pick times that fit your day ⏰
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={saved && <span className="text-xs leading-4 font-bold text-[#13707e]">Saved ✓</span>}>Reminder Slots</SectionTitle>
        {slots.map((s, i) => (
          <div key={s.title} className={`flex flex-col gap-3 rounded-[32px] p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${s.card} ${on[i] ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className={`flex size-11 items-center justify-center rounded-full ${s.bg}`}>
                  <img src={s.icon} alt="" style={{ width: s.w, height: s.h }} />
                </span>
                <span>
                  <span className="block text-base leading-5 font-bold">{s.title}</span>
                </span>
              </span>
              <Switch label={`${s.title} reminder`} on={on[i]} onChange={() => update(times, on.map((v, j) => (j === i ? !v : v)))} />
            </div>
            <label className="flex items-center justify-between rounded-[48px] bg-[#f3f6f5] py-1 pr-1 pl-4">
              <span className="text-sm leading-5 font-semibold text-[#3f4a4b]">Time</span>
              <input
                type="time"
                value={times[i]}
                disabled={!on[i]}
                onChange={e => update(times.map((t, j) => (j === i ? e.target.value : t)), on)}
                className="rounded-full bg-white px-4 py-2 text-lg leading-6 font-bold text-[#13707e] outline-none focus:ring-2 focus:ring-brand"
              />
            </label>
          </div>
        ))}
      </section>

    </div>
  )
}
