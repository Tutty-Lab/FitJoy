import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { workouts } from '../../data/workouts'
import { useCompleted } from '../../lib/progress'
import { loadProfile } from '../../lib/profile'
import { playChime } from '../Reminders'
import mascot from '../../assets/home/mascot.png'

const colors = ['#10b981', '#fbbf24', '#8455ef', '#ef8933', '#6ffbbe', '#f472b6']

export default function Celebration() {
  const day = Number(useParams().day)
  const w = workouts.find(x => x.day === day)
  const { completed, current } = useCompleted()
  const p = loadProfile()

  const confetti = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.8, dur: 2.2 + Math.random() * 1.6, color: colors[i % colors.length], rot: Math.random() * 360, round: i % 3 === 0 })),
    [],
  )

  useEffect(() => {
    if (p?.chime ?? true) playChime()
  }, [])

  if (!w || !completed.includes(day)) return <Navigate to="/workouts" replace />

  const total = completed.length
  const allDone = total >= 22
  const next = workouts.find(x => x.day === current)

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-[440px] flex-col overflow-hidden bg-gradient-to-b from-[#d1fae5] via-[#f9f9ff] to-[#fffbeb] px-4 pt-[calc(env(safe-area-inset-top)+32px)] pb-10">
      <style>{`@keyframes fj-fall{0%{transform:translateY(-10vh) rotate(0)}100%{transform:translateY(110vh) rotate(720deg)}}@keyframes fj-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}`}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {confetti.map((c, i) => (
          <span
            key={i}
            className={`absolute top-0 block ${c.round ? 'size-2.5 rounded-full' : 'h-3.5 w-2 rounded-sm'}`}
            style={{ left: `${c.left}%`, background: c.color, transform: `rotate(${c.rot}deg)`, animation: `fj-fall ${c.dur}s ${c.delay}s ease-in forwards` }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center" style={{ animation: 'fj-pop .6s ease-out both' }}>
        <span className="rounded-full bg-white px-4 py-1 text-xs leading-4 font-bold tracking-[0.6px] text-[#006c49] uppercase shadow-sm">Day {w.day} complete</span>
        <div className="relative my-5">
          <div className="absolute inset-2 rounded-full bg-[rgba(52,211,153,0.35)] blur-[24px]" />
          <img src={mascot} alt="FitJoy mascot" className="float relative size-40 drop-shadow-xl" />
          <span className="absolute -top-2 -right-3 text-4xl">🎉</span>
        </div>
        <h1 className="text-[28px] leading-9 font-black tracking-[-0.6px]">{allDone ? 'Program complete!' : 'Amazing work!'}</h1>
        <p className="mt-1 max-w-[300px] text-sm leading-5 text-[#3c4a42]">
          {allDone
            ? `You finished all 22 workouts, ${p?.name || 'champ'}! Your consistency is unstoppable. 🏆`
            : `You crushed “${w.title}”, ${p?.name || 'friend'}! Every session makes you stronger. 🌱`}
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {[
          { v: `+${60}`, l: 'XP earned', c: 'text-amber-700', bg: 'bg-amber-100' },
          { v: w.mins, l: 'Minutes', c: 'text-[#6b38d4]', bg: 'bg-[#e9ddff]' },
          { v: `~${w.kcal}`, l: 'kcal burned', c: 'text-[#944a00]', bg: 'bg-[#ffdcc5]' },
        ].map(s => (
          <div key={s.l} className="flex flex-col items-center rounded-[24px] bg-white p-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <span className={`mb-1 rounded-full px-2.5 py-0.5 text-lg leading-7 font-black ${s.bg} ${s.c}`}>{s.v}</span>
            <span className="text-[11px] leading-4 font-semibold text-[#6c7a71]">{s.l}</span>
          </div>
        ))}
      </div>

      <section className="relative mt-4 flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-base leading-5 font-bold">22-Day Journey</span>
          <span className="text-sm leading-5 font-bold text-[#006c49]">{total}/22</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {workouts.map(x => (
            <span
              key={x.day}
              className={`size-3.5 rounded-full ${completed.includes(x.day) ? (x.day === day ? 'bg-amber-400 ring-2 ring-amber-200' : 'bg-brand') : 'bg-[#e7eeff]'}`}
             
            />
          ))}
        </div>
        {!allDone && next && (
          <span className="text-sm leading-5 text-[#3c4a42]">
            Unlocked: <b className="font-bold">Day {next.day} – {next.title}</b> 🔓
          </span>
        )}
      </section>

      <div className="relative mt-auto flex flex-col gap-3 pt-8">
        <Link to="/" className="flex h-14 items-center justify-center rounded-full bg-brand text-base leading-5 font-bold tracking-[0.16px] text-white drop-shadow-[0_4px_0_#005236] active:translate-y-1 active:drop-shadow-none">
          Back to Home
        </Link>
        {!allDone && next && (
          <Link to={`/workouts/${next.day}`} className="py-2 text-center text-sm leading-5 font-semibold text-[#3c4a42]">
            Preview tomorrow's workout →
          </Link>
        )}
      </div>
    </div>
  )
}
