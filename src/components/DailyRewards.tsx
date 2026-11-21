import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gem, Gift, X } from 'lucide-react'
import { loadProfile, saveProfile } from '../lib/profile'
import { useCompleted } from '../lib/progress'
import { dayKey } from '../lib/game'
import { playGameSound } from '../lib/gameAudio'
import { L } from '../lib/i18n'

// Daily mini games: a chest (after today's first minute) and one free spin of the wheel. Prizes are diamonds only.
const KEY = 'fitjoy.rewards'
type Claimed = { chest?: string; wheel?: string }
const read = (): Claimed => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} } }
const write = (c: Claimed) => { try { localStorage.setItem(KEY, JSON.stringify(c)) } catch { /* private mode */ } }
const addGems = (n: number) => saveProfile({ xp: (loadProfile()?.xp ?? 0) + n })
const sound = (k: 'tap' | 'success' | 'streak') => { if (loadProfile()?.chime ?? true) playGameSound(k) }
const PRIZES = [5, 20, 10, 50, 5, 15, 10, 30]
// Segment colours [light centre, dark edge] for a soft 3D shade.
// Cartoon segment colours: [fill, number colour].
const COLORS = [['#ff7a59', '#fff7d1'], ['#4cc9a7', '#fff7d1'], ['#ffd23f', '#ff7a59'], ['#5aa9ff', '#fff7d1'], ['#ff7a59', '#fff7d1'], ['#4cc9a7', '#fff7d1'], ['#ffd23f', '#ff7a59'], ['#a17cf5', '#fff7d1']]
// TEMP: test mode: unlimited chest opens and spins, no diamonds credited, nothing saved.
const TEST = true

export function rewardsWaiting(doneToday: boolean) {
  const c = read(), t = dayKey(new Date())
  return TEST || c.wheel !== t || (doneToday && c.chest !== t)
}

export default function DailyRewards() {
  const { doneToday } = useCompleted()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [, bump] = useState(0)
  const waiting = rewardsWaiting(doneToday)
  const close = () => { setOpen(false); navigate('/', { replace: true }) }
  return <>
    <button type="button" className={`rewards-fab ${waiting ? 'has-gift' : ''}`} aria-label={L('Tagesgeschenke', 'Quà mỗi ngày')} onClick={() => { sound('tap'); setOpen(true) }}>
      <Gift size={30} strokeWidth={2.4} />
    </button>
    {open && <div className="day-sheet-backdrop" onClick={close}>
      <div className="day-sheet" role="dialog" aria-label={L('Tagesgeschenke', 'Quà mỗi ngày')} onClick={e => e.stopPropagation()}>
        <div className="day-sheet-grip" />
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-black">{L('Tagesgeschenke', 'Quà mỗi ngày')}</h2>
          <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="grid size-11 place-items-center rounded-full text-slate-500"><X size={26} strokeWidth={2.6} /></button>
        </header>
        <Chest doneToday={doneToday} onWin={() => bump(n => n + 1)} />
        <Wheel onWin={() => bump(n => n + 1)} />
      </div>
    </div>}
  </>
}

function Chest({ doneToday, onWin }: { doneToday: boolean; onWin: () => void }) {
  const today = dayKey(new Date())
  const [taps, setTaps] = useState(0)
  const [won, setWon] = useState<number | null>(null)
  const claimed = !TEST && read().chest === today && won === null
  const ready = (TEST || doneToday) && !claimed && won === null
  const tap = () => {
    if (TEST && won !== null) { setWon(null); setTaps(0); return }
    if (!ready) return
    if (taps < 2) { setTaps(taps + 1); sound('tap'); return }
    const n = 10 + Math.floor(Math.random() * 4) * 5
    if (!TEST) { write({ ...read(), chest: today }); addGems(n) }
    setWon(n); sound('success'); onWin()
  }
  const hint = won !== null
    ? (TEST ? L(`+${won}, nochmal tippen`, `+${won}, chạm để mở lại`) : L(`+${won} Diamanten!`, `+${won} kim cương!`))
    : claimed ? L('Morgen gibt es eine neue.', 'Mai có rương mới nhé.')
      : ready ? L(`Noch ${3 - taps} Mal tippen.`, `Chạm ${3 - taps} lần để mở.`)
        : L('Öffnet nach deiner ersten Minute heute.', 'Mở sau phút tập đầu tiên hôm nay.')
  return <section className="reward-card">
    <button type="button" key={`${taps}-${won}`} className={`chest ${won !== null ? 'open' : ''} ${taps ? `shake-${taps}` : ''}`} onClick={tap} disabled={!ready && !(TEST && won !== null)} aria-label={L('Truhe öffnen', 'Mở rương')}>
      <img src={won !== null ? '/rewards/chest-open.webp' : '/rewards/chest-closed.webp'} alt="" width="132" height="132" className="chest-img" draggable={false} />
    </button>
    <div className="flex-1">
      <h3 className="text-lg font-black">{L('Schatztruhe', 'Rương báu')}</h3>
      <p className="text-base text-slate-600">{hint}</p>
    </div>
    {won !== null && <span className="reward-pop"><Gem size={20} />+{won}</span>}
  </section>
}

