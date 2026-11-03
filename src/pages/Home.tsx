import { useState } from 'react'
import { Switch as UiSwitch } from '@/components/ui/switch'
import { Link } from 'react-router-dom'
import mascot from '../assets/home/mascot.png'
import { workouts, pad } from '../data/workouts'
import { useCompleted } from '../lib/progress'
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number'
import { PressButton } from '@/components/ui/press-button'
import { loadProfile, saveProfile } from '../lib/profile'
import workoutThumb from '../assets/home/workout-thumb.png'
import icPwa from '../assets/home/c0.svg'
import icClose from '../assets/home/c1.svg'
import icWorkouts from '../assets/home/c3.svg'
import icMins from '../assets/home/c4.svg'
import icStreak from '../assets/home/c5.svg'
import icXp from '../assets/home/c6.svg'
import icPlay from '../assets/home/c7.svg'
import icClock from '../assets/home/c8.svg'
import icKcal from '../assets/home/c9.svg'
import icVideo from '../assets/home/c10.svg'
import icArrow from '../assets/home/c11.svg'
import icBell from '../assets/home/c12.svg'
import icMorning from '../assets/home/c13.svg'
import icDone from '../assets/home/c14.svg'
import icNoon from '../assets/home/c15.svg'
import icUpcoming from '../assets/home/c16.svg'
import icNight from '../assets/home/c17.svg'
import icJourney from '../assets/home/c18.svg'
import icPast from '../assets/home/c19.svg'
import icCheck from '../assets/home/c20.svg'
import icCurrent from '../assets/home/c21.svg'
import icLock from '../assets/home/c22.svg'
import icGoal from '../assets/home/c23.svg'
import icTrophy from '../assets/home/c24.svg'
import scWorkouts from '../assets/home/c25.svg'
import scBeforeAfter from '../assets/home/c26.svg'
import scReminders from '../assets/home/c27.svg'
import scProfile from '../assets/home/c28.svg'

const card = 'w-full rounded-3xl border border-mint bg-white p-[17px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'

function Icon({ src, w, h = w }: { src: string; w: number; h?: number }) {
  return <img src={src} alt="" style={{ width: w, height: h }} className="shrink-0" />
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return <UiSwitch checked={on} onCheckedChange={onChange} aria-label={label} className="h-5 w-9 data-checked:bg-brand data-unchecked:bg-slate-300" />
}

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

const slots = [
  { label: 'Morning', name: 'Sunrise Warmup', icon: <Icon src={icMorning} w={16.667} h={13.333} />, iconBg: 'bg-amber-100' },
  { label: 'Noon', name: 'Spine Alignment & Mobility', icon: <Icon src={icNoon} w={18.333} />, iconBg: 'bg-[rgba(253,230,138,0.7)]' },
  { label: 'Night', name: 'Deep Stretch & Rest', icon: <Icon src={icNight} w={16.667} />, iconBg: 'bg-indigo-100' },
]

