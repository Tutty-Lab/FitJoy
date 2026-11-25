import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { Region } from '../data/story'

// Rive overlay layer for the adventure map (Duolingo-style animated objects).
//
// HOW TO ADD AN OBJECT
// 1. Drop a .riv file into  public/rive/  (e.g. public/rive/harbor-cat.riv).
// 2. Add an entry below. x/y are percent positions on the map (same frame as the
//    hotspots); w/h are pixels. Set stateMachine to the file's state machine so it
//    animates and reacts to taps; many Rive files react to pointer on their own.
//
// The map stacks every chapter, so each object only mounts a Rive canvas while it
// is scrolled into view (IntersectionObserver) and the runtime chunk only loads
// when a region actually has objects — keeping it light on older devices.
export type RiveObj = {
  region: Region['id']
  x: number; y: number; w: number; h: number
  src: string
  stateMachine?: string
  trigger?: string
}

export const RIVE_OBJECTS: RiveObj[] = [
  { region: 'harbor', x: 78, y: 30, w: 104, h: 104, src: '/rive/birb.riv', stateMachine: 'birb' },
  { region: 'harbor', x: 74, y: 72, w: 72, h: 72, src: '/rive/little_machine.riv', stateMachine: 'State Machine 1' },
  { region: 'forest', x: 80, y: 46, w: 104, h: 104, src: '/rive/birb.riv', stateMachine: 'birb' },
  { region: 'lighthouse', x: 72, y: 40, w: 104, h: 104, src: '/rive/birb.riv', stateMachine: 'birb' },
]

const RiveObject = lazy(() => import('./RiveObject'))

// Renders the heavy Rive canvas only while the object is near the viewport.
function RiveGate({ obj, flip }: { obj: RiveObj; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const left = flip ? 100 - obj.x : obj.x
  return (
    <div ref={ref} className="map-rive" style={{ left: `${left}%`, top: `${obj.y}%`, width: obj.w, height: obj.h }}>
      {near && <Suspense fallback={null}><RiveObject obj={obj} /></Suspense>}
    </div>
  )
}

export default function MapRive({ region, flip }: { region: Region['id']; flip: boolean }) {
  const objs = RIVE_OBJECTS.filter(o => o.region === region)
  if (!objs.length) return null
  return (
    <div className="map-rive-layer">
      {objs.map((obj, i) => <RiveGate key={i} obj={obj} flip={flip} />)}
    </div>
  )
}
