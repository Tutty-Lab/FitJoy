import { ArrowLeft, Check } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import mascot from '../../assets/home/mascot.png'
import { bonusFor, dayContent, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../../data/program'
import { sessionsDone, useCompleted } from '../../lib/progress'

const card = 'rounded-3xl border border-mint bg-white p-[17px]'

// Look back at an opened day: greeting, affirmation, sessions done, bonus; practise again or catch up.
export default function DayReview() {
  const day = Number(useParams().day)
  const navigate = useNavigate()
  const { statusOf, current } = useCompleted()
  if (!Number.isInteger(day) || day < 1 || day > PROGRAM_DAYS || statusOf(day) === 'locked') return <Navigate to="/" replace />
  const c = dayContent(day)
  const done = sessionsDone(day)
  const bonus = bonusFor(day)

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-canvas/95 py-2 backdrop-blur">
        <button type="button" aria-label="Zurück" title="Zurück" onClick={() => navigate('/', { replace: true })} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-mint bg-white text-brand-deep shadow-sm">
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <div>
          <h1 className="font-bold">Tag {day}{day === current ? ' · heute' : ''}</h1>
          <p className="text-xs text-slate-500">{c.phase.replace(/^P(\d):\s*/, 'Phase $1 · ')}</p>
        </div>
      </header>

      <section className={`${card} flex items-start gap-3`}>
        <img src={mascot} alt="Vestibu" className="size-16 shrink-0 object-contain" />
        <blockquote className="text-[16px] leading-6 font-bold">„{c.begruessung}“</blockquote>
      </section>

      <section className={card}>
        <p className="text-xs font-bold tracking-wide text-rust uppercase">Deine Affirmation</p>
        <p className="mt-1 text-lg font-bold text-brand-deep">{c.affirmation ? `„${c.affirmation}“` : <span className="text-base font-semibold text-slate-500">Folgt bald.</span>}</p>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between">
          <p className="font-black">Grundübung · {done} / {SESSIONS_PER_DAY} Mal</p>
          <span className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: SESSIONS_PER_DAY }, (_, i) => <span key={i} className={`flex size-6 items-center justify-center rounded-full ${i < done ? 'bg-brand text-white' : 'bg-mint'}`}>{i < done && <Check className="size-3.5" strokeWidth={3} />}</span>)}
          </span>
        </div>
        <Link to={`/workouts/${day}?session=${Math.min(SESSIONS_PER_DAY, done + 1)}`} state={{ from: `/days/${day}` }} className="mt-3 flex h-12 items-center justify-center rounded-full bg-brand-deep font-bold text-white">
          {done < SESSIONS_PER_DAY ? (done === 0 ? 'Grundübung starten' : `Übung ${done + 1}. Mal`) : 'Nochmal üben'}
        </Link>
      </section>

      {bonus && (
        <section className={card}>
          <p className="text-xs font-bold tracking-wide text-rust uppercase">Bonus · freiwillig</p>
          <h2 className="mt-1 text-lg font-black">{bonus.titel}</h2>
          <span className="mt-1 inline-block rounded-full bg-mint px-3 py-1 text-xs font-bold text-brand-deep">{bonus.kategorie}</span>
          <p className="mt-2 text-[15px] leading-6">{bonus.anleitung}</p>
        </section>
      )}
    </div>
  )
}
