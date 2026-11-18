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

function synth(kind: 'tap' | 'success' | 'streak') {
  unlockGameAudio()
  if (!context || context.state !== 'running') return
  const ctx = context
  const notes = kind === 'tap' ? [660] : kind === 'streak' ? [392, 523, 784] : [523, 659, 784, 1047]
  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = ctx.currentTime + i * .09
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(.07, start + .012)
    gain.gain.exponentialRampToValueAtTime(.001, start + .22)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + .25)
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
  })
}

export function playGameSound(kind: 'tap' | 'success' | 'streak') {
  if (loadProfile()?.chime === false) return
  if (kind === 'tap') { synth(kind); return }
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
