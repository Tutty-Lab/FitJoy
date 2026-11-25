import { lazy, Suspense } from 'react'
import type { Region } from '../data/story'

// Rive overlay layer for the adventure map (Duolingo-style animated objects).
//
// HOW TO ADD AN OBJECT
// 1. Drop a .riv file into  public/rive/  (e.g. public/rive/harbor-cat.riv).
// 2. Add an entry below. x/y are percent positions on the map (same frame as the
//    hotspots); w/h are pixels. If the .riv has a state machine with a trigger
//    input, set stateMachine + trigger and tapping the object fires it.
//
// Until a file exists the entry simply renders nothing (no crash, no placeholder),
// and the Rive runtime chunk only loads when there is at least one object for the
// region – so an empty list costs nothing.
export type RiveObj = {
  region: Region['id']
  x: number; y: number; w: number; h: number
  src: string
  stateMachine?: string
  trigger?: string
}

export const RIVE_OBJECTS: RiveObj[] = [
  // Examples – uncomment and point src at a real file once you add one:
  // { region: 'harbor', x: 46, y: 35, w: 90, h: 90, src: '/rive/harbor-cat.riv', stateMachine: 'Motion', trigger: 'tap' },
  // { region: 'lighthouse', x: 26, y: 10, w: 110, h: 70, src: '/rive/park-ducks.riv', stateMachine: 'Motion' },
]

const RiveObject = lazy(() => import('./RiveObject'))

export default function MapRive({ region, flip }: { region: Region['id']; flip: boolean }) {
  const objs = RIVE_OBJECTS.filter(o => o.region === region)
  if (!objs.length) return null
  return (
    <div className="map-rive-layer" aria-hidden="true">
      <Suspense fallback={null}>
        {objs.map((obj, i) => <RiveObject key={i} obj={obj} flip={flip} />)}
      </Suspense>
    </div>
  )
}
