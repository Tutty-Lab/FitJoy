import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { pullUser } from '../services/remote'
import { loadProfile } from '../lib/profile'
import { L } from '../lib/i18n'
export default function Activate() {
 const [code,setCode]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 const navigate=useNavigate()
 async function submit(e:FormEvent) {
  e.preventDefault();setBusy(true);setError('')
  try { await api('redeem',{method:'POST',body:{code}}); if(!await pullUser()) throw new Error(L('Konto konnte nicht geladen werden. Bitte melde dich erneut an.', 'Không tải được tài khoản. Vui lòng đăng nhập lại.')); navigate(loadProfile()?.checks?.start?'/':'/check/start',{replace:true}) }
  catch(e) {setError(e instanceof Error?e.message:L('Aktivierung fehlgeschlagen', 'Kích hoạt không thành công'))}
  finally {setBusy(false)}
 }
 return <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col gap-5 bg-canvas px-5 py-16">
 <h1 className="text-2xl font-bold">{L('Einladungscode eingeben', 'Nhập mã mời')}</h1>
 <form onSubmit={submit} className="flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-sm">
 <label className="text-sm font-semibold">{L('Einladungscode', 'Mã mời')}<input aria-label={L('Einladungscode', 'Mã mời')} value={code} onChange={e=>setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" spellCheck={false} required maxLength={100} className="mt-2 w-full rounded-xl bg-canvas p-3 font-mono" /></label>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
 <button disabled={busy||!code.trim()} className="rounded-full bg-brand-deep p-3 font-bold text-white disabled:opacity-50">{busy?L('Wird aktiviert…', 'Đang kích hoạt…'):L('Aktivieren', 'Kích hoạt')}</button>
 </form>
 <p className="text-sm text-slate-600">{L('Kein Code? Frag deine Organisation nach einer Einladung.', 'Chưa có mã? Hãy xin lời mời từ tổ chức của bạn.')}</p>
 </main>
}
