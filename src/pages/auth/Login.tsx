import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadProfile } from '../../lib/profile'
import { signIn } from '../../services/auth'
import { api } from '../../lib/api'
import sprout from '../../assets/home/mascot.png'
import icHeart from '../../assets/auth/l-heart.svg'
import icClear from '../../assets/auth/l-clear.svg'
import icEye from '../../assets/auth/eye.svg'
import { L } from '../../lib/i18n'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await signIn(username, password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    const invite = new URLSearchParams(location.search).get('invite')
    if (invite) { try { await api('redeem', { method: 'POST', body: { code: invite } }) } catch (e) { return setError(e instanceof Error ? e.message : L('Einladung konnte nicht eingelöst werden', 'Không thể dùng mã mời')) } }
    const profile = loadProfile()
    navigate(profile?.role === 'admin' ? '/admin' : !profile?.gameOnboarded ? '/onboarding' : profile?.checks?.start || profile?.checkPostponed ? '/' : '/check/start', { replace: true })
  }

  return (
    <div className="stagger mx-auto min-h-dvh max-w-[440px] bg-white px-4 pt-[calc(env(safe-area-inset-top)+64px)] pb-9">
      <section className="relative mb-4 flex flex-col gap-2 overflow-hidden rounded-[28px] border-2 border-mint bg-[#f3f6f5] p-4 shadow-[0_4px_0_#cfe7e5]">
        <div className="absolute -top-8 -right-8 size-36 rounded-full bg-[#ffe3d3] opacity-40 blur-[40px]" />
        <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-[#ffece1] opacity-30 blur-[24px]" />
        <div className="relative flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1 pr-2">
            <span className="rounded-full bg-[rgba(238,122,63,0.3)] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#0b4a54]">Der Gleichgewichts-Code</span>
            <h1 className="pt-0.5 text-2xl leading-8 font-bold tracking-[-0.6px]">{L('Willkommen zurück!', 'Chào mừng bạn quay lại!')}</h1>
          </div>
          <div className="float relative size-24 shrink-0 overflow-hidden rounded-2xl bg-white p-1.5 shadow-md">
            <img src={sprout} alt="Vestibu" className="size-full rounded-[48px] object-cover" />
            <span className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-brand shadow-sm">
              <img src={icHeart} alt="" style={{ width: 10, height: 9.175 }} />
            </span>
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-[28px] bg-white p-6 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <div className="flex flex-col gap-1.5">
          <span className="relative">
            <input
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={L('Benutzername', 'Tên đăng nhập')} aria-label={L('Benutzername', 'Tên đăng nhập')}
              className="h-[52px] w-full rounded-2xl bg-[#f3f6f5] pr-12 pl-4 text-base outline-none focus:ring-2 focus:ring-brand"
            />
            {username && (
              <button type="button" aria-label={L('Benutzername löschen', 'Xóa tên đăng nhập')} onClick={() => setUsername('')} className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1">
                <img src={icClear} alt="" className="size-[15px]" />
              </button>
            )}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="relative">
            <input
              id="pw"
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder={L('Passwort', 'Mật khẩu')}
              aria-label={L('Passwort', 'Mật khẩu')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-[52px] w-full rounded-2xl bg-[#f3f6f5] pr-12 pl-4 text-base tracking-[0.8px] outline-none focus:ring-2 focus:ring-brand"
            />
            <button type="button" aria-label={showPw ? L('Passwort verbergen', 'Ẩn mật khẩu') : L('Passwort anzeigen', 'Hiện mật khẩu')} onClick={() => setShowPw(v => !v)} className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1">
              <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
            </button>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">

        <Link to="/signup" className="text-sm font-bold text-brand-deep">{L('Registrieren', 'Đăng ký')}</Link>
        </div>

        {error && <p role="alert" className="text-sm text-[#ba1a1a]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-1 flex items-center justify-center gap-2 px-6 py-3.5 text-base cursor-pointer rounded-2xl bg-brand-deep font-black tracking-wide text-white uppercase shadow-[0_4px_0_#0b4a54] transition-transform duration-150 active:translate-y-[3px] active:shadow-[0_1px_0_#0b4a54]"
        >
          {busy && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {busy ? L('Anmelden…', 'Đang đăng nhập…') : L('Anmelden', 'Đăng nhập')}
        </button>

      </form>
    </div>
  )
}
