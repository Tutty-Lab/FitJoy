import LanguagePicker from '../components/LanguagePicker'
import { useCompleted } from '../lib/progress'
import { useState, type ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Switch } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import { signOutEverywhere } from '../services/auth'
import { applyTheme } from '../lib/theme'
import avatar from '../assets/profile/avatar.png'
import sWorkouts from '../assets/profile/s-workouts.svg'
import sMins from '../assets/profile/s-mins.svg'
import sKcal from '../assets/profile/s-kcal.svg'
import iHealth from '../assets/profile/i-health.svg'
import iGoal from '../assets/profile/i-goal.svg'
import iPhone from '../assets/profile/i-phone.svg'
import iSound from '../assets/profile/i-sound.svg'
import iLang from '../assets/profile/i-lang.svg'
import iMoon from '../assets/profile/i-moon.svg'
import iInfo from '../assets/profile/i-info.svg'
import iTrophy from '../assets/profile/i-trophy.svg'
import iFlame from '../assets/profile/i-flame.svg'
import iStar from '../assets/profile/i-star.svg'
import { ChevronRight } from 'lucide-react'
import { L } from '../lib/i18n'

const Chevron = () => <ChevronRight aria-hidden="true" className="size-4 text-slate-400" />

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
      <div className="divide-y divide-[#f3f6f5] overflow-hidden rounded-[28px] bg-white border-2 border-mint shadow-[0_4px_0_#cfe7e5] [&>*]:mx-0">{children}</div>
    </section>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const {completed,dates}=useCompleted()
  const [p, setP] = useState(() => loadProfile())

  const toggle = (key: 'pushAlerts' | 'chime' | 'darkMode', fallback: boolean) => {
    const next = !(p?.[key] ?? fallback)
    if (key === 'pushAlerts' && next && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
    setP(saveProfile({ [key]: next }))
    if (key === 'darkMode') applyTheme(next)
  }


  async function logout() {
    await signOutEverywhere()
    applyTheme(false)
    navigate('/login', { replace: true })
  }



  return (
    <div className="stagger flex flex-col gap-6 px-4 pt-2 pb-6">

      <div className="flex flex-col gap-4">
        <Link to="/onboarding" className="game-secondary">{L('Einführung noch einmal ansehen', 'Xem lại phần giới thiệu')}</Link>
        <Group title={L('Gleichgewicht', 'Thăng bằng')}>
          <Row
            to="/compare"
            icon={<img src={iGoal} alt="" style={{ width: 12.5, height: 14.167 }} />}
            iconBg="bg-[rgba(255,227,211,0.3)]"
            title={L('Meine Ergebnisse', 'Kết quả của tôi')}
          />
        </Group>

        <Group title={L('Benachrichtigungen', 'Thông báo')}>
          <Row to="/reminders" icon={<img src={iPhone} alt="" className="size-4" />} iconBg="bg-mint" title={L('Erinnerungszeiten', 'Giờ nhắc tập')} />
          <Row
            icon={<img src={iPhone} alt="" style={{ width: 12.5, height: 18.333 }} />}
            iconBg="bg-[rgba(255,236,225,0.3)]"
            title={L('Erinnerungen bei geöffneter App', 'Nhắc khi ứng dụng đang mở')}
            right={<Switch label={L('Erinnerungen bei geöffneter App', 'Nhắc khi ứng dụng đang mở')} on={p?.pushAlerts ?? true} onChange={() => toggle('pushAlerts', true)} />}
          />
          <Row
            icon={<img src={iSound} alt="" style={{ width: 15, height: 14.583 }} />}
            iconBg="bg-[rgba(255,236,225,0.3)]"
            title={L('Signalton', 'Âm báo')}
            right={<Switch label={L('Signalton', 'Âm báo')} on={p?.chime ?? true} onChange={() => toggle('chime', true)} />}
          />
        </Group>

        <Group title={L('Einstellungen', 'Cài đặt')}>
          <div className="p-4"><LanguagePicker /></div>
          <Row
            icon={<img src={iMoon} alt="" className="size-[15px]" />}
            iconBg="bg-[#e7efee]"
            title={L('Dunkelmodus', 'Chế độ tối')}
            right={<Switch label={L('Dunkelmodus', 'Chế độ tối')} on={p?.darkMode ?? false} onChange={() => toggle('darkMode', false)} />}
          />
        </Group>

        <Group title={L('Hilfe & Daten', 'Hỗ trợ & dữ liệu')}>
          <Row to="/privacy" icon={<img src={iInfo} alt="" className="size-[16.667px]" />} iconBg="bg-[#f3f6f5]" title={L('Datenschutz', 'Chính sách bảo mật')} />
        </Group>
      </div>

      <Group title={L('Konto', 'Tài khoản')}>
        <Row
          onClick={logout}
          icon={<LogOut aria-hidden="true" className="size-4 text-[#ba1a1a] dark:text-red-300" />}
          iconBg="bg-red-50 dark:bg-red-950/40"
          title={L('Abmelden', 'Đăng xuất')}
        />
      </Group>
    </div>
  )
}
