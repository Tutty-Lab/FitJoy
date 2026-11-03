import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { workouts, categoryColor, pad, type Category } from '../../data/workouts'
import { useCompleted } from '../../lib/progress'
import heroMascot from '../../assets/workouts/hero-mascot.png'
import thumb from '../../assets/workouts/thumb-active.png'
import icLevel from '../../assets/workouts/l-level.svg'
import icSearch from '../../assets/workouts/l-search.svg'
import icProgress from '../../assets/workouts/l-progress.svg'
import icBolt from '../../assets/workouts/l-bolt.svg'
import icSpin from '../../assets/workouts/l-spin.svg'
import icClock from '../../assets/workouts/l-clock.svg'
import icFlame from '../../assets/workouts/l-flame.svg'
import icPlay from '../../assets/workouts/l-play.svg'
import icCheck from '../../assets/workouts/l-check.svg'
import icReplay from '../../assets/workouts/l-replay.svg'
import icLock from '../../assets/workouts/l-lock.svg'
import icLockClock from '../../assets/workouts/l-lockclock.svg'
import icInfo from '../../assets/workouts/l-info.svg'

type Status = 'all' | 'current' | 'completed' | 'locked'
const categories: Category[] = ['Warm-up', 'Core & Cardio', 'Fat Burn', 'Recovery']

