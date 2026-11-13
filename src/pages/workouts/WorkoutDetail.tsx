import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { workouts } from '../../data/workouts'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { completeDay, useCompleted } from '../../lib/progress'
import videoThumb from '../../assets/workouts/video-thumb.png'
import icBack from '../../assets/onboarding/back.svg'
import icCoach from '../../assets/workouts/d-coach.svg'


export default function WorkoutDetail() {
  const navigate = useNavigate()
  const day = Number(useParams().day)
  const lesson = new URLSearchParams(window.location.search).get('lesson') ?? '1'
  const w = workouts.find(x => x.day === day)
  const { completed, statusOf } = useCompleted()
  const [watched, setWatched] = useState(0)
  const player = useRef<VideoPlayerHandle>(null)

  const status = w ? statusOf(w.day) : 'locked'

  useEffect(() => {
    setWatched(0)
  }, [day])

  if (!w) return <Navigate to="/workouts" replace />
  if (status === 'locked') return <Navigate to="/workouts" replace />

  const isDone = completed.includes(w.day)
  // Watching 90% of the video counts as finishing the workout.
  const finished = watched >= 0.9

  function finish() {
    completeDay(w!.day)
    navigate(`/celebrate/${w!.day}`)
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-[#fbf8f3]">
      <header className="sticky top-0 z-20 bg-[rgba(251,248,243,0.8)] pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <button aria-label="Go back" onClick={() => navigate('/')} className="flex size-11 items-center justify-center rounded-full">
              <img src={icBack} alt="" className="size-4" />
            </button>
            <h1 className="text-[20px] leading-7 font-bold">Lesson</h1>
          </div>
          <span className="size-8" aria-hidden="true" />
        </div>
      </header>

      <main className="stagger flex flex-col gap-5 px-4 pt-1 pb-10">
        <VideoPlayer
          ref={player}
          src={w.video}
          poster={videoThumb}
          onProgress={setWatched}
          badge={
            <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs leading-4 font-bold tracking-[0.48px] backdrop-blur-[12px]">
              <img src={icCoach} alt="" style={{ width: 14.667, height: 14 }} />Coach Linh Nhi
            </span>
          }
        />

        <div className="flex flex-col gap-1">
          <h2 className="pt-1.5 text-2xl leading-8 font-bold tracking-[-0.24px]">Day {w.day} · Lesson {lesson}: {w.title}</h2>
          <p className="text-sm leading-5 text-[#3f4a4b]">{w.blurb}</p>
        </div>


        <div className="flex gap-3 rounded-[32px] bg-white p-4 shadow-md">
          <div className="relative size-12 shrink-0 self-start">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#ffe3d3] text-2xl shadow-inner">🌱</span>
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-[#ef8933] text-[10px]">✨</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-[18px] font-semibold text-[#13707e]">
              Joy Sprout <span className="text-xs font-bold tracking-[0.48px] text-[#3f4a4b]">• FitJoy Coach</span>
            </span>
            <p className="text-sm leading-[22.75px]">“Coach Tip: Maintain a steady breath and never overstrain. With every exhale, let tension melt away. You're doing amazing! 🌱✨”</p>
          </div>
        </div>

        {watched > 0 && (
          <button
            onClick={finish}
            disabled={!finished && !isDone}
            className="rounded-full bg-brand px-6 py-4 text-base leading-5 font-bold tracking-[0.16px] text-white shadow-[0_10px_15px_-3px_rgba(19,112,126,0.3)] disabled:opacity-60"
          >
            {finished ? `Complete Day ${w.day} ✓` : `Keep going… ${Math.round(watched * 100)}% watched`}
          </button>
        )}

        <p className="text-center text-sm font-semibold text-[#6f7472]">Day {w.day} · Lesson {lesson} of 3</p>
      </main>
    </div>
  )
}
