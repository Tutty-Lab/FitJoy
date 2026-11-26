import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// Rive overlay layer for the adventure map.
//
// Only on-theme, transparent (no background) objects belong here – a gentle app
// for older adults, so no random mascots/logos/vehicles. Free official Rive repos
// barely have anything that fits, so for now this is just a small bird companion;
// proper themed objects (a steaming kettle, a cat by the fire, ducks on the pond)
// need to be authored in the Rive editor and dropped into public/rive/.
//
// Objects are keyed by chapter so nothing is ever repeated on the same screen.
// Each only mounts its Rive canvas while scrolled into view (IntersectionObserver).
export type RiveObj = {
  chapter: number
  x: number; y: number; w: number; h: number
  src: string
  stateMachine?: string
  trigger?: string
}

const S = (chapter: number, x: number, y: number, w: number, src: string, stateMachine?: string): RiveObj =>
  ({ chapter, x, y, w, h: w, src: `/rive/${src}.riv`, stateMachine })

export const RIVE_OBJECTS: RiveObj[] = [
  // Cleared – themed transparent PNG objects (ElevenLabs/Seedream) drive the map now.
]

const RiveObject = lazy(() => import('./RiveObject'))

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

export default function MapRive({ chapter, flip }: { chapter: number; flip: boolean }) {
  const objs = RIVE_OBJECTS.filter(o => o.chapter === chapter)
  if (!objs.length) return null
  return (
    <div className="map-rive-layer">
      {objs.map((obj, i) => <RiveGate key={i} obj={obj} flip={flip} />)}
    </div>
  )
}
