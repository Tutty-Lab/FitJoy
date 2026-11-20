import { useEffect, useRef, useState } from 'react'
import still from '../assets/home/vestibu-welcome.png'

export type Mood = 'wave' | 'idle' | 'celebrate' | 'sad' | 'think' | 'encourage' | 'rest'
type Clip = 'wave' | 'jump' | 'thumbs' | 'clap' | 'sad' | 'think' | 'point' | 'dance' | 'stretch' | 'kiss'

// Hand-drawn cartoon clips (generated from the original artwork, ~1.2 s each, in /public/vestibu).
// Every clip starts and ends in the neutral pose, so they chain without a visible jump.
const POOLS: Record<Mood, Clip[]> = {
  idle: ['wave', 'think', 'stretch', 'point', 'dance', 'kiss'],
  wave: ['wave', 'thumbs', 'kiss', 'clap', 'wave'],
  celebrate: ['jump', 'clap', 'dance', 'thumbs'],
  sad: ['sad', 'think'],
  think: ['think', 'point'],
  encourage: ['thumbs', 'clap'],
  rest: ['stretch', 'think'],
}
const src = (c: Clip, ext: 'mp4' | 'jpg') => `${import.meta.env.BASE_URL}vestibu/${c}.${ext}`

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Vestibu({ mood = 'idle', className = '' }: { mood?: Mood; className?: string }) {
  const pool = POOLS[mood]
  const [clip, setClip] = useState<Clip>(pool[0])
  const video = useRef<HTMLVideoElement>(null)
  const wait = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [still_, setStill] = useState(reducedMotion())

  useEffect(() => { setClip(pool[0]) }, [mood]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(wait.current), [])
  // Browsers pause muted video while the app is in the background; resume when it returns.
  useEffect(() => {
    const resume = () => { const v = video.current; if (!document.hidden && v && v.paused && !v.ended) v.play().catch(() => {}) }
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [])

  const next = () => {
    // Celebrations chain quickly; calmer moods rest a moment in the neutral pose.
    const rest = mood === 'celebrate' ? 250 : 1200 + Math.random() * 2200
    wait.current = setTimeout(() => {
      const options = pool.length > 1 ? pool.filter(c => c !== clip) : pool
      const pick = options[Math.floor(Math.random() * options.length)]
      if (pick === clip) video.current?.play().catch(() => {})
      else setClip(pick)
    }, rest)
  }

  if (still_) return <img src={still} alt="Vestibu" draggable={false} className={`vestibu-rig ${className}`} />
  return (
    <div className={`vestibu-rig ${className}`} role="img" aria-label="Vestibu">
      <video key={clip} ref={video} className="vb-video" src={src(clip, 'mp4')} poster={src(clip, 'jpg')}
        autoPlay muted playsInline preload="auto" disablePictureInPicture
        onEnded={next} onError={() => setStill(true)} />
    </div>
  )
}
