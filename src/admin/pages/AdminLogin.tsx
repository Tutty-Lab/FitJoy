import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { adminSignIn, isAdmin } from '../../services/adminApi'
import { apiEnabled } from '../../lib/api'
import mascot from '../../assets/home/mascot.png'

const field = 'h-12 rounded-2xl bg-[#f3f6f5] px-4 text-base outline-none focus:ring-2 focus:ring-brand'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (isAdmin()) return <Navigate to="/admin" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    const err = apiEnabled ? await adminSignIn(email, secret) : await adminSignIn(secret)
    setBusy(false)
    if (err) setError(err)
    else navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#fbf8f3] p-4">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4 rounded-[32px] bg-white p-8 shadow-[0_20px_25px_-5px_rgba(200,220,218,0.4)]">
        <div className="flex items-center gap-3">
          <img src={mascot} alt="" className="size-12" />
          <div>
            <h1 className="text-xl leading-7 font-black">FitJoy Admin</h1>
            <p className="text-sm text-[#6f7472]">Sign in to manage the program</p>
          </div>
        </div>
        {apiEnabled && (
          <input type="email" required autoComplete="email" aria-label="Email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} className={field} />
        )}
        <input
          type="password"
          required
          autoFocus={!apiEnabled}
          aria-label={apiEnabled ? 'Password' : 'Admin passcode'}
          placeholder={apiEnabled ? 'Password' : 'Admin passcode'}
          value={secret}
          onChange={e => {
            setSecret(e.target.value)
            setError('')
          }}
          className={field}
        />
        {error && <p role="alert" className="-mt-2 text-sm text-[#ba1a1a]">{error}</p>}
        <button disabled={busy} className="h-12 rounded-full bg-brand font-bold text-white disabled:opacity-60">Sign in</button>
      </form>
    </div>
  )
}