const reminderStyle = {
  done: { row: 'bg-slate-50 border-[rgba(226,232,240,0.8)]', sub: 'text-slate-500 font-normal',
    badge: <span className="flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-xs leading-4 font-bold text-brand-ink"><Icon src={icDone} w={9.508} h={7.015} />Done</span> },
  passed: { row: 'bg-slate-50 border-[rgba(226,232,240,0.8)]', sub: 'text-slate-500 font-normal',
    badge: <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs leading-4 font-bold text-slate-600">Passed</span> },
  upcoming: { row: 'bg-[rgba(255,251,235,0.7)] border-amber-200', sub: 'text-[#78350f] font-medium',
    badge: <span className="flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-xs leading-4 font-bold text-[#78350f]"><Icon src={icUpcoming} w={9.333} h={11.667} />Upcoming</span> },
  scheduled: { row: 'bg-[rgba(238,242,255,0.5)] border-indigo-100', sub: 'text-slate-500 font-normal',
    badge: <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs leading-4 font-bold text-indigo-800">Scheduled</span> },
  off: { row: 'bg-slate-50 border-[rgba(226,232,240,0.8)] opacity-60', sub: 'text-slate-500 font-normal',
    badge: <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs leading-4 font-bold text-slate-500">Off</span> },
}

const toMin = (t: string) => t.split(':').map(Number).reduce((h, m) => h * 60 + m)

function ProgressRing({ pct }: { pct: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#d1fae5" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="transition-all duration-700" />
    </svg>
  )
}

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? ['Good morning', '☀️'] : h < 18 ? ['Good afternoon', '🌤️'] : ['Good evening', '🌙']
}

const shortcuts = [
  { to: '/workouts', label: 'Workouts', icon: <Icon src={scWorkouts} w={16.667} />, bg: 'bg-[rgba(236,253,245,0.7)]', dot: 'bg-brand' },
  { to: '/results', label: 'Before & After', icon: <Icon src={scBeforeAfter} w={16.667} h={15} />, bg: 'bg-[rgba(250,245,255,0.7)]', dot: 'bg-purple-500' },
  { to: '/reminders', label: 'Reminders', icon: <Icon src={scReminders} w={17.75} h={16.375} />, bg: 'bg-[rgba(255,251,235,0.7)]', dot: 'bg-amber-500' },
  { to: '/profile', label: 'Profile', icon: <Icon src={scProfile} w={15} />, bg: 'bg-[rgba(240,253,250,0.7)]', dot: 'bg-teal-500' },
]

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)
  const [p, setP] = useState(() => loadProfile())
  const { completed, current, streak, doneToday, mins, xp, level, levelPct } = useCompleted()
  const enabled = p?.reminders ?? [true, true, true]
  const times = p?.reminderTimes ?? ['06:30', '12:15', '20:00']
  const name = p?.name || 'friend'
  const done = completed.length
  const pct = (done / 22) * 100
  const next = workouts.find(w => w.day === current)!
  const finished = done >= 22
  const [hello, sun] = greeting()

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const upcomingIdx = times.findIndex((t, i) => enabled[i] && toMin(t) > nowMin)
  const reminderState = (i: number): keyof typeof reminderStyle =>
    !enabled[i] ? 'off' : toMin(times[i]) <= nowMin ? (doneToday ? 'done' : 'passed') : i === upcomingIdx ? 'upcoming' : 'scheduled'

  const toggle = (i: number) => setP(saveProfile({ reminders: enabled.map((v, j) => (j === i ? !v : v)) }))

  const milestone = [5, 10, 15, 20, 22].find(m => m > done) ?? 22
  const badges = [
    { title: [`${streak}-Day`, 'Streak'], emoji: '🔥', on: streak >= 1, grad: 'linear-gradient(45deg,#fbbf24,#fcd34d)', box: 'border-[rgba(253,230,138,0.8)] bg-gradient-to-b from-amber-50 to-orange-50', foot: streak >= 1 ? 'Unlocked ✓' : 'Start today' },
    { title: ['Steadfast', 'Warrior'], emoji: '🛡️', on: done > 0, grad: 'linear-gradient(45deg,#10b981,#2dd4bf)', box: 'border-[rgba(167,243,208,0.8)] bg-gradient-to-b from-emerald-50 to-teal-50', foot: `${done}/22 done` },
    { title: ['Mystery', 'Reward'], emoji: '🎁', on: false, grad: '', box: 'border-dashed border-amber-300 bg-slate-50', foot: `Unlocks at ${milestone}` },
  ]

  // Journey strip: everything before yesterday's day collapses into one chip.
  const prevDone = completed.filter(d => d < current - 1)

  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      {showBanner && (
        <div className="flex w-full items-center justify-between rounded-2xl border border-[rgba(167,243,208,0.7)] bg-gradient-to-r from-mint via-[#f0fdfa] to-amber-100 p-[11px] shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <Icon src={icPwa} w={12.5} h={18.333} />
            </span>
            <p className="text-[13px] leading-6">
              Install <b className="font-bold text-brand-deep">FitJoy PWA</b> for daily reminders!
            </p>
          </div>
          <button aria-label="Dismiss banner" onClick={() => setShowBanner(false)} className="rounded-full p-1">
            <Icon src={icClose} w={10.5} />
          </button>
        </div>
      )}

      {/* Hero */}
      <section
        className="relative w-full overflow-hidden rounded-3xl border border-[rgba(167,243,208,0.6)] p-[17px] shadow-[0_10px_25px_rgba(16,185,129,0.12)]"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(209,250,229,0.9) 0%, #fff 50%, #fffbeb 100%)' }}
      >
        <div className="absolute -top-10 -right-8 size-36 rounded-full bg-[rgba(110,231,183,0.3)] blur-[40px]" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-[rgba(253,230,138,0.4)] blur-[24px]" />
        <div className="relative flex flex-col gap-3">
          <div className="relative flex gap-2 rounded-2xl border border-[rgba(167,243,208,0.8)] bg-white/95 p-[11px] shadow-sm backdrop-blur-[4px]">
            <span className="text-[20px] leading-7">🌱</span>
            <p className="text-xs leading-[16.5px] font-semibold text-[#064e3b]">
              {finished
                ? `"You did all 22 workouts, ${name}! What a champion! 🏆✨"`
                : doneToday
                  ? `"Workout done today, ${name}! Rest up and come back tomorrow! 🌱✨"`
                  : `"Rise and shine, ${name}! Let’s crush today’s goals! 🌱✨"`}
            </p>
            <span className="absolute right-[30px] -bottom-[6.5px] size-3 rotate-45 border-r border-b border-[rgba(226,232,240,0.8)] bg-white" />
          </div>

          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.15)] px-[11px] py-[3px]">
                <span className="size-2 rounded-full bg-brand" />
                <span className="text-[11px] leading-6 font-bold tracking-[0.275px] text-brand-ink uppercase">{streak >= 3 ? 'High energy' : doneToday ? 'Recharging' : 'Ready to go'}</span>
              </span>
              <h2 className="text-[22px] leading-[30.25px] font-black tracking-[-0.55px]">{hello}, {name}! {sun}</h2>
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs leading-4 font-bold text-brand-ink">
                    <span className="text-amber-500">⭐</span>Level {level}: Active Warrior
                  </span>
                  <span className="rounded-md bg-[rgba(254,243,199,0.8)] px-1.5 py-0.5 text-[11px] leading-4 font-bold text-amber-700"><CountingNumber number={xp} /> XP</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full border border-emerald-200 bg-[rgba(209,250,229,0.8)]">
                  <div className="bar-grow absolute inset-y-px left-px rounded-full bg-gradient-to-r from-emerald-400 to-brand transition-all" style={{ width: `${Math.max(levelPct, 3)}%` }} />
                </div>
              </div>
            </div>
            <div className="relative size-24 shrink-0">
              <div className="absolute inset-[4.8px] rounded-full bg-[rgba(52,211,153,0.2)] blur-[12px]" />
              <img src={mascot} alt="FitJoy mascot" className="float relative size-24 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_16px_rgba(0,0,0,0.04)]" />
              <span className="absolute right-0 -bottom-1 rounded-full border border-mint bg-white px-[5px] py-[3px] text-[14px] leading-5 shadow-sm">🌿</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mint bg-white/90 p-[13px] shadow-sm backdrop-blur-[12px]">
            <div>
              <div className="text-[11px] leading-6 font-bold tracking-[0.55px] text-brand-ink uppercase">Standard 22-day program</div>
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="text-2xl leading-8 font-black text-brand-deep"><CountingNumber number={done} /></span>
                <span className="text-base leading-6 font-bold text-slate-500">/ 22 workouts</span>
              </div>
              <div className="pt-0.5 text-xs leading-4 font-medium text-slate-600">{done === 0 ? 'Your journey starts today!' : `${done} / 22 workouts completed!`}</div>
            </div>
            <div className="relative size-16 shrink-0">
              <ProgressRing pct={pct} />
              <span className="absolute inset-0 flex items-center justify-center text-xs leading-4 font-black text-brand-ink">{+pct.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="flex w-full gap-2">
        {[
          { v: <CountingNumber number={done} />, l: 'Workouts', icon: <Icon src={icWorkouts} w={16.5} />, bg: 'bg-mint', border: 'border-[rgba(209,250,229,0.8)]', vc: 'text-slate-800' },
          { v: <CountingNumber number={mins} />, l: 'Mins', icon: <Icon src={icMins} w={15} h={17.5} />, bg: 'bg-blue-100', border: 'border-[rgba(219,234,254,0.8)]', vc: 'text-slate-800' },
          { v: `${streak} 🔥`, l: `${streak}-Day Streak`, icon: <Icon src={icStreak} w={13.333} h={15} />, bg: 'bg-amber-100', border: 'border-[rgba(254,243,199,0.8)]', vc: 'text-amber-700' },
        ].map(s => (
          <div key={s.l} className={`flex flex-1 flex-col items-center rounded-2xl border bg-white p-[11px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${s.border}`}>
            <span className={`mb-1 flex size-9 items-center justify-center rounded-full ${s.bg}`}>{s.icon}</span>
            <span className={`text-lg leading-7 font-black ${s.vc}`}>{s.v}</span>
            <span className="text-[11px] leading-6 font-semibold text-slate-500">{s.l}</span>
          </div>
        ))}
      </div>

      {/* Up next */}
      <section className="flex w-full flex-col gap-3 rounded-3xl border-2 border-[rgba(110,231,183,0.8)] bg-white p-[18px] shadow-md">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-xs leading-4 font-bold text-brand-ink">
            <span className="size-2 rounded-full bg-brand" />{finished ? 'Replay' : doneToday ? 'Tomorrow' : 'Up Next'}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[rgba(254,243,199,0.8)] px-2 py-0.5 text-xs leading-4 font-bold text-amber-700">
            <Icon src={icXp} w={12.5} />+60 XP
          </span>
        </div>
        <Link to={`/workouts/${next.day}`} className="relative h-40 w-full overflow-hidden rounded-2xl">
          <img src={workoutThumb} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,23,0.85)] via-[rgba(15,23,42,0.3)] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="pulse-ring flex size-14 items-center justify-center rounded-full bg-[rgba(16,185,129,0.95)] pr-2.5 pl-3.5">
              <Icon src={icPlay} w={14.667} h={18.667} />
            </span>
          </div>
          <div className="absolute right-3 bottom-2.5 left-3 flex flex-col items-start gap-[5px]">
            <span className="rounded-full bg-[rgba(5,150,105,0.9)] px-2 text-[11px] leading-[18px] font-bold tracking-[0.55px] text-white uppercase backdrop-blur-[4px]">{next.category}</span>
            <h3 className="text-base leading-6 font-black text-white drop-shadow">Workout {next.day}: {next.title}</h3>
          </div>
        </Link>
        <div className="flex items-center justify-between px-1 text-xs leading-4 font-semibold text-slate-600">
          <span className="flex items-center gap-1"><Icon src={icClock} w={14.167} />{next.mins} mins</span>
          <span className="flex items-center gap-1"><Icon src={icKcal} w={11.333} h={13.458} />~{next.kcal} kcal</span>
          <span className="flex items-center gap-1"><Icon src={icVideo} w={14.167} h={11.333} />HD Video</span>
        </div>
        <PressButton asChild>
        <Link
          to={`/workouts/${next.day}`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3.5 text-base leading-6 font-black text-white shadow-[0_5px_0_#059669,0_10px_18px_rgba(16,185,129,0.35)] transition-transform active:translate-y-[5px] active:shadow-[0_0_0_#059669]"
        >
          {doneToday && !finished ? 'Preview Tomorrow ➔' : 'Start Workout ➔'}
          <Icon src={icArrow} w={18.15} />
        </Link>
        </PressButton>
      </section>

      {/* Reminders */}
      <section className={`flex flex-col gap-3 ${card}`}>
        <SectionHeader
          icon={<Icon src={icBell} w={16.667} h={16.708} />}
          iconBg="bg-mint"
          title="3 Daily Reminders"
          right={
            <Link to="/reminders" className="rounded-full border border-emerald-200 bg-emerald-50 px-[9px] py-[3px] text-xs leading-4 font-bold text-brand-deep">
              {enabled.some(Boolean) ? 'Active' : 'Off'}
            </Link>
          }
        />
        <div className="flex flex-col gap-2">
          {slots.map((s, i) => {
            const st = reminderStyle[reminderState(i)]
            return (
              <div key={s.label} className={`flex items-center justify-between rounded-2xl border p-[11px] ${st.row}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>{s.icon}</span>
                  <div>
                    <div className="text-[13px] leading-6 font-bold text-slate-900">{s.label}: {times[i]}</div>
                    <div className={`max-w-[130px] text-xs leading-4 ${st.sub}`}>{s.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {st.badge}
                  <Toggle label={`${s.label} reminder`} on={enabled[i]} onChange={() => toggle(i)} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Journey */}
      <section className={`flex flex-col gap-3 ${card}`}>
        <SectionHeader
          icon={<Icon src={icJourney} w={15} />}
          iconBg="bg-purple-100"
          title="22-Day Challenge Journey"
          right={<Link to="/workouts" className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs leading-4 font-bold text-brand-deep">Journey</Link>}
        />
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="flex h-20 w-max items-center gap-2.5">
            {prevDone.length > 0 && (
              <>
                <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-[13px] py-[7px] text-xs leading-4 font-bold text-slate-600">
                  <Icon src={icPast} w={13.333} />Day {pad(1)}{prevDone.length > 1 ? ` - ${pad(prevDone[prevDone.length - 1])}` : ''}
                </span>
                <span className="h-1 w-4 rounded-full bg-brand" />
              </>
            )}
            {completed.includes(current - 1) && (
              <>
                <div className="flex flex-col items-center">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-dark"><Icon src={icCheck} w={12.225} h={9.019} /></span>
                  <span className="pt-1 text-[11px] leading-6 font-bold text-brand-deep">Day {current - 1}</span>
                </div>
                <span className="h-1 w-4 rounded-full bg-brand" />
              </>
            )}
            {!finished && (
              <Link to={`/workouts/${current}`} className="flex flex-col items-center">
                <span className="pulse-ring flex size-11 items-center justify-center rounded-full bg-brand"><Icon src={icCurrent} w={10.083} h={12.833} /></span>
                <span className="pt-1 text-xs leading-4 font-black text-brand-ink">Day {current} ★</span>
              </Link>
            )}
            {current < 22 && !finished && (
              <>
                <span className="h-1 w-4 rounded-full bg-slate-200" />
                <div className="flex flex-col items-center opacity-60">
                  <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100"><Icon src={icLock} w={10.667} h={14} /></span>
                  <span className="pt-1 text-[11px] leading-6 font-semibold text-slate-400">Day {current + 1}</span>
                </div>
              </>
            )}
            {milestone < 22 && milestone > current + 1 && (
              <>
                <span className="h-1 w-4 rounded-full bg-slate-200" />
                <div className="flex flex-col items-center">
                  <span className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-amber-400 bg-amber-100 text-lg leading-7">🎁</span>
                  <span className="pt-1 text-[11px] leading-6 font-bold text-amber-700">Milestone {milestone}</span>
                </div>
              </>
            )}
            <span className={`h-1 w-4 rounded-full ${finished ? 'bg-brand' : 'bg-slate-200'}`} />
            <div className={`flex flex-col items-center ${finished ? '' : 'opacity-70'}`}>
              <span className="flex size-9 items-center justify-center rounded-full bg-amber-200 shadow-inner"><Icon src={icGoal} w={13.5} /></span>
              <span className="pt-1 text-[11px] leading-6 font-bold text-amber-800">Goal 22</span>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className={`flex flex-col gap-3 ${card}`}>
        <SectionHeader
          icon={<Icon src={icTrophy} w={8.333} h={16.667} />}
          iconBg="bg-amber-100"
          title="Achievements"
          right={<Link to="/profile" className="text-xs leading-4 font-bold text-brand-dark">View all</Link>}
        />
        <div className="flex gap-2">
          {badges.map(b => (
            <div key={b.title[1]} className={`flex flex-1 flex-col items-center rounded-2xl border p-[11px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${b.box} ${b.grad && !b.on ? 'grayscale' : ''}`}>
              <span
                className={`mb-1.5 flex size-12 items-center justify-center rounded-2xl text-2xl leading-8 ${b.grad ? 'shadow-md' : 'bg-amber-100 shadow-inner'}`}
                style={b.grad ? { backgroundImage: b.grad } : undefined}
              >
                {b.emoji}
              </span>
              <span className="text-center text-xs leading-4 font-black text-slate-800">{b.title[0]}<br />{b.title[1]}</span>
              <span className="pt-1">
                {b.grad ? (
                  <span className="rounded-full bg-[rgba(209,250,229,0.9)] px-1.5 text-[10px] leading-6 font-bold text-brand-deep">{b.foot}</span>
                ) : (
                  <span className="text-[10px] leading-6 font-semibold text-amber-700">{b.foot}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shortcuts */}
      <section className={`flex flex-col gap-2.5 ${card}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm leading-5 font-bold text-slate-800">Quick Shortcuts</h3>
          <span className="text-xs leading-4 text-slate-400">Utilities</span>
        </div>
        <div className="flex items-start gap-2">
          {shortcuts.map(s => (
            <Link key={s.label} to={s.to} className={`flex flex-1 flex-col items-center self-stretch rounded-2xl p-2 ${s.bg}`}>
              <span className={`mb-1 flex size-10 items-center justify-center rounded-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${s.dot}`}>{s.icon}</span>
              <span className="text-center text-[11px] leading-6 font-bold text-slate-700">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
