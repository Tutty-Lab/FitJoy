import { Link, Navigate } from 'react-router-dom'
import { tasks } from '../../data/balanceCheck'
import { loadProfile } from '../../lib/profile'
import { emptyEntry } from '../../lib/checks'
import { SectionTitle } from '../../components/shared'

const card = 'rounded-[32px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB') : '–')

// Day-1 vs day-22 balance check, side by side.
export default function Compare() {
  const { start, end } = loadProfile()?.checks ?? {}
  if (!end) return <Navigate to="/" replace />
  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      <SectionTitle>My balance check</SectionTitle>
      <div className={`${card} grid grid-cols-2 gap-2 text-center`}>
        <div>
          <p className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6f7472] uppercase">Day 1</p>
          <p className="text-lg font-bold text-brand-deep">{fmt(start?.date)}</p>
        </div>
        <div>
          <p className="text-xs leading-4 font-bold tracking-[0.48px] text-[#6f7472] uppercase">After 22 days</p>
          <p className="text-lg font-bold text-rust">{fmt(end?.date)}</p>
        </div>
      </div>
      {!start && <Link to="/check/start" className="flex h-14 items-center justify-center rounded-full bg-brand-deep font-bold text-white">Start check</Link>}
      <SectionTitle>My results</SectionTitle>
      {tasks.map((t, i) => {
        const a = start?.entries[t.id] ?? emptyEntry()
        const b = end?.entries[t.id] ?? emptyEntry()
        return (
          <div key={t.id} className={card}>
            <p className="flex items-center gap-2 font-bold">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-xs text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
              {t.title}
            </p>
            <div className="mt-3 grid grid-cols-[1fr_56px_56px] gap-y-1 text-sm">
              <span />
              <span className="text-center text-xs font-bold text-[#6f7472]">Day 1</span>
              <span className="text-center text-xs font-bold text-[#6f7472]">Day 22</span>
              <span className="text-[#3f4a4b]">Result ({t.unit})</span>
              <span className="text-center font-bold text-brand-deep">{a.value || '–'}</span>
              <span className="text-center font-bold text-rust">{b.value || '–'}</span>
              <span className="text-[#3f4a4b]">Felt safe</span>
              <span className="text-center font-bold text-brand-deep">{a.safety ?? '–'}</span>
              <span className="text-center font-bold text-rust">{b.safety ?? '–'}</span>
            </div>
            {(a.notes.length > 0 || b.notes.length > 0) && (
              <p className="mt-2 text-xs text-[#6f7472]">
                {a.notes.length > 0 && <>Day 1: {a.notes.join(', ')}. </>}
                {b.notes.length > 0 && <>Day 22: {b.notes.join(', ')}.</>}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
