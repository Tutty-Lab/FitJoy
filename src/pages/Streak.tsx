import { StreakFlame } from '../components/GameEffects'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useCompleted } from '../lib/progress'
import { dayKey } from '../lib/game'
import { L, locale } from '../lib/i18n'

export function StreakSummary() {
  const { streak, doneToday } = useCompleted()
  let dates: string[] = []
  try { dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]') } catch { /* empty history */ }
  const todayKey = dayKey(new Date())
  return <>
    <div className={`game-flame mx-auto ${doneToday ? 'lit' : ''}`}><StreakFlame lit={doneToday} /></div>
    <h1 className="text-center text-5xl font-black text-orange-500">{streak}</h1>
    <p className="text-center text-xl font-black">{L('Tage in Folge', 'ngày liên tiếp')}</p>
    <div className="game-week">{Array.from({ length: 7 }, (_, i) => {
      const date = new Date(); date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i)
      const key = dayKey(date), active = dates.includes(key), isToday = key === todayKey, future = key > todayKey
      return <div key={i} className={`${isToday ? 'is-today' : ''} ${future ? 'is-future' : ''}`}><span>{date.toLocaleDateString(locale, { weekday: 'narrow' })}</span><span className={active ? 'active' : ''}>{active && <Check size={18} />}</span></div>
    })}</div>
  </>
}

export default function Streak() {
  return <div className="game-onboarding"><Link to="/" className="flow-back"><ArrowLeft />{L('Heute', 'Hôm nay')}</Link><main className="flex flex-1 flex-col justify-center gap-5 py-6"><StreakSummary /></main><Link className="game-primary text-center" to="/">{L('Zur heutigen Minute', 'Về phút tập hôm nay')}</Link></div>
}
