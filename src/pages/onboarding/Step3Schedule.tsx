import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingShell, { PrimaryCta } from './OnboardingShell'
import { Switch } from '../../components/shared'
import { loadProfile, saveProfile } from '../../lib/profile'
import coach from '../../assets/onboarding/coach-step3.png'
import icSun from '../../assets/onboarding/t-sun.svg'
import icCup from '../../assets/onboarding/t-cup.svg'
import icMoon from '../../assets/onboarding/t-moon.svg'
import icCheckOn from '../../assets/onboarding/check-sm-white.svg'
import icCheckOff from '../../assets/onboarding/check-faint.svg'
import icAlarm from '../../assets/onboarding/r-alarm.svg'
import icBell from '../../assets/onboarding/r-bell.svg'
import icSunset from '../../assets/onboarding/r-sunset.svg'
import icNote from '../../assets/onboarding/r-note.svg'
import icSpeaker from '../../assets/onboarding/r-speaker.svg'
import icArrow from '../../assets/auth/arrow.svg'

const times = [
  { id: 'morning', title: 'Morning Energy', time: '06:30', desc: 'Optimize fat burn & ignite metabolism', icon: icSun, size: 22, onBg: 'bg-[#6ffbbe]' },
  { id: 'midday', title: 'Midday Reset', time: '12:15', desc: 'Relieve desk posture tension & reset energy', icon: icCup, size: 18, onBg: 'bg-[#6ffbbe]' },
  { id: 'evening', title: 'Evening Unwind', time: '20:00', desc: 'Deep stretch, release stress & prepare sleep', icon: icMoon, size: 20, onBg: 'bg-[#6ffbbe]' },
]

const alerts = [
  { title: 'Morning Alert', time: '06:30 AM', icon: icAlarm, w: 15.975, h: 14.738, bg: 'bg-[#6ffbbe]' },
  { title: 'Lunch Break Alert', time: '12:15 PM', icon: icBell, w: 12, h: 15, bg: 'bg-[#dee8ff]' },
  { title: 'Evening Stretch Chime', time: '08:00 PM', icon: icSunset, w: 16.5, h: 15, bg: 'bg-[#ffdcc5]' },
]

function playChime() {
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

export default function Step3Schedule() {
  const navigate = useNavigate()
  const p = loadProfile()
  const [workoutTime, setWorkoutTime] = useState(p?.workoutTime ?? 'morning')
  const [reminders, setReminders] = useState<boolean[]>(p?.reminders ?? [true, true, true])

  const finish = () => {
    saveProfile({ workoutTime, reminders, onboarded: true })
    if (reminders.some(Boolean) && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
    navigate('/', { replace: true })
  }

  return (
    <OnboardingShell step={3}>
      <div className="flex gap-4 overflow-hidden rounded-2xl bg-[#e9ddff] p-4 shadow-sm">
        <div className="relative shrink-0 self-start">
          <div className="size-14 overflow-hidden rounded-full bg-[#8455ef] shadow-md">
            <img src={coach} alt="FitJoy coach" className="size-full object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-1 rounded-full bg-[#ef8933] px-1.5 py-0.5 text-[10px] leading-[15px] text-[#5c2c00] shadow-sm">COACH</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#6b38d4]">FitJoy Coach</span>
          <p className="text-sm leading-[22.75px] font-medium text-[#23005c]">
            Almost at the finish line, {p?.name || 'friend'}! Pick your 3 ideal reminder slots to build and keep your <b className="font-bold text-[#6b38d4]">22-day streak</b> going! ⏰🔥
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-[20px] leading-7 font-bold tracking-[-0.5px]">Preferred Workout Time</h2>
        <div className="flex flex-col gap-2">
          {times.map(t => {
            const on = workoutTime === t.id
            return (
              <button
                key={t.id}
                onClick={() => setWorkoutTime(t.id)}
                aria-pressed={on}
                className={`flex items-center justify-between rounded-2xl bg-white p-4 text-left drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${on ? 'ring-2 ring-brand' : ''}`}
              >
                <span className="flex items-center gap-4">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${on ? t.onBg : 'bg-[#dee8ff]'}`}>
                    <img src={t.icon} alt="" style={{ width: t.size, height: t.size }} />
                  </span>
                  <span>
                    <span className="flex items-center gap-1">
                      <span className="text-base leading-5 font-bold tracking-[0.16px]">{t.title}</span>
                      <span className={`rounded-full bg-[#e7eeff] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] ${on ? 'text-[#006c49]' : 'text-[#3c4a42]'}`}>{t.time}</span>
                    </span>
                    <span className="block text-sm leading-[22.75px] text-[#3c4a42]">{t.desc}</span>
                  </span>
                </span>
                <span className={`ml-2 flex size-7 shrink-0 items-center justify-center rounded-full ${on ? 'bg-[#006c49]' : 'bg-[#e7eeff]'}`}>
                  <img src={on ? icCheckOn : icCheckOff} alt="" style={{ width: 12.225, height: 9.019 }} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="pb-1 text-[20px] leading-7 font-bold tracking-[-0.5px]">PWA Smart Reminders</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          {alerts.map((a, i) => (
            <div key={a.title} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className={`flex size-9 items-center justify-center rounded-full ${a.bg}`}>
                  <img src={a.icon} alt="" style={{ width: a.w, height: a.h }} />
                </span>
                <span>
                  <span className="block text-sm leading-[18px] font-semibold">{a.title}</span>
                  <span className="block text-sm leading-5 text-[#3c4a42]">{a.time}</span>
                </span>
              </span>
              <Switch label={a.title} on={reminders[i]} onChange={() => setReminders(r => r.map((v, j) => (j === i ? !v : v)))} />
            </div>
          ))}
          <div className="flex items-center justify-between rounded-[48px] bg-[#f0f3ff] p-2">
            <span className="flex items-center gap-2 pr-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#e9ddff]">
                <img src={icNote} alt="" style={{ width: 9, height: 13.5 }} />
              </span>
              <span>
                <span className="block text-xs leading-4 font-semibold tracking-[0.48px]">FitJoy Playful Chime</span>
                <span className="block text-[10px] leading-[15px] font-medium text-[#3c4a42]">Chime sound</span>
              </span>
            </span>
            <button onClick={playChime} className="flex items-center gap-1 rounded-full bg-[#e9ddff] px-3 py-1.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#23005c]">
              <img src={icSpeaker} alt="" style={{ width: 12, height: 11.667 }} />Test
            </button>
          </div>
        </div>
      </section>

      <div className="py-6">
        <PrimaryCta onClick={finish} icon={icArrow}>Complete &amp; Start Day 1</PrimaryCta>
      </div>
    </OnboardingShell>
  )
}
