import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import icBack from '../assets/onboarding/back.svg'
import { Switch as UiSwitch } from '@/components/ui/switch'

// FitJoy-sized animated switch (Animate UI). Keeps the old on/onChange API used across screens.
export function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return <UiSwitch size="lg" checked={on} onCheckedChange={onChange} aria-label={label} className="data-checked:bg-[#13707e] data-unchecked:bg-[#e7efee]" />
}

export function SubPage({ title, back, children }: { title: string; back: string; children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-[#fbf8f3]">
      <header className="sticky top-0 z-20 bg-[rgba(251,248,243,0.8)] pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[24px]">
        <div className="flex h-16 items-center gap-1 px-4">
          <button aria-label="Go back" onClick={() => navigate(back)} className="flex size-11 items-center justify-center rounded-full">
            <img src={icBack} alt="" className="size-4" />
          </button>
          <h1 className="text-[20px] leading-7 font-bold">{title}</h1>
        </div>
      </header>
      <main className="stagger flex flex-col gap-5 px-4 pt-2 pb-10">{children}</main>
    </div>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[20px] leading-7 font-bold tracking-[-0.5px]">{children}</h2>
      {aside}
    </div>
  )
}
