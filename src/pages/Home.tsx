import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import mascot from '../assets/home/mascot.png'
import { affirmationFor, localDay, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../data/program'
import { loadProfile } from '../lib/profile'
import { sessionsDone, useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'

const card = 'w-full rounded-3xl border border-mint bg-white p-[17px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const phaseName = (phase: string) => phase.replace(/^P(\d):\s*/, `${L('Phase', 'Giai đoạn')} $1 · `)

export default function Home() {
  const [p] = useState(() => loadProfile())
  const { completed, current, waitingForTomorrow, finished } = useCompleted()
  const today = localDay(current)
  const done = sessionsDone(current)
  const pct = (completed.length / PROGRAM_DAYS) * 100

  return (
    <div className="stagger flex flex-col gap-4 px-4 pt-2 pb-6">
      <button type="button" onClick={() => window.location.reload()} className="flex h-10 items-center justify-center gap-2 self-end rounded-full border border-mint bg-white px-4 text-sm font-bold text-brand-deep shadow-sm">
        <RefreshCw aria-hidden="true" className="size-4" />{L('Aktualisieren', 'Làm mới')}
      </button>
      {/* Vestibu's greeting of the day */}
      <section className="hero-card relative overflow-hidden rounded-3xl border border-[rgba(207,231,229,0.6)] p-[17px] shadow-[0_10px_25px_rgba(19,112,126,0.12)]" style={{ backgroundImage: 'linear-gradient(135deg, rgba(227,242,241,0.9) 0%, #fff 50%, #fffbeb 100%)' }}>
        <div className="flex items-start gap-3">
          <img src={mascot} alt="Vestibu" className="float size-20 shrink-0 object-contain" />
          <figure className="min-w-0 flex-1">
            <blockquote className="text-[17px] leading-6 font-bold text-slate-900">„{today.begruessung}“</blockquote>
          </figure>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-mint bg-white/90 px-[13px] py-2">
          <span className="text-xs font-bold tracking-[0.4px] text-brand-ink uppercase">{phaseName(today.phase)}</span>
          <span className="text-sm font-bold text-slate-500">{L('Tag', 'Ngày')} <b className="text-lg font-black text-brand-deep">{current}</b> / {PROGRAM_DAYS}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mint" role="progressbar" aria-valuemin={0} aria-valuemax={PROGRAM_DAYS} aria-valuenow={completed.length} aria-label={L('Fortschritt', 'Tiến trình')}>
          <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 rounded-2xl bg-mint/70 p-3">
          <p className="text-xs font-bold tracking-wide text-brand-ink uppercase">♥ {L('Dein Gedanke für heute', 'Suy nghĩ của bạn hôm nay')}</p>
          <p className="mt-1 text-[16px] leading-6 font-bold text-brand-deep">„{affirmationFor(current)}“</p>
        </div>
      </section>

      {finished && !p?.checks?.end && (
        <Link to="/check/end" className={`flex items-center justify-between gap-3 ${card}`}>
          <span>
            <span className="block text-base font-black text-slate-900">{L('Dein stiller Regisseur zieht den Hut vor dir!', 'Người đạo diễn thầm lặng ngả mũ trước bạn!')}</span>
            <span className="text-sm text-[#6f7472]">{L('Zeit für deine neue Standortbestimmung – ganz ohne Leistungsdruck.', 'Đến lúc xem lại bạn đang ở đâu – hoàn toàn không áp lực.')}</span>
          </span>
          <span className="shrink-0 rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white">{L('Selbsttest', 'Tự kiểm tra')}</span>
        </Link>
      )}
      {p?.checks?.end && <Link to="/compare" className={`${card} font-bold text-brand-deep`}>{L('Meine Ergebnisse: Tag 1 und Tag 90 vergleichen →', 'Kết quả của tôi: so sánh ngày 1 và ngày 90 →')}</Link>}

      {/* Today's base exercise */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-rust uppercase">{L('Grundübung heute', 'Bài tập cơ bản hôm nay')}</p>
            <h3 className="text-lg font-black">{done} / {SESSIONS_PER_DAY} {L('Mal', 'lần')}</h3>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: SESSIONS_PER_DAY }, (_, i) => <span key={i} className={`size-3 rounded-full ${i < done ? 'bg-brand' : 'bg-mint'}`} />)}
          </div>
        </div>
        {done < SESSIONS_PER_DAY ? (
          <Link to={`/workouts/${current}?session=${done + 1}`} state={{ from: '/' }} className="mt-3 flex h-14 items-center justify-center rounded-full bg-brand-deep text-base font-bold text-white shadow-md">
            {L(`Minute ${done + 1} starten`, `Bắt đầu phút ${done + 1}`)}
          </Link>
        ) : (
          <p className="mt-3 rounded-2xl bg-mint p-3 text-sm font-semibold text-brand-deep">{L('Für heute alles geschafft. Bis morgen!', 'Hôm nay đã xong hết. Hẹn mai nhé!')}</p>
        )}
      </section>

      <Link to="/calendar" className={`${card} flex items-center justify-between`}>
        <span className="font-black">{L('Dein 90-Tage-Kalender', 'Lịch 90 ngày của bạn')}</span>
        <span className="text-sm font-bold text-brand-deep">{completed.length} / {PROGRAM_DAYS} ›</span>
      </Link>
    </div>
  )
}