function Wheel({ onWin }: { onWin: () => void }) {
  const today = dayKey(new Date())
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [won, setWon] = useState<number | null>(null)
  const used = !TEST && read().wheel === today && won === null
  const locked = spinning || used || (!TEST && won !== null)
  const spin = () => {
    if (locked) return
    const i = Math.floor(Math.random() * PRIZES.length)
    const target = 360 - i * 45 - 22.5
    setSpinning(true); setWon(null); sound('tap')
    setAngle(a => a - (a % 360) + 360 * 6 + target)
    setTimeout(() => {
      if (!TEST) { write({ ...read(), wheel: today }); addGems(PRIZES[i]) }
      setWon(PRIZES[i]); setSpinning(false); sound('success'); onWin()
    }, 4200)
  }
  const R = 102
  const label = won !== null ? L(`+${won} Diamanten!`, `+${won} kim cương!`) : used ? L('Morgen wieder', 'Mai quay tiếp') : TEST ? 'Test' : L('1 Dreh gratis', '1 lượt miễn phí')
  return <section className="reward-card flex-col">
    <div className="flex w-full items-center justify-between">
      <h3 className="text-lg font-black">{L('Glücksrad', 'Vòng quay may mắn')}</h3>
      <span className="text-base font-bold text-slate-600">{label}</span>
    </div>
    <div className="wheel-wrap cartoon">
      <svg className="wheel-base" viewBox="0 0 260 260" aria-hidden="true">
        <ellipse cx="130" cy="252" rx="80" ry="7" fill="#0b4a54" opacity=".18" />
        <circle cx="130" cy="132" r="122" fill="#2b1d0e" />
        <circle cx="130" cy="128" r="122" fill="#ffb627" stroke="#2b1d0e" strokeWidth="5" />
        <path d="M40 80 A104 104 0 0 1 150 26" fill="none" stroke="#ffe08a" strokeWidth="7" strokeLinecap="round" />
        <circle cx="130" cy="128" r="104" fill="#2b1d0e" />
      </svg>
      <svg className="wheel" viewBox="-104 -104 208 208" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(.2,.9,.25,1.04)' : 'none' }} aria-hidden="true">
        {PRIZES.map((p, i) => {
          const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180
          return <g key={i}>
            <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={COLORS[i][0]} stroke="#2b1d0e" strokeWidth="4" strokeLinejoin="round" />
            <path d={`M${0.82 * R * Math.cos(a0 + 0.08)} ${0.82 * R * Math.sin(a0 + 0.08)} A${0.82 * R} ${0.82 * R} 0 0 1 ${0.82 * R * Math.cos(a1 - 0.08)} ${0.82 * R * Math.sin(a1 - 0.08)}`} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".55" />
            <g transform={`rotate(${i * 45 + 22.5}) translate(0 -60)`}>
              <text textAnchor="middle" y="9" fontSize="27" fontWeight="900" fill={COLORS[i][1]} stroke="#2b1d0e" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">{p}</text>
            </g>
          </g>
        })}
      </svg>
      <svg className="wheel-top" viewBox="0 0 260 260" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180, x = 130 + 113 * Math.cos(a), y = 128 + 113 * Math.sin(a)
          return <circle key={i} className={`bulb ${spinning ? 'on' : ''} ${i % 2 ? 'odd' : ''}`} cx={x} cy={y} r="6.5" fill="#fff7d1" stroke="#2b1d0e" strokeWidth="3" />
        })}
      </svg>
      <svg className="wheel-pin" viewBox="0 0 48 58" width="48" height="58" aria-hidden="true">
        <path d="M24 54 L7 20 A18 18 0 1 1 41 20 Z" fill="#ff5a5f" stroke="#2b1d0e" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M14 14 A11 11 0 0 1 26 7" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        <circle cx="24" cy="19" r="6" fill="#fff7d1" stroke="#2b1d0e" strokeWidth="3" />
      </svg>
      <button type="button" className="wheel-hub" onClick={spin} disabled={locked}>{spinning ? '…' : L('Los!', 'Quay')}</button>
    </div>
  </section>
}
