import { Link, Navigate } from 'react-router-dom'
import { groupOf, groups, tasks, PROGRAM_DAYS } from '../../data/balanceCheck'
import { loadProfile } from '../../lib/profile'
import { emptyEntry, type Check } from '../../lib/checks'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'
import { SectionTitle } from '../../components/shared'

const card = 'rounded-[32px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('de-DE') : '–')
const avgSafety = (c?: Check) => {
  const v = tasks.map(t => c?.entries[t.id]?.safety).filter((n): n is number => typeof n === 'number')
  return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1).replace('.', ',') : '–'
}

// 08: day 1 vs day 90, grouped Stehen / Gehen / Sitzen.
export default function Compare() {
  const { start, end } = loadProfile()?.checks ?? {}
  if (!end) return <Navigate to="/" replace />
  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      <section className={`${card} flex flex-col gap-3 text-[15px] leading-6`}>
        <img src={vestibuWelcome} alt="Vestibu" className="mx-auto size-28 object-contain" />
        <h1 className="text-2xl font-black">Danke für deine ehrliche Bestandsaufnahme!</h1>
        <p>Dein stiller Regisseur sagt Danke für deine Aufmerksamkeit! Drei Monate lang hast du dir immer wieder deine persönlichen Minuten geschenkt – und heute haben wir geschaut, wo du stehst.</p>
        <p>Vielleicht spürst und siehst du heute schon deutliche Veränderungen – vielleicht wirken deine Werte auf den ersten Blick aber auch noch sehr vertraut. Beides ist ein wertvolles Zeichen für dich:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Du siehst Veränderungen?</b> Wunderbar! Dein System reagiert bereits spürbar auf deine regelmäßige Zuwendung.</li>
          <li><b>Du siehst bekannte Werte?</b> Genau so wichtig! Das Gleichgewichtssystem arbeitet oft lange im Verborgenen, stabilisiert im Hintergrund, stoppt schleichenden Abbau und fängt Alltagsstress ab, bevor es nach außen im Test sichtbar wird.</li>
        </ul>
        <p>Das Wichtigste ist: Du hast drei Monate lang das Fundament gelegt. <i>„Gras wächst nicht schneller, wenn man daran zieht – ich vertraue meinem eigenen Tempo.“</i></p>
      </section>
      <SectionTitle>Meine Ergebnisse</SectionTitle>
      <div className={`${card} grid grid-cols-3 gap-2 text-center`}>
        <div />
        <div><p className="text-xs font-bold text-[#6f7472] uppercase">Tag 1</p><p className="font-bold text-brand-deep">{fmt(start?.date)}</p></div>
        <div><p className="text-xs font-bold text-[#6f7472] uppercase">Tag {PROGRAM_DAYS}</p><p className="font-bold text-rust">{fmt(end?.date)}</p></div>
        <p className="text-left text-sm font-semibold">Sicherheit Ø</p>
        <p className="text-2xl font-black text-brand-deep">{avgSafety(start)}</p>
        <p className="text-2xl font-black text-rust">{avgSafety(end)}</p>
      </div>
      {!start && <Link to="/check/start" className="flex h-14 items-center justify-center rounded-full bg-brand-deep font-bold text-white">Check starten</Link>}
      {groups.map(g => (
        <section key={g} className="flex flex-col gap-3">
          <SectionTitle>{g}</SectionTitle>
          {tasks.map((t, i) => {
            if (groupOf(i) !== g) return null
            const a = start?.entries[t.id] ?? emptyEntry()
            const b = end?.entries[t.id] ?? emptyEntry()
            return (
              <div key={t.id} className={card}>
                <p className="flex items-center gap-2 font-bold">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-xs text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                  {t.title}
                </p>
                <div className="mt-3 grid grid-cols-[1fr_64px_64px] gap-y-1 text-sm">
                  <span />
                  <span className="text-center text-xs font-bold text-[#6f7472]">Tag 1</span>
                  <span className="text-center text-xs font-bold text-[#6f7472]">Tag {PROGRAM_DAYS}</span>
                  <span className="text-[#3f4a4b]">Wert ({t.unit})</span>
                  <span className="text-center font-bold text-brand-deep">{a.value || '–'}</span>
                  <span className="text-center font-bold text-rust">{b.value || '–'}</span>
                  <span className="text-[#3f4a4b]">Sicherheit</span>
                  <span className="text-center font-bold text-brand-deep">{a.safety ?? '–'}</span>
                  <span className="text-center font-bold text-rust">{b.safety ?? '–'}</span>
                </div>
                {(a.notes.length > 0 || b.notes.length > 0 || a.comment || b.comment) && (
                  <p className="mt-2 text-xs text-[#6f7472]">
                    {(a.notes.length > 0 || a.comment) && <>Tag 1: {[...a.notes, a.comment].filter(Boolean).join(', ')}. </>}
                    {(b.notes.length > 0 || b.comment) && <>Tag {PROGRAM_DAYS}: {[...b.notes, b.comment].filter(Boolean).join(', ')}.</>}
                  </p>
                )}
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
