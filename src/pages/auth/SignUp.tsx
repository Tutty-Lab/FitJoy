import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthTabs from './AuthTabs'
import { signUp } from '../../services/auth'
import { api } from '../../lib/api'
import sprout from '../../assets/home/mascot.png'
import icLeaf from '../../assets/auth/s-leaf.svg'
import { ArrowRight, ChevronRight } from 'lucide-react'
import icUser from '../../assets/auth/s-user.svg'
import icOk from '../../assets/auth/s-ok.svg'
import icVerified from '../../assets/auth/s-verified.svg'
import icLock from '../../assets/auth/s-lock.svg'
import icLockReset from '../../assets/auth/s-lockreset.svg'
import icEye from '../../assets/auth/eye.svg'
import icShield from '../../assets/auth/s-shield.svg'
import icMatch from '../../assets/auth/s-match.svg'
import { L } from '../../lib/i18n'

function Field({ icon, children, trailing }: { label: string; aside?: ReactNode; icon: ReactNode; children: ReactNode; trailing?: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex h-[52px] items-center rounded-2xl bg-[#f3f6f5] px-4 focus-within:ring-2 focus-within:ring-brand">
        {icon}
        {children}
        {trailing}
      </span>
    </label>
  )
}

const input = 'min-w-0 flex-1 bg-transparent px-3 py-2 text-base leading-6 outline-none'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [agree, setAgree] = useState(false)

  const usernameOk = username.trim().length > 0 && username.trim().length <= 64
  const match = pw2.length > 0 && pw === pw2
  const canSubmit = name.trim() && usernameOk && pw.length > 0 && match && agree

  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit || busy) return
    setBusy(true)
    setError('')
    const res = await signUp(name.trim(), username, pw)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    const invite = new URLSearchParams(location.search).get('invite')
    if (invite) { try { await api('redeem', { method: 'POST', body: { code: invite } }) } catch (e) { return setError(e instanceof Error ? e.message : L('Einladung konnte nicht eingelöst werden', 'Không thể dùng mã mời')) } }
    navigate('/onboarding')
  }

  const okMark = <img src={icOk} alt="" style={{ width: 17.583, height: 14.021 }} />

  return (
    <div className="stagger mx-auto min-h-dvh max-w-[440px] bg-white px-4 pt-[calc(env(safe-area-inset-top)+64px)] pb-8">
      <section className="relative mt-2 flex flex-col gap-2 overflow-hidden rounded-[28px] bg-white p-6 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-[rgba(255,227,211,0.3)] blur-[40px]" />
        <div className="absolute -top-6 -left-6 size-28 rounded-full bg-[rgba(255,236,225,0.4)] blur-[24px]" />
        <div className="relative flex items-start justify-between">
          <div className="max-w-[210px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffe3d3] px-2.5 py-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#0b4a54]">
              <img src={icLeaf} alt="" style={{ width: 11.362, height: 11.35 }} />Der Gleichgewichts-Code
            </span>
            <h1 className="pt-1 text-2xl leading-8 font-bold tracking-[-0.6px]">{L('Erstelle dein Konto!', 'Tạo tài khoản của bạn!')}</h1>
          </div>
          <div className="relative flex size-24 shrink-0 items-center justify-center">
            <div className="size-20 overflow-hidden rounded-2xl bg-[#e7efee] p-1 shadow-inner">
              <img src={sprout} alt="Vestibu" className="size-full rounded-[48px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-4">
        <AuthTabs active="signup" />
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-4 rounded-[28px] bg-white p-6 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <Field
          label="Full Name"
          aside={name.trim() && (
            <span className="flex items-center gap-0.5 text-[11px] leading-4 font-medium tracking-[0.48px] text-[#13707e]">
              <ChevronRight aria-hidden="true" className="size-3" />{L('Profil bereit', 'Hồ sơ sẵn sàng')}
            </span>
          )}
          icon={<img src={icUser} alt="" style={{ width: 21.333, height: 13.333 }} />}
          trailing={name.trim() ? okMark : null}
        >
          <input className={input} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required placeholder={L('Vollständiger Name', 'Họ và tên')} aria-label={L('Vollständiger Name', 'Họ và tên')} />
        </Field>

        <Field
          label="Username"
          icon={<img src={icUser} alt="" style={{ width: 24.667, height: 16.667 }} />}
          trailing={usernameOk ? <img src={icVerified} alt="" style={{ width: 18.333, height: 17.5 }} /> : null}
        >
          <input className={input} type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={64} required placeholder={L('Benutzername', 'Tên đăng nhập')} aria-label={L('Benutzername', 'Tên đăng nhập')} />
        </Field>

        <div className="flex flex-col gap-1">
          <Field
            label="Create Password"
            icon={<img src={icLock} alt="" style={{ width: 21.333, height: 17.5 }} />}
            trailing={
              <button type="button" aria-label={L('Passwort anzeigen', 'Hiện mật khẩu')} onClick={() => setShow(v => !v)} className="p-1">
                <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
              </button>
            }
          >
            <input className={`${input} font-mono tracking-[1.6px]`} type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" required placeholder={L('Passwort', 'Mật khẩu')} aria-label={L('Passwort', 'Mật khẩu')} />
          </Field>
        </div>

        <div className="flex flex-col gap-1">
          <Field
            label="Confirm Password"
            icon={<img src={icLockReset} alt="" style={{ width: 24.667, height: 16.667 }} />}
            trailing={
              <>
                <button type="button" aria-label={L('Passwort anzeigen', 'Hiện mật khẩu')} onClick={() => setShow2(v => !v)} className="p-1 pr-2">
                  <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
                </button>
                {match && okMark}
              </>
            }
          >
            <input className={`${input} font-mono tracking-[1.6px]`} type={show2 ? 'text' : 'password'} value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" required placeholder={L('Passwort bestätigen', 'Xác nhận mật khẩu')} aria-label={L('Passwort bestätigen', 'Xác nhận mật khẩu')} />
          </Field>
          {pw2 && (
            <span className={`flex items-center gap-1 px-2 text-[11px] leading-6 ${match ? 'text-[#13707e]' : 'text-red-600'}`}>
              {match && <img src={icMatch} alt="" className="size-[10.833px]" />}
              {match ? L('Passwörter stimmen überein', 'Mật khẩu khớp') : L('Passwörter stimmen nicht überein', 'Mật khẩu không khớp')}
            </span>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 px-1 pt-1 text-sm leading-[17.5px] text-[#3f4a4b]">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="size-5 shrink-0 rounded-md accent-[#13707e]" />
          <span>{L('Ich stimme den ', 'Tôi đồng ý với ')}<a href="#" className="text-[#13707e] underline">{L('Nutzungsbedingungen', 'Điều khoản sử dụng')}</a>{L(' und der ', ' và ')}<Link to="/privacy" className="text-[#13707e] underline">{L('Datenschutzerklärung', 'Chính sách bảo mật')}</Link>{L(' zu', '')}</span>
        </label>

        {error && <p role="alert" className="text-sm text-[#ba1a1a]">{error}</p>}
        {notice && <p role="status" className="text-sm font-semibold text-[#13707e]">{notice}</p>}
        <button
          type="submit"
          disabled={!canSubmit || busy}
          className="mt-1 flex items-center justify-center gap-2 px-6 py-4 text-base disabled:opacity-50 cursor-pointer rounded-2xl bg-brand-deep font-black tracking-wide text-white uppercase shadow-[0_4px_0_#0b4a54] transition-transform duration-150 active:translate-y-[3px] active:shadow-[0_1px_0_#0b4a54]"
        >
          {L('90-Tage-Reise starten', 'Bắt đầu hành trình 90 ngày')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </form>
    </div>
  )
}
