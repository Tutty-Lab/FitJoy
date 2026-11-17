import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import icVolume from '../assets/workouts/d-volume.svg'
import icFull from '../assets/workouts/d-full.svg'
import { L } from '../lib/i18n'

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export type VideoPlayerHandle = { play: () => void; pause: () => void; replay: () => void }

type Props = {
  src: string
  poster: string
  badge?: React.ReactNode
  // Fraction of the video (0–1) the viewer has reached at least once.
  onProgress?: (watched: number) => void
  onEnded?: () => void
  autoPlay?: boolean
  loop?: boolean
  onPlaybackChange?: (playing: boolean) => void
}

// Native <video> with FitJoy-styled controls. Native playback keeps it light and works inside
// the iOS WebView (Capacitor) with inline play and the system fullscreen player.
export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(function VideoPlayer({ src, poster, badge, onProgress, onEnded, autoPlay = false, loop = false, onPlaybackChange }, ref) {
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
    setDuration(0)
    if (autoPlay) play()
  }, [src, autoPlay])

  const play = () => {
    const v = video.current
    if (!v) return
    v.play().catch((e: DOMException) => {
      onPlaybackChange?.(false)
      // Autoplay may require another tap; this is not a broken video.
      if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') setError(true)
    })
  }
  useImperativeHandle(ref, () => ({
    play() {
      box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      play()
    },
    pause() { video.current?.pause(); onPlaybackChange?.(false) },
    replay() {
      if (video.current) video.current.currentTime = 0
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
        loop={loop}
        onClick={toggle}
        onPlay={() => {
          setStarted(true)
        }}
        onPlaying={() => { setPlaying(true); onPlaybackChange?.(true) }}
        onPause={() => { setPlaying(false); onPlaybackChange?.(false) }}
        onWaiting={() => { setPlaying(false); onPlaybackChange?.(false) }}
        onSeeking={() => onPlaybackChange?.(false)}
        onSeeked={e => { if (!e.currentTarget.paused && !e.currentTarget.ended && e.currentTarget.readyState >= 3) onPlaybackChange?.(true) }}
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
          setPlaying(false)
          onPlaybackChange?.(false)
          onProgress?.(1)
          onEnded?.()
        }}
        onError={() => { setError(true); setPlaying(false); onPlaybackChange?.(false) }}
        className="block aspect-video w-full object-cover"
      />

      {badge && <span className="absolute top-3 right-3">{badge}</span>}

      {!playing && (
        <button
          aria-label={started ? L('Video fortsetzen', 'Tiếp tục video') : L('Video abspielen', 'Phát video')}
          onClick={play}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="pulse-ring flex size-16 items-center justify-center rounded-full bg-brand">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#ffe3d3] pr-2.5 pl-3.5 shadow-inner">
              <Play aria-hidden="true" className="size-4 fill-current" />
            </span>
          </span>
        </button>
      )}

      {error && (
        <div role="alert" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center text-sm text-white">
          <p>{L('Das Video konnte nicht geladen werden. Prüfe deine Verbindung und versuche es erneut.', 'Không tải được video. Kiểm tra kết nối rồi thử lại.')}</p>
          <button type="button" onClick={() => { setError(false); video.current?.load(); play() }} className="rounded-xl bg-white px-4 py-2 font-bold text-brand-deep">{L('Erneut versuchen', 'Thử lại')}</button>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-3">
        <input
          type="range"
          aria-label={L('Position', 'Vị trí')}
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
          <button onClick={() => setMuted(m => !m)} aria-label={muted ? L('Ton an', 'Bật tiếng') : L('Ton aus', 'Tắt tiếng')} className={`flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.48px] text-white ${muted ? 'opacity-50' : ''}`}>
            <img src={icVolume} alt="" style={{ width: 12, height: 11.667 }} />
            {fmt(time)} / {fmt(duration)}
          </button>
          <button onClick={fullscreen} aria-label={L('Vollbild', 'Toàn màn hình')} className="p-1">
            <img src={icFull} alt="" className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
})
