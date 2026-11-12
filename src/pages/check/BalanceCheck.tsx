import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { observations, tasks } from '../../data/balanceCheck'
import { emptyEntry, saveCheck, todayKey, type Entry, type Phase } from '../../lib/checks'
import { loadProfile } from '../../lib/profile'
import mascot from '../../assets/home/mascot.png'

const card = 'rounded-3xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const btnPrimary = 'flex h-14 w-full items-center justify-center rounded-full bg-brand-deep px-6 text-base font-bold text-white shadow-md disabled:opacity-50'

const DRAFT = (p: Phase) => `fitjoy.checkDraft.${p}`

export default function BalanceCheck() {
  const { phase } = useParams() as { phase: Phase }
  const navigate = useNavigate()
  const [entries, setEntries] = useState<Record<string, Entry>>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT(phase)) ?? '{}')
    } catch {
      return {}
    }
  })
  if (phase !== 'start' && phase !== 'end') return <Navigate to="/" replace />
  const isStart = phase === 'start'
  const first = !loadProfile()?.checks?.start

  const update = (id: string, patch: Partial<Entry>) =>
    setEntries(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? emptyEntry()), ...patch } }
      try {
        localStorage.setItem(DRAFT(phase), JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })

  function finish() {
    saveCheck(phase, { date: todayKey(), entries })
    localStorage.removeItem(DRAFT(phase))
    // Completing either check returns the user to the single home flow.
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-cream px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-10">
      <header className="pb-2 text-center">
        <h1 className="text-[26px] leading-8 font-extrabold tracking-[-0.6px]">Balance check</h1>
        <p className="mt-1 text-sm font-semibold text-rust">{isStart ? 'Day 1' : 'Day 22'}</p>
      </header>

      <section className={`${card} mt-5 flex gap-3`}>
        <img src={mascot} alt="" className="size-16 shrink-0 object-contain" />
        <div className="text-[15px] leading-6 text-ink">
          <p>Use level ground. Hold a wall or chair if needed. Stop whenever you feel unsafe.</p>
          <p className="mt-2 font-bold">Barefoot. Record only what feels comfortable.</p>
        </div>
      </section>

      <ol className="mt-5 flex flex-col gap-4">
        {tasks.map((t, i) => {
          const e = entries[t.id] ?? emptyEntry()
          return (
            <li key={t.id} className={card}>
              <div className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-bold text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-bold">{t.title}</h2>
                  <p className="text-sm text-[#6f7472]">{t.detail}</p>
                </div>
              </div>

              <label className="mt-3 flex items-center justify-between gap-3 border-t border-[#f3f6f5] pt-3">
                <span className="text-sm font-semibold">Result</span>
                <span className="flex items-center gap-2">
                  <input inputMode="decimal" value={e.value} onChange={ev => update(t.id, { value: ev.target.value })} placeholder="–" className="h-10 w-20 rounded-full bg-[#f3f6f5] text-center text-lg font-bold text-brand-deep outline-none focus:ring-2 focus:ring-brand" />
                  <span className="w-14 text-sm text-[#6f7472]">{t.unit}</span>
                </span>
              </label>

              <div className="mt-3">
                <p className="text-sm font-semibold">Safety <span className="font-normal text-[#6f7472]">(1–10)</span></p>
                <div className="mt-2 grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                    <button key={n} type="button" onClick={() => update(t.id, { safety: e.safety === n ? null : n })} className={`h-9 rounded-full text-sm font-semibold ${e.safety === n ? 'bg-brand-deep text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{n}</button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold">Notes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {observations.map(o => {
                    const on = e.notes.includes(o)
                    return (
                      <button key={o} type="button" onClick={() => update(t.id, { notes: on ? e.notes.filter(x => x !== o) : [...e.notes, o] })} className={`rounded-full px-3 py-1 text-sm font-semibold ${on ? 'bg-rust text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{o}</button>
                    )
                  })}
                </div>
                <input value={e.comment} onChange={ev => update(t.id, { comment: ev.target.value })} placeholder="etc. – your own note" className="mt-2 h-10 w-full rounded-full bg-[#f3f6f5] px-4 text-sm outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <button onClick={finish} className={btnPrimary}>{isStart ? 'Save check & start' : 'Save check'}</button>
        {!first && <button onClick={() => navigate(-1)} className="h-11 text-sm text-[#6f7472]">Continue later</button>}
      </div>
    </div>
  )
}
