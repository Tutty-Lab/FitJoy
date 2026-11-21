import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Lock, Play, RotateCcw, X } from 'lucide-react'
import { episodeFor } from '../data/story'
import { dialogFor } from '../data/storyDialog'
import { SESSIONS_PER_DAY } from '../data/program'
import { sessionsDone } from '../lib/progress'
import { L, lang } from '../lib/i18n'

// Bottom sheet for a map stop: the day's story so far and its three sessions (replay done ones, start the next).
export default function DaySheet({ day, onClose }: { day: number; onClose: () => void }) {
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const done = sessionsDone(day), episode = episodeFor(day), next = Math.min(SESSIONS_PER_DAY, done + 1)
  const close = () => { setClosing(true); setTimeout(onClose, 260) }
  const go = (session: number) => navigate(`/workouts/${day}?session=${session}`)
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <div className={`day-sheet-backdrop ${closing ? 'closing' : ''}`} onClick={close}>
    <div className="day-sheet" role="dialog" aria-label={L(`Tag ${day}`, `Ngày ${day}`)} onClick={e => e.stopPropagation()}>
      <div className="day-sheet-grip" />
      <header className="flex items-start gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-black leading-8">{episode.title[lang]}</h2>
        </div>
        <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="grid size-11 place-items-center rounded-full text-slate-500"><X size={26} strokeWidth={2.6} /></button>
      </header>
      <ol className="mt-3 flex flex-col gap-2">
        {Array.from({ length: SESSIONS_PER_DAY }, (_, i) => {
          const k = i + 1, isDone = k <= done, isNext = !isDone && k === next, scene = dialogFor(day, k)
          return <li key={k} className={`day-session ${isDone ? 'is-done' : isNext ? 'is-next' : 'is-locked'}`}>
            <button type="button" className="day-session-row" disabled={!isDone && !isNext} onClick={() => isDone ? setOpen(open === k ? null : k) : go(k)}>
              <span className="day-session-dot">{isDone ? <Check size={20} strokeWidth={3} /> : isNext ? <Play size={18} fill="currentColor" /> : <Lock size={18} />}</span>
              <span className="flex-1 text-left">
                <b className="block text-lg">{L(`Mal ${k}`, `Lượt ${k}`)}</b>
              </span>
            </button>
            {isDone && open === k && <div className="day-session-story">
              {scene?.pre.map((x, j) => <p key={j} className={x.who === 'me' ? 'me' : ''}>{x[lang]}</p>)}
              <p className="post">{(scene?.post ?? episode.after)[lang]}</p>
              <button type="button" className="game-secondary mt-2 inline-flex items-center gap-2" onClick={() => go(k)}><RotateCcw size={18} />{L('Nochmal üben', 'Tập lại lượt này')}</button>
            </div>}
          </li>
        })}
      </ol>
      {done < SESSIONS_PER_DAY
        ? <button type="button" className="game-primary mt-4 w-full" onClick={() => go(next)}>{L(`Mal ${next} starten`, `Bắt đầu lượt ${next}`)}</button>
        : <button type="button" className="game-primary mt-4 w-full" onClick={() => go(1)}>{L('Tag nochmal üben', 'Tập lại ngày này')}</button>}
    </div>
  </div>
}
