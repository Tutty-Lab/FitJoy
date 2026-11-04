import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthTabs from './AuthTabs'
import { signUp } from '../../services/auth'
import sprout from '../../assets/auth/sprout-signup.png'
import icLeaf from '../../assets/auth/s-leaf.svg'
import icChev from '../../assets/auth/s-chev.svg'
import icUser from '../../assets/auth/s-user.svg'
import icOk from '../../assets/auth/s-ok.svg'
import icAt from '../../assets/auth/s-at.svg'
import icVerified from '../../assets/auth/s-verified.svg'
import icLock from '../../assets/auth/s-lock.svg'
import icLockReset from '../../assets/auth/s-lockreset.svg'
import icEye from '../../assets/auth/eye.svg'
import icShield from '../../assets/auth/s-shield.svg'
import icMatch from '../../assets/auth/s-match.svg'
import icArrow from '../../assets/auth/arrow.svg'

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

function Field({ icon, children, trailing }: { label: string; aside?: ReactNode; icon: ReactNode; children: ReactNode; trailing?: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex h-[52px] items-center rounded-2xl bg-[#f0f3ff] px-4 focus-within:ring-2 focus-within:ring-brand">
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
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [agree, setAgree] = useState(false)

  const s = strength(pw)
  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const match = pw2.length > 0 && pw === pw2
  const canSubmit = name.trim() && emailOk && s >= 3 && match && agree

  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit || busy) return
    setBusy(true)
    setError('')
    const res = await signUp(name.trim(), email, pw)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    navigate('/onboarding/1')
  }

  const okMark = <img src={icOk} alt="" style={{ width: 17.583, height: 14.021 }} />

  return (
    <div className="stagger mx-auto min-h-dvh max-w-[440px] bg-[#f9f9ff] px-4 pt-[calc(env(safe-area-inset-top)+64px)] pb-8">
      <section className="relative mt-2 flex flex-col gap-2 overflow-hidden rounded-[48px] bg-white p-6 shadow-sm">
        <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-[rgba(111,251,190,0.3)] blur-[40px]" />
        <div className="absolute -top-6 -left-6 size-28 rounded-full bg-[rgba(233,221,255,0.4)] blur-[24px]" />
        <div className="relative flex items-start justify-between">
          <div className="max-w-[210px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ffbbe] px-2.5 py-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#002113]">
              <img src={icLeaf} alt="" style={{ width: 11.362, height: 11.35 }} />Joy Sprout • Vibe Buddy
            </span>
            <h1 className="pt-1 text-2xl leading-8 font-bold tracking-[-0.6px]">Create your account!</h1>
          </div>
          <div className="relative flex size-24 shrink-0 items-center justify-center">
            <div className="size-20 overflow-hidden rounded-2xl bg-[#dee8ff] p-1 shadow-inner">
              <img src={sprout} alt="Joy Sprout mascot" className="size-full rounded-[48px] object-cover" />
            </div>
            <span className="absolute -right-1 -bottom-1 rounded-full bg-[#ef8933] px-1.5 py-0.5 text-[10px] leading-6 text-[#5c2c00]">LVL 1</span>
          </div>
        </div>
      </section>

      <div className="pt-4">
        <AuthTabs active="signup" />
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-[0_20px_25px_-5px_rgba(207,218,242,0.4),0_8px_10px_-6px_rgba(207,218,242,0.4)]">
        <Field
          label="Full Name"
          aside={name.trim() && (
            <span className="flex items-center gap-0.5 text-[11px] leading-4 font-medium tracking-[0.48px] text-[#006c49]">
              <img src={icChev} alt="" style={{ width: 6.378, height: 10.833 }} />Profile ready
            </span>
          )}
          icon={<img src={icUser} alt="" style={{ width: 21.333, height: 13.333 }} />}
          trailing={name.trim() ? okMark : null}
        >
          <input className={input} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required placeholder="Full name" aria-label="Full name" />
        </Field>

        <Field
          label="Email Address"
          icon={<img src={icAt} alt="" style={{ width: 24.667, height: 16.667 }} />}
          trailing={emailOk ? <img src={icVerified} alt="" style={{ width: 18.333, height: 17.5 }} /> : null}
        >
          <input className={input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required placeholder="Email" aria-label="Email" />
        </Field>

        <div className="flex flex-col gap-1">
          <Field
            label="Create Password"
            icon={<img src={icLock} alt="" style={{ width: 21.333, height: 17.5 }} />}
            trailing={
              <button type="button" aria-label="Toggle password" onClick={() => setShow(v => !v)} className="p-1">
                <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
              </button>
            }
          >
            <input className={`${input} font-mono tracking-[1.6px]`} type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" required placeholder="Password" aria-label="Password" />
          </Field>
          {pw && (
            <div className="flex flex-col gap-1 px-2 pt-1">
              <div className="flex h-1.5 gap-1 overflow-hidden rounded-full bg-[#dee8ff]">
                {[0, 1, 2, 3].map(i => (
                  <span key={i} className={`flex-1 rounded-full ${i < s ? (i === 3 ? 'bg-[#4edea3]' : 'bg-[#006c49]') : ''}`} />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] leading-6">
                <span className="flex items-center gap-1 font-semibold text-[#006c49]">
                  <img src={icShield} alt="" style={{ width: 8.667, height: 10.833 }} />
                  {s >= 3 ? 'Strong • 8+ chars & symbol' : 'Weak • use 8+ chars, number & symbol'}
                </span>
                {s >= 3 && <span className="text-[#3c4a42]">Optimal safety</span>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Field
            label="Confirm Password"
            icon={<img src={icLockReset} alt="" style={{ width: 24.667, height: 16.667 }} />}
            trailing={
              <>
                <button type="button" aria-label="Toggle password" onClick={() => setShow2(v => !v)} className="p-1 pr-2">
                  <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
                </button>
                {match && okMark}
              </>
            }
          >
            <input className={`${input} font-mono tracking-[1.6px]`} type={show2 ? 'text' : 'password'} value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" required placeholder="Confirm password" aria-label="Confirm password" />
          </Field>
          {pw2 && (
            <span className={`flex items-center gap-1 px-2 text-[11px] leading-6 ${match ? 'text-[#006c49]' : 'text-red-600'}`}>
              {match && <img src={icMatch} alt="" className="size-[10.833px]" />}
              {match ? 'Passwords match perfectly' : 'Passwords do not match'}
            </span>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 px-1 pt-1 text-sm leading-[17.5px] text-[#3c4a42]">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="size-5 shrink-0 rounded-md accent-[#006c49]" />
          <span>I agree to the <a href="#" className="text-[#006c49] underline">Terms of Service</a> &amp; <a href="#" className="text-[#006c49] underline">Privacy Policy</a></span>
        </label>

        {error && <p role="alert" className="text-sm text-[#ba1a1a]">{error}</p>}
        {notice && <p role="status" className="text-sm font-semibold text-[#006c49]">{notice}</p>}
        <button
          type="submit"
          disabled={!canSubmit || busy}
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand via-brand to-teal-500 px-6 py-4 text-base leading-5 font-bold tracking-[0.16px] text-white drop-shadow-[0_6px_0_#005236] transition active:translate-y-1 active:drop-shadow-[0_2px_0_#005236] disabled:opacity-50"
        >
          Start 22-Day Journey
          <img src={icArrow} alt="" className="size-[13.333px]" />
        </button>
      </form>
    </div>
  )
}
