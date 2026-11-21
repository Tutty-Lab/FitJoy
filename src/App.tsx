import { syncWidget, widgetLaunchRoute } from './lib/widget'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Splash from './components/Splash'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Streak from './pages/Streak'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import BalanceCheck from './pages/check/BalanceCheck'
import Compare from './pages/check/Compare'
import DayReview from './pages/workouts/DayReview'
import WorkoutDetail from './pages/workouts/WorkoutDetail'
import Celebration from './pages/workouts/Celebration'
import Profile from './pages/Profile'
import Reminders from './pages/Reminders'
import Privacy from './pages/Privacy'
import Activate from './pages/Activate'
import { apiEnabled } from './lib/api'
import JoinOrganization from './pages/JoinOrganization'
import { loadProfile } from './lib/profile'
import { useReminderScheduler } from './lib/reminders'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function StreakRoute() {
  const up = new URLSearchParams(useLocation().search).get('up') === '1'
  return up ? <Streak /> : <><div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden"><Home /></div><Streak /></>
}

function CheckRoute() {
  const {phase}=useParams()
  return <BalanceCheck key={phase}/>
}

function RequireAuth({ onboarded }: { onboarded?: boolean }) {
  const p = loadProfile()
  if (!p?.email && !p?.username) return <Navigate to="/login" replace />
  if (apiEnabled && p.role !== 'admin' && !p.access?.active && !['/activate','/profile'].includes(window.location.pathname)) return <Navigate to="/activate" replace />
  if (onboarded && !p.gameOnboarded && window.location.pathname !== '/profile') return <Navigate to="/onboarding" replace />
  if (onboarded && window.location.pathname !== '/profile' && !p.checks?.start && !p.checkPostponed) return <Navigate to="/check/start" replace />
  return <Outlet />
}

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const openStreak = () => navigate('/streak')
    window.addEventListener('fitjoy:streak', openStreak)
    widgetLaunchRoute().then(route => { if (route === '/streak') navigate(route) })
    let dates: string[] = []
    try { dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]') } catch { /* empty */ }
    syncWidget(dates, Boolean(loadProfile()?.username || loadProfile()?.email))
    return () => { window.removeEventListener('fitjoy:streak', openStreak) }
  }, [navigate])
  useReminderScheduler()
  useEffect(() => {
    // The map positions itself on today's stop.
    if (pathname !== '/') window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
    <Splash />
    <div key={pathname === '/' || pathname === '/streak' ? 'home' : 'page'} className="route-enter">
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/join/:orgId/:code" element={<JoinOrganization />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/streak" element={<StreakRoute />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/check/:phase" element={<CheckRoute />} />
      </Route>
      <Route element={<RequireAuth onboarded />}>
        <Route element={<AppLayout />}>
          <Route path="/workouts/:day" element={<WorkoutDetail />} />
        </Route>
        <Route path="/celebrate/:day" element={<Celebration />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/days/:day" element={<DayReview />} />
          <Route path="/workouts" element={<Navigate to="/" replace />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/calendar" element={<Navigate to="/" replace />} />
          <Route path="/story" element={<Navigate to="/" replace />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </div>
    </>
  )
}
