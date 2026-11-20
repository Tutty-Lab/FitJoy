import ExitMinuteDialog from '../../components/ExitMinuteDialog'
import StoryReward from '../../components/StoryReward'
import Vestibu from '../../components/Vestibu'
import { Confetti } from '../../components/GameEffects'
import { playGameSound, unlockGameAudio } from '../../lib/gameAudio'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { completeLesson, sessionsDone, useCompleted } from '../../lib/progress'
import { affirmationFor, baseText, categoryLabel, baseVideo, localBonusFor, localDay, PRACTICE_SECONDS, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../../data/program'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { loadProfile } from '../../lib/profile'
import poster from '../../assets/home/vestibu-welcome.png'
import { L } from '../../lib/i18n'
import { clayPrimary, claySecondary } from '../../components/clay'

type Stage = 'instructions' | 'practice' | 'done' | 'bonus' | 'bonusDone'

// 05a instructions → 05b 60-second practice → 05c congratulations + bonus question → 06 bonus.
export default function WorkoutDetail() {
  const day = Number(useParams().day)
  const location = useLocation()
  const navigate = useNavigate()
  const { statusOf, completed, finished, current } = useCompleted()
  const session = useMemo(() => {
    const requested = Number(new URLSearchParams(location.search).get('session'))
    return Number.isInteger(requested) && requested >= 1 && requested <= SESSIONS_PER_DAY ? requested : Math.min(SESSIONS_PER_DAY, sessionsDone(day) + 1)
  }, [day, location.search])
  const content = localDay(day)
  const affirmation = affirmationFor(day)
  const video = baseVideo()
  const bonus = localBonusFor(day)
  const [stage, setStage] = useState<Stage>('instructions')
  const [remaining, setRemaining] = useState(PRACTICE_SECONDS)
  const [running, setRunning] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [newDiscovery, setNewDiscovery] = useState(false)
  const wasCompleted = useRef(completed.includes(day))
  const player = useRef<VideoPlayerHandle>(null)
  const remainingMs = useRef(PRACTICE_SECONDS * 1000)
  const from = (location.state as { from?: string } | null)?.from
  const returnTo = from && /^\/days\/\d+$/.test(from) ? from : '/'

  useEffect(() => { setStage('instructions'); setRemaining(PRACTICE_SECONDS); remainingMs.current = PRACTICE_SECONDS * 1000; setRunning(false); setExitOpen(false); setNewDiscovery(false); wasCompleted.current=completed.includes(day) }, [day, session])
  useEffect(() => {
    const pause=()=>{ if(document.hidden){player.current?.pause();setRunning(false)} }
    document.addEventListener('visibilitychange',pause)
    return ()=>document.removeEventListener('visibilitychange',pause)
  }, [])
  useEffect(() => {
    if (!running || (stage !== 'practice' && stage !== 'bonus')) return
    const startedAt = performance.now()
    const available = remainingMs.current
    const id = setInterval(() => setRemaining(Math.ceil(Math.max(0, available - (performance.now() - startedAt)) / 1000)), 100)
    return () => {
      clearInterval(id)
      remainingMs.current = Math.max(0, available - (performance.now() - startedAt))
    }
  }, [running, stage])
  useEffect(() => {
    if (stage === 'practice' && remaining === 0) {
      setRunning(false)
      setNewDiscovery(!wasCompleted.current)
      completeLesson(day, session)
      if (loadProfile()?.chime ?? true) playGameSound('success')
      setStage('done')
    }
    if (stage === 'bonus' && remaining === 0) {
      setRunning(false)
      if (loadProfile()?.chime ?? true) playGameSound('success')
      setStage('bonusDone')
    }
  }, [remaining, stage, day, session])

  if (!Number.isInteger(day) || day < 1 || day > PROGRAM_DAYS || statusOf(day) === 'locked') return <Navigate to="/" replace />

  const start = (next: 'practice' | 'bonus') => {
    unlockGameAudio()
    remainingMs.current = PRACTICE_SECONDS * 1000
    setRemaining(PRACTICE_SECONDS)
    setRunning(false)
    setStage(next)
  }
  const togglePlayback = () => {
    if (running) player.current?.pause()
    else player.current?.play()
  }

  const primary = clayPrimary
  const secondary = claySecondary
  const Affirmation = ({ big }: { big?: boolean }) => (
    <blockquote className={`rounded-[28px] border-2 border-[#bfe0dd] bg-mint p-5 text-center shadow-[0_4px_0_#bfe0dd] font-bold text-brand-deep ${big ? 'text-2xl leading-9' : 'text-lg'}`}>
      „{affirmation}“
      {big && <p className="mt-2 text-sm font-semibold text-slate-600">{L('Halte die Position und sprich diesen Satz laut aus.', 'Giữ tư thế và đọc to câu này.')}</p>}
    </blockquote>
  )
  const back = () => {
    if (stage === 'bonus' || stage === 'practice') { player.current?.pause(); setRunning(false); setExitOpen(true); return }
    navigate(returnTo, { replace: true })
  }
  const done = sessionsDone(day)
  const nextRoute = finished && day===90 && done>=SESSIONS_PER_DAY ? (loadProfile()?.checks?.end ? '/compare' : '/check/end') : done<SESSIONS_PER_DAY && day===current ? `/workouts/${day}?session=${done+1}` : '/'
  const nextLabel = finished && day===90 && done>=SESSIONS_PER_DAY ? L('Zum abschließenden Selbsttest', 'Đến tự kiểm tra cuối hành trình') : done<SESSIONS_PER_DAY && day===current ? L(`Weiter zu Minute ${done+1}`, `Đến phút ${done+1}`) : L('Zurück zu Heute', 'Về Hôm nay')

  return <div className="flex flex-col gap-5 px-4 pb-8">
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 py-2 backdrop-blur">
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
      <p className="flow-note">{L('Pausierst du das Video, hält auch der Zähler an. Bei Unwohlsein pausieren und hinsetzen.', 'Tạm dừng video thì đồng hồ cũng dừng. Nếu khó chịu, hãy tạm dừng và ngồi xuống.')}</p>
      <button type="button" className={primary} onClick={() => start('practice')}>{L('Übung starten', 'Bắt đầu tập')} · {PRACTICE_SECONDS} {L('Sekunden', 'giây')}</button>
    </>}

    {stage === 'practice' && <>
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-brand-deep">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:practice`} ref={player} src={video} poster={poster} autoPlay loop onPlaybackChange={setRunning} />
      <Affirmation big />
      <button type="button" className={primary} onClick={togglePlayback}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {stage === 'done' && <section className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-6 text-center border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
      <Confetti /><Vestibu mood="celebrate" className="size-32" />
      <h2 className="text-2xl font-black">{L('Gut gemacht!', 'Làm tốt lắm!')}</h2>
      {newDiscovery && <StoryReward day={day} />}
      <p className="text-slate-600">{L(`Grundübung ${session}/${SESSIONS_PER_DAY} für Tag ${day} geschafft.`, `Đã xong bài cơ bản ${session}/${SESSIONS_PER_DAY} của ngày ${day}.`)}</p>
      {!newDiscovery && <p className="flow-note">{L('Diese Geschichte ist bereits in deinem Inselbuch. Wiederholen gibt keine doppelte Entdeckung.', 'Diễn biến này đã lưu trong nhật ký. Tập lại không nhận thêm khám phá trùng.')}</p>}
      <Link className={primary} to={nextRoute} replace>{nextLabel}</Link>
      {nextRoute !== '/' && <Link to="/" className="flow-back">{L('Für jetzt aufhören', 'Tạm nghỉ, về Hôm nay')}</Link>}
      {bonus && <details className="w-full text-left"><summary className="flow-summary">{L('Bonus · freiwillig', 'Bonus · tùy chọn')}</summary><p className="flow-note mb-3">{content.bonusImpuls || L('Eine weitere Minute, ohne zusätzliche Freischaltung.', 'Tập thêm một phút, không mở thêm ngày hay phần thưởng.')}</p><button type="button" className={secondary} onClick={() => start('bonus')}>{L('Bonus-Minute starten', 'Bắt đầu phút bonus')}</button></details>}
    </section>}

    {stage === 'bonus' && bonus && <>
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-rust">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:bonus`} ref={player} src={video} poster={poster} autoPlay loop onPlaybackChange={setRunning} />
      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-5 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <p className="text-xs font-bold tracking-wide text-rust uppercase">Bonus · {categoryLabel(bonus.kategorie)}</p>
        <h2 className="text-xl font-black">{bonus.titel}</h2>
        <p className="text-[15px] leading-6">{bonus.anleitung}</p>
      </section>
      <Affirmation big />
      <button type="button" className={primary} onClick={togglePlayback}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {stage === 'bonusDone' && <section className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-6 text-center border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
      <Confetti /><Vestibu mood="celebrate" className="size-32" />
      <h2 className="text-2xl font-black">{L('Bonus geschafft!', 'Xong phút bonus!')}</h2>
      <p className="text-slate-600">{L('Eine Extra-Minute für dein Gleichgewicht.', 'Thêm một phút cho sự thăng bằng của bạn.')}</p>
      <Link className={primary} to={nextRoute} replace>{nextLabel}</Link>
      {nextRoute !== '/' && <Link to="/" className="flow-back">{L('Für jetzt aufhören','Tạm nghỉ, về Hôm nay')}</Link>}
    </section>}
    {exitOpen && <ExitMinuteDialog stay={()=>setExitOpen(false)} leave={()=>navigate(returnTo,{replace:true})}/>}
  </div>
}
