import { motion, useReducedMotion } from 'motion/react'

export function Confetti() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return <div className="game-confetti" aria-hidden="true">{Array.from({length:18}, (_, i) => <motion.i key={i} style={{left:`${5 + i * 5}%`,background:['#1a8a99','#ffbd32','#ff8b72','#78d6bc'][i % 4]}} initial={{y:-15,opacity:0,rotate:0}} animate={{y:[-15,60 + i % 4 * 35,160 + i % 5 * 25],x:[0,(i % 2 ? 1:-1)*25],opacity:[0,1,0],rotate:i % 2 ? 180:-180}} transition={{duration:1.8,delay:i % 5 * .08,ease:'easeOut'}} />)}</div>
}

export function StreakFlame({ lit = false }: { lit?: boolean }) {
  const outer = 'M60 4C66 26 92 36 98 66C104 100 86 132 58 134C30 136 12 114 14 86C15 68 26 54 34 46C34 60 40 66 46 62C54 52 46 30 60 4Z'
  const mid = 'M60 44C66 62 82 70 82 92C82 112 70 124 58 124C44 124 34 112 35 98C36 86 44 80 48 74C50 84 54 86 57 82C61 74 56 60 60 44Z'
  const core = 'M59 82C63 92 72 98 71 108C70 117 64 120 59 120C52 120 47 115 48 108C49 100 56 96 59 82Z'
  const id = lit ? 'on' : 'off'
  return <svg viewBox="0 0 120 140" role="img" aria-label={lit ? 'Streak' : undefined} aria-hidden={!lit} className={`streak-flame ${lit ? 'is-lit' : ''}`}>
    <defs>
      <linearGradient id={`fo-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lit ? '#ffb02e' : '#7d93a1'} /><stop offset="1" stopColor={lit ? '#ff5a1f' : '#4d6474'} /></linearGradient>
      <linearGradient id={`fm-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lit ? '#ffe36b' : '#a9bac4'} /><stop offset="1" stopColor={lit ? '#ffa62b' : '#8197a5'} /></linearGradient>
    </defs>
    {lit && <ellipse className="flame-glow" cx="58" cy="100" rx="52" ry="40" fill="#ffb53a" opacity=".28" />}
    <ellipse cx="58" cy="134" rx="34" ry="5" fill="#0002" />
    <path className="flame-outer" d={outer} fill={`url(#fo-${id})`} stroke={lit ? '#e2480f' : '#3f5563'} strokeWidth="3" strokeLinejoin="round" />
    <path className="flame-mid" d={mid} fill={`url(#fm-${id})`} />
    <path className="flame-core" d={core} fill={lit ? '#fff7cf' : '#cfd9df'} />
    <path d="M36 70C32 82 32 94 38 104" fill="none" stroke="#fff8" strokeWidth="5" strokeLinecap="round" />
    {lit && [0, 1, 2, 3].map(i => <circle key={i} className="flame-ember" cx={[40, 76, 58, 88][i]} cy="40" r={[3, 2.5, 2, 2.5][i]} fill="#ffcf4a" style={{ animationDelay: `${i * .45}s` }} />)}
  </svg>
}
