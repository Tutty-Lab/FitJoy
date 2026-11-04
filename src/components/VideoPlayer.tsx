import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import icPlay from '../assets/workouts/d-play.svg'
import icVolume from '../assets/workouts/d-volume.svg'
import icFull from '../assets/workouts/d-full.svg'

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export type VideoPlayerHandle = { play: () => void }

type Props = {
  src: string
  poster: string
  badge?: React.ReactNode
  // Fraction of the video (0–1) the viewer has reached at least once.
  onProgress?: (watched: number) => void
  onEnded?: () => void
}

// Native <video> with FitJoy-styled controls. Native playback keeps it light and works inside
// the iOS WebView (Capacitor) with inline play and the system fullscreen player.
export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(function VideoPlayer({ src, poster, badge, onProgress, onEnded }, ref) {
  const video = useRef<HTMLVideoElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const maxSeen = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    maxSeen.current = 0
    setTime(0)
    setStarted(false)
    setPlaying(false)
    setError(false)
  }, [src])

  const play = () => {
    const v = video.current
    if (!v) return
    v.play().catch(() => setError(true))
  }
  useImperativeHandle(ref, () => ({
    play() {
      box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      play()
    },
  }))

  const toggle = () => (video.current?.paused ? play() : video.current?.pause())

  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!v) return
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.())
    else v.webkitEnterFullscreen?.()
  }

  return (
    <div ref={box} className="relative scroll-mt-20 overflow-hidden rounded-[32px] bg-black shadow-lg">
      <video
        ref={video}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        muted={muted}
        onClick={toggle}
        onPlay={() => {
          setPlaying(true)
          setStarted(true)
        }}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onTimeUpdate={e => {
          const v = e.currentTarget
          setTime(v.currentTime)
          if (v.duration) {
            maxSeen.current = Math.max(maxSeen.current, v.currentTime / v.duration)
            onProgress?.(maxSeen.current)
          }
        }}
        onEnded={() => {
          onProgress?.(1)
          onEnded?.()
        }}
        onError={() => setError(true)}
        className="block aspect-video w-full object-cover"
      />

      {badge && <span className="absolute top-3 right-3">{badge}</span>}

      {!playing && (
        <button
          aria-label={started ? 'Resume video' : 'Play workout video'}
          onClick={play}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="pulse-ring flex size-16 items-center justify-center rounded-full bg-brand">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#ffe3d3] pr-2.5 pl-3.5 shadow-inner">
              <img src={icPlay} alt="" style={{ width: 14.667, height: 18.667 }} />
            </span>
          </span>
        </button>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-white">
          Video couldn’t load. Check your connection and try again.
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-3">
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={e => {
            if (video.current) video.current.currentTime = Number(e.target.value)
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-[#1a8a99]"
          style={{ background: `linear-gradient(to right, #1a8a99 ${duration ? (time / duration) * 100 : 0}%, rgb(255 255 255 / 0.3) 0)` }}
        />
        <div className="flex items-center justify-between">
          <button onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className={`flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.48px] text-white ${muted ? 'opacity-50' : ''}`}>
            <img src={icVolume} alt="" style={{ width: 12, height: 11.667 }} />
            {fmt(time)} / {fmt(duration)}
          </button>
          <button onClick={fullscreen} aria-label="Fullscreen" className="p-1">
            <img src={icFull} alt="" className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
})
