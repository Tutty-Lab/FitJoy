import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { workouts } from '../../data/workouts'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { completeDay, useCompleted } from '../../lib/progress'
import videoThumb from '../../assets/workouts/video-thumb.png'
import icBack from '../../assets/onboarding/back.svg'
import icUser from '../../assets/onboarding/user-sm.svg'
import icCoach from '../../assets/workouts/d-coach.svg'
import icSwitch from '../../assets/workouts/d-switch.svg'
import icDone from '../../assets/workouts/d-done.svg'
import icCurrent from '../../assets/workouts/d-current.svg'
import icLock from '../../assets/workouts/d-lock.svg'
import icPrev from '../../assets/workouts/d-prev.svg'
import icNext from '../../assets/workouts/d-next.svg'


export default function WorkoutDetail() {
  const navigate = useNavigate()
  const day = Number(useParams().day)
  const w = workouts.find(x => x.day === day)
  const { completed, statusOf } = useCompleted()
  const [watched, setWatched] = useState(0)
  const player = useRef<VideoPlayerHandle>(null)
  const [picker, setPicker] = useState(false)

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
            <button aria-label="Go back" onClick={() => navigate('/workouts')} className="flex size-11 items-center justify-center rounded-full">
              <img src={icBack} alt="" className="size-4" />
            </button>
            <h1 className="text-[20px] leading-7 font-bold">Lesson</h1>
          </div>
          <Link to="/profile" aria-label="Profile" className="flex size-8 items-center justify-center rounded-full bg-[#13707e]">
            <img src={icUser} alt="" className="size-3" />
          </Link>
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
          <h2 className="pt-1.5 text-2xl leading-8 font-bold tracking-[-0.24px]">Day {w.day}: {w.title}</h2>
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

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous workout"
            disabled={w.day === 1}
            onClick={() => navigate(`/workouts/${w.day - 1}`)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7efee] disabled:opacity-40"
          >
            <img src={icPrev} alt="" style={{ width: 5.55, height: 9 }} />
          </button>
          <button
            onClick={() => setPicker(true)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white text-sm leading-[18px] font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          >
            <img src={icSwitch} alt="" style={{ width: 15, height: 10.5 }} />Day {w.day} / 22 · View all
          </button>
          <button
            aria-label="Next workout"
            disabled={w.day === 22 || statusOf(w.day + 1) === 'locked'}
            onClick={() => navigate(`/workouts/${w.day + 1}`)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7efee] disabled:opacity-40"
          >
            <img src={icNext} alt="" style={{ width: 5.55, height: 9 }} />
          </button>
        </div>
      </main>

      <AnimatePresence>
        {picker && (
          <motion.div className="fixed inset-0 z-40 mx-auto flex max-w-[440px] items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={() => setPicker(false)} />
            <motion.div
              role="dialog"
              aria-label="All workouts"
              className="relative max-h-[75dvh] w-full overflow-y-auto rounded-t-[32px] bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-slate-200" />
              <h3 className="pb-2 text-lg leading-7 font-bold">All workouts</h3>
              <div className="flex flex-col gap-1.5">
                {workouts.map(x => {
                  const st = statusOf(x.day)
                  const cur = x.day === w.day
                  const locked = st === 'locked'
                  return (
                    <button
                      key={x.day}
                      disabled={locked}
                      onClick={() => {
                        setPicker(false)
                        navigate(`/workouts/${x.day}`)
                      }}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left disabled:opacity-45 ${cur ? 'bg-[rgba(255,227,211,0.3)] ring-2 ring-[#13707e]' : 'bg-[#f3f6f5]'}`}
                    >
                      <span className="w-12 shrink-0 text-xs leading-4 font-bold text-[#6f7472]">Day {x.day}</span>
                      <span className="min-w-0 flex-1 truncate text-sm leading-5 font-semibold">{x.title}</span>
                      {locked ? <img src={icLock} alt="" style={{ width: 10.667, height: 14 }} /> : st === 'completed' ? <img src={icDone} alt="" className="size-[13.333px]" /> : <img src={icCurrent} alt="" className="size-[15px]" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
