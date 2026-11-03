import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SubPage, SectionTitle } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import { useCompleted } from '../lib/progress'

// Shrinks a photo so it fits comfortably in local storage.
function downscale(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * s)
      c.height = Math.round(img.height * s)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(img.src)
      resolve(c.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })

export default function Results() {
  const [p, setP] = useState(() => loadProfile())
  const [error, setError] = useState('')
  const { completed } = useCompleted()
  const history = p?.history ?? []
  const first = history[0]
  const last = history[history.length - 1]

  async function pick(slot: 'before' | 'after', file?: File) {
    if (!file) return
    setError('')
    try {
      const data = await downscale(file)
      setP(saveProfile({ photos: { ...p?.photos, [slot]: data } }))
    } catch {
      setError('Could not read that photo. Please try another one.')
    }
  }

  const rows = first && last
    ? [
        { l: 'Weight', u: 'kg', a: first.weight, b: last.weight },
        { l: 'Waist', u: 'cm', a: first.waist, b: last.waist },
        { l: 'Hip', u: 'cm', a: first.hip, b: last.hip },
      ]
    : []

  return (
    <SubPage title="Before & After" back="/">
      <div className="rounded-[32px] bg-gradient-to-br from-[#e9ddff] via-white to-[#d1fae5] p-5 shadow-md">
        <span className="rounded-full bg-white px-3 py-1 text-xs leading-4 font-bold tracking-[0.48px] text-[#6b38d4]">Your transformation</span>
        <h2 className="mt-2 text-2xl leading-8 font-extrabold tracking-[-0.6px]">
          {completed.length} of 22 workouts done
        </h2>
        <p className="text-sm leading-5 text-[#3c4a42]">
          {history.length > 1 ? `Tracking since ${fmtDate(first.date)} • ${history.length} check-ins` : 'Log new measurements as you go to see your progress here.'}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <SectionTitle>Progress Photos</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {(['before', 'after'] as const).map(slot => {
            const src = p?.photos?.[slot]
            return (
              <label key={slot} className="relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-[#bbcabf] bg-white text-center">
                {src ? (
                  <img src={src} alt={`${slot} photo`} className="absolute inset-0 size-full object-cover" />
                ) : (
                  <>
                    <span className="mb-1 text-3xl">📷</span>
                    <span className="text-sm leading-5 font-semibold text-[#3c4a42]">Add photo</span>
                  </>
                )}
                <span className={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs leading-4 font-bold uppercase ${slot === 'before' ? 'bg-[#e9ddff] text-[#23005c]' : 'bg-[#6ffbbe] text-[#002113]'}`}>{slot}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={e => pick(slot, e.target.files?.[0])} />
              </label>
            )
          })}
        </div>
        {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={<Link to="/profile/health" className="text-xs leading-4 font-bold text-[#006c49]">Update →</Link>}>Measurements</SectionTitle>
        {rows.length === 0 ? (
          <p className="rounded-[24px] bg-white p-4 text-sm text-[#3c4a42]">No measurements yet. Add them in your Health Profile.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rows.map(r => {
              const d = +(r.b - r.a).toFixed(1)
              return (
                <div key={r.l} className="flex items-center justify-between rounded-[24px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                  <span className="text-base leading-5 font-bold">{r.l}</span>
                  <span className="flex items-center gap-2 text-sm leading-5">
                    <span className="text-[#6c7a71]">{r.a}</span>→<span className="font-bold">{r.b} {r.u}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs leading-4 font-bold ${d < 0 ? 'bg-[#6ffbbe] text-[#006c49]' : d > 0 ? 'bg-[#ffdcc5] text-[#944a00]' : 'bg-[#e7eeff] text-[#3c4a42]'}`}>
                      {d > 0 ? '+' : ''}{d}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Check-in History</SectionTitle>
          <div className="divide-y divide-[#f0f3ff] rounded-[24px] bg-white">
            {[...history].reverse().map(h => (
              <div key={h.date} className="flex items-center justify-between px-4 py-3 text-sm leading-5">
                <span className="font-semibold">{fmtDate(h.date)}</span>
                <span className="text-[#3c4a42]">{h.weight} kg • {h.waist} / {h.hip} cm</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </SubPage>
  )
}
