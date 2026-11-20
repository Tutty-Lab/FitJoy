import { Link, Outlet, useLocation } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { useCompleted } from '../lib/progress'
import { loadProfile } from '../lib/profile'
import { L } from '../lib/i18n'
import avatar from '../assets/profile/avatar.png'

// No bottom navigation: a slim header carries the account (to the profile) and the streak.
export default function AppLayout() {
  const pathname = useLocation().pathname
  const { streak, doneToday } = useCompleted()
  const training = pathname.startsWith('/workouts/') || pathname.startsWith('/days/')
  const p = loadProfile()
  const name = p?.name || p?.username || ''
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-white">
      {!training && (
        <header className="sticky top-0 z-30 border-b-2 border-mint bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <Link to="/profile" aria-label={L('Profil', 'Hồ sơ')} className="flex min-w-0 items-center gap-2 rounded-full py-1 pr-3 pl-1 hover:bg-mint">
              <img src={avatar} alt="" className="size-9 shrink-0 rounded-full object-cover ring-2 ring-mint" />
              <span className="truncate font-black">{name || L('Profil', 'Hồ sơ')}</span>
            </Link>
            <Link to="/streak" aria-label={L(`${streak} Tage in Folge`, `${streak} ngày liên tiếp`)} className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 font-black ${doneToday ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
              <Flame size={18} fill={doneToday ? 'currentColor' : 'none'} />{streak}
            </Link>
          </div>
        </header>
      )}
      {training && <div className="pt-[env(safe-area-inset-top)]" />}
      <main className={training ? 'pt-3 pb-6' : 'pt-3 pb-[calc(env(safe-area-inset-bottom)+24px)]'}>
        <Outlet />
      </main>
    </div>
  )
}
