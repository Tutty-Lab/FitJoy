import { useState } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import type { RiveObj } from './MapRive'

// One Rive animation placed over the map. Tapping fires its state-machine trigger
// (if the .riv defines one). If the file is missing or fails to load, nothing shows.
export default function RiveObject({ obj, flip }: { obj: RiveObj; flip: boolean }) {
  const [ok, setOk] = useState(true)
  const sm = obj.stateMachine
  const { rive, RiveComponent } = useRive({
    src: obj.src,
    stateMachines: sm,
    autoplay: true,
    onLoadError: () => setOk(false),
  })
  const input = useStateMachineInput(rive, sm, obj.trigger)
  if (!ok) return null
  const left = flip ? 100 - obj.x : obj.x
  return (
    <div
      className="map-rive"
      style={{ left: `${left}%`, top: `${obj.y}%`, width: obj.w, height: obj.h, transform: `translate(-50%,-50%)${flip ? ' scaleX(-1)' : ''}` }}
      onClick={() => input?.fire()}
      role={obj.trigger ? 'button' : undefined}
    >
      <RiveComponent />
    </div>
  )
}
