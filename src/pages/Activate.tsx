import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { pullUser } from '../services/remote'
import { loadProfile } from '../lib/profile'
export default function Activate() {
 const [code,setCode]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 const navigate=useNavigate()
 async function submit(e:FormEvent) {
  e.preventDefault();setBusy(true);setError('')
  try { await api('redeem',{method:'POST',body:{code}}); if(!await pullUser()) throw new Error('Could not refresh account. Please sign in again.'); navigate(loadProfile()?.checks?.start?'/':'/check/start',{replace:true}) }
  catch(e) {setError(e instanceof Error?e.message:'Could not activate')}
  finally {setBusy(false)}
 }
 return <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col gap-5 bg-canvas px-5 py-16">
 <h1 className="text-2xl font-bold">Enter invitation code</h1>
 <form onSubmit={submit} className="flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-sm">
 <label className="text-sm font-semibold">Invitation code<input aria-label="Invitation code" value={code} onChange={e=>setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" spellCheck={false} required maxLength={100} className="mt-2 w-full rounded-xl bg-canvas p-3 font-mono" /></label>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
 <button disabled={busy||!code.trim()} className="rounded-full bg-brand-deep p-3 font-bold text-white disabled:opacity-50">{busy?'Activating…':'Activate'}</button>
 </form>
 <p className="text-sm text-slate-600">No code? Ask your organization for an invitation.</p>
 </main>
}
