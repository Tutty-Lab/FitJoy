import { Link, Navigate } from 'react-router-dom'
import { groupLabel, groupOf, groups, obsLabel, taskText, tasks, PROGRAM_DAYS } from '../../data/balanceCheck'
import { loadProfile } from '../../lib/profile'
import { emptyEntry, type Check } from '../../lib/checks'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'
import { SectionTitle } from '../../components/shared'
import { L, locale } from '../../lib/i18n'

const card = 'rounded-[32px] bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString(locale) : '–')
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
        <h1 className="text-2xl font-black">{L('Danke für deine ehrliche Bestandsaufnahme!', 'Cảm ơn bạn đã thành thật nhìn lại!')}</h1>
        <p>{L('Dein stiller Regisseur sagt Danke für deine Aufmerksamkeit! Drei Monate lang hast du dir immer wieder deine persönlichen Minuten geschenkt – und heute haben wir geschaut, wo du stehst.', 'Người đạo diễn thầm lặng cảm ơn sự chú tâm của bạn! Suốt ba tháng, bạn đã đều đặn dành cho mình những phút riêng – và hôm nay ta đã xem bạn đang ở đâu.')}</p>
        <p>{L('Vielleicht spürst und siehst du heute schon deutliche Veränderungen – vielleicht wirken deine Werte auf den ersten Blick aber auch noch sehr vertraut. Beides ist ein wertvolles Zeichen für dich:', 'Có thể hôm nay bạn đã cảm nhận và thấy rõ thay đổi – cũng có thể kết quả thoạt nhìn vẫn rất quen thuộc. Cả hai đều là dấu hiệu quý giá:')}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><b>{L('Du siehst Veränderungen?', 'Bạn thấy có thay đổi?')}</b> {L('Wunderbar! Dein System reagiert bereits spürbar auf deine regelmäßige Zuwendung.', 'Tuyệt vời! Cơ thể bạn đã phản hồi rõ rệt với sự chăm sóc đều đặn.')}</li>
          <li><b>{L('Du siehst bekannte Werte?', 'Bạn thấy kết quả quen thuộc?')}</b> {L('Genau so wichtig! Das Gleichgewichtssystem arbeitet oft lange im Verborgenen, stabilisiert im Hintergrund, stoppt schleichenden Abbau und fängt Alltagsstress ab, bevor es nach außen im Test sichtbar wird.', 'Điều này cũng quan trọng không kém! Hệ thăng bằng thường làm việc thầm lặng rất lâu: ổn định từ bên trong, ngăn suy giảm âm thầm và hấp thụ căng thẳng thường ngày trước khi điều đó hiện rõ trong bài kiểm tra.')}</li>
        </ul>
        <p>{L('Das Wichtigste ist: Du hast drei Monate lang das Fundament gelegt.', 'Điều quan trọng nhất: bạn đã xây nền móng suốt ba tháng.')} <i>{L('„Gras wächst nicht schneller, wenn man daran zieht – ich vertraue meinem eigenen Tempo.“', '„Cỏ không mọc nhanh hơn khi ta kéo nó – tôi tin vào nhịp độ của chính mình.“')}</i></p>
      </section>
      <SectionTitle>{L('Meine Ergebnisse', 'Kết quả của tôi')}</SectionTitle>
      <div className={`${card} grid grid-cols-3 gap-2 text-center`}>
        <div />
        <div><p className="text-xs font-bold text-[#6f7472] uppercase">{L('Tag 1', 'Ngày 1')}</p><p className="font-bold text-brand-deep">{fmt(start?.date)}</p></div>
        <div><p className="text-xs font-bold text-[#6f7472] uppercase">{L('Tag', 'Ngày')} {PROGRAM_DAYS}</p><p className="font-bold text-rust">{fmt(end?.date)}</p></div>
        <p className="text-left text-sm font-semibold">{L('Sicherheit Ø', 'An toàn TB')}</p>
        <p className="text-2xl font-black text-brand-deep">{avgSafety(start)}</p>
        <p className="text-2xl font-black text-rust">{avgSafety(end)}</p>
      </div>
      {!start && <Link to="/check/start" className="flex h-14 items-center justify-center rounded-full bg-brand-deep font-bold text-white">{L('Check starten', 'Bắt đầu kiểm tra')}</Link>}
      {groups.map(g => (
        <section key={g} className="flex flex-col gap-3">
          <SectionTitle>{groupLabel(g)}</SectionTitle>
          {tasks.map((t, i) => {
            if (groupOf(i) !== g) return null
            const a = start?.entries[t.id] ?? emptyEntry()
            const b = end?.entries[t.id] ?? emptyEntry()
            return (
              <div key={t.id} className={card}>
                <p className="flex items-center gap-2 font-bold">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-xs text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                  {taskText(t).title}
                </p>
                <div className="mt-3 grid grid-cols-[1fr_64px_64px] gap-y-1 text-sm">
                  <span />
                  <span className="text-center text-xs font-bold text-[#6f7472]">{L('Tag 1', 'Ngày 1')}</span>
                  <span className="text-center text-xs font-bold text-[#6f7472]">{L('Tag', 'Ngày')} {PROGRAM_DAYS}</span>
                  <span className="text-[#3f4a4b]">{L('Wert', 'Kết quả')} ({taskText(t).unit})</span>
                  <span className="text-center font-bold text-brand-deep">{a.value || '–'}</span>
                  <span className="text-center font-bold text-rust">{b.value || '–'}</span>
                  <span className="text-[#3f4a4b]">{L('Sicherheit', 'An toàn')}</span>
                  <span className="text-center font-bold text-brand-deep">{a.safety ?? '–'}</span>
                  <span className="text-center font-bold text-rust">{b.safety ?? '–'}</span>
                </div>
                {(a.notes.length > 0 || b.notes.length > 0 || a.comment || b.comment) && (
                  <p className="mt-2 text-xs text-[#6f7472]">
                    {(a.notes.length > 0 || a.comment) && <>{L('Tag 1', 'Ngày 1')}: {[...a.notes.map(obsLabel), a.comment].filter(Boolean).join(', ')}. </>}
                    {(b.notes.length > 0 || b.comment) && <>{L('Tag', 'Ngày')} {PROGRAM_DAYS}: {[...b.notes.map(obsLabel), b.comment].filter(Boolean).join(', ')}.</>}
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
