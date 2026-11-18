import Vestibu from '../components/Vestibu'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Gift, LockKeyhole, Trophy, X } from 'lucide-react'
import mascot from '../assets/home/mascot.png'
import { localDay } from '../data/program'
import { loadProfile } from '../lib/profile'
import { sessionsDone, useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'

export default function Home() {
  const navigate = useNavigate()
  const { completed, current, streak, doneToday, finished, statusOf } = useCompleted()
  const [hint, setHint] = useState('')
  const [chapter, setChapter] = useState(Math.floor((current - 1) / 10))
  const done = sessionsDone(current)
  useEffect(() => { if (!hint) return; const id = setTimeout(() => setHint(''), 4500); return () => clearTimeout(id) }, [hint])
  return <div className="game-home">
    <section className="game-chapter"><p className="text-xs font-black tracking-wider uppercase">{L('Dein Gleichgewichts-Code', 'Hành trình thăng bằng')}</p><h1 className="text-xl font-black">{L(`Kapitel ${chapter + 1} · Kleine Schritte`, `Chặng ${chapter + 1} · Từng bước nhỏ`)}</h1><div className="game-progress mt-3" role="progressbar" aria-label={L('Fortschritt', 'Tiến trình')} aria-valuemin={0} aria-valuemax={90} aria-valuenow={completed.length}><span style={{width:`${completed.length / 90 * 100}%`}} /><b>{L('Tag', 'Ngày')} {current} / 90</b></div></section>
    <div className="flex items-center gap-3 px-5 py-6"><Vestibu mood="wave" className="w-20 shrink-0" /><p className="game-speech text-sm font-bold">{doneToday ? L('Deine Flamme leuchtet! Lust auf eine weitere Minute?', 'Lửa đang cháy! Thêm một phút nữa nhé?') : L('Eine Minute reicht für deinen ersten Erfolg heute. Los geht’s!', 'Chỉ một phút cho thành công đầu tiên hôm nay. Bắt đầu nhé!')}</p></div>
    <TrailMap chapter={chapter} current={current} statusOf={statusOf} onPick={(day, status) => status === 'locked' ? setHint(L('Dieser Schritt öffnet nach dem vorherigen Training an einem neuen Tag.', 'Chặng này mở vào ngày mới sau khi hoàn thành chặng trước.')) : navigate(day === current && done < 3 ? `/workouts/${day}?session=${done + 1}` : `/days/${day}`)} />
    <div className="flex items-center justify-between px-5 py-6"><button className="game-secondary" disabled={chapter === 0} onClick={() => setChapter(chapter - 1)}>‹ {L('Zurück', 'Trước')}</button><button className="game-secondary" disabled={chapter === 8} onClick={() => setChapter(chapter + 1)}>{L('Weiter', 'Sau')} ›</button></div>
    {finished && <Link className="game-primary mx-5 block text-center" to={loadProfile()?.checks?.end ? '/compare' : '/check/end'}>{L('Deine Ergebnisse ansehen', 'Xem kết quả của bạn')}</Link>}
    <div className="game-today"><div><p className="text-xs font-black text-brand-deep">{L('DEINE TÄGLICHE MINUTE', 'MỘT PHÚT MỖI NGÀY')}</p><p className="font-black">{done}/3 · {localDay(current).phase.replace(/^P\d:\s*/, '')}</p></div><Link className="game-primary shrink-0" to={done < 3 ? `/workouts/${current}?session=${done + 1}` : '/streak'}>{done < 3 ? L('Start', 'Tập ngay') : L('Streak', 'Chuỗi ngày')}</Link></div>
    {hint && <div className="game-toast" role="status"><img src={mascot} alt="" /><p>{hint}</p><button aria-label={L('Schließen', 'Đóng')} onClick={() => setHint('')}><X size={18} /></button></div>}
  </div>
}

// Trail map: a winding road drawn as one SVG path through the node centres, with milestone
// gifts on day 5 and a trophy at the end of each 10-day chapter.
const W = 360, ROW = 112, TOP = 70
const XS = [180, 110, 80, 130, 220, 280, 250, 170, 110, 180]
function TrailMap({ chapter, current, statusOf, onPick }: { chapter: number; current: number; statusOf: (d: number) => string; onPick: (day: number, status: string) => void }) {
  const pts = XS.map((x, i) => [x, TOP + i * ROW])
  const road = pts.reduce((d, [x, y], i) => i === 0 ? `M${x} ${y}` : `${d} C${pts[i - 1][0]} ${y - ROW / 2} ${x} ${pts[i - 1][1] + ROW / 2} ${x} ${y}`, '')
  const doneIdx = XS.findIndex((_, i) => statusOf(chapter * 10 + i + 1) === 'locked')
  const reach = doneIdx === -1 ? 9 : Math.max(0, doneIdx - 1)
  const height = TOP + 9 * ROW + 70
  return <div className="trail" style={{ height }} aria-label={L('Dein Lernpfad', 'Hành trình luyện tập')}>
    <svg className="trail-road" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={road} className="trail-road-base" />
      <path d={road} className="trail-road-top" />
      <path d={road} className="trail-road-done" style={{ strokeDasharray: 1, strokeDashoffset: 1 - reach / 9 }} pathLength={1} />
      <path d={road} className="trail-road-dash" />
      {[[40, 150], [320, 380], [30, 640], [330, 900], [45, 1060]].map(([x, y], i) => <g key={i} className="trail-deco" transform={`translate(${x} ${y})`}><circle r="16" fill="#d9f3ea" /><circle cx="12" cy="-6" r="11" fill="#c5ecdf" /><circle cx="-10" cy="4" r="8" fill="#e6f8f1" /></g>)}
    </svg>
    {pts.map(([x, y], i) => {
      const day = chapter * 10 + i + 1, status = statusOf(day), now = day === current
      const kind = i === 9 ? 'trophy' : i === 4 ? 'gift' : 'day'
      return <div key={day} className="trail-stop" style={{ left: `${x / W * 100}%`, top: y }}>
        {now && <span className="trail-here">{L('HEUTE', 'HÔM NAY')}</span>}
        <button className={`trail-node ${status} ${kind} ${now ? 'now' : ''}`} style={{ animationDelay: `${i * 60}ms` }}
          aria-label={L(`Tag ${day}: ${status === 'locked' ? 'gesperrt' : status === 'completed' ? 'abgeschlossen' : 'starten'}`, `Ngày ${day}: ${status === 'locked' ? 'chưa mở' : status === 'completed' ? 'đã xong' : 'bắt đầu'}`)}
          onClick={() => onPick(day, status)}>
          {kind === 'trophy' ? <Trophy /> : kind === 'gift' ? <Gift /> : <span className="trail-num">{day}</span>}
          {status === 'completed' && <i className="trail-badge done"><Check /></i>}
          {status === 'locked' && <i className="trail-badge lock"><LockKeyhole /></i>}
        </button>
      </div>
    })}
  </div>
}
