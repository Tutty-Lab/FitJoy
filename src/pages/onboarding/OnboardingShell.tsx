import type { ReactNode } from 'react'
import { PressButton } from '@/components/ui/press-button'
import { useNavigate } from 'react-router-dom'
import icBack from '../../assets/onboarding/back.svg'
import icUser from '../../assets/onboarding/user.svg'
import icFlag from '../../assets/onboarding/s1-flag.svg'
import icDone from '../../assets/onboarding/s3-check.svg'

const titles = ['Goals & Activity', 'Baseline Metrics', 'Schedule & Habits']

export default function OnboardingShell({ step, children }: { step: 1 | 2 | 3; children: ReactNode }) {
  const navigate = useNavigate()
  const pct = Math.round((step / 3) * 100)

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-[#f9f9ff]">
      <header className="sticky top-0 z-20 bg-[rgba(249,249,255,0.8)] pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <button aria-label="Go back" onClick={() => navigate(-1)} className="flex size-11 items-center justify-center rounded-full">
              <img src={icBack} alt="" className="size-4" />
            </button>
            <h1 className="text-[20px] leading-7 font-bold">Fitness Assessment</h1>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-[#006c49]">
            <img src={icUser} alt="" className="size-[13.333px]" />
          </span>
        </div>
      </header>

      <main className="stagger flex flex-col gap-5 px-4 pt-2 pb-8">
        <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#e9ddff] text-xs leading-4 font-bold text-[#23005c]">{step}</span>
              <span className="text-sm leading-[18px] font-semibold">Step {step} of 3: {titles[step - 1]}</span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[rgba(111,251,190,0.4)] px-2 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#006c49]">
              {step === 3 ? <img src={icDone} alt="" className="size-[13.333px]" /> : <img src={icFlag} alt="" style={{ width: 10, height: 11.333 }} />}
              {step === 3 ? '100%' : `${step === 1 ? 33 : 66}%`}
            </span>
          </div>
          <div className="flex h-4 items-stretch overflow-hidden rounded-full bg-[#dee8ff] p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <div className="bar-grow rounded-full bg-brand drop-shadow-[0_2px_2px_rgba(0,108,73,0.3)] transition-all duration-500" style={{ width: `${pct}%` }}>
              <div className="h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export function PrimaryCta({ children, onClick, icon }: { children: ReactNode; onClick: () => void; icon: string }) {
  return (
    <PressButton
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base leading-5 font-bold tracking-[0.16px] text-white drop-shadow-[0_4px_0_#005236]"
    >
      {children}
      <img src={icon} alt="" className="size-[13.333px]" />
    </PressButton>
  )
}
