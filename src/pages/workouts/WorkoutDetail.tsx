import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { workouts } from '../../data/workouts'
import { completeDay, useCompleted } from '../../lib/progress'
import videoThumb from '../../assets/workouts/video-thumb.png'
import icBack from '../../assets/onboarding/back.svg'
import icUser from '../../assets/onboarding/user-sm.svg'
import icProgram from '../../assets/workouts/d-program.svg'
import icStar from '../../assets/workouts/d-star.svg'
import icBike from '../../assets/workouts/d-bike.svg'
import icTimer from '../../assets/workouts/d-timer.svg'
import icFlame from '../../assets/workouts/d-flame.svg'
import icSpeed from '../../assets/workouts/d-speed.svg'
import icList from '../../assets/workouts/d-list.svg'
import icShield from '../../assets/workouts/d-shield.svg'
import icClock from '../../assets/workouts/d-clock.svg'
import icPlayCircle from '../../assets/workouts/d-playcircle.svg'
import icCoach from '../../assets/workouts/d-coach.svg'
import icPlay from '../../assets/workouts/d-play.svg'
import icVolume from '../../assets/workouts/d-volume.svg'
import icCc from '../../assets/workouts/d-cc.svg'
import icFull from '../../assets/workouts/d-full.svg'
import icSwitch from '../../assets/workouts/d-switch.svg'
import icDone from '../../assets/workouts/d-done.svg'
import icCurrent from '../../assets/workouts/d-current.svg'
import icLock from '../../assets/workouts/d-lock.svg'
import icPrev from '../../assets/workouts/d-prev.svg'
import icNext from '../../assets/workouts/d-next.svg'

