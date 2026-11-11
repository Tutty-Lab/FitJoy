import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminSignOut } from '../services/adminApi'
import mascot from '../assets/home/mascot.png'

const nav = [
  { to: '/admin/licenses', label: 'Invitations', icon: '◇' },
  { to: '/admin/organizations', label: 'Organizations', icon: '◎' },
  { to: '/admin/audit', label: 'Audit log', icon: '≡' },
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/users', label: 'Users', icon: '◉' },
  { to: '/admin/workouts', label: 'Workouts', icon: '▶' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-dvh bg-[#fbf8f3] text-ink">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <img src={mascot} alt="" className="size-9" />
          <div>
            <div className="text-lg leading-5 font-black text-[#13707e]">FitJoy</div>
            <div className="text-xs leading-4 font-bold text-[#6f7472]">Admin console</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-mint text-[#13707e]' : 'text-[#3f4a4b] hover:bg-slate-100'}`}
            >
              <span aria-hidden className="w-4 text-center">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <NavLink to="/" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#3f4a4b] hover:bg-slate-100">← Open user app</NavLink>
          <button
            onClick={async () => {
              await adminSignOut()
              navigate('/login', { replace: true })
            }}
            className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#ba1a1a] hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Compact top nav for narrow screens */}
        <header className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="mr-2 text-base font-black text-[#13707e]">FitJoy Admin</span>
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-mint text-[#13707e]' : 'text-[#3f4a4b]'}`}>
              {n.label}
            </NavLink>
          ))}
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
