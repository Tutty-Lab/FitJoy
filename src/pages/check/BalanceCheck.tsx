import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { groupOf, groups, observations, tasks, PROGRAM_DAYS } from '../../data/balanceCheck'
import { emptyEntry, saveCheck, todayKey, type Entry, type Phase } from '../../lib/checks'
import { useCompleted } from '../../lib/progress'
import { loadProfile, saveProfile } from '../../lib/profile'
import mascot from '../../assets/home/mascot.png'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'

const card = 'rounded-3xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const btnPrimary = 'flex h-14 w-full items-center justify-center rounded-full bg-brand-deep px-6 text-base font-bold text-white shadow-md disabled:opacity-50'

const DRAFT = (p: Phase) => `fitjoy.checkDraft.${p}`

export default function BalanceCheck() {
  const { phase } = useParams() as { phase: Phase }
  const navigate = useNavigate()
  const { finished } = useCompleted()
  const [entries, setEntries] = useState<Record<string, Entry>>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT(phase)) ?? '{}')
    } catch {
      return {}
    }
  })
  const [intro, setIntro] = useState(loadProfile()?.introSeen ? 2 : 0)
  const [page, setPage] = useState(0)
  if (phase !== 'start' && phase !== 'end') return <Navigate to="/" replace />
  if (phase === 'end' && !finished) return <Navigate to="/" replace />
  const isStart = phase === 'start'
  const first = !loadProfile()?.checks?.start
  const pageSize = 1
  const pageCount = Math.ceil(tasks.length / pageSize)
  const visibleTasks = tasks.slice(page * pageSize, (page + 1) * pageSize)
  const valid = (id: string) => { const e = entries[id]; return !!e && e.value.trim() !== '' && Number.isFinite(Number(e.value.replace(',', '.'))) && Number(e.value.replace(',', '.')) >= 0 && e.safety !== null }
  const pageValid = visibleTasks.every(t => valid(t.id))
  const lastPage = page === pageCount - 1

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
    if (!tasks.every(t => valid(t.id))) return
    saveCheck(phase, { date: todayKey(), entries })
    localStorage.removeItem(DRAFT(phase))
    // Completing either check returns the user to the single home flow.
    navigate(isStart ? '/' : '/compare', { replace: true })
  }

  if (isStart && intro < 2) return <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col gap-6 p-6 pt-12">
    <img src={intro === 0 ? vestibuWelcome : mascot} alt="Vestibu" className="mx-auto size-44 object-contain" />
    <h1 className="text-2xl font-black">{intro === 0 ? 'Der Gleichgewichts-Code' : 'Bevor du beginnst'}</h1>
    {intro === 0 ? <p>Hallo, ich bin Michaela – und das ist Vestibu, dein Gleichgewichtsorgan. In den nächsten 90 Tagen machen wir jeden Tag eine kurze Grundübung, bis zu dreimal, und du sprichst dabei deine Affirmation laut aus. Wenn du magst, gibt es danach eine Bonus-Minute.</p> : <ul className="list-disc space-y-3 pl-5"><li>Stelle einen stabilen Stuhl bereit.</li><li>Übe barfuß.</li><li>Trinke ein Glas Wasser.</li><li>Achte auf ebenen Boden und genügend Freiraum.</li><li>Halte dich bei Bedarf an der Wand oder einem stabilen Stuhl fest.</li></ul>}
    <button className={btnPrimary} onClick={() => { if (intro === 1) saveProfile({ introSeen: true }); setIntro(i => i + 1) }}>{intro === 0 ? 'Weiter' : 'Gleichgewichts-Check starten'}</button>
  </main>

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-cream px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-10">
      <header className="pb-2 text-center">
        <h1 className="text-[26px] leading-8 font-extrabold tracking-[-0.6px]">Gleichgewichts-Check</h1>
        <p className="mt-1 text-sm font-semibold text-rust">{isStart ? 'Tag 1' : `Tag ${PROGRAM_DAYS}`} · Aufgabe {page + 1}/{tasks.length}</p>
        <nav aria-label="Kategorien" className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-white p-1">
          {groups.map(g => {
            const first = tasks.findIndex((_, i) => groupOf(i) === g)
            const reachable = tasks.slice(0, first).every(t => valid(t.id))
            return <button key={g} type="button" disabled={!reachable} aria-current={groupOf(page) === g ? 'step' : undefined} onClick={() => setPage(first)} className={`rounded-full py-2 text-sm font-bold disabled:opacity-40 ${groupOf(page) === g ? 'bg-brand-deep text-white' : 'text-[#3f4a4b]'}`}>{g}</button>
          })}
        </nav>
      </header>

      <section className={`${card} mt-5 flex gap-3`}>
        <img src={mascot} alt="" className="size-16 shrink-0 object-contain" />
        <div className="text-[15px] leading-6 text-ink">
          <p>Nimm dir Zeit: Achte auf ebenen Boden und genügend Freiraum. Halt dich bei Bedarf an der Wand oder einem stabilen Stuhl fest.</p>
          <p className="mt-2 font-bold">Barfuß. Ergebnis und Sicherheit sind Pflichtfelder.</p>
        </div>
      </section>

      <ol className="mt-5 flex flex-col gap-4">
        {visibleTasks.map((t, pageIndex) => {
          const i = page * pageSize + pageIndex
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
                <span className="text-sm font-semibold">Mein Wert <span className="text-rust">*</span></span>
                <span className="flex items-center gap-2">
                  <input inputMode="decimal" value={e.value} onChange={ev => update(t.id, { value: ev.target.value })} placeholder="–" className="h-10 w-20 rounded-full bg-[#f3f6f5] text-center text-lg font-bold text-brand-deep outline-none focus:ring-2 focus:ring-brand" />
                  <span className="w-14 text-sm text-[#6f7472]">{t.unit}</span>
                </span>
              </label>

              <div className="mt-3">
                <p className="text-sm font-semibold">Meine gefühlte Sicherheit <span className="text-rust">*</span> <span className="font-normal text-[#6f7472]">(1 Tiefpunkt – 10 Fantastisch)</span></p>
                <div className="mt-2 grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                    <button key={n} type="button" onClick={() => update(t.id, { safety: e.safety === n ? null : n })} className={`h-9 rounded-full text-sm font-semibold ${e.safety === n ? 'bg-brand-deep text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{n}</button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold">Mir fällt auf</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {observations.map(o => {
                    const on = e.notes.includes(o)
                    return (
                      <button key={o} type="button" onClick={() => update(t.id, { notes: on ? e.notes.filter(x => x !== o) : [...e.notes, o] })} className={`rounded-full px-3 py-1 text-sm font-semibold ${on ? 'bg-rust text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{o}</button>
                    )
                  })}
                </div>
                <input value={e.comment} onChange={ev => update(t.id, { comment: ev.target.value })} placeholder="usw. – eigene Notiz" className="mt-2 h-10 w-full rounded-full bg-[#f3f6f5] px-4 text-sm outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-sm font-semibold text-[#6f7472]">
          <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-full px-3 py-2 disabled:opacity-30">Zurück</button>
          <span>{page + 1} / {pageCount}</span>
          {lastPage ? <span className="w-[58px]" /> : <button type="button" disabled={!pageValid} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }} className="rounded-full px-3 py-2 text-brand-deep">Weiter</button>}
        </div>
        {lastPage && <button disabled={!tasks.every(t => valid(t.id))} onClick={finish} className={btnPrimary}>{isStart ? 'Speichern und starten' : 'Ergebnisse vergleichen'}</button>}
        {!first && <button onClick={() => navigate(-1)} className="h-11 text-sm text-[#6f7472]">Später fortsetzen</button>}
      </div>
    </div>
  )
}
