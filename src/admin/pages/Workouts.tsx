import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { isEdited, listWorkouts } from '../../services/catalog'

export default function Workouts() {
  const list = listWorkouts()
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black">Workouts</h1>
        <p className="text-sm text-[#6f7472]">The 22-day program. Edits show in the user app on next load.</p>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Mins</th>
              <th className="px-4 py-3">Intensity</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map(w => (
              <Fragment key={w.day}>
              <tr key={w.day} className="border-t border-slate-100 cursor-pointer hover:bg-slate-50" onClick={() => setExpanded(expanded === w.day ? null : w.day)}>
                <td className="px-4 py-3 font-bold tabular-nums">{expanded === w.day ? '▾' : '▸'} Day {w.day}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{w.title}</span>
                  {isEdited(w.day) && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Edited</span>}
                </td>
                <td className="px-4 py-3">{w.category}</td>
                <td className="px-4 py-3 tabular-nums">{w.mins}</td>
                <td className="px-4 py-3">{w.intensity}</td>
                <td className="px-4 py-3 text-right" />
              </tr>
              {expanded === w.day && [
                ['Mobility', w.title],
                ['Strength & balance', `${w.title} · Stability`],
                ['Stretch & reset', `${w.title} · Recovery`],
              ].map(([label, title], i) => <tr key={`${w.day}-${i}`} className="bg-slate-50 text-xs">
                <td className="px-4 py-2" /><td className="px-4 py-2 pl-8"><span className="font-semibold">Lesson {i + 1} · {title}</span><span className="ml-2 text-slate-500">{label}</span></td><td colSpan={3} /><td className="px-4 py-2 text-right"><Link onClick={e => e.stopPropagation()} to={`/admin/workouts/${w.day}?lesson=${i + 1}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-brand-deep">Edit</Link></td>
              </tr>)}
              </Fragment>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  )
}
