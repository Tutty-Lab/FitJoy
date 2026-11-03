import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubPage, SectionTitle } from '../components/shared'
import { loadProfile, logMeasurement, saveProfile } from '../lib/profile'
import companion from '../assets/onboarding/companion.png'
import icHeight from '../assets/onboarding/m-height.svg'
import icScale from '../assets/onboarding/m-scale.svg'
import icRuler from '../assets/onboarding/m-ruler.svg'
import icMinusSm from '../assets/onboarding/minus-sm.svg'
import icPlusSm from '../assets/onboarding/plus-sm.svg'

const goalLabel: Record<string, string> = {
  fat: 'Burn Fat & Lean Tone',
  posture: 'Fix Posture & Relieve Pain',
  energy: 'Boost Energy & Stamina',
  strength: 'Build Strength & Muscle',
}
const activityLabel: Record<string, string> = { sedentary: 'Sedentary', light: 'Lightly Active', very: 'Very Active' }

function bmiInfo(bmi: number) {
  // WHO Asian cut-offs, suited to the app's Vietnamese audience.
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-[#6b38d4]', bg: 'bg-[#e9ddff]' }
  if (bmi < 23) return { label: 'Healthy', color: 'text-[#006c49]', bg: 'bg-[#6ffbbe]' }
  if (bmi < 25) return { label: 'Overweight', color: 'text-[#944a00]', bg: 'bg-[#ffdcc5]' }
  return { label: 'Obese', color: 'text-[#ba1a1a]', bg: 'bg-[#ffdad6]' }
}

function Metric({ label, unit, value, onChange, icon, iw, ih, bg, step = 0.5 }: { label: string; unit: string; value: number; onChange: (v: number) => void; icon: string; iw: number; ih: number; bg: string; step?: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-[#f0f3ff] p-3">
      <span className="flex items-center gap-2 text-sm leading-[18px] font-semibold">
        <span className={`flex size-7 items-center justify-center rounded-full ${bg}`}>
          <img src={icon} alt="" style={{ width: iw, height: ih }} />
        </span>
        {label}
      </span>
      <div className="flex items-center justify-between rounded-[48px] bg-white p-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <button aria-label={`Decrease ${label}`} onClick={() => onChange(+(value - step).toFixed(1))} className="flex size-8 items-center justify-center rounded-full bg-[#e7eeff]">
          <img src={icMinusSm} alt="" style={{ width: 10.5, height: 1.5 }} />
        </button>
        <span className="flex items-baseline gap-0.5 font-bold">
          <span className="text-base leading-5">{step < 1 ? value.toFixed(1) : value}</span>
          <span className="text-xs leading-4 text-[#3c4a42]">{unit}</span>
        </span>
        <button aria-label={`Increase ${label}`} onClick={() => onChange(+(value + step).toFixed(1))} className="flex size-8 items-center justify-center rounded-full bg-[#e7eeff]">
          <img src={icPlusSm} alt="" className="size-[10.5px]" />
        </button>
      </div>
    </div>
  )
}

export default function HealthProfile() {
  const navigate = useNavigate()
  const p = loadProfile()
  const [height, setHeight] = useState(p?.height ?? 162)
  const [weight, setWeight] = useState(p?.weight ?? 61.5)
  const [waist, setWaist] = useState(p?.waist ?? 76)
  const [hip, setHip] = useState(p?.hip ?? 95)
  const [goalWeight, setGoalWeight] = useState(p?.goalWeight ?? 55)

  const bmi = weight / (height / 100) ** 2
  const info = bmiInfo(bmi)
  const start = p?.history?.[0]?.weight ?? weight
  const toGo = +(weight - goalWeight).toFixed(1)
  const goalPct = start === goalWeight ? 100 : Math.max(0, Math.min(100, ((start - weight) / (start - goalWeight)) * 100))
  const whr = waist / hip

  function save() {
    saveProfile({ height, goalWeight })
    logMeasurement({ weight, waist, hip })
    navigate('/profile')
  }

  return (
    <SubPage title="Health Profile" back="/profile">
      <div className="flex gap-3 rounded-2xl bg-[#f0f3ff] p-4">
        <div className="size-16 shrink-0 self-start overflow-hidden rounded-2xl bg-[#e9ddff] p-1 shadow-md">
          <img src={companion} alt="" className="size-full rounded-[48px] object-cover" />
        </div>
        <div className="min-w-0">
          <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">FitJoy Companion</span>
          <p className="text-sm leading-[19.25px]">
            Update your numbers anytime, <b className="font-bold text-[#006c49]">{p?.name || 'friend'}</b>. Each save is added to your Before &amp; After timeline! 📈
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-4 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">BMI</span>
          <span className="text-[32px] leading-10 font-extrabold">{bmi.toFixed(1)}</span>
          <span className={`rounded-full px-3 py-0.5 text-xs leading-4 font-bold ${info.bg} ${info.color}`}>{info.label}</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-4 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <span className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6c7a71]">Waist / Hip</span>
          <span className="text-[32px] leading-10 font-extrabold">{whr.toFixed(2)}</span>
          <span className={`rounded-full px-3 py-0.5 text-xs leading-4 font-bold ${whr <= 0.85 ? 'bg-[#6ffbbe] text-[#006c49]' : 'bg-[#ffdcc5] text-[#944a00]'}`}>
            {whr <= 0.85 ? 'Low risk' : 'Watch zone'}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-[32px] bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-base leading-5 font-bold">Goal weight progress</span>
          <span className="rounded-full bg-[#006c49] px-3 py-0.5 text-sm leading-5 font-bold text-white">{Math.round(goalPct)}%</span>
        </div>
        <div className="h-3.5 overflow-hidden rounded-full bg-[#e7eeff] p-0.5 shadow-inner">
          <div className="bar-grow h-full rounded-full bg-brand transition-all" style={{ width: `${Math.max(goalPct, 3)}%` }} />
        </div>
        <span className="text-sm leading-5 text-[#3c4a42]">
          {toGo > 0 ? `${toGo} kg to go • start ${start} kg → goal ${goalWeight} kg` : `Goal reached! 🎉 ${weight} kg`}
        </span>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={<Link to="/results" className="text-xs leading-4 font-bold text-[#006c49]">Before &amp; After →</Link>}>Body Measurements</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <Metric label="Height" unit="cm" value={height} onChange={setHeight} step={1} icon={icHeight} iw={6} ih={13.5} bg="bg-[#6ffbbe]" />
          <Metric label="Weight" unit="kg" value={weight} onChange={setWeight} icon={icScale} iw={13.5} ih={13.5} bg="bg-[#e9ddff]" />
          <Metric label="Waist" unit="cm" value={waist} onChange={setWaist} icon={icRuler} iw={15} ih={9} bg="bg-[#ffdcc5]" />
          <Metric label="Hip" unit="cm" value={hip} onChange={setHip} icon={icRuler} iw={15} ih={9} bg="bg-[#ffdcc5]" />
          <Metric label="Goal weight" unit="kg" value={goalWeight} onChange={setGoalWeight} icon={icScale} iw={13.5} ih={13.5} bg="bg-[#6ffbbe]" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={<Link to="/onboarding/1" className="text-xs leading-4 font-bold text-[#006c49]">Edit</Link>}>Fitness Profile</SectionTitle>
        <div className="divide-y divide-[#f0f3ff] rounded-[32px] bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          {[
            ['Main goal', goalLabel[p?.goal ?? 'fat']],
            ['Activity level', activityLabel[p?.activity ?? 'light']],
            ['Focus areas', (p?.focus ?? []).join(', ') || '—'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm leading-5 text-[#6c7a71]">{k}</span>
              <span className="text-right text-sm leading-5 font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <button onClick={save} className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-base leading-5 font-bold tracking-[0.16px] text-white drop-shadow-[0_4px_0_#005236] active:translate-y-1 active:drop-shadow-none">
        Save Measurements
      </button>
    </SubPage>
  )
}
