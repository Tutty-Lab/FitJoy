import { NavLink, Outlet } from 'react-router-dom'
import { useCompleted } from '../lib/progress'
import mascot from '../assets/home/mascot.png'
import avatar from '../assets/home/avatar.png'
import navHome from '../assets/home/c29.svg'
import navWorkouts from '../assets/home/c30.svg'
import navReminders from '../assets/home/c31.svg'
import navProfile from '../assets/home/c32.svg'

const tabs = [
  { to: '/', label: 'Home', icon: navHome, w: 14.667, h: 16.5 },
  { to: '/workouts', label: 'Workouts', icon: navWorkouts, w: 19.8, h: 19.8 },
  { to: '/reminders', label: 'Reminders', icon: navReminders, w: 21.3, h: 19.65 },
  { to: '/profile', label: 'Profile', icon: navProfile, w: 20, h: 20 },
]

export default function AppLayout() {
  const { streak } = useCompleted()
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-canvas">
      <header className="sticky top-0 z-20 bg-[rgba(244,251,247,0.9)] pt-[env(safe-area-inset-top)] shadow-[0_2px_12px_rgba(16,185,129,0.08)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={mascot} alt="FitJoy" className="size-9 shadow-sm" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[20px] leading-5 font-black tracking-[-0.5px] text-[#006c49]">FitJoy</span>
                <span className="rounded-full bg-[rgba(0,108,73,0.1)] px-1.5 py-0.5 text-xs leading-4 font-bold tracking-[-0.5px] text-[#006c49]">3D</span>
              </div>
              <div className="text-xs leading-4 font-bold tracking-[0.48px] text-[#3c4a42]">Daily Wellness</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 rounded-full border border-[rgba(252,211,77,0.8)] bg-[rgba(254,243,199,0.9)] px-[11px] py-[5px] text-[#78350f] shadow-[0_2px_6px_rgba(245,158,11,0.2)]">
              <span className="text-base leading-6">🔥</span>
              <span className="text-[13px] leading-6 font-bold">{streak} {streak === 1 ? 'day' : 'days'}</span>
            </div>
            <NavLink to="/profile" aria-label="User profile" className="flex size-10 items-center justify-center p-1">
              <img src={avatar} alt="" className="size-8 rounded-full ring-2 ring-brand" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[440px] border-t border-mint bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(16,185,129,0.08)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center justify-around px-2">
          {tabs.map(t => (
            <NavLink key={t.to} to={t.to} end className="flex min-h-11 min-w-11 flex-col items-center justify-center px-2">
              {({ isActive }) => (
                <>
                  <span className={`flex size-8 items-center justify-center rounded-full ${isActive ? 'bg-mint' : ''}`}>
                    <img src={t.icon} alt="" style={{ width: t.w, height: t.h }} />
                  </span>
                  <span className={`pt-0.5 text-[11px] leading-4 ${isActive ? 'font-black text-brand-deep' : 'font-semibold text-slate-500'}`}>
                    {t.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
