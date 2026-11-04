import { useMemo, useState } from 'react'
import { GOAL_LABEL, type Member } from '../../services/adminApi'
import { useMembers } from '../useMembers'

type Sort = 'joined' | 'completed' | 'lastActive' | 'name'

export default function Users() {
  const { members, error } = useMembers()
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

  if (error) return <p className="text-[#ba1a1a]">{error}</p>
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black">Users</h1>
        <p className="text-sm text-[#6c7a71]">{rows.length} of {all.length} members</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search name or email"
          aria-label="Search members"
          className="h-10 min-w-56 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <select value={goal} onChange={e => setGoal(e.target.value as Member['goal'] | 'all')} aria-label="Filter by goal" className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm">
          <option value="all">All goals</option>
          {Object.entries(GOAL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort by" className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm">
          <option value="joined">Newest</option>
          <option value="lastActive">Recently active</option>
          <option value="completed">Most progress</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs font-bold tracking-[0.48px] text-[#6c7a71] uppercase">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Streak</th>
              <th className="px-4 py-3">Last active</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map(m => (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-semibold">{m.name} {!m.demo && <span className="ml-1 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-[#006c49]">This device</span>}</div>
                  <div className="text-[#6c7a71]">{m.email}</div>
                </td>
                <td className="px-4 py-3">{GOAL_LABEL[m.goal]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(m.completed / 22) * 100}%` }} />
                    </div>
                    {m.completed}/22
                  </div>
                </td>
                <td className="px-4 py-3">{m.streak ? `${m.streak} 🔥` : '—'}</td>
                <td className="px-4 py-3">{m.lastActive}</td>
                <td className="px-4 py-3">{m.joined}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-[#6c7a71]">No members match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
