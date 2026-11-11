import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { isAdmin } from '../services/adminApi'
import AdminLayout from './AdminLayout'
import Licenses from './pages/Licenses'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Workouts from './pages/Workouts'
import WorkoutEdit from './pages/WorkoutEdit'
import Organizations from './pages/Organizations'
import Audit from './pages/Audit'
import OrganizationDetail from './pages/OrganizationDetail'

function RequireAdmin() {
  return isAdmin() ? <Outlet /> : <Navigate to="/login" replace />
}

// Mounted at /admin/* and lazy-loaded, so none of this ships in the user app bundle.
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Navigate to="/login" replace />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="licenses" element={<Licenses />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="organizations/:id" element={<OrganizationDetail />} />
          <Route path="audit" element={<Audit />} />
          <Route path="users" element={<Users />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="workouts/:day" element={<WorkoutEdit />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
