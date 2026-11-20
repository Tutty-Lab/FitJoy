import Vestibu from '../components/Vestibu'
import { StreakFlame } from '../components/GameEffects'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useCompleted } from '../lib/progress'
import { dayKey } from '../lib/game'
import { loadProfile } from '../lib/profile'
import { L, locale } from '../lib/i18n'

export function StreakSummary() {
  const { streak, doneToday } = useCompleted()
  let dates: string[] = []
  try { dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]') } catch { /* empty history */ }
  const goal = loadProfile()?.streakGoal ?? 7
  return <><p className="game-speech mb-3 text-center font-bold">{doneToday ? L('Deine Flamme leuchtet. Gut gemacht!', 'Ngọn lửa của bạn đang tỏa sáng. Giỏi lắm!') : L('Ein kleiner Schritt. Jeden Tag.', 'Một bước nhỏ. Mỗi ngày.')}</p><div className="relative mx-auto w-52"><Vestibu mood={doneToday ? 'celebrate' : 'idle'} className="absolute -right-4 bottom-0 w-24 z-10" /><div className={`game-flame ${doneToday ? 'lit' : ''}`}><StreakFlame lit={doneToday} /></div></div><h1 className="text-center text-5xl font-black text-orange-500">{streak}</h1><p className="text-center text-xl font-black">{L('Tage im Streak', 'ngày liên tiếp')}</p><div className="game-week">{Array.from({length:7}, (_, i) => { const date = new Date(); date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i); const active = dates.includes(dayKey(date)); return <div key={i}><span>{date.toLocaleDateString(locale, {weekday:'narrow'})}</span><span className={active ? 'active' : ''}>{active ? <Check size={18} /> : '·'}</span></div> })}</div><p className="text-center text-slate-600">{doneToday ? L('Flamme an! Du hast heute für dich geübt.', 'Lửa đã cháy! Hôm nay bạn đã tập rồi.') : L('Eine Minute heute hält deine Flamme am Leben.', 'Một phút hôm nay để giữ ngọn lửa của bạn.')} {L(`Dein Ziel: ${goal} Tage.`, `Mục tiêu: ${goal} ngày.`)}</p></>
}

export default function Streak() {
  return <div className="game-onboarding"><Link to="/" className="flow-back"><ArrowLeft />{L('Heute', 'Hôm nay')}</Link><main className="flex flex-1 flex-col justify-center gap-5 py-6"><StreakSummary /><p className="flow-note text-center">{L('Eine Pause kann den Streak unterbrechen. Dein Programmfortschritt und deine Geschichte bleiben erhalten.', 'Nghỉ một ngày có thể ngắt chuỗi. Tiến trình chương trình và câu chuyện vẫn được giữ.')}</p></main><Link className="game-primary text-center" to="/">{L('Zur heutigen Minute', 'Về phút tập hôm nay')}</Link></div>
}
