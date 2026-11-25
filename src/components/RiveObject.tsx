import { useState } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import type { RiveObj } from './MapRive'

// One Rive animation that fills its (already positioned) gate box. Rive attaches
// its own pointer listeners, so hover/press interactions in the file just work;
// if the file also exposes a named trigger, tapping fires it too. A missing or
// broken file renders nothing.
export default function RiveObject({ obj }: { obj: RiveObj }) {
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
  return (
    <RiveComponent
      style={{ width: '100%', height: '100%' }}
      onClick={obj.trigger ? () => input?.fire() : undefined}
    />
  )
}
