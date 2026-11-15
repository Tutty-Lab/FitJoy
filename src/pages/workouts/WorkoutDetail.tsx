import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { completeLesson, sessionsDone, useCompleted } from '../../lib/progress'
import { affirmationFor, baseText, categoryLabel, baseVideo, localBonusFor, localDay, PRACTICE_SECONDS, SESSIONS_PER_DAY } from '../../data/program'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { loadProfile } from '../../lib/profile'
import { playChime } from '../../lib/reminders'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'
import poster from '../../assets/workouts/video-thumb.png'
import { L } from '../../lib/i18n'
import { clayPrimary, claySecondary } from '../../components/clay'

type Stage = 'instructions' | 'practice' | 'done' | 'bonus' | 'bonusDone'

// 05a instructions → 05b 60-second practice → 05c congratulations + bonus question → 06 bonus.
export default function WorkoutDetail() {
  const day = Number(useParams().day)
  const location = useLocation()
  const navigate = useNavigate()
  const { statusOf } = useCompleted()
  const session = Math.min(SESSIONS_PER_DAY, Number(new URLSearchParams(location.search).get('session')) || sessionsDone(day) + 1)
  const content = localDay(day)
  const affirmation = affirmationFor(day)
  const video = baseVideo()
  const bonus = localBonusFor(day)
  const [stage, setStage] = useState<Stage>('instructions')
  const [remaining, setRemaining] = useState(PRACTICE_SECONDS)
  const [running, setRunning] = useState(false)
  const player = useRef<VideoPlayerHandle>(null)
  const from = (location.state as { from?: string } | null)?.from
  const returnTo = from && /^\/days\/\d+$/.test(from) ? from : '/'

  useEffect(() => { setStage('instructions'); setRemaining(PRACTICE_SECONDS); setRunning(false) }, [day, session])
  useEffect(() => {
    if (!running || (stage !== 'practice' && stage !== 'bonus')) return
    const id = setInterval(() => setRemaining(n => Math.max(0, n - 1)), 1000)
    return () => clearInterval(id)
  }, [running, stage])
  useEffect(() => {
    if (stage === 'practice' && remaining === 0) {
      setRunning(false)
      completeLesson(day, session)
      if (loadProfile()?.chime ?? true) playChime()
      setStage('done')
    }
    if (stage === 'bonus' && remaining === 0) {
      setRunning(false)
      if (loadProfile()?.chime ?? true) playChime()
      setStage('bonusDone')
    }
  }, [remaining, stage, day, session])

  if (!Number.isInteger(day) || day < 1 || day > 90 || statusOf(day) === 'locked') return <Navigate to="/" replace />

  const primary = clayPrimary
  const secondary = claySecondary
  const Affirmation = ({ big }: { big?: boolean }) => (
    <blockquote className={`rounded-[28px] border-2 border-[#bfe0dd] bg-mint p-5 text-center shadow-[0_4px_0_#bfe0dd] font-bold text-brand-deep ${big ? 'text-2xl leading-9' : 'text-lg'}`}>
      „{affirmation}“
      {big && <p className="mt-2 text-sm font-semibold text-slate-600">{L('Halte die Position und sprich diesen Satz laut aus.', 'Giữ tư thế và đọc to câu này.')}</p>}
    </blockquote>
  )
  const back = () => {
    if (stage === 'bonus') { setRunning(false); setStage('done'); return }
    if (stage === 'practice') { setRunning(false); setRemaining(PRACTICE_SECONDS); setStage('instructions'); return }
    navigate(returnTo, { replace: true })
  }

  return <div className="flex flex-col gap-5 px-4 pb-8">
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-canvas/95 py-2 backdrop-blur">
      <button type="button" aria-label={L('Zurück', 'Quay lại')} title={L('Zurück', 'Quay lại')} onClick={back} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-mint bg-white text-brand-deep shadow-sm focus-visible:outline-2 focus-visible:outline-brand">
        <ArrowLeft aria-hidden="true" className="size-5" />
      </button>
      <h1 className="font-bold">{stage === 'bonus' || stage === 'bonusDone' ? `Bonus · ${L('Tag', 'Ngày')} ${day}` : L(`Tag ${day} · ${session}. von ${SESSIONS_PER_DAY} Mal`, `Ngày ${day} · lần ${session}/${SESSIONS_PER_DAY}`)}</h1>
    </header>

    {stage === 'instructions' && <>
      <VideoPlayer key={`${day}:instr`} ref={player} src={video} poster={poster} />
      <h2 className="text-xl font-black">{baseText.title}</h2>
      <ol className="list-decimal space-y-2 rounded-[28px] bg-white p-6 pl-10 border-2 border-mint shadow-[0_4px_0_#cfe7e5] text-[15px] leading-6">{baseText.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <Affirmation />
      <button type="button" className={secondary} onClick={() => { player.current?.play() }}>{L('Anleitung noch einmal ansehen', 'Xem lại hướng dẫn')}</button>
      <button type="button" className={primary} onClick={() => { setRemaining(PRACTICE_SECONDS); setStage('practice'); setRunning(true) }}>{L('Übung starten', 'Bắt đầu tập')} · {PRACTICE_SECONDS} {L('Sekunden', 'giây')}</button>
    </>}

    {stage === 'practice' && <>
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-brand-deep">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:practice`} src={video} poster={poster} />
      <Affirmation big />
      <button type="button" className={primary} onClick={() => setRunning(v => !v)}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {stage === 'done' && <section className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-6 text-center border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
      <img src={vestibuWelcome} alt="Vestibu" className="float size-32 object-contain" />
      <h2 className="text-2xl font-black">{L('Gut gemacht!', 'Làm tốt lắm!')}</h2>
      <p className="text-slate-600">{L(`Grundübung ${session}/${SESSIONS_PER_DAY} für Tag ${day} geschafft.`, `Đã xong bài cơ bản ${session}/${SESSIONS_PER_DAY} của ngày ${day}.`)}</p>
      {bonus && <p className="text-lg font-bold text-rust">{content.bonusImpuls || L('Lust auf deine Bonus-Minute?', 'Muốn tập thêm phút bonus không?')}</p>}
      {bonus && <button type="button" className={primary} onClick={() => { setRemaining(PRACTICE_SECONDS); setStage('bonus'); setRunning(true) }}>{L('Bonus-Minute starten', 'Bắt đầu phút bonus')}</button>}
      <button type="button" className={bonus ? 'h-10 text-sm font-semibold text-slate-500 underline' : secondary} onClick={() => navigate(returnTo, { replace: true })}>{bonus ? L('Heute nicht', 'Hôm nay thôi') : L('Zur Startseite', 'Về trang chủ')}</button>
    </section>}

    {stage === 'bonus' && bonus && <>
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-rust">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:bonus`} src={video} poster={poster} />
      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-5 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <p className="text-xs font-bold tracking-wide text-rust uppercase">Bonus · {categoryLabel(bonus.kategorie)}</p>
        <h2 className="text-xl font-black">{bonus.titel}</h2>
        <p className="text-[15px] leading-6">{bonus.anleitung}</p>
      </section>
      <Affirmation big />
      <button type="button" className={primary} onClick={() => setRunning(v => !v)}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {stage === 'bonusDone' && <section className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-6 text-center border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
      <img src={vestibuWelcome} alt="Vestibu" className="float size-32 object-contain" />
      <h2 className="text-2xl font-black">{L('Bonus geschafft!', 'Xong phút bonus!')}</h2>
      <p className="text-slate-600">{L('Eine Extra-Minute für dein Gleichgewicht.', 'Thêm một phút cho sự thăng bằng của bạn.')}</p>
      <button type="button" className={primary} onClick={() => navigate(returnTo, { replace: true })}>{L('Fertig', 'Xong')}</button>
    </section>}
  </div>
}
