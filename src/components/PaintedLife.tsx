import { useEffect } from 'react'
import type { Region } from '../data/story'

// Layered ambient motion over the painted map backgrounds, back to front:
// 1 water shimmer · 2 boat / fireflies / leaves · 4 seagulls · 5 clouds (parallax on scroll).
// Pure CSS animation, paused off-screen (data-moving on the map section) and off for reduced motion.
const sparkles = [[9, 12], [88, 20], [6, 38], [92, 47], [10, 63], [90, 74], [7, 88]]
const fireflies = [[14, 18], [82, 26], [20, 41], [76, 52], [12, 66], [85, 71], [24, 84], [70, 90]]
const leaves = [18, 62, 84, 36]

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
  const water = region !== 'forest'
  return (
    <div className="painted-life" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {water && sparkles.map(([x, y], i) => <span key={`s${i}`} className="pl-sparkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />)}
      {water && <img src="/map/boat.webp" alt="" className="pl-boat" style={{ top: region === 'harbor' ? '30%' : '44%' }} />}
      {!water && fireflies.map(([x, y], i) => <span key={`f${i}`} className="pl-firefly" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.9}s` }} />)}
      {!water && leaves.map((x, i) => <span key={`l${i}`} className="pl-leaf" style={{ left: `${x}%`, animationDelay: `${i * 4.5}s` }} />)}
      {water && <>
        <img src="/map/seagull.webp" alt="" className="pl-gull" style={{ top: '18%', animationDelay: '-4s' }} />
        <img src="/map/seagull.webp" alt="" className="pl-gull pl-gull-b" style={{ top: '62%', animationDelay: '-15s' }} />
      </>}
      {region === 'lighthouse' && <span className="pl-beam" />}
      <span className="pl-parallax" style={{ top: '10%' }}><img src="/map/cloud.webp" alt="" className="pl-cloud" style={{ animationDelay: '-8s' }} /></span>
      <span className="pl-parallax pl-parallax-b" style={{ top: '55%' }}><img src="/map/cloud.webp" alt="" className="pl-cloud pl-cloud-b" style={{ animationDelay: '-30s' }} /></span>
    </div>
  )
}
