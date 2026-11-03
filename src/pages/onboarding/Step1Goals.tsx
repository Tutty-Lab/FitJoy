import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingShell from './OnboardingShell'
import { loadProfile, saveProfile } from '../../lib/profile'
import coach from '../../assets/onboarding/coach.png'
import goalFat from '../../assets/onboarding/goal-fat.png'
import goalPosture from '../../assets/onboarding/goal-posture.png'
import goalEnergy from '../../assets/onboarding/goal-energy.png'
import goalStrength from '../../assets/onboarding/goal-strength.png'
import icLeaf from '../../assets/onboarding/s1-leaf.svg'
import icCheck from '../../assets/onboarding/check-white.svg'
import icRadio from '../../assets/onboarding/radio.svg'
import icSofa from '../../assets/onboarding/act-sofa.svg'
import icWalk from '../../assets/onboarding/act-walk.svg'
import icRun from '../../assets/onboarding/act-run.svg'
import icPillCheck from '../../assets/onboarding/pill-check.svg'
import icPlus from '../../assets/onboarding/pill-plus.svg'
import icArrow from '../../assets/onboarding/arrow-right.svg'

const goals = [
  { id: 'fat', title: 'Burn Fat & Lean Tone', desc: 'High metabolic burn and core slimming', img: goalFat, bg: 'bg-[#6ffbbe]', top: true },
  { id: 'posture', title: 'Fix Posture & Relieve Pain', desc: 'Combat desk stiffness and relieve spine tension', img: goalPosture, bg: 'bg-[#e9ddff]' },
  { id: 'energy', title: 'Boost Energy & Stamina', desc: 'Build endurance, better breath and vitality', img: goalEnergy, bg: 'bg-[#ffdcc5]' },
  { id: 'strength', title: 'Build Strength & Muscle', desc: 'Full body resistance, power and tone', img: goalStrength, bg: 'bg-[#dee8ff]' },
]

const levels = [
  { id: 'sedentary', title: 'Sedentary', sub: 'Desk sitting', icon: icSofa, w: 18.333, h: 15 },
  { id: 'light', title: 'Lightly Active', sub: '3k–6k steps', icon: icWalk, w: 10.833, h: 17.917 },
  { id: 'very', title: 'Very Active', sub: 'High energy', icon: icRun, w: 18.333, h: 13.333 },
]

const areas = ['Full Body', 'Abs & Core', 'Glutes & Legs', 'Upper Body & Posture']

function SectionTitle({ title, hint, accent }: { title: string; hint: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base leading-5 font-bold tracking-[0.16px]">{title}</h3>
      <span className={`text-xs leading-4 font-bold tracking-[0.48px] ${accent ? 'text-[#006c49]' : 'text-[#3c4a42]'}`}>{hint}</span>
    </div>
  )
}

export default function Step1Goals() {
  const navigate = useNavigate()
  const p = loadProfile()
  const [goal, setGoal] = useState(p?.goal ?? 'fat')
  const [activity, setActivity] = useState(p?.activity ?? 'light')
  const [focus, setFocus] = useState<string[]>(p?.focus ?? ['Full Body', 'Abs & Core'])

  const toggle = (a: string) => setFocus(f => (f.includes(a) ? f.filter(x => x !== a) : [...f, a]))
  const next = () => {
    saveProfile({ goal, activity, focus })
    navigate('/onboarding/2')
  }

  return (
    <OnboardingShell step={1}>
      <div className="flex gap-4 rounded-2xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <div className="relative shrink-0 self-start">
          <div className="size-16 overflow-hidden rounded-full bg-[#6ffbbe] shadow-inner">
            <img src={coach} alt="FitJoy coach" className="size-full object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-brand">
            <img src={icLeaf} alt="" style={{ width: 9.942, height: 9.931 }} />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 pt-1">
          <span className="rounded-full bg-[rgba(111,251,190,0.4)] px-2.5 py-0.5 text-xs leading-4 font-semibold tracking-[0.48px] text-[#005236]">🌿 FitJoy Coach</span>
          <h2 className="pt-0.5 text-2xl leading-[33px] font-bold tracking-[-0.6px]">Hey {p?.name || 'there'}!</h2>
          <p className="text-sm leading-5 text-[#3c4a42]">Let's tailor your customized 22-day transformation path.</p>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <SectionTitle title="Primary Fitness Goal" hint="Choose your main focus" />
        {goals.map(g => {
          const on = goal === g.id
          return (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              aria-pressed={on}
              className={`flex items-center rounded-[32px] p-3.5 text-left ${on ? 'bg-[rgba(111,251,190,0.2)] shadow-[0_0_0_2px_#10b981]' : 'bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
            >
              <span className={`mr-3 size-12 shrink-0 overflow-hidden rounded-full ${g.bg}`}>
                <img src={g.img} alt="" className="size-full object-cover" />
              </span>
              <span className="min-w-0 flex-1 pr-2">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm leading-[17.5px] font-bold">{g.title}</span>
                  {g.top && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] leading-[15px] font-bold tracking-[0.5px] text-white uppercase">Top pick</span>}
                </span>
                <span className="block text-[13px] leading-[17.88px] text-[#3c4a42]">{g.desc}</span>
              </span>
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${on ? 'bg-brand' : 'bg-[#e7eeff]'}`}>
                {on ? <img src={icCheck} alt="" style={{ width: 13.425, height: 10.238 }} /> : <img src={icRadio} alt="" className="size-[13.333px]" />}
              </span>
            </button>
          )
        })}
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle title="Daily Activity Level" hint="Baseline rhythm" />
        <div className="flex gap-2">
          {levels.map(l => {
            const on = activity === l.id
            return (
              <button
                key={l.id}
                onClick={() => setActivity(l.id)}
                aria-pressed={on}
                className={`flex flex-1 flex-col items-center justify-center rounded-[32px] px-1 py-[13px] ${on ? 'bg-[rgba(111,251,190,0.25)] shadow-[0_0_0_2px_#10b981]' : 'bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'}`}
              >
                <span className={`mb-1.5 flex size-10 items-center justify-center rounded-full ${on ? 'bg-brand' : 'bg-[#e7eeff]'}`}>
                  <img src={l.icon} alt="" style={{ width: l.w, height: l.h }} />
                </span>
                <span className={`text-[13px] leading-[16.25px] ${on ? 'font-bold' : 'font-semibold'}`}>{l.title}</span>
                <span className="pt-[3px] text-[11px] leading-[13.75px] text-[#3c4a42]">{l.sub}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle title="Target Focus Areas" hint="Select all that apply" accent />
        <div className="flex flex-wrap gap-2">
          {areas.map(a => {
            const on = focus.includes(a)
            return (
              <button
                key={a}
                onClick={() => toggle(a)}
                aria-pressed={on}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm leading-[21px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${on ? 'bg-brand text-white' : 'border border-[#dee8ff] bg-white text-[#3c4a42]'}`}
              >
                {on ? <img src={icPillCheck} alt="" style={{ width: 12.225, height: 9.019 }} /> : <img src={icPlus} alt="" className="size-[10.5px]" />}
                {a}
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-col items-center gap-2 pt-1">
        <button onClick={next} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base leading-5 font-bold tracking-[0.16px] text-white shadow-md active:scale-[0.98]">
          Continue to Measurements
          <img src={icArrow} alt="" className="size-[14.75px]" />
        </button>
        <button onClick={() => navigate('/onboarding/2')} className="px-4 py-2 text-sm leading-[18px] font-semibold text-[#3c4a42]">Skip for now</button>
      </div>
    </OnboardingShell>
  )
}
