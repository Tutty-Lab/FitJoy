import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lock, RefreshCw } from 'lucide-react'
import mascot from '../assets/home/mascot.png'
import { dayContent, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../data/program'
import { loadProfile } from '../lib/profile'
import { sessionsDone, useCompleted } from '../lib/progress'

const card = 'w-full rounded-3xl border border-mint bg-white p-[17px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const phaseName = (phase: string) => phase.replace(/^P(\d):\s*/, 'Phase $1 · ')

export default function Home() {
  const [p] = useState(() => loadProfile())
  const [hint, setHint] = useState<number | null>(null)
  const { completed, current, waitingForTomorrow, finished, statusOf } = useCompleted()
  const today = dayContent(current)
  const done = sessionsDone(current)
  const pct = (completed.length / PROGRAM_DAYS) * 100

  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      <button type="button" onClick={() => window.location.reload()} className="flex h-10 items-center justify-center gap-2 self-end rounded-full border border-mint bg-white px-4 text-sm font-bold text-brand-deep shadow-sm">
        <RefreshCw aria-hidden="true" className="size-4" />Aktualisieren
      </button>
      {/* Vestibu's greeting of the day */}
      <section className="hero-card relative overflow-hidden rounded-3xl border border-[rgba(207,231,229,0.6)] p-[17px] shadow-[0_10px_25px_rgba(19,112,126,0.12)]" style={{ backgroundImage: 'linear-gradient(135deg, rgba(227,242,241,0.9) 0%, #fff 50%, #fffbeb 100%)' }}>
        <div className="flex items-start gap-3">
          <img src={mascot} alt="Vestibu" className="float size-20 shrink-0 object-contain" />
          <figure className="min-w-0 flex-1">
            <blockquote className="text-[17px] leading-6 font-bold text-slate-900">„{today.begruessung}“</blockquote>
            <figcaption className="mt-1 text-xs font-semibold text-slate-500">Vestibu · Tag {current}</figcaption>
          </figure>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-mint bg-white/90 px-[13px] py-2">
          <span className="text-xs font-bold tracking-[0.4px] text-brand-ink uppercase">{phaseName(today.phase)}</span>
          <span className="text-sm font-bold text-slate-500">Tag <b className="text-lg font-black text-brand-deep">{current}</b> / {PROGRAM_DAYS}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mint" role="progressbar" aria-valuemin={0} aria-valuemax={PROGRAM_DAYS} aria-valuenow={completed.length} aria-label="Fortschritt">
          <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {finished && !p?.checks?.end && (
        <Link to="/check/end" className={`flex items-center justify-between gap-3 ${card}`}>
          <span>
            <span className="block text-base font-black text-slate-900">Du hast 90 Tage geschafft!</span>
            <span className="text-sm text-[#6f7472]">Mach den Gleichgewichts-Check noch einmal und sieh deinen Fortschritt.</span>
          </span>
          <span className="shrink-0 rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white">Check</span>
        </Link>
      )}
      {p?.checks?.end && <Link to="/compare" className={`${card} font-bold text-brand-deep`}>Meine Ergebnisse: Tag 1 und Tag 90 vergleichen →</Link>}

      {/* Today's base exercise */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-rust uppercase">Grundübung heute</p>
            <h3 className="text-lg font-black">{done} / {SESSIONS_PER_DAY} Mal</h3>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: SESSIONS_PER_DAY }, (_, i) => <span key={i} className={`size-3 rounded-full ${i < done ? 'bg-brand' : 'bg-mint'}`} />)}
          </div>
        </div>
        {done < SESSIONS_PER_DAY ? (
          <Link to={`/workouts/${current}?session=${done + 1}`} state={{ from: '/' }} className="mt-3 flex h-14 items-center justify-center rounded-full bg-brand-deep text-base font-bold text-white shadow-md">
            {done === 0 ? 'Grundübung starten' : `Übung ${done + 1}. Mal`}
          </Link>
        ) : (
          <p className="mt-3 rounded-2xl bg-mint p-3 text-sm font-semibold text-brand-deep">Für heute alles geschafft. Bis morgen!</p>
        )}
        {waitingForTomorrow && done > 0 && done < SESSIONS_PER_DAY && <p className="mt-2 text-xs text-slate-500">Tag {current + 1} öffnet sich morgen.</p>}
      </section>

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
