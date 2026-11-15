import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { completeLesson, sessionsDone, useCompleted } from '../../lib/progress'
import { baseExercise, baseVideo, bonusFor, dayContent, PRACTICE_SECONDS, SESSIONS_PER_DAY } from '../../data/program'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { loadProfile } from '../../lib/profile'
import { playChime } from '../../lib/reminders'
import vestibuWelcome from '../../assets/home/vestibu-welcome.png'
import poster from '../../assets/workouts/video-thumb.png'

type Stage = 'instructions' | 'practice' | 'done' | 'bonus' | 'bonusDone'

// 05a instructions → 05b 60-second practice → 05c congratulations + bonus question → 06 bonus.
export default function WorkoutDetail() {
  const day = Number(useParams().day)
  const location = useLocation()
  const navigate = useNavigate()
  const { statusOf } = useCompleted()
  const session = Math.min(SESSIONS_PER_DAY, Number(new URLSearchParams(location.search).get('session')) || sessionsDone(day) + 1)
  const content = dayContent(day)
  // Until the customer delivers per-day affirmations, show a default one so the user always has a sentence to speak.
  const affirmation = content.affirmation || 'Ich stehe sicher. Mein Gleichgewicht wird jeden Tag stärker.'
  const video = baseVideo()
  const bonus = bonusFor(day)
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

  const primary = 'flex h-14 w-full items-center justify-center rounded-full bg-brand-deep px-5 text-base font-bold text-white shadow-md disabled:opacity-40'
  const secondary = 'flex h-12 w-full items-center justify-center rounded-full border border-mint bg-white px-5 font-bold text-brand-deep'
  const Affirmation = ({ big }: { big?: boolean }) => (
    <blockquote className={`rounded-3xl bg-mint p-5 text-center font-bold text-brand-deep ${big ? 'text-2xl leading-9' : 'text-lg'}`}>
      „{affirmation}“
      {big && <p className="mt-2 text-sm font-semibold text-slate-600">Halte die Position und sprich diesen Satz laut aus.</p>}
    </blockquote>
  )
  const back = () => {
    if (stage === 'bonus') { setRunning(false); setStage('done'); return }
    if (stage === 'practice') { setRunning(false); setRemaining(PRACTICE_SECONDS); setStage('instructions'); return }
    navigate(returnTo, { replace: true })
  }

  return <div className="flex flex-col gap-5 px-4 pb-8">
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-canvas/95 py-2 backdrop-blur">
      <button type="button" aria-label="Zurück" title="Zurück" onClick={back} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-mint bg-white text-brand-deep shadow-sm focus-visible:outline-2 focus-visible:outline-brand">
        <ArrowLeft aria-hidden="true" className="size-5" />
      </button>
      <h1 className="font-bold">{stage === 'bonus' || stage === 'bonusDone' ? `Bonus · Tag ${day}` : `Tag ${day} · ${session}. von ${SESSIONS_PER_DAY} Mal`}</h1>
    </header>

    {stage === 'instructions' && <>
      <VideoPlayer key={`${day}:instr`} ref={player} src={video} poster={poster} />
      <h2 className="text-xl font-black">{baseExercise.title}</h2>
      <ol className="list-decimal space-y-2 rounded-3xl bg-white p-6 pl-10 text-[15px] leading-6">{baseExercise.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <Affirmation />
      <button type="button" className={secondary} onClick={() => { player.current?.play() }}>Anleitung noch einmal ansehen</button>
      <button type="button" className={primary} onClick={() => { setRemaining(PRACTICE_SECONDS); setStage('practice'); setRunning(true) }}>Übung starten · {PRACTICE_SECONDS} Sekunden</button>
    </>}

    {stage === 'practice' && <>
      <div role="timer" aria-label="Verbleibende Zeit" className="text-center text-6xl font-black tabular-nums text-brand-deep">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:practice`} src={video} poster={poster} />
      <Affirmation big />
      <button type="button" className={primary} onClick={() => setRunning(v => !v)}>{running ? 'Pause' : 'Fortsetzen'}</button>
    </>}

    {stage === 'done' && <section className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center">
      <img src={vestibuWelcome} alt="Vestibu" className="float size-32 object-contain" />
      <h2 className="text-2xl font-black">Gut gemacht!</h2>
      <p className="text-slate-600">Grundübung {session}/{SESSIONS_PER_DAY} für Tag {day} geschafft.</p>
      {bonus && <p className="text-lg font-bold text-rust">„{content.bonusImpuls}“</p>}
      {bonus && <button type="button" className={primary} onClick={() => { setRemaining(PRACTICE_SECONDS); setStage('bonus'); setRunning(true) }}>Ja, Bonus-Minute</button>}
      <button type="button" className={secondary} onClick={() => navigate(returnTo, { replace: true })}>Nein, zur Startseite</button>
    </section>}

    {stage === 'bonus' && bonus && <>
      <div role="timer" aria-label="Verbleibende Zeit" className="text-center text-6xl font-black tabular-nums text-rust">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:bonus`} src={video} poster={poster} />
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5">
        <p className="text-xs font-bold tracking-wide text-rust uppercase">Bonus · {bonus.kategorie}</p>
        <h2 className="text-xl font-black">{bonus.titel}</h2>
        <p className="text-[15px] leading-6">{bonus.anleitung}</p>
      </section>
      <Affirmation big />
      <button type="button" className={primary} onClick={() => setRunning(v => !v)}>{running ? 'Pause' : 'Fortsetzen'}</button>
    </>}

    {stage === 'bonusDone' && <section className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center">
      <img src={vestibuWelcome} alt="Vestibu" className="float size-32 object-contain" />
      <h2 className="text-2xl font-black">Bonus geschafft!</h2>
      <p className="text-slate-600">Eine Extra-Minute für dein Gleichgewicht.</p>
      <button type="button" className={primary} onClick={() => navigate(returnTo, { replace: true })}>Fertig</button>
    </section>}
  </div>
}
