import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Gem, Gift, Lock, X } from 'lucide-react'
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
const COLORS = [['#ff7a59', '#fff7d1'], ['#4cc9a7', '#fff7d1'], ['#ffd23f', '#ff7a59'], ['#5aa9ff', '#fff7d1'], ['#ff7a59', '#fff7d1'], ['#4cc9a7', '#fff7d1'], ['#ffd23f', '#ff7a59'], ['#a17cf5', '#fff7d1']]
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
    {open === 'wheel' && <div className="day-sheet-backdrop" onClick={close}>
      <div className="day-sheet reward-sheet" role="dialog" aria-label={L('Glücksrad', 'Vòng quay may mắn')} onClick={e => e.stopPropagation()}>
        <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={close} className="reward-close"><X size={26} strokeWidth={2.8} /></button>
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
        return <li key={i} ref={current ? (el => el?.scrollIntoView({ block: 'center' })) : undefined} className={`ladder-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
          <span className="ladder-node">{done ? <Check size={18} strokeWidth={3.4} /> : <b>{i + 1}</b>}</span>
          <span className="ladder-icon">{step.kind === 'gems' ? <GemPile n={step.n} /> : <img src={done ? '/rewards/chest-open.webp' : '/rewards/chest-closed.webp'} alt="" className={`tier-${step.tier}`} draggable={false} />}</span>
          <span className="ladder-amount"><Gem size={20} />{step.n}</span>
          {current && claimedCount < LADDER.length && (canClaim
            ? <button type="button" className="ladder-claim" onClick={() => claim(step)} aria-label={L('Abholen', 'Nhận')}><Gift size={22} /></button>
            : <span className="ladder-wait" aria-label={L('Nach dem Training', 'Sau buổi tập')}><Lock size={20} /></span>)}
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
    <span className={`reward-pop big ${stage === 'open' ? '' : 'ghost'}`}><Gem size={30} />+{prize}</span>
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
    <div className="wheel-wrap cartoon">
      <svg className="wheel-base" viewBox="0 0 260 260" aria-hidden="true">
        <ellipse cx="130" cy="252" rx="80" ry="7" fill="#0b4a54" opacity=".18" />
        <circle cx="130" cy="132" r="122" fill="#2b1d0e" />
        <circle cx="130" cy="128" r="122" fill="#ffb627" stroke="#2b1d0e" strokeWidth="5" />
        <path d="M40 80 A104 104 0 0 1 150 26" fill="none" stroke="#ffe08a" strokeWidth="7" strokeLinecap="round" />
        <circle cx="130" cy="128" r="104" fill="#2b1d0e" />
      </svg>
      <div className="wheel-clip"><svg className="wheel" viewBox="-104 -104 208 208" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(.2,.9,.25,1.04)' : 'none' }} aria-hidden="true">
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
      </svg></div>
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
    <span className={`reward-pop big ${won !== null ? '' : 'ghost'}`}><Gem size={30} />+{won ?? 0}</span>
  </section>
}
