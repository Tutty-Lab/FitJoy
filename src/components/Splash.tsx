import { useEffect, useState } from 'react'
import mascot from '../assets/home/mascot.png'
import { L } from '../lib/i18n'

// Short intro on every app launch; fades out into whatever screen is underneath.
export default function Splash() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>(() => (sessionStorage.getItem('fitjoy.splash') ? 'gone' : 'in'))
  useEffect(() => {
    if (phase !== 'in') return
    sessionStorage.setItem('fitjoy.splash', '1')
    const t1 = setTimeout(() => setPhase('out'), 1600)
    const t2 = setTimeout(() => setPhase('gone'), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])
  if (phase === 'gone') return null
  return (
    <div className={`splash ${phase === 'out' ? 'splash-out' : ''}`} onClick={() => setPhase('out')} aria-hidden>
      <img src={mascot} alt="" className="splash-mascot" />
      <p className="splash-title">FitJoy</p>
      <p className="splash-sub">{L('Der Gleichgewichts-Code', 'Mật mã thăng bằng')}</p>
    </div>
  )
}
