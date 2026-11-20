import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import CartoonNavIcon, { type CartoonNavKind } from './CartoonNavIcon'
import { L } from '../lib/i18n'

const tabs: { to: string; label: string; icon: CartoonNavKind }[] = [
  { to: '/', label: L('Reise', 'Hành trình'), icon: 'journey' },
  { to: '/profile', label: L('Profil', 'Hồ sơ'), icon: 'profile' },
]

export default function AppLayout() {
  const pathname=useLocation().pathname
  const training = pathname.startsWith('/workouts/') || pathname.startsWith('/days/')
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-white">
      <div className="pt-[env(safe-area-inset-top)]" />

      <main className={training ? "pt-3 pb-6" : "pt-3 pb-28"}>
        <Outlet />
      </main>

      {/* Floating liquid-glass tab bar */}
      {!training && <nav aria-label={L('Hauptnavigation','Điều hướng chính')} className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[440px] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="relative flex h-[68px] items-center justify-around overflow-hidden rounded-[22px] border-2 border-line bg-white px-1.5 shadow-[0_10px_30px_rgba(19,112,126,0.18),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.35)] backdrop-blur-[22px] backdrop-saturate-[1.8]">
          <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-1/2 rounded-b-full bg-gradient-to-b from-white/60 to-transparent" />
          {tabs.map(t => (
            <NavLink key={t.to} to={t.to} end aria-label={t.label} title={t.label} className="relative z-10 flex h-14 flex-1 items-center justify-center rounded-2xl focus-visible:outline-3 focus-visible:outline-brand focus-visible:outline-offset-1">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="tab-glass"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-[28px] border border-white/80 bg-mint shadow-[0_4px_14px_rgba(19,112,126,0.22),inset_0_1px_0_rgba(255,255,255,1)]"
                    />
                  )}
                  <motion.span
                    animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className={`relative ${isActive ? 'text-brand-deep' : 'text-slate-500'}`}
                  >
                    <CartoonNavIcon kind={t.icon} />
                  </motion.span>

                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>}
    </div>
  )
}
