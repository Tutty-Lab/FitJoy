import { useEffect, useState } from 'react'
import { StreakFlame } from '../components/GameEffects'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Flame } from 'lucide-react'
import { useCompleted } from '../lib/progress'
import { dayKey } from '../lib/game'
import { playGameSound } from '../lib/gameAudio'
import { L, locale } from '../lib/i18n'

// up: the streak just grew (first session today). Starts from the old count with an unlit flame,
// then lights the flame, counts up and ticks today.
export function StreakSummary({ up = false, from = 0 }: { up?: boolean; from?: number }) {
  const { streak, doneToday } = useCompleted()
  const [lit, setLit] = useState(!up)
  useEffect(() => {
    if (!up) return
    const t = setTimeout(() => { setLit(true); playGameSound('streak') }, 700)
    return () => clearTimeout(t)
  }, [up])
  let dates: string[] = []
  try { dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]') } catch { /* empty history */ }
  const todayKey = dayKey(new Date())
  const shown = up && !lit ? from : streak
  const flameOn = up ? lit : doneToday
  return <>
    <div className={`game-flame mx-auto ${flameOn ? 'lit' : ''} ${up && lit ? 'streak-ignite' : ''}`}><StreakFlame lit={flameOn} /></div>
    <h1 key={shown} className={`text-center text-6xl font-black ${flameOn ? 'text-orange-500' : 'text-slate-400'} ${up && lit ? 'streak-bump' : ''}`}>{shown}</h1>
    <p className="text-center text-xl font-black">{L('Tage in Folge', 'ngày liên tiếp')}</p>
    <div className="game-week">{Array.from({ length: 7 }, (_, i) => {
      const date = new Date(); date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i)
      const key = dayKey(date), isToday = key === todayKey, future = key > todayKey
      const active = dates.includes(key) && !(up && isToday && !lit)
      return <div key={i} className={`${isToday ? 'is-today' : ''} ${future ? 'is-future' : ''}`}><span>{date.toLocaleDateString(locale, { weekday: 'narrow' })}</span><span className={active ? 'active' : ''}><Flame size={22} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 1.5 : 2} /></span></div>
    })}</div>
  </>
}

export default function Streak() {
  const [params] = useSearchParams()
  const up = params.get('up') === '1'
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/'
  const [from] = useState(() => {
    try { const v = Number(sessionStorage.getItem('fitjoy.streakUp') ?? 0); sessionStorage.removeItem('fitjoy.streakUp'); return v } catch { return 0 }
  })
  return <div className="game-onboarding">
    {!up && <Link to="/" aria-label={L('Zurück', 'Quay lại')} className="flow-back"><ArrowLeft /></Link>}
    <main className="flex flex-1 flex-col justify-center gap-5 py-6"><StreakSummary up={up} from={from} /></main>
    <Link className="game-primary text-center" to={up ? next : '/'} replace={up}>{up ? L('Weiter', 'Tiếp tục') : L('Zur heutigen Minute', 'Về phút tập hôm nay')}</Link>
  </div>
}
