import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Step1Goals from './pages/onboarding/Step1Goals'
import Step2Measurements from './pages/onboarding/Step2Measurements'
import Step3Schedule from './pages/onboarding/Step3Schedule'
import Library from './pages/workouts/Library'
import WorkoutDetail from './pages/workouts/WorkoutDetail'
import Profile from './pages/Profile'
import Reminders from './pages/Reminders'
import HealthProfile from './pages/HealthProfile'
import Results from './pages/Results'
import Celebration from './pages/workouts/Celebration'
import Privacy from './pages/Privacy'
import { loadProfile } from './lib/profile'
import { useReminderScheduler } from './lib/reminders'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function RequireAuth({ onboarded }: { onboarded?: boolean }) {
  const p = loadProfile()
  if (!p?.email) return <Navigate to="/login" replace />
  if (onboarded && !p.onboarded) return <Navigate to="/onboarding/1" replace />
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
        <Route path="/onboarding/1" element={<Step1Goals />} />
        <Route path="/onboarding/2" element={<Step2Measurements />} />
        <Route path="/onboarding/3" element={<Step3Schedule />} />
      </Route>
      <Route element={<RequireAuth onboarded />}>
        <Route path="/workouts/:day" element={<WorkoutDetail />} />
        <Route path="/celebrate/:day" element={<Celebration />} />
        <Route path="/profile/health" element={<HealthProfile />} />
        <Route path="/results" element={<Results />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Library />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
