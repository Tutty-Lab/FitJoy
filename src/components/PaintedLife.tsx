import { useEffect } from 'react'
import type { Region } from '../data/story'

// Layered ambient motion over the painted map backgrounds, back to front:
// 1 water shimmer · 2 boat / fireflies / leaves · 4 seagulls · 5 clouds (parallax on scroll).
// Pure CSS animation, paused off-screen (data-moving on the map section) and off for reduced motion.
const sparkles = [[9, 12], [88, 20], [6, 38], [92, 47], [10, 63], [90, 74], [7, 88]]
const fireflies = [[14, 18], [82, 26], [20, 41], [76, 52], [12, 66], [85, 71], [24, 84], [70, 90]]
const leaves = [18, 62, 84, 36]

// Region-anchored living accents (steam rising, light-beam dust, bobbing glints).
// Tuned to each painted scene so the motion sits on real objects, not floating at random.
type Accent = { steam: [number, number][]; dust: [number, number][]; bob: [number, number][] }
const accents: Record<Region['id'], Accent> = {
  harbor: { steam: [[84, 64], [81, 12]], dust: [[26, 24], [72, 40]], bob: [[57, 51], [71, 56]] },
  forest: { steam: [[86, 32]], dust: [[20, 30], [66, 20]], bob: [[53, 41], [74, 7]] },
  lighthouse: { steam: [[76, 27]], dust: [[40, 18], [70, 34]], bob: [[50, 39], [20, 55]] },
}

let parallaxBound = false
function bindParallax() {
  if (parallaxBound || typeof window === 'undefined') return
  parallaxBound = true
  let raf = 0
  const set = () => { raf = 0; document.documentElement.style.setProperty('--map-sy', String(window.scrollY)) }
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(set) }, { passive: true })
  set()
}

export default function PaintedLife({ region, flip }: { region: Region['id']; flip: boolean }) {
  useEffect(bindParallax, [])
  const a = accents[region]
  // Home/neighborhood/park: gentle flower sparkles, drifting leaves and parallax clouds. No water, boat or gulls.
  return (
    <div className="painted-life" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {sparkles.map(([x, y], i) => <span key={`s${i}`} className="pl-sparkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />)}
      {fireflies.slice(0, 5).map(([x, y], i) => <span key={`f${i}`} className="pl-firefly" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.9}s` }} />)}
      {leaves.map((x, i) => <span key={`l${i}`} className="pl-leaf" style={{ left: `${x}%`, animationDelay: `${i * 4.5}s` }} />)}
      {a.steam.map(([x, y], i) => <span key={`st${i}`} className="pl-steam" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 1.3}s` }}><i /><i /><i /></span>)}
      {a.dust.map(([x, y], i) => <span key={`d${i}`} className="pl-dust" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 2}s` }} />)}
      {a.bob.map(([x, y], i) => <span key={`b${i}`} className="pl-bob" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 1.1}s` }} />)}
      <span className="pl-parallax" style={{ top: '10%' }}><img src="/map/cloud.webp" alt="" className="pl-cloud" style={{ animationDelay: '-8s' }} /></span>
      <span className="pl-parallax pl-parallax-b" style={{ top: '55%' }}><img src="/map/cloud.webp" alt="" className="pl-cloud pl-cloud-b" style={{ animationDelay: '-30s' }} /></span>
    </div>
  )
}
