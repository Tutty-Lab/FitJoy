import { Link, useNavigate } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { workouts, pad } from '../../data/workouts'
import { useCompleted } from '../../lib/progress'
import thumb from '../../assets/workouts/thumb-active.png'
import icClock from '../../assets/workouts/l-clock.svg'
import icReplay from '../../assets/workouts/l-replay.svg'
import icLock from '../../assets/workouts/l-lock.svg'

export default function Library() {
  const navigate = useNavigate()
  const { statusOf } = useCompleted()
  const rank = { current: 0, completed: 1, locked: 2 }
  const list = [...workouts].sort((a, b) => rank[statusOf(a.day)] - rank[statusOf(b.day)] || (statusOf(a.day) === 'completed' ? b.day - a.day : a.day - b.day))

  return (
    <div className="stagger flex flex-col gap-4 bg-[#fbf8f3] px-4 pt-2 pb-6">
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
                <Play aria-hidden="true" className="size-[18px] fill-current" />
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
                {locked ? <img src={icLock} alt="Locked" style={{ width: 14.667, height: 19.25 }} /> : <Check aria-hidden="true" className="size-5 text-white" strokeWidth={3} />}
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