export default function Library() {
  const navigate = useNavigate()
  const { completed, statusOf } = useCompleted()
  const [status, setStatus] = useState<Status>('all')
  const [cat, setCat] = useState<Category | null>(null)
  const [q, setQ] = useState('')

  const done = completed.length
  const pct = Math.round((done / 22) * 100)
  const phaseEnd = done < 11 ? 11 : 22

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    const rank = { current: 0, completed: 1, locked: 2 }
    return workouts
      .filter(w => status === 'all' || statusOf(w.day) === status)
      .filter(w => !cat || w.category === cat)
      .filter(w => !query || `${w.title} ${w.category}`.toLowerCase().includes(query))
      .sort((a, b) => rank[statusOf(a.day)] - rank[statusOf(b.day)] || (statusOf(a.day) === 'completed' ? b.day - a.day : a.day - b.day))
  }, [q, status, cat, statusOf])

  const pills: [Status, string][] = [
    ['all', 'All (22)'],
    ['current', 'In Progress (1)'],
    ['completed', `Completed (${done})`],
    ['locked', `Locked (${22 - done - 1 < 0 ? 0 : 22 - done - 1})`],
  ]

  return (
    <div className="stagger flex flex-col gap-4 bg-[#f9f9ff] px-4 pt-2 pb-6">
      <section className="flex items-center justify-between overflow-hidden rounded-[32px] bg-[#dee8ff] p-4 shadow-md">
        <div className="max-w-[233px]">
          <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-[rgba(187,202,191,0.3)] bg-white px-[11px] py-[3px] text-xs leading-[15px] font-semibold tracking-[0.48px] text-[#006c49]">
            <img src={icLevel} alt="" style={{ width: 5.833, height: 11.667 }} />Level 2 • Active Athlete
          </span>
          <h1 className="text-2xl leading-8 font-extrabold tracking-[-0.6px]">22-Day Workout Plan</h1>
          <p className="pt-1 text-sm leading-5 text-[#3c4a42]">Structured journey unlocking day by day! 🏆</p>
        </div>
        <img src={heroMascot} alt="" className="float size-28 shrink-0 object-contain" />
      </section>

      <label className="relative block">
        <img src={icSearch} alt="" className="absolute top-1/2 left-4 size-[16.5px] -translate-y-1/2" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search exercises, muscle groups..."
          className="h-12 w-full rounded-full bg-white pr-4 pl-12 text-base shadow-sm outline-none placeholder:text-[#6c7a71] focus:ring-2 focus:ring-brand"
        />
      </label>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {pills.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setStatus(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm leading-[18px] ${status === k ? 'bg-[#006c49] font-bold text-white shadow-md' : 'bg-white font-semibold text-[#3c4a42] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="-mx-4 -mt-1 flex gap-2 overflow-x-auto px-4">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(v => (v === c ? null : c))}
            aria-pressed={cat === c}
            className={`shrink-0 rounded-full px-3 py-1 text-xs leading-4 font-bold tracking-[0.48px] ${cat === c ? 'bg-[#006c49] text-white' : `bg-[#e7eeff] ${categoryColor[c]}`}`}
          >
            # {c}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[20px] leading-7 font-bold">
            <img src={icProgress} alt="" className="size-5" />Training Progress
          </h2>
          <span className="rounded-full bg-[#006c49] px-3 py-1 text-base leading-5 font-bold tracking-[0.16px] text-white">{pct}%</span>
        </div>
        <div className="h-3.5 overflow-hidden rounded-full bg-[#e7eeff] p-0.5 shadow-inner">
          <div className="bar-grow h-full rounded-full bg-brand shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm leading-5 font-semibold text-[#3c4a42]">Completed {done}/22 sessions</span>
          <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">Phase {done < 11 ? 1 : 2}</span>
        </div>
        <div className="flex items-center gap-2 rounded-[48px] bg-[#ffdcc5] p-3">
          <img src={icBolt} alt="" style={{ width: 15.896, height: 18.25 }} />
          <p className="text-sm leading-[19.25px] font-bold text-[#301400]">
            {done >= 22 ? 'Amazing! You finished the whole 22-day program! 🎉' : `Keep going! Only ${phaseEnd - done} sessions left to complete Phase ${done < 11 ? 1 : 2}!`}
          </p>
        </div>
      </section>

      <div className="flex items-center justify-between pt-1">
        <h3 className="text-[20px] leading-7 font-bold">Workout Journey</h3>
        <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">Auto-unlocked</span>
      </div>

      {list.length === 0 && <p className="py-6 text-center text-sm text-[#6c7a71]">No workouts match your filters.</p>}

      {list.map(w => {
        const s = statusOf(w.day)
        if (s === 'current')
          return (
            <section key={w.day} className="flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-[#ef8933] px-3 py-1 text-xs leading-4 font-bold tracking-[0.3px] text-white">
                  <img src={icSpin} alt="" className="size-[11.667px]" />In Progress
                </span>
                <span className="text-base leading-5 font-bold tracking-[0.16px] text-[#6b38d4]">Day {w.day}</span>
              </div>
              <Link to={`/workouts/${w.day}`} className="flex items-center gap-2">
                <img src={thumb} alt="" className="size-20 shrink-0 bg-[#e7eeff] object-cover shadow-inner" />
                <div className="min-w-0">
                  <h4 className="truncate text-[20px] leading-7 font-bold">{w.title}</h4>
                  <div className="flex items-center gap-3 pt-1 text-sm leading-5 text-[#3c4a42]">
                    <span className="flex items-center gap-1"><img src={icClock} alt="" className="size-[13.333px]" />{w.mins} mins</span>
                    <span className="flex items-center gap-1"><img src={icFlame} alt="" style={{ width: 10.667, height: 12.667 }} />~{w.kcal} kcal</span>
                  </div>
                  <span className="block pt-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">{w.category}</span>
                </div>
              </Link>
              <button
                onClick={() => navigate(`/workouts/${w.day}`)}
                className="mt-2 flex h-14 items-center justify-center gap-2 rounded-full bg-[#006c49] text-base leading-5 font-bold tracking-[0.16px] text-white shadow-lg active:scale-[0.98]"
              >
                Start Workout Now
                <img src={icPlay} alt="" className="size-[18.333px]" />
              </button>
            </section>
          )
        const locked = s === 'locked'
        return (
          <Link
            key={w.day}
            to={locked ? '#' : `/workouts/${w.day}`}
            onClick={e => locked && e.preventDefault()}
            aria-disabled={locked}
            className={`flex items-center justify-between gap-2 rounded-[32px] p-4 ${locked ? 'bg-[#d8e3fb] opacity-75 shadow-inner' : 'bg-[#f0f3ff] opacity-95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${locked ? 'bg-[#bbcabf]' : 'bg-brand'}`}>
                {locked ? <img src={icLock} alt="" style={{ width: 14.667, height: 19.25 }} /> : <img src={icCheck} alt="" style={{ width: 16.3, height: 12.025 }} />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">Day {pad(w.day)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] ${locked ? 'bg-[#cfdaf2] text-[#3c4a42]' : 'bg-[rgba(0,108,73,0.1)] text-[#006c49]'}`}>
                    {locked ? 'Locked' : 'Completed'}
                  </span>
                </span>
                <span className={`block truncate text-lg leading-[26px] font-bold ${locked ? 'text-[#3c4a42]' : ''}`}>{w.title}</span>
                <span className={`block truncate text-sm leading-5 ${locked ? 'text-[#6c7a71]' : 'text-[#3c4a42]'}`}>
                  {locked ? `${w.mins} mins • Unlocks after Day ${w.day - 1}` : `${w.mins} mins • ~${w.kcal} kcal • ${w.category}`}
                </span>
              </span>
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7eeff]">
              {locked ? <img src={icLockClock} alt="" style={{ width: 14.25, height: 16.5 }} /> : <img src={icReplay} alt="Replay" style={{ width: 15, height: 17.5 }} />}
            </span>
          </Link>
        )
      })}

      <div className="flex gap-2 rounded-[32px] bg-[#e7eeff] p-4">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8455ef]">
          <img src={icInfo} alt="" className="size-[15px]" />
        </span>
        <div>
          <h5 className="text-[20px] leading-7 font-bold">22-Day Program Guidelines</h5>
          <p className="pt-1 text-sm leading-[22.75px] text-[#3c4a42]">
            To maximize muscle recovery and prevent injuries, upcoming workouts automatically unlock as soon as you finish today's scheduled session. Stay consistent every day!
          </p>
        </div>
      </div>
    </div>
  )
}
