import type { ReactNode } from 'react'
import { SubPage } from '../components/shared'

// Public privacy policy (linked from Profile and from the App Store listing: /privacy).
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5 text-sm leading-6 text-[#3c4a42] shadow-[0_8px_20px_-8px_rgba(216,227,251,0.6)]">
      <h2 className="mb-1 text-base font-bold text-[#151c27]">{title}</h2>
      {children}
    </section>
  )
}

export default function Privacy() {
  return (
    <SubPage title="Privacy Policy" back="/profile">
      <p className="text-xs text-[#6c7a71]">Last updated: 5 November 2026 · Tutty Lab</p>
      <Block title="What we collect">
        Your name, email and a hashed password for your account. The goals, body measurements, reminder times and
        workout progress you enter, so they sync between your devices. Before/after photos stay on your device and are
        never uploaded.
      </Block>
      <Block title="How we use it">
        Only to run FitJoy: sign you in, show your plan and progress, and let our team improve the workout program. We do
        not sell your data, show ads, or use third-party tracking or analytics.
      </Block>
      <Block title="Where it is stored">
        On servers operated by Vercel and Neon (Postgres), encrypted in transit. Reminders and notifications are handled on
        your device.
      </Block>
      <Block title="Your choices">
        You can edit your profile at any time, download a backup from Profile → Backup Health Data, and permanently delete
        your account and all progress from Profile → Delete account.
      </Block>
      <Block title="Health information">
        FitJoy offers general fitness guidance and is not a medical service. Talk to a doctor before starting a new exercise
        program.
      </Block>
      <Block title="Contact">
        Questions or deletion requests: use the support link on FitJoy's App Store page.
      </Block>
    </SubPage>
  )
}