const stepColors = ['bg-[#6ffbbe] text-[#002113]', 'bg-[#e9ddff] text-[#23005c]', 'bg-[#ffdcc5] text-[#301400]', 'bg-[#d8e3fb] text-ink']
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function WorkoutDetail() {
  const navigate = useNavigate()
  const day = Number(useParams().day)
  const w = workouts.find(x => x.day === day)
  const { completed, statusOf } = useCompleted()
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)
  const switcherRef = useRef<HTMLDivElement>(null)

  const total = (w?.mins ?? 0) * 60
  const status = w ? statusOf(w.day) : 'locked'

  useEffect(() => {
    setPlaying(false)
    setElapsed(0)
  }, [day])

  // No real video yet: simulate playback, 1s of wall time = 10s of workout.
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setElapsed(e => Math.min(total, e + 10)), 1000)
    return () => clearInterval(t)
  }, [playing, total])

  useEffect(() => {
    switcherRef.current?.querySelector('[data-current]')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [day])

  if (!w) return <Navigate to="/workouts" replace />
  if (status === 'locked') return <Navigate to="/workouts" replace />

  const isDone = completed.includes(w.day)
  const finished = elapsed >= total

  function start() {
    setPlaying(true)
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function finish() {
    completeDay(w!.day)
    setPlaying(false)
    navigate(`/celebrate/${w!.day}`)
  }

  const near = workouts.filter(x => Math.abs(x.day - w.day) <= 2)

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-[#f9f9ff]">
      <header className="sticky top-0 z-20 bg-[rgba(249,249,255,0.8)] pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <button aria-label="Go back" onClick={() => navigate('/workouts')} className="flex size-11 items-center justify-center rounded-full">
              <img src={icBack} alt="" className="size-4" />
            </button>
            <h1 className="text-[20px] leading-7 font-bold">Workout Details</h1>
          </div>
          <Link to="/profile" aria-label="Profile" className="flex size-8 items-center justify-center rounded-full bg-[#006c49]">
            <img src={icUser} alt="" className="size-3" />
          </Link>
        </div>
      </header>

      <main className="stagger flex flex-col gap-5 px-4 pt-1 pb-10">
        <div className="flex items-center justify-between gap-2 rounded-full bg-[#f0f3ff] px-3.5 py-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <span className="flex min-w-0 items-center gap-1.5">
            <img src={icProgram} alt="" style={{ width: 15, height: 14.25 }} />
            <span className="truncate text-xs leading-4 font-bold tracking-[0.6px] text-[#006c49] uppercase">{w.category} program</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs leading-4 font-extrabold tracking-[0.48px]">
            <img src={icStar} alt="" className="size-[13.333px]" />{w.day}<span className="font-normal text-[#3c4a42]">/22</span>
          </span>
        </div>

        <div ref={playerRef} className="relative scroll-mt-20 overflow-hidden rounded-[32px] bg-[#263143] shadow-lg">
          <div className="relative h-56">
            <img src={videoThumb} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs leading-4 font-bold tracking-[0.48px] backdrop-blur-[12px]">
            <img src={icCoach} alt="" style={{ width: 14.667, height: 14 }} />Coach Linh Nhi
          </span>
          {!playing && (
            <button
              aria-label="Play workout video"
              onClick={() => setPlaying(true)}
              className="pulse-ring absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#6ffbbe] pr-2.5 pl-3.5 shadow-inner">
                <img src={icPlay} alt="" style={{ width: 14.667, height: 18.667 }} />
              </span>
            </button>
          )}
          {playing && (
            <button aria-label="Pause" onClick={() => setPlaying(false)} className="absolute inset-0" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(elapsed / total) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.48px] text-white">
                <img src={icVolume} alt="" style={{ width: 12, height: 11.667 }} />{fmt(elapsed)} / {fmt(total)}
              </span>
              <span className="flex items-center gap-2">
                <img src={icCc} alt="" style={{ width: 12, height: 10.667 }} />
                <img src={icFull} alt="" className="size-3" />
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm leading-[18px] font-semibold text-[#006c49]">
            <img src={icBike} alt="" style={{ width: 13.5, height: 12 }} />Recharge and refresh your body today! 🌿
          </span>
          <h2 className="pt-1.5 text-2xl leading-8 font-bold tracking-[-0.24px]">Day {w.day}: {w.title}</h2>
          <p className="text-sm leading-5 text-[#3c4a42]">{w.blurb}</p>
        </div>

        <div className="flex gap-2">
          {[
            { icon: icTimer, w: 15, h: 17.5, v: String(w.mins), l: 'mins', c: '' },
            { icon: icFlame, w: 13.333, h: 15, v: `~${w.kcal}`, l: 'kcal', c: 'text-[#944a00]' },
            { icon: icSpeed, w: 16.647, h: 13.333, v: w.intensity, l: 'Intensity', c: 'text-[#006c49]' },
            { icon: icList, w: 15, h: 13.333, v: String(w.moves), l: 'moves', c: 'text-[#6b38d4]' },
          ].map(p => (
            <div key={p.l} className="flex flex-1 flex-col items-center justify-center rounded-[32px] bg-white p-2.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <img src={p.icon} alt="" className="mb-0.5" style={{ width: p.w, height: p.h }} />
              <span className={`text-base leading-4 font-extrabold tracking-[0.16px] ${p.c}`}>{p.v}</span>
              <span className="pt-0.5 text-[10px] leading-[15px] text-[#3c4a42]">{p.l}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 rounded-[32px] bg-white p-4 shadow-md">
          <div className="relative size-12 shrink-0 self-start">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#6ffbbe] text-2xl shadow-inner">🌱</span>
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-[#ef8933] text-[10px]">✨</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-[18px] font-semibold text-[#006c49]">
              Joy Sprout <span className="text-xs font-bold tracking-[0.48px] text-[#3c4a42]">• FitJoy Coach</span>
            </span>
            <p className="text-sm leading-[22.75px]">“Coach Tip: Maintain a steady breath and never overstrain. With every exhale, let tension melt away. You're doing amazing! 🌱✨”</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-[32px] bg-[rgba(255,220,197,0.4)] p-4 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ef8933]">
            <img src={icShield} alt="" style={{ width: 13.333, height: 16.667 }} />
          </span>
          <div>
            <h3 className="text-base leading-5 font-bold tracking-[0.16px] text-[#5c2c00]">Health &amp; Safety Reminder 🛡️</h3>
            <p className="text-sm leading-[19.25px] text-[#713700]">Listen to your body. Pause or ease off intensity if you experience sharp pain or dizziness. Your well-being comes first!</p>
          </div>
        </div>

        <section className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] leading-7 font-bold">Step-by-Step Routine</h3>
            <span className="rounded-full bg-[rgba(111,251,190,0.4)] px-2.5 py-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">{w.steps.length} Curated Steps</span>
          </div>
          {w.steps.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3.5 rounded-[32px] bg-white p-3.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-base leading-5 font-bold ${stepColors[i % 4]}`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm leading-[18px] font-semibold">{s.name}</h4>
                <span className="flex items-center gap-1 text-sm leading-5 text-[#3c4a42]">
                  <img src={icClock} alt="" style={{ width: 10.5, height: 12.25 }} />{s.mins} mins • {s.note}
                </span>
              </div>
              <button aria-label={`Play step ${i + 1}`} onClick={start} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#dee8ff]">
                <img src={icPlayCircle} alt="" className="size-[16.667px]" />
              </button>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm leading-[18px] font-semibold">
              <img src={icSwitch} alt="" style={{ width: 15, height: 10.5 }} />Quick Workout Switcher
            </span>
            <Link to="/workouts" className="text-xs leading-[18px] text-[#006c49]">View all (22)</Link>
          </div>
          <div ref={switcherRef} className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1.5">
            {near.map(x => {
              const st = statusOf(x.day)
              const cur = x.day === w.day
              const locked = st === 'locked'
              return (
                <Link
                  key={x.day}
                  to={locked ? '#' : `/workouts/${x.day}`}
                  onClick={e => locked && e.preventDefault()}
                  data-current={cur || undefined}
                  className={`flex shrink-0 flex-col justify-between rounded-2xl ${cur ? 'w-40 border-2 border-[#006c49] bg-[rgba(111,251,190,0.3)] p-4 shadow-md' : 'w-36 border border-[rgba(187,202,191,0.3)] bg-white p-[15px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
                >
                  <span className="flex items-center justify-between pb-1.5">
                    {cur ? (
                      <span className="rounded-full bg-[#006c49] px-2 py-0.5 text-[11px] leading-[16.5px] font-bold text-white">Current</span>
                    ) : (
                      <span className="text-[11px] leading-[16.5px] font-bold text-[#3c4a42]">Day {x.day}</span>
                    )}
                    {locked ? <img src={icLock} alt="" style={{ width: 10.667, height: 14 }} /> : st === 'completed' ? <img src={icDone} alt="" className="size-[13.333px]" /> : <img src={icCurrent} alt="" className="size-[15px]" />}
                  </span>
                  <span className={`truncate text-[13px] leading-[19.5px] ${cur ? 'font-bold text-[#006c49]' : ''}`}>{x.title}</span>
                  <span className={`pt-1 text-[11px] leading-[16.5px] ${cur ? 'font-medium' : 'text-[#3c4a42]'}`}>
                    {x.mins} mins • {cur ? 'Selected' : st === 'completed' ? 'Completed' : st === 'locked' ? 'Locked' : 'Up next'}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-3">
          {playing || elapsed > 0 ? (
            <button
              onClick={finish}
              disabled={!finished && !isDone}
              className="rounded-full bg-brand px-6 py-4 text-base leading-5 font-bold tracking-[0.16px] text-[#00422b] shadow-[0_10px_15px_-3px_rgba(16,185,129,0.3)] disabled:opacity-60"
            >
              {finished ? `Complete Day ${w.day} ✓` : `Keep going… ${fmt(total - elapsed)} left`}
            </button>
          ) : (
            <button
              onClick={start}
              className="rounded-full bg-brand px-6 py-4 text-base leading-5 font-bold tracking-[0.16px] text-[#00422b] shadow-[0_10px_15px_-3px_rgba(16,185,129,0.3)] active:scale-[0.98]"
            >
              {isDone ? `Replay Day ${w.day} ▶` : `Start Workout Day ${w.day} ▶`}
            </button>
          )}
          <div className="flex gap-3">
            <button
              disabled={w.day === 1}
              onClick={() => navigate(`/workouts/${w.day - 1}`)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#dee8ff] px-4 py-3 text-sm leading-[18px] font-semibold disabled:opacity-40"
            >
              <img src={icPrev} alt="" style={{ width: 5.55, height: 9 }} />Previous (Day {w.day - 1})
            </button>
            <button
              disabled={w.day === 22 || statusOf(w.day + 1) === 'locked'}
              onClick={() => navigate(`/workouts/${w.day + 1}`)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#dee8ff] px-4 py-3 text-sm leading-[18px] font-semibold disabled:opacity-40"
            >
              Next (Day {w.day + 1})<img src={icNext} alt="" style={{ width: 5.55, height: 9 }} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
