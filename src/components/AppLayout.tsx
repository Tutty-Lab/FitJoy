import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'
import navHome from '../assets/home/c29.svg'
import navWorkouts from '../assets/home/c30.svg'
import navReminders from '../assets/home/c31.svg'
import navProfile from '../assets/home/c32.svg'

const tabs = [
  { to: '/', label: 'Home', icon: navHome, w: 14.667, h: 16.5 },
  { to: '/workouts', label: 'Lessons', icon: navWorkouts, w: 19.8, h: 19.8 },
  { to: '/reminders', label: 'Reminders', icon: navReminders, w: 21.3, h: 19.65 },
  { to: '/profile', label: 'Profile', icon: navProfile, w: 20, h: 20 },
]

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-canvas">
      <div className="pt-[env(safe-area-inset-top)]" />

      <main className="pb-28">
        <Outlet />
      </main>

      {/* Floating liquid-glass tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[440px] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="relative flex h-[68px] items-center justify-around overflow-hidden rounded-[34px] border border-white/60 bg-white/35 px-1.5 shadow-[0_10px_30px_rgba(19,112,126,0.18),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.35)] backdrop-blur-[22px] backdrop-saturate-[1.8]">
          <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-1/2 rounded-b-full bg-gradient-to-b from-white/60 to-transparent" />
          {tabs.map(t => (
            <NavLink key={t.to} to={t.to} end className="relative z-10 flex h-14 flex-1 flex-col items-center justify-center">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="tab-glass"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-[28px] border border-white/80 bg-white/60 shadow-[0_4px_14px_rgba(19,112,126,0.22),inset_0_1px_0_rgba(255,255,255,1)]"
                    />
                  )}
                  <motion.img
                    src={t.icon}
                    alt=""
                    animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="relative"
                    style={{ width: t.w, height: t.h }}
                  />
                  <span className={`relative pt-1 text-[11px] leading-4 ${isActive ? 'font-black text-brand-deep' : 'font-semibold text-slate-600'}`}>
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
