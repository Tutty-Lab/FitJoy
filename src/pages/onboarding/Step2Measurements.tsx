import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingShell, { PrimaryCta } from './OnboardingShell'
import { loadProfile, logMeasurement, saveProfile } from '../../lib/profile'
import companion from '../../assets/onboarding/companion.png'
import icHeight from '../../assets/onboarding/m-height.svg'
import icScale from '../../assets/onboarding/m-scale.svg'
import icRuler from '../../assets/onboarding/m-ruler.svg'
import icMinus from '../../assets/onboarding/minus.svg'
import icPlus from '../../assets/onboarding/plus-white.svg'
import icPlus2 from '../../assets/onboarding/plus-white2.svg'
import icMinusSm from '../../assets/onboarding/minus-sm.svg'
import icPlusSmWhite from '../../assets/onboarding/plus-sm-white.svg'
import icPlusSm from '../../assets/onboarding/plus-sm.svg'
import icTrophy from '../../assets/onboarding/trophy-sm.svg'
import icLeaf from '../../assets/onboarding/leaf-sm.svg'
import icArrow from '../../assets/auth/arrow.svg'

type Big = {
  label: string; unit: string; step: number; decimals: number; min: number; max: number
  icon: string; iw: number; ih: number; iconBg: string; unitColor: string; valueColor: string
  plusBg: string; plusShadow: string; plusIcon: string
}

