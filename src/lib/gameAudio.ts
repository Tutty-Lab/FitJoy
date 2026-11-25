import { loadProfile } from './profile'

let context: AudioContext | undefined
let effect: HTMLAudioElement | undefined

export function unlockGameAudio() {
  if (loadProfile()?.chime === false) return
  try {
    context ??= new AudioContext()
    if (context.state === 'suspended') void context.resume().catch(() => {})
  } catch { /* audio unavailable */ }
}

function synth(kind: 'tap' | 'success' | 'streak' | 'sparkle') {
  unlockGameAudio()
  if (!context || context.state !== 'running') return
  const ctx = context
  const sparkle = kind === 'sparkle'
  const notes = kind === 'tap' ? [660]
    : sparkle ? [1047, 1319, 1568, 2093]
    : kind === 'streak' ? [392, 523, 784]
    : [523, 659, 784, 1047]
  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = ctx.currentTime + i * (sparkle ? .05 : .09)
    oscillator.type = sparkle ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(sparkle ? .05 : .07, start + .012)
    gain.gain.exponentialRampToValueAtTime(.001, start + (sparkle ? .32 : .22))
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + (sparkle ? .35 : .25))
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
  })
}

export function playGameSound(kind: 'tap' | 'success' | 'streak' | 'sparkle') {
  if (loadProfile()?.chime === false) return
  if (kind === 'tap' || kind === 'sparkle') { synth(kind); return }
  // Locally synthesized static asset; no API keys, network synthesis or user data sent from the app.
  effect?.pause()
  effect = new Audio('/audio/reward.wav')
  effect.volume = .45
  void effect.play().catch(() => synth(kind))
}

export function stopGameAudio() {
  effect?.pause()
  effect = undefined
}
