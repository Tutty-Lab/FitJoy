import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { baseExercise, baseVideo, bonusFor, dayContent, PROGRAM_DAYS } from '../../data/program'

const blockPicked = (day: number) => { const s = Math.floor((day - 1) / 3) * 3 + 1; return [s, s + 1, s + 2].some(d => dayContent(d).bonusUebung) }
import { getDayOverride } from '../../services/catalog'

const phases = ['Alle', 'P1', 'P2', 'P3'] as const

// Program overview: 90 days with greeting, affirmation and bonus; base exercise shared by all days.
export default function Workouts() {
  const [phase, setPhase] = useState<(typeof phases)[number]>('Alle')
  const [q, setQ] = useState('')
  const [onlyMissing, setOnlyMissing] = useState(false)
  const rows = useMemo(() => Array.from({ length: PROGRAM_DAYS }, (_, i) => {
    const day = i + 1
    const c = dayContent(day)
    return { day, c, bonus: bonusFor(day), pickedBonus: c.bonusUebung, edited: (['begruessung', 'affirmation', 'bonusImpuls', 'bonusUebung'] as const).some(k => getDayOverride(day)[k] !== undefined) }
  }), [])
  const missingAff = rows.filter(r => !r.c.affirmation).length
  const missingBonus = rows.filter((_, i) => i % 3 === 0).filter(r => !blockPicked(r.day)).length
  const shown = rows.filter(r =>
    (phase === 'Alle' || r.c.phase.startsWith(phase)) &&
    (!onlyMissing || !r.c.affirmation) &&
    (!q || `${r.day} ${r.c.begruessung} ${r.c.affirmation} ${r.bonus?.titel}`.toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Program · 90 days</h1>
          <p className="text-sm text-slate-500">Texts come from Vestibu_90_Tage_Texte.xlsx. Edits here override the Excel per day.</p>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link to="/admin/workouts/0" className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">Base exercise · all days</p>
          <p className="mt-1 font-semibold">{baseExercise.title}</p>
          <p className="text-xs text-slate-500">{baseVideo() === baseExercise.video ? 'Sample video – replace with AI video' : 'Custom video set'}</p>
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Affirmations missing</p>
          <p className={`mt-1 text-2xl font-semibold ${missingAff ? 'text-amber-600' : 'text-emerald-600'}`}>{missingAff} / {PROGRAM_DAYS}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Bonus blocks not chosen</p>
          <p className={`mt-1 text-2xl font-semibold ${missingBonus ? 'text-amber-600' : 'text-emerald-600'}`}>{missingBonus} / 30</p>
          {missingBonus > 0 && <p className="text-xs text-slate-500">Placeholder from library order until chosen.</p>}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Phase" className="flex rounded-lg border border-slate-200 bg-white p-0.5">
          {phases.map(p => <button key={p} type="button" aria-pressed={phase === p} onClick={() => setPhase(p)} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${phase === p ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>{p}</button>)}
        </div>
        <label className="relative">
          <Search aria-hidden="true" className="absolute top-2.5 left-2.5 size-4 text-slate-400" />
          <input aria-label="Search days" value={q} onChange={e => setQ(e.target.value)} placeholder="Search text or day" className="h-9 rounded-lg border border-slate-200 bg-white pr-3 pl-8 text-sm" />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyMissing} onChange={e => setOnlyMissing(e.target.checked)} />Only missing affirmation</label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-xs font-semibold text-slate-500 uppercase">
            <tr><th className="px-4 py-3">Day</th><th className="px-4 py-3">Greeting</th><th className="px-4 py-3">Affirmation</th><th className="px-4 py-3">Bonus</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.day} className={`border-t border-slate-100 align-top hover:bg-slate-50 ${(r.day - 1) % 3 === 0 ? 'border-t-slate-300' : ''}`}>
                <td className="px-4 py-3 whitespace-nowrap"><span className="font-semibold tabular-nums">Day {r.day}</span><p className="text-xs text-slate-500">{r.c.phase.slice(0, 2)}</p>{r.edited && <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Edited</span>}</td>
                <td className="max-w-72 px-4 py-3"><p className="line-clamp-2">{r.c.begruessung}</p></td>
                <td className="max-w-60 px-4 py-3">{r.c.affirmation ? <p className="line-clamp-2">{r.c.affirmation}</p> : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Missing</span>}</td>
                <td className="px-4 py-3">{r.bonus?.titel}<p className="text-xs text-slate-500">{r.bonus?.kategorie}{!r.pickedBonus && (blockPicked(r.day) ? ' · from block' : ' · random')}</p></td>
                <td className="px-4 py-3 text-right"><Link to={`/admin/workouts/${r.day}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-brand-deep">Edit</Link></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No days match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
