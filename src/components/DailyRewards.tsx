import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Lock, X } from 'lucide-react'
import { IcoGem, IcoGift, IcoLock } from './CartoonIcons'
import { loadProfile, saveProfile } from '../lib/profile'
import { useCompleted } from '../lib/progress'
import { dayKey } from '../lib/game'
import { playGameSound } from '../lib/gameAudio'
import { L } from '../lib/i18n'

// Daily mini games: a chest (after today's first minute) and one free spin of the wheel. Prizes are diamonds only.
const KEY = 'fitjoy.rewards'
type Claimed = { chest?: string; wheel?: string; ladder?: number }
const read = (): Claimed => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} } }
const write = (c: Claimed) => { try { localStorage.setItem(KEY, JSON.stringify(c)) } catch { /* private mode */ } }
const addGems = (n: number) => saveProfile({ xp: (loadProfile()?.xp ?? 0) + n })
const sound = (k: 'tap' | 'success' | 'streak') => { if (loadProfile()?.chime ?? true) playGameSound(k) }
const PRIZES = [5, 20, 10, 50, 5, 15, 10, 30]
// Segment colours [light centre, dark edge] for a soft 3D shade.
// Cartoon segment colours: [fill, number colour].
const COLORS = [['#ff7a59', '#fff'], ['#32b49a', '#fff'], ['#f5b82e', '#fff'], ['#3b9cf0', '#fff'], ['#ff7a59', '#fff'], ['#32b49a', '#fff'], ['#f5b82e', '#fff'], ['#8b6ef0', '#fff']]
// TEMP: test mode: unlimited chest opens and spins, no diamonds credited, nothing saved.
const TEST = true

export default function DailyRewards() {
  const { doneToday } = useCompleted()
  const navigate = useNavigate()
  const [open, setOpen] = useState<'chest' | 'wheel' | null>(null)
  const [, bump] = useState(0)
  const c = read(), t = dayKey(new Date())
  const chestWaiting = TEST || (doneToday && c.chest !== t), wheelWaiting = TEST || c.wheel !== t
  const close = () => { setOpen(null); navigate('/', { replace: true }) }
  const show = (k: 'chest' | 'wheel') => { sound('tap'); setOpen(k) }
  useEffect(() => {
    const on = (e: Event) => setOpen((e as CustomEvent<'chest' | 'wheel'>).detail)
    window.addEventListener('fitjoy:rewards', on)
    return () => window.removeEventListener('fitjoy:rewards', on)
  }, [])
  return <>
    <div className="rewards-dock">
      <button type="button" className={`rewards-fab ${chestWaiting ? 'has-gift' : ''}`} aria-label={L('Schatztruhe', 'Rương báu')} onClick={() => show('chest')}>
        <img src="/rewards/chest-closed.webp" alt="" draggable={false} />
      </button>
      <button type="button" className={`rewards-fab ${wheelWaiting ? 'has-gift' : ''}`} aria-label={L('Glücksrad', 'Vòng quay may mắn')} onClick={() => show('wheel')}>
        <MiniWheel />
      </button>
    </div>
    {open === 'chest' && <div className="streak-backdrop">
      <div className="streak-sheet ladder-page" role="dialog" aria-label={L('Tagesbelohnung', 'Thưởng hằng ngày')}>
        <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="ladder-x"><X size={30} strokeWidth={2.8} /></button>
        <Ladder doneToday={doneToday} onWin={() => bump(n => n + 1)} />
      </div>
    </div>}
    {open === 'wheel' && <div className="wheel-overlay" onClick={close}>
      <div className="wheel-stage-center" role="dialog" aria-label={L('Glücksrad', 'Vòng quay may mắn')} onClick={e => e.stopPropagation()}>
        <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="wheel-close"><X size={28} strokeWidth={2.8} /></button>
        <Wheel onWin={() => bump(n => n + 1)} />
      </div>
    </div>}
  </>
}