function BigStepper({ cfg, value, onChange }: { cfg: Big; value: number; onChange: (v: number) => void }) {
  const set = (d: number) => onChange(Math.min(cfg.max, Math.max(cfg.min, +(value + d).toFixed(1))))
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-[#f0f3ff] p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm leading-[18px] font-semibold">
          <span className={`flex size-8 items-center justify-center rounded-full ${cfg.iconBg}`}>
            <img src={cfg.icon} alt="" style={{ width: cfg.iw, height: cfg.ih }} />
          </span>
          {cfg.label}
        </span>
        <span className={`text-xs leading-4 font-bold tracking-[0.48px] ${cfg.unitColor}`}>{cfg.unit}</span>
      </div>
      <div className="flex items-center justify-between rounded-[48px] bg-white p-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <button aria-label={`Decrease ${cfg.label}`} onClick={() => set(-cfg.step)} className="flex size-12 items-center justify-center rounded-[48px] bg-[#e7eeff] drop-shadow-[0_3px_0_#bbcabf] active:translate-y-0.5">
          <img src={icMinus} alt="" style={{ width: 14, height: 2 }} />
        </button>
        <span className="flex items-baseline gap-1">
          <span className={`text-[28px] leading-9 font-bold tracking-[-0.7px] ${cfg.valueColor}`}>{value.toFixed(cfg.decimals)}</span>
          <span className="text-sm leading-5 font-medium text-[#3c4a42]">{cfg.unit}</span>
        </span>
        <button aria-label={`Increase ${cfg.label}`} onClick={() => set(cfg.step)} className={`flex size-12 items-center justify-center rounded-[48px] active:translate-y-0.5 ${cfg.plusBg} ${cfg.plusShadow}`}>
          <img src={cfg.plusIcon} alt="" className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function SmallStepper({ label, sub, unit, value, onChange, primary }: { label: string; sub: string; unit: string; value: number; onChange: (v: number) => void; primary?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between rounded-2xl bg-[#f0f3ff] p-3">
      <div className="flex flex-col gap-1 pb-2">
        <span className="truncate text-sm leading-[17.5px] font-semibold">{label}</span>
      </div>
      <div className="flex items-center justify-between rounded-[48px] bg-white p-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <button aria-label={`Decrease ${label}`} onClick={() => onChange(+(value - 0.5).toFixed(1))} className="flex size-8 items-center justify-center rounded-[32px] bg-[#e7eeff]">
          <img src={icMinusSm} alt="" style={{ width: 10.5, height: 1.5 }} />
        </button>
        <span className="flex items-baseline gap-0.5 font-bold">
          <span className={`text-base leading-5 tracking-[0.16px] ${primary ? 'text-[#006c49]' : ''}`}>{value.toFixed(1)}</span>
          <span className="text-xs leading-4 tracking-[0.48px] text-[#3c4a42]">{unit}</span>
        </span>
        <button aria-label={`Increase ${label}`} onClick={() => onChange(+(value + 0.5).toFixed(1))} className={`flex size-8 items-center justify-center rounded-[32px] ${primary ? 'bg-brand' : 'bg-[#e7eeff]'}`}>
          <img src={primary ? icPlusSmWhite : icPlusSm} alt="" className="size-[10.5px]" />
        </button>
      </div>
    </div>
  )
}

const heightCfg: Big = { label: 'Height', unit: 'cm', step: 1, decimals: 0, min: 100, max: 230, icon: icHeight, iw: 6, ih: 13.5, iconBg: 'bg-[#6ffbbe]', unitColor: 'text-[#006c49]', valueColor: '', plusBg: 'bg-brand', plusShadow: 'drop-shadow-[0_3px_0_rgba(0,108,73,0.9)]', plusIcon: icPlus }
const weightCfg: Big = { label: 'Current weight', unit: 'kg', step: 0.5, decimals: 1, min: 30, max: 250, icon: icScale, iw: 13.5, ih: 13.5, iconBg: 'bg-[#e9ddff]', unitColor: 'text-[#6b38d4]', valueColor: 'text-[#6b38d4]', plusBg: 'bg-[#8455ef]', plusShadow: 'drop-shadow-[0_3px_0_rgba(107,56,212,0.9)]', plusIcon: icPlus2 }
const waistCfg: Big = { label: 'Waist circumference', unit: 'cm', step: 0.5, decimals: 1, min: 40, max: 200, icon: icRuler, iw: 15, ih: 9, iconBg: 'bg-[#ffdcc5]', unitColor: 'text-[#944a00]', valueColor: '', plusBg: 'bg-[#ef8933]', plusShadow: 'drop-shadow-[0_3px_0_rgba(148,74,0,0.9)]', plusIcon: icPlus }

export default function Step2Measurements() {
  const navigate = useNavigate()
  const p = loadProfile()
  const [height, setHeight] = useState(p?.height ?? 162)
  const [weight, setWeight] = useState(p?.weight ?? 61.5)
  const [waist, setWaist] = useState(p?.waist ?? 76)
  const [goalWeight, setGoalWeight] = useState(p?.goalWeight ?? 55)
  const [hip, setHip] = useState(p?.hip ?? 95)

  const next = () => {
    saveProfile({ height, goalWeight })
    logMeasurement({ weight, waist, hip })
    navigate('/onboarding/3')
  }

  return (
    <OnboardingShell step={2}>
      <div className="flex gap-3 rounded-2xl bg-[#f0f3ff] p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <div className="relative shrink-0 self-start">
          <div className="size-20 overflow-hidden rounded-2xl bg-[#e9ddff] p-1 shadow-md">
            <img src={companion} alt="FitJoy companion" className="size-full rounded-[48px] object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-2 flex items-center gap-0.5 rounded-full bg-[#ef8933] px-1.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-white">
            <img src={icTrophy} alt="" style={{ width: 8, height: 10.5 }} />Day 1
          </span>
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-[3px] rounded-2xl bg-white p-3">
          <span className="absolute top-6 -left-2 h-3 w-2 border-y-[6px] border-r-8 border-y-transparent border-r-white" />
          <span className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">
            <img src={icLeaf} alt="" style={{ width: 9.914, height: 9.912 }} />FitJoy Companion
          </span>
          <p className="text-sm leading-[19.25px]">
            Hey <b className="font-bold text-[#006c49]">{p?.name || 'there'}</b>! Record your starting baseline to witness your stunning 22-workout transformation! 🌱✨
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        <h2 className="pb-1 text-[20px] leading-7 font-bold tracking-[-0.5px]">Body Measurements</h2>
        <BigStepper cfg={heightCfg} value={height} onChange={setHeight} />
        <BigStepper cfg={weightCfg} value={weight} onChange={setWeight} />
        <BigStepper cfg={waistCfg} value={waist} onChange={setWaist} />
        <div className="flex gap-2.5">
          <SmallStepper label="Goal Weight" sub="Target kg" unit="kg" value={goalWeight} onChange={setGoalWeight} primary />
          <SmallStepper label="Hip circumference" sub="Largest hip line" unit="cm" value={hip} onChange={setHip} />
        </div>
      </section>

      <div className="flex flex-col gap-3 pt-2">
        <PrimaryCta onClick={next} icon={icArrow}>Save Baseline &amp; Continue</PrimaryCta>
        <button onClick={() => navigate('/onboarding/3')} className="py-2.5 text-sm leading-[18px] font-semibold text-[#3c4a42]">Skip, I will update later</button>
      </div>
    </OnboardingShell>
  )
}
