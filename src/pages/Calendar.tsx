import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { PROGRAM_DAYS } from '../data/program'
import { sessionsDone, useCompleted } from '../lib/progress'

const card = 'w-full rounded-3xl border border-mint bg-white p-[17px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'

export default function Calendar() {
  const [hint, setHint] = useState<number | null>(null)
  const { current, waitingForTomorrow, statusOf } = useCompleted()
  const done = sessionsDone(current)
  return (
    <div className="flex flex-col gap-4 px-4">
      {/* Advent-calendar of 90 days */}
      <section className={card}>
        <h3 className="mb-3 text-base font-black">Dein 90-Tage-Kalender</h3>
        <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
          {Array.from({ length: PROGRAM_DAYS }, (_, i) => i + 1).map(d => {
            const s = statusOf(d)
            const isToday = d === current
            const cls = s === 'completed' ? 'bg-brand text-white' : s === 'current' ? 'bg-amber-300 text-slate-900 ring-2 ring-amber-200' : 'bg-[#f3f6f5] text-slate-400'
            return (
              <li key={d}>
                {s === 'locked' ? (
                  <button type="button" onClick={() => setHint(hint === d ? null : d)} aria-label={`Tag ${d}: gesperrt`} className={`flex aspect-square w-full items-center justify-center rounded-xl text-xs font-bold ${cls}`}>
                    {hint === d ? d : <Lock aria-hidden="true" className="size-3" />}
                  </button>
                ) : (
                  <Link to={`/days/${d}`} aria-label={`Tag ${d}: ${s === 'completed' ? 'erledigt' : 'heute'}`} className={`flex aspect-square items-center justify-center rounded-xl text-xs font-bold ${cls} ${isToday && s === 'completed' ? 'ring-2 ring-amber-300' : ''}`}>
                    {s === 'completed' ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : d}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
        {hint !== null && <p role="status" className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">{(() => { const n = hint - current; return `Tag ${hint} öffnet sich frühestens ${n === 1 ? 'morgen' : `in ${n} Tagen`}${waitingForTomorrow || done > 0 ? '' : ' – nach deiner heutigen Grundübung'}.` })()}</p>}
        <p className="mt-3 text-xs text-slate-500">Tippe auf ein Türchen, um den Tag noch einmal anzusehen. Ein neues Türchen öffnet sich jeden Tag, sobald du die Grundübung mindestens einmal gemacht hast.</p>
      </section>
    </div>
  )
}
