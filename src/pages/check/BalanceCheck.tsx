import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { groupOf, groups, observations, tasks, PROGRAM_DAYS } from '../../data/balanceCheck'
import { emptyEntry, saveCheck, todayKey, type Entry, type Phase } from '../../lib/checks'
import { useCompleted } from '../../lib/progress'
import { loadProfile, saveProfile } from '../../lib/profile'
import { ensureNotificationPermission } from '../../lib/reminders'
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
  // 0–2 welcome cards, 3 preparation, 4 safety note, 5 tasks, 6 day-1 finish screen.
  const [stage, setStage] = useState(phase === 'start' && loadProfile()?.introSeen ? 5 : 0)
  const [picking, setPicking] = useState(false)
  const [remindAt, setRemindAt] = useState<string | null>(null)
  function remind(time: string) {
    const [h, m] = time.split(':').map(Number)
    const at = new Date(); at.setHours(h, m, 0, 0)
    if (at.getTime() < Date.now()) at.setDate(at.getDate() + 1)
    saveProfile({ checkReminderAt: at.toISOString() })
    ensureNotificationPermission()
    setRemindAt(time); setPicking(false)
  }
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
    if (isStart) { setStage(6); window.scrollTo(0, 0) } else navigate('/compare', { replace: true })
  }

  const shell = 'mx-auto flex min-h-dvh max-w-[440px] flex-col gap-5 p-6 pt-12'
  const btnSecondary = 'flex h-12 w-full items-center justify-center rounded-full border border-mint bg-white px-6 font-bold text-brand-deep'
  const Checklist = ({ items }: { items: [string, string][] }) => <ul className="space-y-3 rounded-3xl bg-white p-5 text-[15px] leading-6">{items.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>

  // Day 1: three swipe cards → preparation checklist (with "remind me later") → safety note → tasks.
  if (isStart && stage < 5) {
    if (stage <= 2) {
      const cards = [
        ['Hallo! Ich bin Vestibu, dein stiller Regisseur für mehr Gleichgewicht im Alltag.', 'Schon seit deiner Zeit im Mutterleib steuere ich rund um die Uhr dein Gleichgewichtsorgan. Meist arbeite ich im Verborgenen und beeinflusse deine Konzentration, dein gefühltes Stresslevel und dein körperliches Wohlbefinden im Alltag.'],
        ['Wie gut sind wir aufeinander eingespielt?', 'Damit ich dich in jeder Lebenslage optimal unterstützen kann, brauche ich ab und zu deine Aufmerksamkeit. Wie gut sind wir aktuell aufeinander eingespielt? Lass es uns mit einem Selbsttest herausfinden.'],
        ['3 × 1 Minute täglich', 'Danach begleite ich dich mit 3x1 Minute täglich – ganz leicht und überall machbar. Wenn du Lust auf mehr hast, warten freiwillige Bonus-Minuten als Extra auf dich. Und weil dein Gehirn Affirmationen liebt, bekommst du zu jeder Übung einen positiven Tages-Gedanken dazu.'],
      ]
      return <main className={shell}>
        <img src={stage === 0 ? vestibuWelcome : mascot} alt="Vestibu" className="float mx-auto size-44 object-contain" />
        <h1 className="text-2xl font-black">{cards[stage][0]}</h1>
        <p className="text-[16px] leading-7">{cards[stage][1]}</p>
        {stage === 2 && <p className="font-bold">Bist du bereit zu beginnen?</p>}
        <div className="flex justify-center gap-2" aria-hidden="true">{cards.map((_, i) => <span key={i} className={`h-2 rounded-full ${i === stage ? 'w-6 bg-brand-deep' : 'w-2 bg-mint'}`} />)}</div>
        <button className={btnPrimary} onClick={() => setStage(s => s + 1)}>{stage === 2 ? 'Meinen Selbsttest starten' : 'Weiter'}</button>
        {stage > 0 && <button className="h-10 text-sm font-semibold text-slate-500" onClick={() => setStage(s => s - 1)}>Zurück</button>}
      </main>
    }
    if (stage === 3) return <main className={shell}>
      <img src={mascot} alt="Vestibu" className="mx-auto size-32 object-contain" />
      <h1 className="text-2xl font-black">Schön, dass du dir Zeit für dich nimmst!</h1>
      <p>Du möchtest dein Gleichgewichtssystem besser kennenlernen? Wir machen gemeinsam deinen persönlichen Check-up. Ich bin Vestibu, dein stiller Regisseur, wir schauen uns in Ruhe an, wie wir aktuell zusammenarbeiten.</p>
      <h2 className="font-black">Das brauchst du für deinen Selbsttest:</h2>
      <Checklist items={[['Zeit', 'Nimm dir eine ruhige halbe Stunde ungestört für dich.'], ['Platz', 'Eine frei begehbare Fläche von ca. 3 Metern, damit du dich sicher bewegen kannst.'], ['Hilfsmittel', 'Einen stabilen Stuhl für die Übungen und deine Sicherheit.']]} />
      <p className="text-sm text-slate-600">Falls es gerade nicht passt, ist das kein Problem. Du kannst den Test jederzeit nachholen, wenn du zu Hause Ruhe hast.</p>
      {remindAt && <p role="status" className="rounded-2xl bg-mint p-3 text-sm font-semibold text-brand-deep">Ich erinnere dich um {remindAt} Uhr. Lass die App dafür geöffnet oder angepinnt.</p>}
      <button className={btnPrimary} onClick={() => setStage(4)}>Alles bereit – los geht’s!</button>
      {!picking ? <button className={btnSecondary} onClick={() => setPicking(true)}>Später erinnern</button> : <div className="flex flex-col gap-2 rounded-3xl bg-white p-4">
        <button className={btnSecondary} onClick={() => remind('19:00')}>Heute Abend (19:00 Uhr)</button>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">Eigene Zeit wählen<input type="time" onChange={e => e.target.value && remind(e.target.value)} className="h-10 rounded-full bg-canvas px-3" /></label>
      </div>}
    </main>
    return <main className={shell}>
      <img src={vestibuWelcome} alt="Vestibu" className="mx-auto size-32 object-contain" />
      <h1 className="text-2xl font-black">Schön, dass du da bist!</h1>
      <p>Bevor wir starten, das Wichtigste vorweg: Nimm dir die Zeit, die du brauchst – es ist kein Wettkampf. Es geht nur darum, dass wir beide herausfinden, wie es dir aktuell geht.</p>
      <p>Achte während der Übungen gut auf dich. Wenn dir schwindelig wird oder sich etwas unangenehm anfühlt, mach eine Pause, trink ein Glas Wasser oder setz dich auf einen Stuhl. Deine Sicherheit geht immer vor.</p>
      <p className="font-bold">Stell dich jetzt ganz entspannt auf deine freie Fläche. Tippe auf Start, sobald du bereit bist!</p>
      <button className={btnPrimary} onClick={() => { saveProfile({ introSeen: true }); setStage(5) }}>Start</button>
    </main>
  }

  // Day 90: a no-pressure "where do you stand today" intro before the re-test.
  if (!isStart && stage < 5) return <main className={shell}>
    <img src={vestibuWelcome} alt="Vestibu" className="float mx-auto size-40 object-contain" />
    {stage === 0 ? <>
      <h1 className="text-2xl font-black">Dein stiller Regisseur zieht den Hut vor dir!</h1>
      <p>Drei Monate lang hast du dir immer wieder deine persönlichen Minuten geschenkt und deinem Gleichgewichtssystem wertvolle Aufmerksamkeit gegeben.</p>
      <p>Jetzt nehmen wir uns Zeit für eine neue Standortbestimmung: Wie fühlt sich deine Balance heute im Vergleich zu vor 90 Tagen an?</p>
      <p>Lass uns das mit einem zweiten Selbsttest gemeinsam anschauen. Ganz ohne Leistungsdruck – es geht nicht um „besser“ oder „schlechter“, sondern darum, wo du heute stehst.</p>
      <button className={btnPrimary} onClick={() => setStage(1)}>Jetzt Selbsttest starten</button>
    </> : <>
      <h1 className="text-2xl font-black">Bereit für deinen Vorher-Nachher-Vergleich?</h1>
      <p>Damit wir deine Werte von heute mit Tag 1 vergleichen können, gelten dieselben Bedingungen wie beim ersten Mal:</p>
      <Checklist items={[['Zeit', 'Eine ruhige halbe Stunde ungestört für dich.'], ['Platz', 'Ca. 3 Meter frei begehbare Fläche.'], ['Sicherheit', 'Dein stabiler Stuhl steht griffbereit.']]} />
      <button className={btnPrimary} onClick={() => setStage(5)}>Alles bereit – Vergleich starten!</button>
    </>}
  </main>

  // After the day-1 test: appreciation and hand-over to the daily minutes.
  if (stage === 6) return <main className={shell}>
    <img src={vestibuWelcome} alt="Vestibu" className="float mx-auto size-40 object-contain" />
    <h1 className="text-2xl font-black">Geschafft! Danke für deine Aufmerksamkeit.</h1>
    <p>Du hast dir gerade eine Zeit nur für dich und dein inneres Gleichgewicht genommen – darauf kannst du wirklich stolz sein.</p>
    <p>Ich habe mir genau angeschaut, wie wir beide zusammenspielen. Egal, wie sich die einzelnen Übungen angefühlt haben: Dein Gleichgewichtssystem ist lernfähig in jedem Alter. Genau hier setzen wir jetzt gemeinsam an.</p>
    <h2 className="font-black">Dein persönlicher Plan steht bereit:</h2>
    <p>Ab jetzt begleite ich dich 3x1 Minute täglich. So, wie es dir am besten möglich ist. Ganz ohne Stress, überall machbar. Und wenn du mal Lust auf mehr hast, warten freiwillige Bonus-Minuten auf dich.</p>
    <button className={btnPrimary} onClick={() => navigate('/', { replace: true })}>Meine heutige Übung ansehen</button>
  </main>

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-cream px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-10">
      <header className="pb-2 text-center">
        <h1 className="text-[26px] leading-8 font-extrabold tracking-[-0.6px]">Selbsttest</h1>
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