function MiniWheel() {
  return <svg viewBox="-24 -24 48 48" width="44" height="44" aria-hidden="true">
    <circle r="22" fill="#ffb627" stroke="#2b1d0e" strokeWidth="3" />
    {COLORS.map((col, i) => { const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180, r = 16; return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={col[0]} stroke="#2b1d0e" strokeWidth="1.5" /> })}
    <circle r="5" fill="#ffb627" stroke="#2b1d0e" strokeWidth="2" />
    <path d="M0 -25 l-5 -8 h10z" fill="#ff5a5f" stroke="#2b1d0e" strokeWidth="2" strokeLinejoin="round" />
  </svg>
}

type Step = { kind: 'gems' | 'chest'; n: number; tier?: 'silver' | 'gold' | 'big' }
// One reward per programme day (90): diamonds grow slowly, a chest every 7th day, a big chest at 30, 60 and 90.
const LADDER: Step[] = Array.from({ length: 90 }, (_, i) => {
  const d = i + 1, base = 10 + Math.floor(i / 10) * 5
  if (d % 30 === 0) return { kind: 'chest', n: 100 + d, tier: 'big' }
  if (d % 7 === 0) return { kind: 'chest', n: base * 2, tier: d % 14 === 0 ? 'gold' : 'silver' }
  return { kind: 'gems', n: base }
})

function GemPile({ n }: { n: number }) {
  const count = n >= 30 ? 5 : n >= 20 ? 4 : 3
  const spots = [[0, 6], [-13, 10], [13, 10], [-7, -4], [7, -4]].slice(0, count)
  return <svg viewBox="-30 -24 60 48" width="60" height="48" aria-hidden="true">
    <ellipse cy="20" rx="24" ry="4" fill="#0b4a54" opacity=".18" />
    {spots.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><path d="M-9 -4h18l4 5-13 13-13-13z" fill="#5fd3ff" stroke="#0b4a54" strokeWidth="2.2" strokeLinejoin="round" /><path d="M-9 -4l4 5h10l4-5M-5 1l5 12 5-12" fill="none" stroke="#fff" strokeWidth="1.3" opacity=".75" /></g>)}
  </svg>
}

