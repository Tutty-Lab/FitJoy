import { loadProfile } from '../lib/profile'
import BackArrow from './BackArrow'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Flame, Gem } from 'lucide-react'
import { useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'
import avatar from '../assets/profile/avatar.png'
import { StreakSheet } from '../pages/Streak'

// No bottom navigation: a slim header with back arrow (off the map), streak and account icon.
export default function AppLayout() {
  const { pathname, search } = useLocation()
  const streakOpen = pathname === '/' && new URLSearchParams(search).get('streak') === '1'
  const navigate = useNavigate()
  const { streak, doneToday } = useCompleted()
  const training = pathname.startsWith('/workouts/') || pathname.startsWith('/days/')
  const home = pathname === '/'
  const xp = loadProfile()?.xp ?? 0
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-white">
      {!training && (
        <header className="sticky top-0 z-30 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-3">
            {home ? <span /> : (
              <button type="button" aria-label={L('Zurück', 'Quay lại')} onClick={() => navigate(['/reminders', '/compare', '/privacy'].includes(pathname) ? '/profile' : '/', { replace: true })} className="cartoon-back">
                <BackArrow />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Link to="/?streak=1" aria-label={L(`${streak} Tage in Folge`, `${streak} ngày liên tiếp`)} className={`flex items-center gap-1 px-2 py-1 text-lg font-black ${doneToday ? 'text-orange-500' : 'text-slate-400'}`}>
                <Flame size={22} fill={doneToday ? 'currentColor' : 'none'} />{streak}
              </Link>
              <span aria-label={L(`${xp} Punkte`, `${xp} điểm`)} className="flex items-center gap-1 px-1 text-lg font-black text-sky-500"><Gem size={20} />{xp}</span>
              <Link to="/profile" aria-label={L('Profil', 'Hồ sơ')} className="rounded-full">
                <img src={avatar} alt="" className="size-9 rounded-full object-cover ring-2 ring-mint" />
              </Link>
            </div>
          </div>
        </header>
      )}
      {training && <div className="pt-[env(safe-area-inset-top)]" />}
      <main className={training ? 'pt-3 pb-6' : 'pt-1 pb-[calc(env(safe-area-inset-bottom)+24px)]'}>
        <Outlet />
      </main>
      {streakOpen && <StreakSheet />}
    </div>
  )
}
