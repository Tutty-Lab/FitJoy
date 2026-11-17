import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lock, Star, X } from 'lucide-react'
import mascot from '../assets/home/mascot.png'
import { localDay, PROGRAM_DAYS } from '../data/program'
import { sessionsDone, useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'

// Playful "clay" calendar: chunky 3D day bubbles that press down, grouped by the 3 phases of 30 days.
const bubble = 'relative flex aspect-square w-full items-center justify-center rounded-full text-sm font-black transition-transform duration-150 active:translate-y-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
const styles = {
  completed: 'bg-brand text-white shadow-[0_4px_0_#0b4a54]',
  current: 'bg-amber-300 text-amber-950 shadow-[0_4px_0_#d97706] ring-4 ring-amber-200/70 scale-110 z-10',
  locked: 'bg-[#eef3f2] text-slate-400 shadow-[0_4px_0_#d5dfdd]',
}
const phaseName = (phase: string) => phase.replace(/^P\d:\s*/, '')

export default function Calendar() {
  const [hint, setHint] = useState<{ day: number } | null>(null)
  const { current, completed, waitingForTomorrow, statusOf } = useCompleted()
  const done = sessionsDone(current)
  const pct = Math.round((completed.length / PROGRAM_DAYS) * 100)
  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setHint(null), 6000)
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHint(null)
    }
    window.addEventListener('keydown', dismiss)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
    }
  }, [hint])
  const hintText = (() => {
    if (!hint) return ''
    const n = hint.day - current
    const after = waitingForTomorrow || done > 0 ? '' : L(' – nach deiner heutigen Grundübung', ' – sau bài tập cơ bản hôm nay')
    return L(`Tag ${hint.day} öffnet sich frühestens ${n === 1 ? 'morgen' : `in ${n} Tagen`}${after}.`, `Ngày ${hint.day} sớm nhất sẽ mở ${n === 1 ? 'vào ngày mai' : `sau ${n} ngày`}${after}.`)
  })()

  return (
    <div className="flex flex-col gap-5 px-4 pb-4">
      {/* Progress header with Vestibu */}
      <section className="flex items-center gap-3 rounded-[28px] border-2 border-mint bg-white p-4 shadow-[0_4px_0_#cfe7e5]">
        <img src={mascot} alt="" className="float size-16 shrink-0 object-contain" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-black">{L('Dein 90-Tage-Kalender', 'Lịch 90 ngày của bạn')}</h1>
          <p className="text-sm font-bold text-slate-500">{L(`${completed.length} von ${PROGRAM_DAYS} Tagen geschafft`, `Đã xong ${completed.length}/${PROGRAM_DAYS} ngày`)}</p>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-mint" role="progressbar" aria-valuemin={0} aria-valuemax={PROGRAM_DAYS} aria-valuenow={completed.length} aria-label={L('Fortschritt', 'Tiến trình')}>
            <div className="relative h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${Math.max(pct, 4)}%` }}>
              <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </section>

      {[0, 1, 2].map(ph => {
        const days = Array.from({ length: 30 }, (_, i) => ph * 30 + i + 1)
        const doneInPhase = days.filter(d => completed.includes(d)).length
        const open = days.some(d => statusOf(d) !== 'locked')
        return (
          <section key={ph} className={`rounded-[28px] border-2 bg-white p-4 ${open ? 'border-mint shadow-[0_4px_0_#cfe7e5]' : 'border-[#eef3f2] shadow-[0_4px_0_#e3eae9]'}`}>
            <header className="mb-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-xs font-black tracking-wide uppercase ${open ? 'text-rust' : 'text-slate-400'}`}>{L('Phase', 'Giai đoạn')} {ph + 1}</p>
                <h2 className="truncate font-black">{phaseName(localDay(ph * 30 + 1).phase)}</h2>
              </div>
              <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-black ${doneInPhase === 30 ? 'bg-amber-300 text-amber-950' : 'bg-mint text-brand-deep'}`}>
                {doneInPhase === 30 && <Star aria-hidden="true" className="size-4 fill-current" />}{doneInPhase}/30
              </span>
            </header>
            <ol className="grid grid-cols-5 gap-x-3 gap-y-4 sm:grid-cols-6">
              {days.map(d => {
                const s = statusOf(d)
                const label = `${L('Tag', 'Ngày')} ${d}`
                return (
                  <li key={d}>
                    {s === 'locked' ? (
                      <button type="button" onClick={() => setHint({ day: d })} aria-label={`${label}: ${L('gesperrt', 'đang khóa')}`} className={`${bubble} ${styles.locked} cursor-pointer`}>
                        {d}
                        <span aria-hidden="true" className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-white"><Lock className="size-2.5" strokeWidth={3} /></span>
                      </button>
                    ) : (
                      <Link to={`/days/${d}`} aria-label={`${label}: ${s === 'completed' ? L('erledigt', 'đã xong') : L('heute', 'hôm nay')}`} className={`${bubble} ${d === current && s === 'completed' ? `${styles.completed} ring-4 ring-amber-200/70` : styles[s]}`}>
                        {d}
                        {s === 'completed' && <span aria-hidden="true" className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-amber-950"><Check className="size-3" strokeWidth={4} /></span>}
                        {s === 'current' && <span aria-hidden="true" className="absolute -top-6 rounded-full bg-amber-950 px-2 py-0.5 text-[10px] font-black whitespace-nowrap text-white">{L('Heute', 'Hôm nay')}</span>}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed bottom-[calc(7rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2">
        {hint && (
          <div key={hint.day} className="pointer-events-auto flex items-start gap-3 rounded-[24px] border-2 border-amber-400 bg-amber-50 p-3 text-amber-950 shadow-[0_5px_0_#d97706,0_12px_24px_#78350f20] animate-in fade-in slide-in-from-bottom-3 duration-200 motion-reduce:animate-none">
            <span aria-hidden="true" className="mt-1 flex size-11 shrink-0 -rotate-6 items-center justify-center rounded-2xl border-2 border-amber-500 bg-amber-300 shadow-[0_3px_0_#d97706]"><Lock className="size-6" strokeWidth={3} /></span>
            <div className="min-w-0 flex-1 py-1">
              <p className="font-black">{L('Noch ein bisschen Geduld!', 'Chờ thêm chút nhé!')}</p>
              <p className="mt-1 text-sm leading-5 font-semibold">{hintText}</p>
            </div>
            <button type="button" onClick={() => setHint(null)} aria-label={L('Schließen', 'Đóng')} className="flex size-11 shrink-0 items-center justify-center rounded-xl text-amber-900 hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"><X aria-hidden="true" className="size-5" strokeWidth={3} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
