import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Switch } from '../components/shared'
import { loadProfile, saveProfile, signOut } from '../lib/profile'
import { useCompleted } from '../lib/progress'
import avatar from '../assets/profile/avatar.png'
import sWorkouts from '../assets/profile/s-workouts.svg'
import sMins from '../assets/profile/s-mins.svg'
import sKcal from '../assets/profile/s-kcal.svg'
import iHealth from '../assets/profile/i-health.svg'
import iGoal from '../assets/profile/i-goal.svg'
import iClock from '../assets/profile/i-clock.svg'
import iPhone from '../assets/profile/i-phone.svg'
import iSound from '../assets/profile/i-sound.svg'
import iLang from '../assets/profile/i-lang.svg'
import iMoon from '../assets/profile/i-moon.svg'
import iBackup from '../assets/profile/i-backup.svg'
import iInfo from '../assets/profile/i-info.svg'
import iLogout from '../assets/profile/i-logout.svg'
import iTrophy from '../assets/profile/i-trophy.svg'
import iFlame from '../assets/profile/i-flame.svg'
import iStar from '../assets/profile/i-star.svg'
import chevron from '../assets/profile/chevron.svg'

const Chevron = () => <img src={chevron} alt="" style={{ width: 6.167, height: 10 }} />

function Row({ icon, iconBg, title, sub, right, to, onClick }: { icon: ReactNode; iconBg: string; title: string; sub: string; right?: ReactNode; to?: string; onClick?: () => void }) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>{icon}</span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-base leading-6 font-semibold">{title}</span>
          <span className="block truncate text-sm leading-5 text-[#6c7a71]">{sub}</span>
        </span>
      </span>
      {right ?? <Chevron />}
    </>
  )
  const cls = 'flex w-full items-center justify-between gap-2 p-4'
  if (to) return <Link to={to} className={cls}>{body}</Link>
  if (onClick) return <button onClick={onClick} className={cls}>{body}</button>
  return <div className={cls}>{body}</div>
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="px-2 pb-1 text-xs leading-4 font-bold tracking-[0.6px] text-[#6c7a71] uppercase">{title}</h3>
      <div className="divide-y divide-[#f0f3ff] overflow-hidden rounded-[32px] bg-white shadow-sm [&>*]:mx-0">{children}</div>
    </section>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [p, setP] = useState(() => loadProfile())
  const { completed, streak, mins, kcal, xp, level } = useCompleted()
  const done = completed
  const activeReminders = (p?.reminders ?? [true, true, true]).filter(Boolean).length

  const toggle = (key: 'pushAlerts' | 'chime' | 'darkMode', fallback: boolean) => {
    const next = !(p?.[key] ?? fallback)
    if (key === 'pushAlerts' && next && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
    setP(saveProfile({ [key]: next }))
  }

  function backup() {
    const data = { profile: loadProfile(), completed, exportedAt: new Date().toISOString() }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'fitjoy-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function logout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="stagger flex flex-col gap-6 bg-[#f9f9ff] px-4 pt-2 pb-6">
      <section className="relative overflow-hidden rounded-[48px] bg-white p-6 shadow-[0_20px_25px_-5px_rgba(216,227,251,0.4),0_8px_10px_-6px_rgba(216,227,251,0.4)]">
        <div className="absolute -top-12 -right-12 size-44 rounded-full bg-[rgba(111,251,190,0.3)] blur-[40px]" />
        <div className="absolute bottom-0 -left-8 size-36 rounded-full bg-[rgba(233,221,255,0.4)] blur-[24px]" />
        <div className="relative flex flex-col items-center">
          <div className="relative mb-4">
            <div className="size-24 rounded-full bg-[#f0f3ff] p-1 shadow-[0_10px_15px_-3px_rgba(16,185,129,0.2)]">
              <img src={avatar} alt="" className="size-full rounded-full object-cover" />
            </div>
            <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-[#006c49] shadow-[0_4px_6px_-1px_rgba(0,108,73,0.4)]">
              <img src={iStar} alt="" style={{ width: 15, height: 14.25 }} />
            </span>
          </div>
          <h2 className="pb-1 text-2xl leading-8 font-bold tracking-[-0.6px]">{p?.name || 'FitJoy friend'}</h2>
          <span className="mb-2 flex items-center gap-1 rounded-full bg-[#dee8ff] px-4 py-1.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#3c4a42]">
            <img src={iTrophy} alt="" style={{ width: 7.5, height: 15 }} />Level {level} • Active Warrior • {xp} XP
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#ffdcc5] px-4 py-1 text-sm leading-[18px] font-semibold text-[#301400]">
            <img src={iFlame} alt="" style={{ width: 12, height: 13.5 }} />{streak}-Day Streak
          </span>
        </div>
      </section>

      <div className="flex gap-1">
        {[
          { icon: sWorkouts, w: 16.5, h: 16.5, bg: 'bg-[rgba(111,251,190,0.4)]', v: done.length, l: 'Workouts' },
          { icon: sMins, w: 15, h: 17.5, bg: 'bg-[rgba(233,221,255,0.5)]', v: mins, l: 'Mins' },
          { icon: sKcal, w: 13.333, h: 16.667, bg: 'bg-[rgba(255,220,197,0.6)]', v: kcal.toLocaleString('en-US'), l: 'kcal' },
        ].map(s => (
          <div key={s.l} className="flex flex-1 flex-col items-center justify-center rounded-[32px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <span className={`mb-1 flex size-10 items-center justify-center rounded-full ${s.bg}`}>
              <img src={s.icon} alt="" style={{ width: s.w, height: s.h }} />
            </span>
            <span className="text-base leading-5 font-bold tracking-[0.16px]">{s.v}</span>
            <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Group title="Account & Health">
          <Row to="/profile/health" icon={<img src={iHealth} alt="" className="size-[13.333px]" />} iconBg="bg-[rgba(111,251,190,0.3)]" title="Personal Health Profile" sub="Weight, height & biometrics" />
          <Row
            to="/onboarding/1"
            icon={<img src={iGoal} alt="" style={{ width: 12.5, height: 14.167 }} />}
            iconBg="bg-[rgba(111,251,190,0.3)]"
            title="Daily Goals"
            sub="15 mins / day routine"
            right={<span className="flex items-center gap-1"><span className="rounded-full bg-[#6ffbbe] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#002113]">Active</span><Chevron /></span>}
          />
        </Group>

        <Group title="Notifications & PWA">
          <Row to="/reminders" icon={<img src={iClock} alt="" className="size-[16.667px]" />} iconBg="bg-[rgba(233,221,255,0.3)]" title="Reminder Times" sub={`${activeReminders} reminders set daily`} />
          <Row
            icon={<img src={iPhone} alt="" style={{ width: 12.5, height: 18.333 }} />}
            iconBg="bg-[rgba(233,221,255,0.3)]"
            title="Lock Screen Notifications"
            sub="Instant push alerts"
            right={<Switch label="Lock screen notifications" on={p?.pushAlerts ?? true} onChange={() => toggle('pushAlerts', true)} />}
          />
          <Row
            icon={<img src={iSound} alt="" style={{ width: 15, height: 14.583 }} />}
            iconBg="bg-[rgba(233,221,255,0.3)]"
            title="Chime Sound"
            sub="Play joyful workout chime"
            right={<Switch label="Chime sound" on={p?.chime ?? true} onChange={() => toggle('chime', true)} />}
          />
        </Group>

        <Group title="Preferences">
          <Row icon={<img src={iLang} alt="" style={{ width: 18.417, height: 16.667 }} />} iconBg="bg-[rgba(255,220,197,0.4)]" title="Language" sub="English (US)" />
          <Row
            icon={<img src={iMoon} alt="" className="size-[15px]" />}
            iconBg="bg-[#d8e3fb]"
            title="Dark Mode"
            sub={p?.darkMode ? 'Currently On' : 'Currently Off'}
            right={<Switch label="Dark mode" on={p?.darkMode ?? false} onChange={() => toggle('darkMode', false)} />}
          />
        </Group>

        <Group title="Support & Data">
          <Row onClick={backup} icon={<img src={iBackup} alt="" style={{ width: 16.667, height: 13.333 }} />} iconBg="bg-[#e7eeff]" title="Backup Health Data" sub="Download a copy of your data" />
          <Row icon={<img src={iInfo} alt="" className="size-[16.667px]" />} iconBg="bg-[#e7eeff]" title="About FitJoy PWA" sub="v0.1.0 (MVP)" />
        </Group>
      </div>

      <div className="flex justify-center pt-2 pb-4">
        <button onClick={logout} className="flex items-center gap-1 rounded-full px-6 py-2.5 text-sm leading-[18px] font-bold text-[#ba1a1a]">
          <img src={iLogout} alt="" className="size-[15px]" />Log Out
        </button>
      </div>
    </div>
  )
}
