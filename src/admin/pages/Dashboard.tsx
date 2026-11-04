import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { computeStats } from '../../services/adminApi'
import { apiEnabled } from '../../lib/api'
import { useMembers } from '../useMembers'

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">{label}</div>
      <div className="pt-1 text-3xl leading-10 font-black tabular-nums">{value}</div>
      {sub && <div className="text-sm text-[#3f4a4b]">{sub}</div>}
    </div>
  )
}

// Single-series bar chart: members who reached each day. One hue, thin rounded bars, hover tooltip.
function FunnelChart({ data, total }: { data: { day: number; members: number }[]; total: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const max = Math.max(1, ...data.map(d => d.members))
  const h = 180

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 pb-4">
        <div>
          <h2 className="text-base font-bold">Program drop-off</h2>
          <p className="text-sm text-[#6f7472]">Members who completed at least day N</p>
        </div>
        <button onClick={() => setTable(t => !t)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-[#3f4a4b]">
          {table ? 'Chart' : 'Table'}
        </button>
      </div>

      {table ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[#6f7472]">
              <tr><th className="py-1">Day</th><th>Members</th><th>% of all</th></tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map(d => (
                <tr key={d.day} className="border-t border-slate-100">
                  <td className="py-1.5">Day {d.day}</td>
                  <td>{d.members}</td>
                  <td>{Math.round((d.members / total) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative" onMouseLeave={() => setHover(null)}>
          <div className="flex items-end gap-[2px] border-b border-slate-200" style={{ height: h }} role="img" aria-label="Bar chart of members reaching each program day">
            {data.map(d => (
              <div
                key={d.day}
                className="flex h-full flex-1 cursor-default items-end"
                onMouseEnter={() => setHover(d.day)}
                onFocus={() => setHover(d.day)}
                tabIndex={0}
                aria-label={`Day ${d.day}: ${d.members} members`}
              >
                <div
                  className={`w-full rounded-t-[4px] transition-opacity ${hover !== null && hover !== d.day ? 'opacity-40' : ''}`}
                  style={{ height: `${(d.members / max) * 100}%`, background: '#1a8a99', minHeight: d.members ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-1.5 text-xs text-[#6f7472] tabular-nums">
            <span>Day 1</span><span>Day 11</span><span>Day 22</span>
          </div>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-xl bg-[#111c2d] px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
              style={{ left: `${((hover - 0.5) / data.length) * 100}%` }}
            >
              <div className="font-bold">Day {hover}</div>
              <div className="tabular-nums">{data[hover - 1].members} members · {Math.round((data[hover - 1].members / total) * 100)}%</div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default function Dashboard() {
  const { members, error } = useMembers()
  const stats = useMemo(() => computeStats(members ?? []), [members])
  const recent = useMemo(() => [...(members ?? [])].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 6), [members])
  if (error) return <p className="text-[#ba1a1a]">{error}</p>
  if (!members) return <p className="text-[#6f7472]">Loading…</p>
  const pct = (n: number) => Math.round((n / stats.pctBase) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-sm text-[#6f7472]">Overview of the 22-day program · {apiEnabled ? 'live data' : 'demo data until the backend is configured'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Members" value={stats.total} />
        <Stat label="Active 7 days" value={stats.active7} sub={`${pct(stats.active7)}% of members`} />
        <Stat label="Sessions done" value={stats.sessions} />
        <Stat label="Finished 22 days" value={stats.finishers} sub={`${pct(stats.finishers)}% completion`} />
      </div>

      <FunnelChart data={stats.funnel} total={stats.pctBase} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-base font-bold">Newest members</h2>
          <Link to="/admin/users" className="text-sm font-semibold text-[#13707e]">View all →</Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map(m => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-semibold">{m.name}</span>
                <span className="block truncate text-[#6f7472]">{m.email}</span>
              </span>
              <span className="shrink-0 text-[#3f4a4b] tabular-nums">{m.completed}/22 · joined {m.joined}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
