import { Link, useNavigate } from 'react-router-dom'
import { workouts, pad } from '../../data/workouts'
import { useCompleted } from '../../lib/progress'
import thumb from '../../assets/workouts/thumb-active.png'
import icProgress from '../../assets/workouts/l-progress.svg'
import icClock from '../../assets/workouts/l-clock.svg'
import icPlay from '../../assets/workouts/l-play.svg'
import icCheck from '../../assets/workouts/l-check.svg'
import icReplay from '../../assets/workouts/l-replay.svg'
import icLock from '../../assets/workouts/l-lock.svg'

export default function Library() {
  const navigate = useNavigate()
  const { completed, statusOf } = useCompleted()
  const done = completed.length
  const pct = Math.round((done / 22) * 100)
  const rank = { current: 0, completed: 1, locked: 2 }
  const list = [...workouts].sort((a, b) => rank[statusOf(a.day)] - rank[statusOf(b.day)] || (statusOf(a.day) === 'completed' ? b.day - a.day : a.day - b.day))

  return (
    <div className="stagger flex flex-col gap-4 bg-[#fbf8f3] px-4 pt-2 pb-6">
      <section className="flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[20px] leading-7 font-bold">
            <img src={icProgress} alt="" className="size-5" />Progress
          </h2>
          <span className="rounded-full bg-[#13707e] px-3 py-1 text-base leading-5 font-bold tracking-[0.16px] text-white">{pct}%</span>
        </div>
        <div className="h-3.5 overflow-hidden rounded-full bg-[#f3f6f5] p-0.5 shadow-inner">
          <div className="bar-grow h-full rounded-full bg-brand shadow-[0_0_8px_rgba(19,112,126,0.5)] transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm leading-5 font-semibold text-[#3f4a4b]">{done} of 22 lessons completed</span>
        </div>
      </section>

      {list.length === 0 && <p className="py-6 text-center text-sm text-[#6f7472]">No lessons.</p>}

      {list.map(w => {
        const s = statusOf(w.day)
        if (s === 'current')
          return (
            <section key={w.day} className="flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-base leading-5 font-bold tracking-[0.16px] text-[#d9652c]">Day {w.day}</span>
              </div>
              <Link to={`/workouts/${w.day}`} className="flex items-center gap-2">
                <img src={thumb} alt="" className="size-20 shrink-0 rounded-2xl border border-line bg-[#f3f6f5] object-cover shadow-inner" />
                <div className="min-w-0">
                  <h4 className="truncate text-[20px] leading-7 font-bold">{w.title}</h4>
                  <div className="flex items-center gap-3 pt-1 text-sm leading-5 text-[#3f4a4b]">
                    <span className="flex items-center gap-1"><img src={icClock} alt="" className="size-[13.333px]" />{w.mins} min</span>
                                      </div>
                </div>
              </Link>
              <button
                onClick={() => navigate(`/workouts/${w.day}`)}
                className="mt-2 flex h-14 items-center justify-center gap-2 rounded-full bg-[#13707e] text-base leading-5 font-bold tracking-[0.16px] text-white shadow-lg active:scale-[0.98]"
              >
                Start lesson
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
            className={`flex items-center justify-between gap-2 rounded-[32px] p-4 ${locked ? 'bg-[#e7efee] opacity-75 shadow-inner' : 'bg-[#f3f6f5] opacity-95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${locked ? 'bg-[#c3d0ce]' : 'bg-brand'}`}>
                {locked ? <img src={icLock} alt="Locked" style={{ width: 14.667, height: 19.25 }} /> : <img src={icCheck} alt="" style={{ width: 16.3, height: 12.025 }} />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6f7472]">Day {pad(w.day)}</span>
                  {!locked && <span className="rounded-full bg-[rgba(19,112,126,0.1)] px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#13707e]">Completed</span>}
                </span>
                <span className={`block truncate text-lg leading-[26px] font-bold ${locked ? 'text-[#3f4a4b]' : ''}`}>{w.title}</span>
                <span className={`block truncate text-sm leading-5 ${locked ? 'text-[#6f7472]' : 'text-[#3f4a4b]'}`}>
                  {`${w.mins} min`}
                </span>
              </span>
            </span>
            {!locked && <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f6f5]">
              <img src={icReplay} alt="Replay" style={{ width: 15, height: 17.5 }} />
            </span>}
          </Link>
        )
      })}


    </div>
  )
}
