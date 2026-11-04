import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import BalanceCheck from './pages/check/BalanceCheck'
import Compare from './pages/check/Compare'
import Library from './pages/workouts/Library'
import WorkoutDetail from './pages/workouts/WorkoutDetail'
import Celebration from './pages/workouts/Celebration'
import Profile from './pages/Profile'
import Reminders from './pages/Reminders'
import Privacy from './pages/Privacy'
import { loadProfile } from './lib/profile'
import { useReminderScheduler } from './lib/reminders'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function RequireAuth({ onboarded }: { onboarded?: boolean }) {
  const p = loadProfile()
  if (!p?.email) return <Navigate to="/login" replace />
  if (onboarded && !p.checks?.start) return <Navigate to="/check/start" replace />
  return <Outlet />
}

export default function App() {
  const { pathname } = useLocation()
  useReminderScheduler()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route element={<RequireAuth />}>
        <Route path="/check/:phase" element={<BalanceCheck />} />
      </Route>
      <Route element={<RequireAuth onboarded />}>
        <Route path="/workouts/:day" element={<WorkoutDetail />} />
        <Route path="/celebrate/:day" element={<Celebration />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Library />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
