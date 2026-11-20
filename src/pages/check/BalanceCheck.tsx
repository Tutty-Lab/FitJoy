import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { groupLabel, groupOf, groups, obsLabel, observations, taskText, tasks, PROGRAM_DAYS } from '../../data/balanceCheck'
import { emptyEntry, saveCheck, todayKey, type Entry, type Phase } from '../../lib/checks'
import { useCompleted } from '../../lib/progress'
import { loadProfile, saveProfile } from '../../lib/profile'
import { ensureNotificationPermission } from '../../lib/reminders'
import mascot from '../../assets/home/mascot.png'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'
import { L } from '../../lib/i18n'
import { clayCard, clayPrimary, claySecondary } from '../../components/clay'

const card = clayCard
const btnPrimary = clayPrimary

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
  const [stage, setStage] = useState(phase === 'start' ? (loadProfile()?.introSeen ? 5 : loadProfile()?.gameOnboarded ? 3 : 0) : 0)
  const [picking, setPicking] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [remindAt, setRemindAt] = useState<string | null>(null)
  function remind(time: string) {
    const [h, m] = time.split(':').map(Number)
    const at = new Date(); at.setHours(h, m, 0, 0)
    if (at.getTime() < Date.now()) at.setDate(at.getDate() + 1)
    saveProfile({ checkReminderAt: at.toISOString() })
    ensureNotificationPermission()
    setRemindAt(time); setPicking(false)
  }
  const [page, setPage] = useState(() => {
    const firstMissing=tasks.findIndex(t=>{const e=entries[t.id];return !e || e.value.trim()==='' || !Number.isFinite(Number(e.value.replace(',','.'))) || Number(e.value.replace(',','.'))<0 || e.safety===null})
    return firstMissing<0 ? tasks.length-1 : firstMissing
  })
  if (phase !== 'start' && phase !== 'end') return <Navigate to="/" replace />
  if (phase === 'end' && !finished) return <Navigate to="/" replace />
  const isStart = phase === 'start'
  const pageSize = 1
  const pageCount = Math.ceil(tasks.length / pageSize)
  const visibleTasks = tasks.slice(page * pageSize, (page + 1) * pageSize)
  const valid = (id: string) => { const e = entries[id]; return !!e && e.value.trim() !== '' && Number.isFinite(Number(e.value.replace(',', '.'))) && Number(e.value.replace(',', '.')) >= 0 && e.safety !== null }
  const pageValid = visibleTasks.every(t => valid(t.id))
  const missing = (id: string) => { const e = entries[id]; const v = e?.value.trim() ?? ''; return { value: v === '' || !Number.isFinite(Number(v.replace(',', '.'))) || Number(v.replace(',', '.')) < 0, safety: e?.safety == null } }
  const leave = () => { if (!loadProfile()?.checks?.start) saveProfile({ checkPostponed: true }); navigate('/', { replace: true }) }
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
  const btnSecondary = claySecondary
  const Checklist = ({ items }: { items: [string, string][] }) => <ul className="space-y-3 rounded-[28px] bg-white p-5 border-2 border-mint shadow-[0_4px_0_#cfe7e5] text-[15px] leading-6">{items.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>

  // Day 1: three swipe cards → preparation checklist (with "remind me later") → safety note → tasks.
  if (isStart && stage < 5) {
    if (stage <= 2) {
      const cards = [
        [L('Hallo! Ich bin Vestibu, dein stiller Regisseur für mehr Gleichgewicht im Alltag.', 'Xin chào! Mình là Vestibu, người đạo diễn thầm lặng giúp bạn thăng bằng hơn mỗi ngày.'), L('Schon seit deiner Zeit im Mutterleib steuere ich rund um die Uhr dein Gleichgewichtsorgan. Meist arbeite ich im Verborgenen und beeinflusse deine Konzentration, dein gefühltes Stresslevel und dein körperliches Wohlbefinden im Alltag.', 'Từ khi bạn còn trong bụng mẹ, mình đã điều khiển cơ quan thăng bằng của bạn suốt ngày đêm. Mình thường làm việc thầm lặng và ảnh hưởng đến sự tập trung, mức độ căng thẳng và cảm giác khỏe khoắn của bạn mỗi ngày.')],
        [L('Wie gut sind wir aufeinander eingespielt?', 'Chúng ta ăn ý đến đâu?'), L('Damit ich dich in jeder Lebenslage optimal unterstützen kann, brauche ich ab und zu deine Aufmerksamkeit. Wie gut sind wir aktuell aufeinander eingespielt? Lass es uns mit einem Selbsttest herausfinden.', 'Để hỗ trợ bạn tốt nhất trong mọi hoàn cảnh, thỉnh thoảng mình cần bạn chú ý đến mình. Hiện giờ chúng ta ăn ý đến đâu? Hãy cùng tìm hiểu qua một bài tự kiểm tra.')],
        [L('3 × 1 Minute täglich', '3 × 1 phút mỗi ngày'), L('Danach begleite ich dich mit 3x1 Minute täglich – ganz leicht und überall machbar. Wenn du Lust auf mehr hast, warten freiwillige Bonus-Minuten als Extra auf dich. Und weil dein Gehirn Affirmationen liebt, bekommst du zu jeder Übung einen positiven Tages-Gedanken dazu.', 'Sau đó mình sẽ đồng hành cùng bạn 3 × 1 phút mỗi ngày – thật nhẹ nhàng và tập ở đâu cũng được. Khi muốn tập thêm, những phút bonus tùy chọn đang chờ bạn. Và vì não bộ thích những câu khẳng định, mỗi bài tập đều đi kèm một suy nghĩ tích cực trong ngày.')],
      ]
      return <main className={shell}>
        <img src={stage === 0 ? vestibuWelcome : mascot} alt="Vestibu" className="float mx-auto size-44 object-contain" />
        <h1 className="text-2xl font-black">{cards[stage][0]}</h1>
        <p className="text-[16px] leading-7">{cards[stage][1]}</p>
        {stage === 2 && <p className="font-bold">{L('Bist du bereit zu beginnen?', 'Bạn đã sẵn sàng bắt đầu chưa?')}</p>}
        <div className="flex justify-center gap-2" aria-hidden="true">{cards.map((_, i) => <span key={i} className={`h-2 rounded-full ${i === stage ? 'w-6 bg-brand-deep' : 'w-2 bg-mint'}`} />)}</div>
        <button className={btnPrimary} onClick={() => setStage(s => s + 1)}>{stage === 2 ? L('Meinen Selbsttest starten', 'Bắt đầu bài tự kiểm tra') : L('Weiter', 'Tiếp')}</button>
        {stage > 0 && <button className="h-10 text-sm font-semibold text-slate-500" onClick={() => setStage(s => s - 1)}>{L('Zurück', 'Quay lại')}</button>}
      </main>
    }
    if (stage === 3) return <main className={shell}>
      <img src={mascot} alt="Vestibu" className="mx-auto size-32 object-contain" />
      <h1 className="text-2xl font-black">{L('Schön, dass du dir Zeit für dich nimmst!', 'Thật tốt khi bạn dành thời gian cho mình!')}</h1>
      <p>{L('Du möchtest dein Gleichgewichtssystem besser kennenlernen? Wir machen gemeinsam deinen persönlichen Check-up. Ich bin Vestibu, dein stiller Regisseur, wir schauen uns in Ruhe an, wie wir aktuell zusammenarbeiten.', 'Bạn muốn hiểu rõ hơn về hệ thăng bằng của mình? Chúng ta sẽ cùng làm bài kiểm tra riêng cho bạn. Mình là Vestibu, người đạo diễn thầm lặng – ta sẽ thong thả xem hiện giờ hai ta phối hợp thế nào.')}</p>
      <h2 className="font-black">{L('Das brauchst du für deinen Selbsttest:', 'Bạn cần chuẩn bị cho bài tự kiểm tra:')}</h2>
      <Checklist items={[[L('Zeit','Thời gian'), L('Nimm dir eine ruhige halbe Stunde ungestört für dich.', 'Dành nửa tiếng yên tĩnh, không bị làm phiền.')], [L('Platz','Không gian'), L('Eine frei begehbare Fläche von ca. 3 Metern, damit du dich sicher bewegen kannst.', 'Một khoảng trống khoảng 3 mét để bạn di chuyển an toàn.')], [L('Hilfsmittel','Dụng cụ'), L('Einen stabilen Stuhl für die Übungen und deine Sicherheit.', 'Một chiếc ghế chắc chắn cho bài tập và sự an toàn của bạn.')]]} />
      <p className="text-sm text-slate-600">{L('Falls es gerade nicht passt, ist das kein Problem. Du kannst den Test jederzeit nachholen, wenn du zu Hause Ruhe hast.', 'Nếu bây giờ chưa tiện cũng không sao. Bạn có thể làm bài bất cứ lúc nào khi ở nhà yên tĩnh.')}</p>
      {remindAt && <p role="status" className="rounded-2xl bg-mint p-3 text-sm font-semibold text-brand-deep">{L(`Ich erinnere dich um ${remindAt} Uhr. Lass die App dafür geöffnet oder angepinnt.`, `Mình sẽ nhắc bạn lúc ${remindAt}. Hãy để ứng dụng mở hoặc ghim nó lại.`)}</p>}
      <button className={btnPrimary} onClick={() => setStage(4)}>{L('Alles bereit – los geht’s!', 'Sẵn sàng – bắt đầu thôi!')}</button>
      <button className="h-11 text-sm font-semibold text-brand-deep" onClick={leave}>{L('Selbsttest später machen', 'Làm bài tự kiểm tra sau')}</button>
      {!picking ? <button className={btnSecondary} onClick={() => setPicking(true)}>{L('Später erinnern', 'Nhắc tôi sau')}</button> : <div className="flex flex-col gap-2 rounded-[28px] bg-white p-4 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <button className={btnSecondary} onClick={() => remind('19:00')}>{L('Heute Abend (19:00 Uhr)', 'Tối nay (19:00)')}</button>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">{L('Eigene Zeit wählen', 'Tự chọn giờ')}<input type="time" onChange={e => e.target.value && remind(e.target.value)} className="h-10 rounded-full bg-canvas px-3" /></label>
      </div>}
    </main>
    return <main className={shell}>
      <img src={vestibuWelcome} alt="Vestibu" className="mx-auto size-32 object-contain" />
      <h1 className="text-2xl font-black">{L('Schön, dass du da bist!', 'Thật vui vì bạn ở đây!')}</h1>
      <p>{L('Bevor wir starten, das Wichtigste vorweg: Nimm dir die Zeit, die du brauchst – es ist kein Wettkampf. Es geht nur darum, dass wir beide herausfinden, wie es dir aktuell geht.', 'Trước khi bắt đầu, điều quan trọng nhất: hãy dành thời gian bạn cần – đây không phải cuộc thi. Chúng ta chỉ cùng tìm hiểu hiện giờ bạn đang thế nào.')}</p>
      <p>{L('Achte während der Übungen gut auf dich. Wenn dir schwindelig wird oder sich etwas unangenehm anfühlt, mach eine Pause, trink ein Glas Wasser oder setz dich auf einen Stuhl. Deine Sicherheit geht immer vor.', 'Hãy chú ý đến bản thân trong lúc tập. Nếu thấy chóng mặt hoặc khó chịu, hãy nghỉ, uống một cốc nước hoặc ngồi xuống ghế. An toàn của bạn luôn được đặt lên hàng đầu.')}</p>
      <p className="font-bold">{L('Stell dich jetzt ganz entspannt auf deine freie Fläche. Tippe auf Start, sobald du bereit bist!', 'Giờ hãy thư thả đứng vào khoảng trống. Nhấn Bắt đầu khi bạn sẵn sàng!')}</p>
      <button className={btnPrimary} onClick={() => { saveProfile({ introSeen: true }); setStage(5) }}>{L('Start', 'Bắt đầu')}</button>
    </main>
  }

  // Day 90: a no-pressure "where do you stand today" intro before the re-test.
  if (!isStart && stage < 5) return <main className={shell}>
    <img src={vestibuWelcome} alt="Vestibu" className="float mx-auto size-40 object-contain" />
    {stage === 0 ? <>
      <h1 className="text-2xl font-black">{L('Dein stiller Regisseur zieht den Hut vor dir!', 'Người đạo diễn thầm lặng ngả mũ trước bạn!')}</h1>
      <p>{L('Drei Monate lang hast du dir immer wieder deine persönlichen Minuten geschenkt und deinem Gleichgewichtssystem wertvolle Aufmerksamkeit gegeben.', 'Suốt ba tháng, bạn đã đều đặn dành cho mình những phút riêng và dành cho hệ thăng bằng sự quan tâm quý giá.')}</p>
      <p>{L('Jetzt nehmen wir uns Zeit für eine neue Standortbestimmung: Wie fühlt sich deine Balance heute im Vergleich zu vor 90 Tagen an?', 'Giờ hãy dành thời gian xem lại bạn đang ở đâu: hôm nay bạn cảm thấy thăng bằng thế nào so với 90 ngày trước?')}</p>
      <p>{L('Lass uns das mit einem zweiten Selbsttest gemeinsam anschauen. Ganz ohne Leistungsdruck – es geht nicht um „besser“ oder „schlechter“, sondern darum, wo du heute stehst.', 'Hãy cùng xem qua bài tự kiểm tra lần hai. Hoàn toàn không áp lực – không phải chuyện “tốt hơn” hay “kém hơn”, mà là hôm nay bạn đang ở đâu.')}</p>
      <button className={btnPrimary} onClick={() => setStage(1)}>{L('Jetzt Selbsttest starten', 'Bắt đầu tự kiểm tra')}</button>
    </> : <>
      <h1 className="text-2xl font-black">{L('Bereit für deinen Vorher-Nachher-Vergleich?', 'Sẵn sàng so sánh trước và sau?')}</h1>
      <p>{L('Damit wir deine Werte von heute mit Tag 1 vergleichen können, gelten dieselben Bedingungen wie beim ersten Mal:', 'Để so sánh kết quả hôm nay với ngày 1, điều kiện sẽ giống như lần đầu:')}</p>
      <Checklist items={[[L('Zeit','Thời gian'), L('Eine ruhige halbe Stunde ungestört für dich.', 'Nửa tiếng yên tĩnh, không bị làm phiền.')], [L('Platz','Không gian'), L('Ca. 3 Meter frei begehbare Fläche.', 'Khoảng 3 mét trống để đi lại.')], [L('Sicherheit', 'An toàn'), L('Dein stabiler Stuhl steht griffbereit.', 'Chiếc ghế chắc chắn ở ngay trong tầm tay.')]]} />
      <button className={btnPrimary} onClick={() => setStage(5)}>{L('Alles bereit – Vergleich starten!', 'Sẵn sàng – bắt đầu so sánh!')}</button>
    </>}
  </main>

  // After the day-1 test: appreciation and hand-over to the daily minutes.
  if (stage === 6) return <main className={shell}>
    <img src={vestibuWelcome} alt="Vestibu" className="float mx-auto size-40 object-contain" />
    <h1 className="text-2xl font-black">{L('Geschafft! Danke für deine Aufmerksamkeit.', 'Xong rồi! Cảm ơn sự chú tâm của bạn.')}</h1>
    <p>{L('Du hast dir gerade eine Zeit nur für dich und dein inneres Gleichgewicht genommen – darauf kannst du wirklich stolz sein.', 'Bạn vừa dành thời gian chỉ cho bản thân và sự thăng bằng bên trong – bạn thật sự có thể tự hào.')}</p>
    <p>{L('Ich habe mir genau angeschaut, wie wir beide zusammenspielen. Egal, wie sich die einzelnen Übungen angefühlt haben: Dein Gleichgewichtssystem ist lernfähig in jedem Alter. Genau hier setzen wir jetzt gemeinsam an.', 'Mình đã xem kỹ hai ta phối hợp thế nào. Dù từng bài tập mang lại cảm giác ra sao: hệ thăng bằng của bạn có thể học hỏi ở mọi lứa tuổi. Chúng ta sẽ cùng bắt đầu từ chính điểm này.')}</p>
    <h2 className="font-black">{L('Dein persönlicher Plan steht bereit:', 'Lộ trình riêng của bạn đã sẵn sàng:')}</h2>
    <p>{L('Ab jetzt begleite ich dich 3x1 Minute täglich. So, wie es dir am besten möglich ist. Ganz ohne Stress, überall machbar. Und wenn du mal Lust auf mehr hast, warten freiwillige Bonus-Minuten auf dich.', 'Từ giờ mình sẽ đồng hành cùng bạn 3 × 1 phút mỗi ngày, theo cách phù hợp nhất với bạn. Không áp lực, tập ở đâu cũng được. Và khi muốn tập thêm, những phút bonus tùy chọn luôn chờ bạn.')}</p>
    <button className={btnPrimary} onClick={() => navigate('/', { replace: true })}>{L('Meine heutige Übung ansehen', 'Xem bài tập hôm nay')}</button>
  </main>

  return (
    <div className="mx-auto min-h-dvh max-w-[440px] bg-cream px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-10">
      <header className="pb-2 text-center">
        <p className="flow-note mb-2">{L('Deine Eingaben werden nach jeder Aufgabe gespeichert.', 'Câu trả lời được lưu sau mỗi bài.')}</p>
        <h1 className="text-[26px] leading-8 font-extrabold tracking-[-0.6px]">{L('Selbsttest', 'Tự kiểm tra')}</h1>
        <p className="mt-1 text-sm font-semibold text-rust">{isStart ? L('Tag 1', 'Ngày 1') : L(`Tag ${PROGRAM_DAYS}`, `Ngày ${PROGRAM_DAYS}`)} · {L('Aufgabe', 'Bài')} {page + 1}/{tasks.length}</p>
        <nav aria-label={L('Kategorien', 'Nhóm')} className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-white p-1">
          {groups.map(g => {
            const first = tasks.findIndex((_, i) => groupOf(i) === g)
            const reachable = tasks.slice(0, first).every(t => valid(t.id))
            return <button key={g} type="button" disabled={!reachable} aria-current={groupOf(page) === g ? 'step' : undefined} onClick={() => setPage(first)} className={`rounded-full py-2 text-sm font-bold disabled:opacity-40 ${groupOf(page) === g ? 'bg-brand-deep text-white' : 'text-[#3f4a4b]'}`}>{groupLabel(g)}</button>
          })}
        </nav>
      </header>

      <section className={`${card} mt-5 flex gap-3`}>
        <img src={mascot} alt="" className="size-16 shrink-0 object-contain" />
        <div className="text-[15px] leading-6 text-ink">
          <p>{L('Nimm dir Zeit: Achte auf ebenen Boden und genügend Freiraum. Halt dich bei Bedarf an der Wand oder einem stabilen Stuhl fest.', 'Cứ từ từ: chọn sàn bằng phẳng và đủ khoảng trống. Vịn vào tường hoặc ghế chắc chắn nếu cần.')}</p>
          <p className="mt-2 font-bold">{L('Barfuß. Ergebnis und Sicherheit sind Pflichtfelder.', 'Đi chân trần. Kết quả và mức độ an toàn là bắt buộc.')}</p>
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
                  <h2 className="font-bold">{taskText(t).title}</h2>
                  <p className="text-sm text-[#6f7472]">{taskText(t).detail}</p>
                </div>
              </div>

              <label className="mt-3 flex items-center justify-between gap-3 border-t border-[#f3f6f5] pt-3">
                <span className="text-sm font-semibold">{L('Mein Wert', 'Kết quả của tôi')} <span className="text-rust">*</span></span>
                <span className="flex items-center gap-2">
                  <input inputMode="decimal" value={e.value} onChange={ev => update(t.id, { value: ev.target.value })} placeholder="–" className="h-10 w-20 rounded-full bg-[#f3f6f5] text-center text-lg font-bold text-brand-deep outline-none focus:ring-2 focus:ring-brand" />
                  <span className="w-14 text-sm text-[#6f7472]">{taskText(t).unit}</span>
                </span>
              </label>

              <div className="mt-3">
                <p className="text-sm font-semibold">{L('Meine gefühlte Sicherheit', 'Mức độ an toàn tôi cảm nhận')} <span className="text-rust">*</span> <span className="font-normal text-[#6f7472]">{L('(1 Tiefpunkt – 10 Fantastisch)', '(1 rất tệ – 10 tuyệt vời)')}</span></p>
                <div className="mt-2 grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                    <button key={n} type="button" onClick={() => update(t.id, { safety: e.safety === n ? null : n })} className={`h-9 rounded-full text-sm font-semibold ${e.safety === n ? 'bg-brand-deep text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{n}</button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold">{L('Mir fällt auf', 'Tôi nhận thấy')}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {observations.map(o => {
                    const on = e.notes.includes(o)
                    return (
                      <button key={o} type="button" onClick={() => update(t.id, { notes: on ? e.notes.filter(x => x !== o) : [...e.notes, o] })} className={`rounded-full px-3 py-1 text-sm font-semibold ${on ? 'bg-rust text-white' : 'bg-[#f3f6f5] text-[#3f4a4b]'}`}>{obsLabel(o)}</button>
                    )
                  })}
                </div>
                <input value={e.comment} onChange={ev => update(t.id, { comment: ev.target.value })} placeholder={L('usw. – eigene Notiz', 'v.v. – ghi chú riêng')} className="mt-2 h-10 w-full rounded-full bg-[#f3f6f5] px-4 text-sm outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-sm font-semibold text-[#6f7472]">
          <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-full px-3 py-2 disabled:opacity-30">{L('Zurück', 'Quay lại')}</button>
          <span>{page + 1} / {pageCount}</span>
          {lastPage ? <span className="w-[58px]" /> : <button type="button" onClick={() => { if (!pageValid) { setShowErrors(true); return } setShowErrors(false); setPage(p => p + 1); window.scrollTo(0, 0) }} className="rounded-full px-3 py-2 text-brand-deep">{L('Weiter', 'Tiếp')}</button>}
        </div>
        {showErrors && !pageValid && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{(() => { const m = visibleTasks.map(t => missing(t.id)); const v = m.some(x => x.value), s = m.some(x => x.safety); return v && s ? L('Bitte trag deinen Wert ein und wähle deine gefühlte Sicherheit (1–10).', 'Vui lòng nhập kết quả và chọn mức độ an toàn bạn cảm nhận (1–10).') : v ? L('Bitte trag deinen Wert als Zahl ein (z. B. 30).', 'Vui lòng nhập kết quả bằng số (ví dụ 30).') : L('Bitte wähle deine gefühlte Sicherheit (1–10).', 'Vui lòng chọn mức độ an toàn bạn cảm nhận (1–10).') })()}</p>}
        {lastPage && <button onClick={() => { if (!tasks.every(t => valid(t.id))) { setShowErrors(true); const i = tasks.findIndex(t => !valid(t.id)); if (i !== page) setPage(i); return } finish() }} className={btnPrimary}>{isStart ? L('Speichern und starten', 'Lưu và bắt đầu') : L('Ergebnisse vergleichen', 'So sánh kết quả')}</button>}
        <button onClick={leave} className="h-11 text-sm text-[#6f7472]">{L('Später fortsetzen', 'Tiếp tục sau')}</button>
      </div>
    </div>
  )
}
