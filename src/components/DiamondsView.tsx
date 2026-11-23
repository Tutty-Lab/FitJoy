import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { IcoGem, IcoTrain } from './CartoonIcons'
import { loadProfile, saveProfile } from '../lib/profile'
import { playGameSound } from '../lib/gameAudio'
import { useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'
const sound = (k: 'tap' | 'success' | 'streak') => { if (loadProfile()?.chime ?? true) playGameSound(k) }

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

const FREEZE_PRICE = 50, FREEZE_MAX = 2

function FreezeIcon() {
  return <svg viewBox="0 0 60 70" width="54" height="62" aria-hidden="true">
    <ellipse cx="30" cy="66" rx="18" ry="3" fill="#0b4a54" opacity=".18" />
    <path d="M30 3C34 17 50 23 52 40C54 57 43 66 30 66C17 66 7 57 8 42C9 32 15 25 19 21C19 29 23 33 27 30C31 25 26 15 30 3Z" fill="#7fdcff" stroke="#0b4a54" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M30 36v22M21 41l18 12M39 41L21 53" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
}

export default function DiamondsView({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { current, doneToday } = useCompleted()
  const [closing, setClosing] = useState(false)
  const [, bump] = useState(0)
  const profile = loadProfile(), xp = profile?.xp ?? 0, freezes = profile?.freezes ?? 0, boost = profile?.boost ?? 0
  const [confirm, setConfirm] = useState<ShopItem | null>(null)
  const [bought, setBought] = useState('')
  const items: ShopItem[] = [
    { key: 'freeze', price: 50, icon: <FreezeIcon />, owned: freezes, max: FREEZE_MAX,
      name: L('Serienschutz', 'Phao giữ chuỗi'), note: L('Hält deine Serie, wenn du einen Tag verpasst.', 'Giữ chuỗi khi bạn lỡ nghỉ 1 ngày.'),
      apply: () => saveProfile({ freezes: freezes + 1 }) },
    { key: 'freeze3', price: 120, icon: <FreezeIcon />, badge: '×3',
      name: L('Serienschutz-Paket', 'Gói 3 phao'), note: L('Drei auf einmal, günstiger.', 'Mua 3 phao, rẻ hơn.'), disabled: freezes >= FREEZE_MAX,
      apply: () => saveProfile({ freezes: Math.min(FREEZE_MAX, freezes + 3) }) },
    { key: 'boost', price: 40, icon: <BoostIcon />, owned: boost,
      name: L('Doppel-Diamanten', 'Nhân đôi kim cương'), note: L('Die nächste Minute bringt doppelt so viele Diamanten.', 'Buổi tập tới được gấp đôi kim cương.'),
      apply: () => saveProfile({ boost: boost + 1 }) },
  ]
  const doBuy = (it: ShopItem) => {
    if (xp < it.price) return
    saveProfile({ xp: xp - it.price }); it.apply()
    if (profile?.chime ?? true) playGameSound('success')
    setConfirm(null); setBought(it.key); setTimeout(() => setBought(''), 1600); bump(n => n + 1)
  }
  useEffect(() => { const h = document.documentElement, o = h.style.overflow; h.style.overflow = 'hidden'; return () => { h.style.overflow = o } }, [])
  const close = (then?: () => void) => { setClosing(true); setTimeout(() => { onClose(); then?.() }, 260) }
  const reward = (kind: 'chest' | 'wheel') => close(() => { navigate('/', { replace: true }); setTimeout(() => window.dispatchEvent(new CustomEvent('fitjoy:rewards', { detail: kind })), 50) })
  const ways = [
    { key: 'train', icon: <span className="earn-ico train"><IcoTrain /></span>, amount: '+10', label: L('Eine Minute üben', 'Tập một phút'), done: doneToday, go: () => close(() => navigate(`/workouts/${current}`)) },
    { key: 'chest', icon: <img src="/rewards/chest-closed.webp" alt="" className="earn-img" />, amount: '+10', label: L('Tagesbelohnung', 'Thưởng hằng ngày'), go: () => reward('chest') },
    { key: 'wheel', icon: <span className="earn-ico spin"><svg viewBox="-24 -24 48 48" width="40" height="40" aria-hidden="true"><circle r="21" fill="#ffb627" stroke="#2b1d0e" strokeWidth="3" />{['#ff7a59', '#4cc9a7', '#ffd23f', '#5aa9ff', '#ff7a59', '#4cc9a7', '#ffd23f', '#a17cf5'].map((c, i) => { const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180, r = 15; return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={c} stroke="#2b1d0e" strokeWidth="1.5" /> })}<circle r="5" fill="#ffb627" stroke="#2b1d0e" strokeWidth="2" /></svg></span>, amount: '+50', label: L('Glücksrad', 'Vòng quay'), go: () => reward('wheel') },
  ]
  return <div className={`streak-backdrop ${closing ? 'closing' : ''}`}>
    <div className="streak-sheet gems-page" role="dialog" aria-label={L('Diamanten', 'Kim cương')}>
      <button type="button" aria-label={L('Schließen', 'Đóng')} onClick={() => close()} className="ladder-x"><X size={30} strokeWidth={2.8} /></button>
      <section className="gems-hero">
        <div className="gems-float"><BigGem /></div>
        <p className="gems-total">{xp}</p>
      </section>
      <ul className="earn-grid">
        {ways.map(w => <li key={w.key}>
          <button type="button" className={`earn-tile ${w.done ? 'done' : ''}`} onClick={w.go} aria-label={w.label}>
            {w.icon}
            <span className="earn-amount">{w.amount}</span>
          </button>
        </li>)}
      </ul>
      <section className="shop">
        <h2 className="shop-title">{L('Shop', 'Cửa hàng')}</h2>
        {items.map(it => {
          const full = it.max !== undefined && (it.owned ?? 0) >= it.max
          return <div key={it.key} className={`shop-item ${bought === it.key ? 'bought' : ''}`}>
            <div className="shop-art">{it.icon}{it.badge && <span className="shop-badge">{it.badge}</span>}{!!it.owned && !it.badge && <span className="shop-owned">×{it.owned}</span>}</div>
            <div className="flex-1"><b className="block text-lg leading-5">{it.name}</b><span className="text-sm text-slate-600">{it.note}</span></div>
            <button type="button" className="shop-buy" disabled={xp < it.price || full || it.disabled} onClick={() => { sound('tap'); setConfirm(it) }} aria-label={L(`Für ${it.price} Diamanten kaufen`, `Mua với ${it.price} kim cương`)}>
              {bought === it.key ? <Check size={22} strokeWidth={3} /> : full ? <Check size={20} strokeWidth={3} /> : <><IcoGem size={18} />{it.price}</>}
            </button>
          </div>
        })}
      </section>
    </div>
    {confirm && <div className="confirm-backdrop" onClick={() => setConfirm(null)}>
      <div className="confirm-box" role="dialog" aria-label={confirm.name} onClick={e => e.stopPropagation()}>
        <div className="confirm-art">{confirm.icon}</div>
        <b className="text-xl">{confirm.name}</b>
        <p className="text-base text-slate-600">{confirm.note}</p>
        <p className="confirm-price"><IcoGem size={24} />{confirm.price}</p>
        <div className="confirm-actions">
          <button type="button" className="confirm-no" onClick={() => setConfirm(null)}>{L('Abbrechen', 'Huỷ')}</button>
          <button type="button" className="confirm-yes" disabled={xp < confirm.price} onClick={() => doBuy(confirm)}>{L('Kaufen', 'Mua')}</button>
        </div>
      </div>
    </div>}
  </div>
}

type ShopItem = { key: string; price: number; icon: ReactNode; name: string; note: string; owned?: number; max?: number; badge?: string; disabled?: boolean; apply: () => void }

function BoostIcon() {
  return <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
    <ellipse cx="24" cy="43" rx="12" ry="2.5" fill="#0b4a54" opacity=".18" />
    <path d="M24 3c7 5 11 12 11 20a11 11 0 0 1-22 0c0-5 2-9 4-12 0 4 2 6 4 5 2-3 0-8 3-13z" fill="#ffb627" stroke="#e0a000" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 16c3 3 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z" fill="#ff7a59" />
    <path d="M20 38h8l-2 7h-4z" fill="#5fd3ff" stroke="#0ea5e9" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
}
