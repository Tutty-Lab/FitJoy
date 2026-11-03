import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthTabs from './AuthTabs'
import { loadProfile, saveProfile } from '../../lib/profile'
import sprout from '../../assets/auth/sprout-login.png'
import icHeart from '../../assets/auth/l-heart.svg'
import icFlame from '../../assets/auth/l-flame.svg'
import icMail from '../../assets/auth/l-mail.svg'
import icClear from '../../assets/auth/l-clear.svg'
import icLock from '../../assets/auth/l-lock.svg'
import icEye from '../../assets/auth/eye.svg'
import icCheck from '../../assets/auth/l-check.svg'
import icArrow from '../../assets/auth/arrow.svg'
import icGoogle from '../../assets/auth/google.svg'
import icApple from '../../assets/auth/apple.svg'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)

  function submit(e: FormEvent) {
    e.preventDefault()
    const existing = loadProfile()
    const p = saveProfile({ email, name: existing?.name || email.split('@')[0] })
    navigate(p.onboarded ? '/' : '/onboarding/1')
  }

  return (
    <div className="stagger mx-auto min-h-dvh max-w-[440px] bg-[#f9f9ff] px-4 pt-[calc(env(safe-area-inset-top)+64px)] pb-9">
      <section className="relative mb-4 flex flex-col gap-2 overflow-hidden rounded-[32px] bg-[#f0f3ff] p-4 shadow-sm">
        <div className="absolute -top-8 -right-8 size-36 rounded-full bg-[#6ffbbe] opacity-40 blur-[40px]" />
        <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-[#e9ddff] opacity-30 blur-[24px]" />
        <div className="relative flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1 pr-2">
            <span className="rounded-full bg-[rgba(78,222,163,0.3)] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#005236]">Joy Sprout • Vibe Buddy</span>
            <h1 className="pt-0.5 text-2xl leading-8 font-bold tracking-[-0.6px]">Start your healthy journey!</h1>
            <p className="line-clamp-2 text-sm leading-5 text-[#3c4a42]">Train with 22 structured workout routines and build an energetic daily habit.</p>
          </div>
          <div className="float relative size-24 shrink-0 overflow-hidden rounded-2xl bg-white p-1.5 shadow-md">
            <img src={sprout} alt="Joy Sprout mascot" className="size-full rounded-[48px] object-cover" />
            <span className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-brand shadow-sm">
              <img src={icHeart} alt="" style={{ width: 10, height: 9.175 }} />
            </span>
          </div>
        </div>
        <div className="relative flex items-center justify-between rounded-full bg-white/80 px-3 pt-1 pb-1.5 shadow-sm backdrop-blur-[4px]">
          <span className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.48px] text-[#3c4a42]">
            <span className="size-2 rounded-full bg-brand" />Daily Energy Pool
          </span>
          <span className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">
            <img src={icFlame} alt="" style={{ width: 10.667, height: 12.667 }} />+150 XP waiting
          </span>
        </div>
      </section>

      <div className="mb-4">
        <AuthTabs active="signin" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-[0_20px_25px_-5px_rgba(207,218,242,0.4),0_8px_10px_-6px_rgba(207,218,242,0.4)]">
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-sm leading-[18px] font-semibold">
            <img src={icMail} alt="" style={{ width: 15, height: 12 }} />Account Email
          </span>
          <span className="relative">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[52px] w-full rounded-2xl bg-[#f0f3ff] pr-12 pl-4 text-base outline-none focus:ring-2 focus:ring-brand"
            />
            {email && (
              <button type="button" aria-label="Clear email" onClick={() => setEmail('')} className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1">
                <img src={icClear} alt="" className="size-[15px]" />
              </button>
            )}
          </span>
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="pw" className="flex items-center gap-1.5 text-sm leading-[18px] font-semibold">
              <img src={icLock} alt="" style={{ width: 12, height: 15.75 }} />Password
            </label>
            <button type="button" className="text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">Forgot password?</button>
          </div>
          <span className="relative">
            <input
              id="pw"
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-[52px] w-full rounded-2xl bg-[#f0f3ff] pr-12 pl-4 text-base tracking-[0.8px] outline-none focus:ring-2 focus:ring-brand"
            />
            <button type="button" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(v => !v)} className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1">
              <img src={icEye} alt="" style={{ width: 18.333, height: 12.5 }} />
            </button>
          </span>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 pt-1">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="sr-only" />
          <span className={`flex size-6 items-center justify-center rounded-full shadow-inner ${remember ? 'bg-brand' : 'border-2 border-[#dee8ff] bg-white'}`}>
            {remember && <img src={icCheck} alt="" style={{ width: 10.867, height: 8.017 }} />}
          </span>
          <span className="text-sm leading-[18px] font-semibold text-[#3c4a42]">Remember me</span>
        </label>

        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base leading-5 font-bold tracking-[0.16px] text-white shadow-[0_10px_15px_-3px_rgba(16,185,129,0.3),0_4px_6px_-4px_rgba(16,185,129,0.3)] active:scale-[0.98]"
        >
          Log In to FitJoy
          <img src={icArrow} alt="" className="size-[13.333px]" />
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-[#dee8ff]" />
          <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">Or continue with</span>
          <span className="h-px flex-1 bg-[#dee8ff]" />
        </div>

        <div className="flex gap-2">
          <button type="button" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f0f3ff] text-sm leading-[18px] font-semibold">
            <img src={icGoogle} alt="" className="size-4" />Google
          </button>
          <button type="button" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f0f3ff] text-sm leading-[18px] font-semibold">
            <img src={icApple} alt="" className="size-4" />Apple ID
          </button>
        </div>

        <p className="pt-2 text-center text-sm leading-5 text-[#3c4a42]">
          Don't have an account? <Link to="/signup" className="font-semibold text-[#006c49]">Sign up for free</Link>
        </p>
      </form>
    </div>
  )
}
