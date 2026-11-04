import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Switch } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import { deleteAccount, signOutEverywhere } from '../services/auth'
import { applyTheme } from '../lib/theme'
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

function Row({ icon, iconBg, title, right, to, onClick }: { icon: ReactNode; iconBg: string; title: string; right?: ReactNode; to?: string; onClick?: () => void }) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>{icon}</span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-base leading-6 font-semibold">{title}</span>
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
      <h3 className="px-2 pb-1 text-xs leading-4 font-bold tracking-[0.6px] text-[#6f7472] uppercase">{title}</h3>
      <div className="divide-y divide-[#f3f6f5] overflow-hidden rounded-[32px] bg-white shadow-sm [&>*]:mx-0">{children}</div>
    </section>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [p, setP] = useState(() => loadProfile())

  const toggle = (key: 'pushAlerts' | 'chime' | 'darkMode', fallback: boolean) => {
    const next = !(p?.[key] ?? fallback)
    if (key === 'pushAlerts' && next && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
    setP(saveProfile({ [key]: next }))
    if (key === 'darkMode') applyTheme(next)
  }

  function backup() {
    const data = { profile: loadProfile(), exportedAt: new Date().toISOString() }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'fitjoy-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function logout() {
    await signOutEverywhere()
    applyTheme(false)
    navigate('/login', { replace: true })
  }

  async function removeAccount() {
    if (!window.confirm('Delete your FitJoy account and all progress? This cannot be undone.')) return
    const r = await deleteAccount()
    if (!r.ok) return window.alert(r.error)
    applyTheme(false)
    navigate('/signup', { replace: true })
  }

  return (
    <div className="stagger flex flex-col gap-6 bg-[#fbf8f3] px-4 pt-2 pb-6">
      <section className="relative overflow-hidden rounded-[48px] bg-white p-6 shadow-[0_20px_25px_-5px_rgba(200,220,218,0.4),0_8px_10px_-6px_rgba(200,220,218,0.4)]">
        <div className="absolute -top-12 -right-12 size-44 rounded-full bg-[rgba(255,227,211,0.3)] blur-[40px]" />
        <div className="absolute bottom-0 -left-8 size-36 rounded-full bg-[rgba(255,236,225,0.4)] blur-[24px]" />
        <div className="relative flex flex-col items-center">
          <div className="relative mb-4">
            <div className="size-24 rounded-full bg-[#f3f6f5] p-1 shadow-[0_10px_15px_-3px_rgba(19,112,126,0.2)]">
              <img src={avatar} alt="" className="size-full rounded-full object-cover" />
            </div>
            <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-[#13707e] shadow-[0_4px_6px_-1px_rgba(19,112,126,0.4)]">
              <img src={iStar} alt="" style={{ width: 15, height: 14.25 }} />
            </span>
          </div>
          <h2 className="pb-1 text-2xl leading-8 font-bold tracking-[-0.6px]">{p?.name || 'FitJoy friend'}</h2>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <Group title="Balance">
          <Row
            to="/compare"
            icon={<img src={iGoal} alt="" style={{ width: 12.5, height: 14.167 }} />}
            iconBg="bg-[rgba(255,227,211,0.3)]"
            title="Balance Check"
            right={<span className="flex items-center gap-1"><span className="rounded-full bg-[#ffe3d3] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#0b4a54]">Active</span><Chevron /></span>}
          />
        </Group>

        <Group title="Notifications & PWA">
          <Row to="/reminders" icon={<img src={iClock} alt="" className="size-[16.667px]" />} iconBg="bg-[rgba(255,236,225,0.3)]" title="Reminder Times" />
          <Row
            icon={<img src={iPhone} alt="" style={{ width: 12.5, height: 18.333 }} />}
            iconBg="bg-[rgba(255,236,225,0.3)]"
            title="Lock Screen Notifications"
            right={<Switch label="Lock screen notifications" on={p?.pushAlerts ?? true} onChange={() => toggle('pushAlerts', true)} />}
          />
          <Row
            icon={<img src={iSound} alt="" style={{ width: 15, height: 14.583 }} />}
            iconBg="bg-[rgba(255,236,225,0.3)]"
            title="Chime Sound"
            right={<Switch label="Chime sound" on={p?.chime ?? true} onChange={() => toggle('chime', true)} />}
          />
        </Group>

        <Group title="Preferences">
          <Row icon={<img src={iLang} alt="" style={{ width: 18.417, height: 16.667 }} />} iconBg="bg-[rgba(255,220,197,0.4)]" title="Language" />
          <Row
            icon={<img src={iMoon} alt="" className="size-[15px]" />}
            iconBg="bg-[#e7efee]"
            title="Dark Mode"
            right={<Switch label="Dark mode" on={p?.darkMode ?? false} onChange={() => toggle('darkMode', false)} />}
          />
        </Group>

        <Group title="Support & Data">
          <Row onClick={backup} icon={<img src={iBackup} alt="" style={{ width: 16.667, height: 13.333 }} />} iconBg="bg-[#f3f6f5]" title="Backup Health Data" />
          <Row to="/privacy" icon={<img src={iInfo} alt="" className="size-[16.667px]" />} iconBg="bg-[#f3f6f5]" title="Privacy Policy" />
        </Group>
      </div>

      <div className="flex flex-col items-center gap-1 pt-2 pb-4">
        <button onClick={logout} className="flex items-center gap-1 rounded-full px-6 py-2.5 text-sm leading-[18px] font-bold text-[#ba1a1a]">
          <img src={iLogout} alt="" className="size-[15px]" />Log Out
        </button>
        <button onClick={removeAccount} className="rounded-full px-6 py-2 text-xs leading-4 font-medium text-[#6f7472] underline">
          Delete account
        </button>
      </div>
    </div>
  )
}