function Ladder({ doneToday, onWin }: { doneToday: boolean; onWin: () => void }) {
  const today = dayKey(new Date())
  const c = read()
  const claimedCount = Math.min(c.ladder ?? 0, LADDER.length)
  const canClaim = TEST || (doneToday && c.chest !== today)
  const [opening, setOpening] = useState<Step | null>(null)
  const [, bump] = useState(0)
  const claim = (step: Step) => {
    if (step.kind === 'chest') { sound('tap'); setOpening(step); return }
    finish(step)
  }
  const finish = (step: Step) => {
    const next = { ...read(), ladder: TEST ? ((read().ladder ?? 0) + 1) % LADDER.length : (read().ladder ?? 0) + 1 }
    if (!TEST) { next.chest = today; addGems(step.n) }
    write(next); sound('success'); bump(n => n + 1); onWin()
  }
  if (opening) return <ChestOpen prize={opening.n} onDone={() => { finish(opening); setOpening(null) }} />
  return <section className="ladder">
    <div className="ladder-hero">
      <img src="/rewards/chest-open.webp" alt="" draggable={false} />
    </div>
    <ol className="ladder-list">
      {LADDER.map((step, i) => {
        const done = i < claimedCount, current = i === claimedCount
        return <li key={i} ref={current ? (el => { const list = el?.parentElement; if (el && list) list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2 }) : undefined} className={`ladder-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
          <span className="ladder-node">{done ? <Check size={18} strokeWidth={3.4} /> : <b>{i + 1}</b>}</span>
          <span className="ladder-icon">{step.kind === 'gems' ? <GemPile n={step.n} /> : <img src={done ? '/rewards/chest-open.webp' : '/rewards/chest-closed.webp'} alt="" className={`tier-${step.tier}`} draggable={false} />}</span>
          <span className="ladder-amount"><IcoGem size={22} />{step.n}</span>
          {current && claimedCount < LADDER.length && (canClaim
            ? <button type="button" className="ladder-claim" onClick={() => claim(step)} aria-label={L('Abholen', 'Nhận')}><IcoGift /></button>
            : <span className="ladder-wait" aria-label={L('Nach dem Training', 'Sau buổi tập')}><IcoLock /></span>)}
        </li>
      })}
    </ol>
  </section>
}

function ChestOpen({ prize, onDone }: { prize: number; onDone: () => void }) {
  const [stage, setStage] = useState<'idle' | 'opening' | 'open'>('idle')
  const tap = () => {
    if (stage === 'open') { onDone(); return }
    if (stage !== 'idle') return
    setStage('opening'); sound('tap')
    setTimeout(() => { setStage('open'); sound('success') }, 700)
  }
  return <section className="reward-stage">
    <button type="button" key={stage === 'open' ? 'o' : 'c'} className={`chest big ${stage === 'open' ? 'open' : ''} ${stage === 'opening' ? 'opening' : ''} ${stage === 'idle' ? 'idle' : ''}`} onClick={tap} aria-label={stage === 'open' ? L('Weiter', 'Tiếp tục') : L('Truhe öffnen', 'Mở rương')}>
      <img src={stage === 'open' ? '/rewards/chest-open.webp' : '/rewards/chest-closed.webp'} alt="" className="chest-img" draggable={false} />
    </button>
    <span className={`reward-pop big ${stage === 'open' ? '' : 'ghost'}`}><IcoGem size={32} />+{prize}</span>
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
  return <section className="reward-stage">
    <div className="wheel-wrap soft">
      <svg className="wheel-base" viewBox="0 0 260 260" aria-hidden="true">
        <defs>
          <linearGradient id="rimGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe27a" /><stop offset=".55" stopColor="#ffc21a" /><stop offset="1" stopColor="#e89a00" /></linearGradient>
        </defs>
        <ellipse cx="130" cy="252" rx="86" ry="6" fill="#0b4a54" opacity=".15" />
        <circle cx="130" cy="132" r="120" fill="#e0a000" />
        <circle cx="130" cy="128" r="120" fill="url(#rimGold)" />
        <path d="M44 76 A102 102 0 0 1 150 28" fill="none" stroke="#fff6c8" strokeWidth="6" strokeLinecap="round" opacity=".8" />
        <circle cx="130" cy="128" r="103" fill="#fff" />
      </svg>
      <div className="wheel-clip"><svg className="wheel" viewBox="-104 -104 208 208" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(.2,.9,.25,1.04)' : 'none' }} aria-hidden="true">
        {PRIZES.map((p, i) => {
          const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180
          return <g key={i}>
            <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={COLORS[i][0]} stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
            <g transform={`rotate(${i * 45 + 22.5}) translate(0 -64)`}>
              <text textAnchor="middle" y="9" fontSize="26" fontWeight="900" fill="#fff">{p}</text>
            </g>
          </g>
        })}
        <circle r="100" fill="none" stroke="#fff" strokeWidth="4" />
      </svg></div>
      <svg className="wheel-top" viewBox="0 0 260 260" aria-hidden="true">
        <defs><radialGradient id="wGloss" cx=".35" cy=".2" r=".7"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".6" stopColor="#fff" stopOpacity="0" /></radialGradient></defs>
        <circle cx="130" cy="128" r="100" fill="url(#wGloss)" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180, x = 130 + 112 * Math.cos(a), y = 128 + 112 * Math.sin(a)
          return <circle key={i} className={`bulb ${spinning ? 'on' : ''} ${i % 2 ? 'odd' : ''}`} cx={x} cy={y} r="5.5" fill="#fffbe6" />
        })}
      </svg>
      <svg className="wheel-pin" viewBox="0 0 44 54" width="44" height="54" aria-hidden="true">
        <defs><linearGradient id="pinSoft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff8a7a" /><stop offset="1" stopColor="#ef4444" /></linearGradient></defs>
        <path d="M22 52 L6 19 A16.5 16.5 0 1 1 38 19 Z" fill="url(#pinSoft)" />
        <path d="M12 13 A10 10 0 0 1 23 6" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity=".75" />
        <circle cx="22" cy="18" r="5.5" fill="#fff" />
      </svg>
      <button type="button" className="wheel-hub" onClick={spin} disabled={locked}>{spinning ? '…' : L('Los!', 'Quay')}</button>
    </div>
    <span className={`reward-pop big ${won !== null ? '' : 'ghost'}`}><IcoGem size={32} />+{won ?? 0}</span>
  </section>
}
