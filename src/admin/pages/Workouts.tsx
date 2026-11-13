import { Link } from 'react-router-dom'
import { isEdited, listWorkouts } from '../../services/catalog'

export default function Workouts() {
  const list = listWorkouts()
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
            {list.flatMap(w => [
              { label: 'Mobility', title: w.title },
              { label: 'Strength & balance', title: `${w.title} · Stability` },
              { label: 'Stretch & reset', title: `${w.title} · Recovery` },
            ].map((lesson, i) => (
              <tr key={`${w.day}-${i}`} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold tabular-nums">Day {w.day}<span className="block text-xs font-normal text-slate-500">Lesson {i + 1}</span></td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{lesson.title}</span>
                  <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-brand-deep">{lesson.label}</span>
                  {isEdited(w.day) && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Edited</span>}
                </td>
                <td className="px-4 py-3">{w.category}</td>
                <td className="px-4 py-3 tabular-nums">{w.mins}</td>
                <td className="px-4 py-3">{w.intensity}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/workouts/${w.day}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#13707e] hover:bg-mint">Edit</Link>
                </td>
              </tr>
            ))) }
          </tbody>
        </table>
      </div>
    </div>
  )
}
