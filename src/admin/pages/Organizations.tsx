import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
type Organization={id:string;name:string;created_at:string;active_members:number;seats_purchased:number;seats_redeemed:number}
export default function Organizations(){
 const [rows,setRows]=useState<Organization[]>([]),[error,setError]=useState('')
 const load=async()=>{try{setRows(await api<Organization[]>('admin/organizations'))}catch(e){setError(e instanceof Error?e.message:'Could not load organizations')}}
 useEffect(()=>{void load()},[])
 async function rename(row:Organization){const name=window.prompt('Organization name',row.name)?.trim();if(!name||name===row.name)return;try{await api('admin/organizations',{method:'PATCH',body:{id:row.id,name}});await load()}catch(e){setError(e instanceof Error?e.message:'Update failed')}}
 return <div className="flex flex-col gap-5"><div><h1 className="text-2xl font-bold">Organizations</h1><p className="text-sm text-slate-600">Seats, active employees and redemption status.</p></div>{error&&<p className="text-red-600">{error}</p>}<div className="overflow-x-auto rounded-3xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="p-4">Organization</th><th className="p-4">Active members</th><th className="p-4">Seats</th><th className="p-4">Redeemed</th><th className="p-4"/></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b last:border-0"><td className="p-4 font-semibold"><Link to={`/admin/organizations/${r.id}`} className="text-brand-deep hover:underline">{r.name}</Link></td><td className="p-4">{r.active_members}</td><td className="p-4">{r.seats_purchased}</td><td className="p-4">{r.seats_redeemed}</td><td className="p-4 text-right"><button onClick={()=>rename(r)} className="rounded-full border px-3 py-1.5 text-xs font-semibold">Rename</button></td></tr>)}</tbody></table>{!rows.length&&<p className="p-8 text-center text-slate-500">No organizations yet.</p>}</div></div>
}
