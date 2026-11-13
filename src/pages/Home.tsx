import { useState } from 'react'
import { Link } from 'react-router-dom'
import mascot from '../assets/home/mascot.png'
import lessonThumb from '../assets/workouts/thumb-active.png'
import { workouts } from '../data/workouts'
import { loadProfile } from '../lib/profile'
import { programDay } from '../lib/checks'
import { useCompleted } from '../lib/progress'

const card = 'w-full rounded-3xl border border-mint bg-white p-[17px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'

function SectionHeader({ icon, iconBg, title, right }: { icon: React.ReactNode; iconBg: string; title: string; right: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`flex size-8 items-center justify-center rounded-full ${iconBg}`}>{icon}</span>
        <h3 className="text-base leading-6 font-black text-slate-900">{title}</h3>
      </div>
      {right}
    </div>
  )
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e3f2f1" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="#1a8a99" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="transition-all duration-700" />
    </svg>
  )
}

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? ['Good morning', '☀️'] : h < 18 ? ['Good afternoon', '🌤️'] : ['Good evening', '🌙']
}


export default function Home() {
  const [p] = useState(() => loadProfile())
  const name = p?.name || 'friend'
  const day = programDay()
  const { completed } = useCompleted()
  const currentDay = Math.min(22, Math.max(1, completed.length + 1))
  const currentWorkout = workouts.find(w => w.day === currentDay)
  const dailyLessons = [
    { label: 'Mobility flow', title: currentWorkout?.title ?? 'Daily mobility' },
    { label: 'Strength & balance', title: 'Core stability practice' },
    { label: 'Stretch & reset', title: 'Relaxing full-body stretch' },
  ]
  const pct = (day / 22) * 100
  const [hello, sun] = greeting()

  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      {/* Hero */}
      <section
        className="hero-card relative w-full overflow-hidden rounded-3xl border border-[rgba(207,231,229,0.6)] p-[17px] shadow-[0_10px_25px_rgba(19,112,126,0.12)]"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(227,242,241,0.9) 0%, #fff 50%, #fffbeb 100%)' }}
      >
        <div className="absolute -top-10 -right-8 size-36 rounded-full bg-[rgba(255,217,194,0.3)] blur-[40px]" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-[rgba(253,230,138,0.4)] blur-[24px]" />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-[22px] leading-[30.25px] font-black tracking-[-0.55px]">{hello}, {name}! {sun}</h2>
            </div>
            <div className="relative size-24 shrink-0">
              <img src={mascot} alt="Mascot" className="float relative size-24 object-contain" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mint bg-white/90 p-[13px] shadow-sm backdrop-blur-[12px]">
            <div>
              <div className="text-[11px] leading-6 font-bold tracking-[0.55px] text-brand-ink uppercase">22-day program</div>
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="text-base leading-6 font-bold text-slate-500">Day</span>
                <span className="text-2xl leading-8 font-black text-brand-deep">{day}</span>
                <span className="text-base leading-6 font-bold text-slate-500">/ 22</span>
              </div>
            </div>
            <div className="relative size-16 shrink-0">
              <ProgressRing pct={pct} />
              <span className="absolute inset-0 flex items-center justify-center text-xs leading-4 font-black text-brand-ink">{Math.round(pct)}%</span>
            </div>
          </div>
        </div>
      </section>

      {completed.length >= 22 && !p?.checks?.end && (
        <Link to="/check/end" className={`flex items-center justify-between gap-3 ${card}`}>
          <span>
            <span className="block text-base font-black text-slate-900">22 days done!</span>
            <span className="text-sm text-[#6f7472]">Take the balance check again</span>
          </span>
          <span className="rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white">Start</span>
        </Link>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black">Today · Day {currentDay}</h3>
          <span className="text-sm font-semibold text-slate-500">0/3 complete</span>
        </div>
        {dailyLessons.map((lesson, index) => (
          <Link key={lesson.label} to={`/workouts/${currentDay}`} className={`flex items-center gap-3 ${card}`}>
            <img src={lessonThumb} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-rust">Lesson {index + 1} · {lesson.label}</p>
              <h4 className="truncate text-base font-black">{lesson.title}</h4>
              <p className="text-sm text-slate-500">10 min · Start</p>
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200" />
          </Link>
        ))}
      </section>

    </div>
  )
}
