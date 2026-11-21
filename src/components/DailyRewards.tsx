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
const COLORS = [['#ffe9a3', '#f5b82e'], ['#b8f0e0', '#36b79a'], ['#ffd3c2', '#f2785a'], ['#d6c9ff', '#7c5ce0'], ['#ffe9a3', '#f5b82e'], ['#b8f0e0', '#36b79a'], ['#ffd3c2', '#f2785a'], ['#c9e8ff', '#3b8fe0']]
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
  const R = 100
  const label = won !== null ? L(`+${won} Diamanten!`, `+${won} kim cương!`) : used ? L('Morgen wieder', 'Mai quay tiếp') : TEST ? 'Test' : L('1 Dreh gratis', '1 lượt miễn phí')
  return <section className="reward-card flex-col">
    <div className="flex w-full items-center justify-between">
      <h3 className="text-lg font-black">{L('Glücksrad', 'Vòng quay may mắn')}</h3>
      <span className="text-base font-bold text-slate-600">{label}</span>
    </div>
    <div className="wheel-wrap">
      <svg className="wheel-base" viewBox="0 0 260 260" aria-hidden="true">
        <defs>
          <linearGradient id="rimG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4fd0d6" /><stop offset=".45" stopColor="#13707e" /><stop offset="1" stopColor="#083a42" /></linearGradient>
          <linearGradient id="rimIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#083a42" /><stop offset="1" stopColor="#2aa3b3" /></linearGradient>
        </defs>
        <ellipse cx="130" cy="254" rx="90" ry="6" fill="#0b4a54" opacity=".18" />
        <circle cx="130" cy="130" r="125" fill="url(#rimG)" />
        <path d="M30 95 A106 106 0 0 1 230 95" fill="none" stroke="#a8f0f2" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <circle cx="130" cy="130" r="107" fill="url(#rimIn)" />
      </svg>
      <svg className="wheel" viewBox="-104 -104 208 208" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(.12,.8,.18,1)' : 'none' }} aria-hidden="true">
        <defs>{COLORS.map(([a, b], i) => <radialGradient key={i} id={`seg${i}`} cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse"><stop offset=".15" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient>)}</defs>
        {PRIZES.map((p, i) => {
          const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180
          return <g key={i}>
            <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={`url(#seg${i})`} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
            <g transform={`rotate(${i * 45 + 22.5}) translate(0 -68)`}>
              <text textAnchor="middle" y="4" fontSize="24" fontWeight="900" fill="#fff" stroke="#0b4a54" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{p}</text>
              <g transform="translate(0 16)"><path d="M-7 0h14l4 5-11 11-11-11z" fill="#5fd3ff" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M-7 0l4 5h6l4-5" fill="none" stroke="#fff" strokeWidth="1" opacity=".8" /></g>
            </g>
          </g>
        })}
      </svg>
      <svg className="wheel-top" viewBox="0 0 260 260" aria-hidden="true">
        <defs><radialGradient id="gloss" cx=".35" cy=".22" r=".75"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".45" stopColor="#fff" stopOpacity=".06" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient></defs>
        <circle cx="130" cy="130" r="100" fill="url(#gloss)" />
        <circle cx="130" cy="130" r="101" fill="none" stroke="#fff" strokeWidth="4" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * 22.5 - 90) * Math.PI / 180, x = 130 + 116 * Math.cos(a), y = 130 + 116 * Math.sin(a)
          return <g key={i} className={`bulb ${spinning ? 'on' : ''} ${i % 2 ? 'odd' : ''}`}><circle cx={x} cy={y} r="7.5" fill="#fff3b0" opacity=".35" /><circle cx={x} cy={y} r="4.5" fill="#fffbe6" /></g>
        })}
      </svg>
      <svg className="wheel-pin" viewBox="0 0 44 54" width="44" height="54" aria-hidden="true">
        <defs><linearGradient id="pinG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff8a7a" /><stop offset="1" stopColor="#d62f2f" /></linearGradient></defs>
        <path d="M22 52 L5 18 A17 17 0 1 1 39 18 Z" fill="url(#pinG)" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="22" cy="17" r="6.5" fill="#fff" /><circle cx="22" cy="17" r="3" fill="#d62f2f" />
      </svg>
      <button type="button" className="wheel-hub" onClick={spin} disabled={locked}>{spinning ? '…' : L('Drehen', 'Quay')}</button>
    </div>
  </section>
}
