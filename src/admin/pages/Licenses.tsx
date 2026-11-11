import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../lib/api'
type Organization={id:string;name:string}
type Batch={id:string;organization:string;seats:number;redeemed:number;revoked:number;valid_until:string}
type Result={organizations:Organization[];batches:Batch[]}
const field='w-full rounded-xl border border-line bg-white p-3'
export default function Licenses(){
 const [data,setData]=useState<Result>({organizations:[],batches:[]}),[name,setName]=useState(''),[org,setOrg]=useState(''),[seats,setSeats]=useState(10),[expiry,setExpiry]=useState(''),[codes,setCodes]=useState<string[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 async function refresh(){const result=await api<Result>('admin/licenses');setData(result)}
 useEffect(()=>{refresh().catch(e=>setError(e.message))},[])
 async function action(work:()=>Promise<void>){setBusy(true);setError('');try{await work();await refresh()}catch(e){setError(e instanceof Error?e.message:'Request failed')}finally{setBusy(false)}}
 function create(e:FormEvent){e.preventDefault();void action(async()=>{await api('admin/licenses',{method:'POST',body:{name}});setName('')})}
 function issue(e:FormEvent){e.preventDefault();if(codes.length&&!window.confirm('Replace the displayed codes? Download them first; they cannot be retrieved later.'))return;void action(async()=>{const result=await api<{codes:string[]}>('admin/licenses',{method:'POST',body:{organizationId:org,seats,validUntil:new Date(expiry+'T23:59:59').toISOString()}});setCodes(result.codes)})}
 function download(){const blob=new Blob(['code\n'+codes.join('\n')],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='fitjoy-invitations.csv';a.click();URL.revokeObjectURL(url)}
 return <div className="flex flex-col gap-6">
 <h1 className="text-2xl font-bold">Organizations & invitations</h1>
 <p className="text-sm text-slate-600">Record purchased seats, then give one code to each employee. Codes are shown once. Each code activates one account.</p>
 {error&&<p role="alert" className="text-red-600">{error}</p>}
 <form onSubmit={create} className="flex flex-col gap-3 rounded-3xl bg-white p-5"><h2 className="font-bold">New organization</h2><label>Organization name<input className={field} value={name} onChange={e=>setName(e.target.value)} required maxLength={120}/></label><button disabled={busy} className="rounded-full bg-brand-deep p-3 text-white">Create organization</button></form>
 <form onSubmit={issue} className="grid gap-3 rounded-3xl bg-white p-5"><h2 className="font-bold">Issue purchased seats</h2><label>Organization<select className={field} value={org} onChange={e=>setOrg(e.target.value)} required><option value="">Select organization</option>{data.organizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label><label>Seats<input className={field} type="number" min={1} max={1000} value={seats} onChange={e=>setSeats(Number(e.target.value))} required/></label><label>Access and redemption expiry<input className={field} type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} required/></label><button disabled={busy} className="rounded-full bg-brand-deep p-3 text-white">Generate codes</button></form>
 {codes.length>0&&<section className="rounded-3xl bg-white p-5"><h2 className="font-bold">Save these {codes.length} codes now</h2><button onClick={download} className="my-3 rounded-full bg-brand-deep px-5 py-2 text-white">Download CSV</button><textarea aria-label="Generated invitation codes" readOnly value={codes.join('\n')} className="h-44 w-full rounded-xl border p-3 font-mono text-sm"/></section>}
 <section className="flex flex-col gap-3"><h2 className="font-bold">Issued batches</h2>{data.batches.map(b=><article key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4"><div><h3 className="font-bold">{b.organization}</h3><p className="text-sm">{b.seats} seats · {b.redeemed} redeemed · {b.revoked} revoked</p><p className="text-sm">Expires {new Date(b.valid_until).toLocaleDateString()}</p></div><button disabled={busy||b.redeemed+b.revoked>=b.seats} className="rounded-full border px-4 py-2 text-sm disabled:opacity-40" onClick={()=>{if(window.confirm('Revoke all unused codes in this batch? Employee access already activated stays unchanged.'))void action(async()=>{await api('admin/licenses?batchId='+b.id,{method:'DELETE'})})}}>Revoke unused codes</button></article>)}</section>
 </div>
}
