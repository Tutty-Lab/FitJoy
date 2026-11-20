import type { Region } from '../data/story'

// Light ambient motion over the painted map backgrounds. Pure CSS; paused off-screen
// (data-moving on the map section) and switched off for reduced motion.
const sparkles = [[9, 12], [88, 20], [6, 38], [92, 47], [10, 63], [90, 74], [7, 88]]
const fireflies = [[14, 18], [82, 26], [20, 41], [76, 52], [12, 66], [85, 71], [24, 84], [70, 90]]
const leaves = [[18, 0], [62, 0], [84, 0], [36, 0]]

export default function PaintedLife({ region, flip }: { region: Region['id']; flip: boolean }) {
  const water = region !== 'forest'
  return (
    <div className="painted-life" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <span className="pl-cloud" style={{ top: '14%', animationDelay: '-6s' }} />
      <span className="pl-cloud pl-cloud-b" style={{ top: '58%', animationDelay: '-22s' }} />
      {water && sparkles.map(([x, y], i) => <span key={i} className="pl-sparkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />)}
      {water && <>
        <span className="pl-bird" style={{ top: '22%', animationDelay: '-3s' }}><i /><i /></span>
        <span className="pl-bird pl-bird-b" style={{ top: '67%', animationDelay: '-12s' }}><i /><i /></span>
      </>}
      {!water && fireflies.map(([x, y], i) => <span key={i} className="pl-firefly" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.9}s` }} />)}
      {!water && leaves.map(([x], i) => <span key={i} className="pl-leaf" style={{ left: `${x}%`, animationDelay: `${i * 4.5}s` }} />)}
      {region === 'lighthouse' && <span className="pl-beam" />}
    </div>
  )
}
