import { useEffect, useState } from 'react'
import { StreakFlame } from '../components/GameEffects'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarCheck, ChevronLeft, ChevronRight, Flame, Trophy, X } from 'lucide-react'
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

function bestStreak(dates: string[]) {
  const ds = [...new Set(dates)].sort()
  let best = 0, run = 0, prev = ''
  for (const d of ds) {
    const p = new Date(d + 'T12:00:00'); p.setDate(p.getDate() - 1)
    run = prev === dayKey(p) ? run + 1 : 1; best = Math.max(best, run); prev = d
  }
  return best
}

// Calendar sheet that slides up from the bottom.
function StreakSheet() {
  const navigate = useNavigate()
  const { streak, doneToday } = useCompleted()
  const [closing, setClosing] = useState(false)
  useEffect(() => { const h = document.documentElement, o = h.style.overflow; h.style.overflow = 'hidden'; return () => { h.style.overflow = o } }, [])
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  let dates: string[] = []
  try { dates = JSON.parse(localStorage.getItem('fitjoy.activeDates') ?? '[]') } catch { /* empty history */ }
  const set = new Set(dates), todayKey = dayKey(new Date())
  const y = month.getFullYear(), m = month.getMonth()
  const lead = (month.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate()
  const cells = Array.from({ length: lead + days }, (_, i) => i < lead ? null : new Date(y, m, i - lead + 1))
  const inMonth = cells.filter(d => d && set.has(dayKey(d))).length
  const close = () => {
    setClosing(true)
    setTimeout(() => { if ((window.history.state?.idx ?? 0) > 0) navigate(-1); else navigate('/', { replace: true }) }, 280)
  }
  const now = new Date(), thisMonth = y === now.getFullYear() && m === now.getMonth()
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }))
  return <div className={`streak-backdrop ${closing ? 'closing' : ''}`} onClick={close}>
    <div className="streak-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Streak">
      <header className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-2">
        <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="grid size-11 place-items-center rounded-full text-slate-500"><X size={28} strokeWidth={2.6} /></button>
        <h1 className="text-lg font-black">{L('Tage in Folge', 'Chuỗi ngày tập')}</h1>
        <span className="size-11" />
      </header>
      <section className={`streak-hero ${doneToday ? 'lit' : ''}`}>
        <div><p className="text-7xl font-black leading-none">{streak}</p><p className="mt-1 text-lg font-bold">{L('Tage in Folge!', 'ngày liên tiếp!')}</p></div>
        <div className={`game-flame ${doneToday ? 'lit' : ''}`}><StreakFlame lit={doneToday} /></div>
      </section>
      {!doneToday && <p className="mx-4 mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-base font-semibold text-orange-700">{L('Mach heute eine Minute, damit die Flamme brennt.', 'Tập một phút hôm nay để giữ ngọn lửa nhé.')}</p>}
      <div className="flex items-center justify-between px-4 pt-5">
        <h2 className="text-xl font-black capitalize">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-1">
          <button type="button" aria-label={L('Vorheriger Monat', 'Tháng trước')} className="grid size-11 place-items-center rounded-full text-slate-600" onClick={() => setMonth(new Date(y, m - 1, 1))}><ChevronLeft /></button>
          <button type="button" aria-label={L('Nächster Monat', 'Tháng sau')} disabled={thisMonth} className="grid size-11 place-items-center rounded-full text-slate-600 disabled:opacity-30" onClick={() => setMonth(new Date(y, m + 1, 1))}><ChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        <div className="streak-stat"><CalendarCheck className="shrink-0 text-brand-deep" /><div><b>{inMonth}</b><span>{L('Trainingstage', 'Ngày đã tập')}</span></div></div>
        <div className="streak-stat"><Trophy className="shrink-0 text-orange-500" /><div><b>{bestStreak(dates)}</b><span>{L('Längste Serie', 'Chuỗi dài nhất')}</span></div></div>
      </div>
      <div className="streak-cal mx-4 mt-3">
        {weekdays.map(w => <span key={w} className="wd">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const k = dayKey(d), on = set.has(k)
          const prevOn = on && i % 7 !== 0 && set.has(dayKey(new Date(y, m, d.getDate() - 1)))
          const nextOn = on && i % 7 !== 6 && set.has(dayKey(new Date(y, m, d.getDate() + 1)))
          return <span key={i} className={`day ${on ? 'on' : ''} ${prevOn ? 'l' : ''} ${nextOn ? 'r' : ''} ${k === todayKey ? 'today' : ''} ${k > todayKey ? 'future' : ''}`}><i>{d.getDate()}</i></span>
        })}
      </div>
      <div className="h-[calc(env(safe-area-inset-bottom)+24px)]" />
    </div>
  </div>
}

export default function Streak() {
  const [params] = useSearchParams()
  const up = params.get('up') === '1'
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/'
  const [from] = useState(() => {
    try { const v = Number(sessionStorage.getItem('fitjoy.streakUp') ?? 0); sessionStorage.removeItem('fitjoy.streakUp'); return v } catch { return 0 }
  })
  if (!up) return <StreakSheet />
  return <div className="game-onboarding">
    <main className="flex flex-1 flex-col justify-center gap-5 py-6"><StreakSummary up={up} from={from} /></main>
    <Link className="game-primary text-center" to={next} replace>{L('Weiter', 'Tiếp tục')}</Link>
  </div>
}
