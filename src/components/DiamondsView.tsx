import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Dumbbell, Plus, X } from 'lucide-react'
import { loadProfile } from '../lib/profile'
import { useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'

// Full-screen diamonds view: balance plus the ways to earn more, each one tappable.
export function BigGem({ size = 120 }: { size?: number }) {
  return <svg viewBox="-60 -50 120 100" width={size} height={size * 5 / 6} aria-hidden="true">
    <ellipse cy="46" rx="40" ry="5" fill="#0b4a54" opacity=".2" />
    <path d="M-36 -22h72l18 20-54 46-54-46z" fill="#5fd3ff" stroke="#0b4a54" strokeWidth="4" strokeLinejoin="round" />
    <path d="M-36 -22l18 20h36l18-20M-18 -2l18 46 18-46M-54 -2h108" fill="none" stroke="#0b4a54" strokeWidth="3" strokeLinejoin="round" opacity=".55" />
    <path d="M-36 -22h72l-18 20h-36z" fill="#b5ecff" />
    <path d="M-26 -14l8 9" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
}

export default function DiamondsView({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { current, doneToday } = useCompleted()
  const [closing, setClosing] = useState(false)
  const xp = loadProfile()?.xp ?? 0
  useEffect(() => { const h = document.documentElement, o = h.style.overflow; h.style.overflow = 'hidden'; return () => { h.style.overflow = o } }, [])
  const close = (then?: () => void) => { setClosing(true); setTimeout(() => { onClose(); then?.() }, 260) }
  const reward = (kind: 'chest' | 'wheel') => close(() => { navigate('/', { replace: true }); setTimeout(() => window.dispatchEvent(new CustomEvent('fitjoy:rewards', { detail: kind })), 50) })
  const ways = [
    { key: 'train', icon: <span className="earn-ico train"><Dumbbell size={30} /></span>, amount: '+10', label: L('Eine Minute üben', 'Tập một phút'), done: doneToday, go: () => close(() => navigate(`/workouts/${current}`)) },
    { key: 'chest', icon: <img src="/rewards/chest-closed.webp" alt="" className="earn-img" />, amount: '+10…190', label: L('Tagesbelohnung', 'Thưởng hằng ngày'), go: () => reward('chest') },
    { key: 'wheel', icon: <span className="earn-ico wheel"><svg viewBox="-24 -24 48 48" width="40" height="40" aria-hidden="true"><circle r="21" fill="#ffb627" stroke="#2b1d0e" strokeWidth="3" />{['#ff7a59', '#4cc9a7', '#ffd23f', '#5aa9ff', '#ff7a59', '#4cc9a7', '#ffd23f', '#a17cf5'].map((c, i) => { const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180, r = 15; return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={c} stroke="#2b1d0e" strokeWidth="1.5" /> })}<circle r="5" fill="#ffb627" stroke="#2b1d0e" strokeWidth="2" /></svg></span>, amount: '+5…50', label: L('Glücksrad', 'Vòng quay'), go: () => reward('wheel') },
  ]
  return <div className={`streak-backdrop ${closing ? 'closing' : ''}`}>
    <div className="streak-sheet gems-page" role="dialog" aria-label={L('Diamanten', 'Kim cương')}>
      <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={() => close()} className="ladder-x"><X size={30} strokeWidth={2.8} /></button>
      <section className="gems-hero">
        <div className="gems-float"><BigGem /></div>
        <p className="gems-total">{xp}</p>
      </section>
      <ul className="earn-list">
        {ways.map(w => <li key={w.key}>
          <button type="button" className={`earn-row ${w.done ? 'done' : ''}`} onClick={w.go}>
            {w.icon}
            <span className="flex-1 text-left"><b className="block text-lg">{w.label}</b></span>
            <span className="earn-amount"><Plus size={16} strokeWidth={3.4} />{w.amount.replace('+', '')}</span>
            <ChevronRight className="text-slate-400" />
          </button>
        </li>)}
      </ul>
    </div>
  </div>
}
