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
const COLORS = ['#ffe08a', '#a7e8d8', '#ffc9b5', '#ffb057', '#ffe08a', '#a7e8d8', '#ffc9b5', '#b9dcff']

export function rewardsWaiting(doneToday: boolean) {
  const c = read(), t = dayKey(new Date())
  return c.wheel !== t || (doneToday && c.chest !== t)
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
  const claimed = read().chest === today && won === null
  const ready = doneToday && !claimed && won === null
  const tap = () => {
    if (!ready) return
    if (taps < 2) { setTaps(taps + 1); sound('tap'); return }
    const n = 10 + Math.floor(Math.random() * 4) * 5
    write({ ...read(), chest: today }); addGems(n); setWon(n); sound('success'); onWin()
  }
  return <section className="reward-card">
    <button type="button" className={`chest ${won !== null ? 'open' : ''} ${taps ? `shake-${taps}` : ''}`} onClick={tap} disabled={!ready} aria-label={L('Truhe öffnen', 'Mở rương')}>
      <img src={won !== null ? '/rewards/chest-open.webp' : '/rewards/chest-closed.webp'} alt="" width="132" height="132" className="chest-img" draggable={false} />
    </button>
    <div className="flex-1">
      <h3 className="text-lg font-black">{L('Schatztruhe', 'Rương báu')}</h3>
      <p className="text-base text-slate-600">{won !== null ? L(`+${won} Diamanten!`, `+${won} kim cương!`) : claimed ? L('Morgen gibt es eine neue.', 'Mai có rương mới nhé.') : doneToday ? L('Tippe dreimal, um sie zu öffnen.', 'Chạm 3 lần để mở.') : L('Öffnet nach deiner ersten Minute heute.', 'Mở sau phút tập đầu tiên hôm nay.')}</p>
    </div>
    {won !== null && <span className="reward-pop"><Gem size={20} />+{won}</span>}
  </section>
}

function Wheel({ onWin }: { onWin: () => void }) {
  const today = dayKey(new Date())
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [won, setWon] = useState<number | null>(null)
  const used = read().wheel === today && won === null
  const spin = () => {
    if (spinning || used || won !== null) return
    const i = Math.floor(Math.random() * PRIZES.length)
    setSpinning(true); sound('tap')
    setAngle(360 * 5 + (360 - i * 45 - 22.5))
    setTimeout(() => {
      write({ ...read(), wheel: today }); addGems(PRIZES[i]); setWon(PRIZES[i]); setSpinning(false); sound('success'); onWin()
    }, 3600)
  }
  return <section className="reward-card flex-col">
    <div className="flex w-full items-center justify-between">
      <h3 className="text-lg font-black">{L('Glücksrad', 'Vòng quay may mắn')}</h3>
      <span className="text-base text-slate-600">{won !== null ? L(`+${won} Diamanten!`, `+${won} kim cương!`) : used ? L('Morgen wieder', 'Mai quay tiếp') : L('1 Dreh gratis', '1 lượt miễn phí')}</span>
    </div>
    <div className="wheel-wrap">
      <svg className="wheel-pin" viewBox="0 0 40 48" width="40" height="48" aria-hidden="true"><path d="M20 46 L4 14 A16 16 0 1 1 36 14 Z" fill="#ef4444" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /><circle cx="20" cy="15" r="6" fill="#fff" /></svg>

      <svg className="wheel" viewBox="-110 -110 220 220" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 3.5s cubic-bezier(.15,.85,.25,1)' : 'none' }} aria-hidden="true">
        {PRIZES.map((p, i) => {
          const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180, R = 106
          return <g key={i}>
            <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={COLORS[i]} stroke="#fff" strokeWidth="3" />
            <g transform={`rotate(${i * 45 + 22.5}) translate(0 -70)`}>
              <text textAnchor="middle" y="2" fontSize="22" fontWeight="900" fill="#0b4a54">{p}</text>
              <path d="M0 10l6 6-6 8-6-8z" fill="#0ea5e9" stroke="#fff" strokeWidth="1.5" />
            </g>
          </g>
        })}
        <circle r="106" fill="none" stroke="#fff" strokeWidth="4" />
      </svg>
      <img src="/rewards/wheel-rim.webp" alt="" className={`wheel-rim ${spinning ? 'on' : ''}`} draggable={false} />
      <button type="button" className="wheel-hub" onClick={spin} disabled={spinning || used || won !== null}>{spinning ? '…' : L('Drehen', 'Quay')}</button>
    </div>
  </section>
}
