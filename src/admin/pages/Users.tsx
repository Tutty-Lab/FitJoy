import { api } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { useMemo, useState } from 'react'
import { GOAL_LABEL, type Member } from '../../services/adminApi'
import { useMembers } from '../useMembers'

type Sort = 'joined' | 'completed' | 'lastActive' | 'name'

export default function Users() {
  const { members, error, refresh } = useMembers()
  const [editing, setEditing] = useState<Member | null>(null)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setBusy(true); setMessage('')
    try {
      await api('admin/members', { method: 'PATCH', body: { id: editing.id, name: editing.name, username: editing.email, ...(password ? { password } : {}) } })
      setEditing(null); setPassword(''); await refresh(); setMessage('User saved.')
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Save failed') }
    finally { setBusy(false) }
  }
  const all = useMemo(() => members ?? [], [members])
  const [q, setQ] = useState('')
  const [goal, setGoal] = useState<Member['goal'] | 'all'>('all')
  const [sort, setSort] = useState<Sort>('joined')

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return all
      .filter(m => goal === 'all' || m.goal === goal)
      .filter(m => !query || `${m.name} ${m.email}`.toLowerCase().includes(query))
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'completed' ? b.completed - a.completed : b[sort].localeCompare(a[sort])))
  }, [all, q, goal, sort])

  if (error) return <p role="alert" className="text-red-600">{error}</p>
  if (!members) return <p role="status" className="text-sm text-slate-500">Loading users...</p>
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Users</h1>
      </div>

      {message && <p role="status" className="text-sm">{message}</p>}
      {editing && <form aria-label={`Edit ${editing.name}`} onSubmit={save} className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-3">
        <label className="grid gap-1 text-sm">Name<input required maxLength={120} className="h-10 rounded-md border px-3" value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></label>
        <label className="grid gap-1 text-sm">Username<input required maxLength={64} className="h-10 rounded-md border px-3" value={editing.email} onChange={e=>setEditing({...editing,email:e.target.value})}/></label>
        <label className="grid gap-1 text-sm">New password (optional)<input type="password" autoComplete="new-password" minLength={8} maxLength={128} className="h-10 rounded-md border px-3" value={password} onChange={e=>setPassword(e.target.value)}/></label>
        <div className="flex gap-2"><Button disabled={busy}>{busy?'Saving...':'Save'}</Button><Button type="button" variant="outline" disabled={busy} onClick={()=>{setEditing(null);setPassword('')}}>Cancel</Button></div>
      </form>}
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search name, username or email"
          aria-label="Search members"
          className="h-10 min-w-56 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <select value={goal} onChange={e => setGoal(e.target.value as Member['goal'] | 'all')} aria-label="Filter by goal" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="all">All goals</option>
          {Object.entries(GOAL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort by" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="joined">Newest</option>
          <option value="lastActive">Recently active</option>
          <option value="completed">Most progress</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Streak</th>
              <th className="px-4 py-3">Last active</th>
              <th className="px-4 py-3">Joined</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map(m => (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-[#6f7472]">{m.email}</div>
                </td>
                <td className="px-4 py-3">{GOAL_LABEL[m.goal]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(m.completed / 90) * 100}%` }} />
                    </div>
                    {m.completed}/90
                  </div>
                </td>
                <td className="px-4 py-3">{m.streak || '—'}</td>
                <td className="px-4 py-3">{m.lastActive}</td>
                <td className="px-4 py-3">{m.joined}</td><td className="px-4 py-3"><Button variant="outline" size="sm" onClick={()=>{setEditing({...m});setPassword('');setMessage('')}}>Edit</Button></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[#6f7472]">No members match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
