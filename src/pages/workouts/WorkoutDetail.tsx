import SessionCoach, { coachCopy } from '../../components/SessionCoach'
import BackArrow from '../../components/BackArrow'
import ExitMinuteDialog from '../../components/ExitMinuteDialog'
import { StoryBeat } from '../../components/StoryReward'
import Vestibu from '../../components/Vestibu'
import { Confetti } from '../../components/GameEffects'
import { playGameSound, unlockGameAudio } from '../../lib/gameAudio'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { completeLesson, sessionsDone, useCompleted } from '../../lib/progress'
import { affirmationFor, baseText, baseVideo, bonusesUpTo, categoryLabel, PRACTICE_SECONDS, PROGRAM_DAYS, SESSIONS_PER_DAY, type BonusExercise } from '../../data/program'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { loadProfile, saveProfile } from '../../lib/profile'
import { episodeFor, regionFor, storyBeat } from '../../data/story'
import { type Who } from '../../data/storyDialog'
import { Flame, Gem, ChevronDown } from 'lucide-react'
import poster from '../../assets/home/vestibu-welcome.png'
import { L, lang } from '../../lib/i18n'
import { clayPrimary, claySecondary } from '../../components/clay'

type Stage = 'instructions' | 'practice' | 'done' | 'bonusOffer' | 'story' | 'bonusSpin' | 'bonus' | 'bonusDone'

// 05a instructions → 05b 60-second practice → 05c congratulations + bonus question → 06 bonus.
const XP_SESSION = 10
const XP_BONUS = 5
// Highest day that already has a dedicated scene at /story/day{n}.webp; later days fall back to a map crop until their scene is generated.
const STORY_SCENES = 90
// Highest day that also has per-session scenes /story/day{n}_s2.webp & _s3.webp (session 1 reuses day{n}.webp).
const STORY_SESSION_SCENES = 10

function Talk({ text, mood }: { text: string; mood: 'wave' | 'encourage' | 'celebrate' }) {
  return <div className="flex items-end gap-3"><Vestibu mood={mood} className="w-24 shrink-0" /><p className="game-speech flex-1 font-bold leading-6">{text}</p></div>
}

function Done({ title, xp, streak, earned, children }: { title: string; xp: number; streak: number; earned: number; children?: ReactNode }) {
  return <section className="flex flex-col items-center gap-4 text-center">
    <Confetti /><Vestibu mood="celebrate" className="size-36" />
    <h2 className="text-3xl font-black text-brand-deep">{title}</h2>
    <div className="grid w-full grid-cols-3 gap-2">
      <div className="duo-stat border-amber-300 text-amber-600"><span>{L('Punkte', 'Điểm')}</span><b className="xp-pop">+{earned}</b></div>
      <div className="duo-stat border-orange-300 text-orange-500"><span>Streak</span><b><Flame size={18} fill="currentColor" className="inline" /> {Math.max(streak, 1)}</b></div>
      <div className="duo-stat border-sky-300 text-sky-600"><span>{L('Gesamt', 'Tổng')}</span><b><Gem size={16} className="inline" /> {xp}</b></div>
    </div>
    {children}
  </section>
}

// Spin to draw a random bonus exercise from the days unlocked so far.
function BonusSpinner({ pool, picked, onPick }: { pool: BonusExercise[]; picked: BonusExercise | null; onPick: (b: BonusExercise) => void }) {
  const [i, setI] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const chime = (k: 'tap' | 'success') => { if (loadProfile()?.chime ?? true) playGameSound(k) }
  const run = () => {
    if (spinning || picked || !pool.length) return
    setSpinning(true); chime('tap')
    const target = Math.floor(Math.random() * pool.length)
    const total = pool.length * 3 + target
    let t = 0
    const tick = () => {
      t += 1; setI(t % pool.length)
      if (t >= total) { setSpinning(false); chime('success'); onPick(pool[target]); return }
      setTimeout(tick, 70 + Math.pow(t / total, 3) * 280)
    }
    setTimeout(tick, 70)
  }
  const show = picked ?? pool[i]
  return <div className="bonus-spinner">
    <div className={`bonus-card ${picked ? 'landed' : spinning ? 'spin' : ''}`}>
      <span className="text-xs font-bold tracking-wide text-rust uppercase">{show ? `Bonus · ${categoryLabel(show.kategorie)}` : ''}</span>
      <b className="text-xl font-black leading-6">{show?.titel ?? '—'}</b>
      {picked && <p className="text-[15px] leading-6 text-slate-600">{picked.anleitung}</p>}
    </div>
    {!picked && <button type="button" className="bonus-spin-btn" onClick={run} disabled={spinning}>{spinning ? '…' : L('Drehen', 'Quay')}</button>}
  </div>
}

export default function WorkoutDetail() {
  const day = Number(useParams().day)
  const location = useLocation()
  const navigate = useNavigate()
  const { statusOf, completed, finished, current, streak, doneToday } = useCompleted()
  const [streakUp, setStreakUp] = useState(false)
  const [earned, setEarned] = useState(0)
  // The pre-session part is split into three short screens: story -> how to -> affirmation.
  const [intro_, setIntro] = useState(0)
  const [said, setSaid] = useState(1)
  const chatEnd = useRef<HTMLDivElement>(null)
  useEffect(() => { chatEnd.current?.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [said])
  const session = useMemo(() => {
    const requested = Number(new URLSearchParams(location.search).get('session'))
    return Number.isInteger(requested) && requested >= 1 && requested <= SESSIONS_PER_DAY ? requested : Math.min(SESSIONS_PER_DAY, sessionsDone(day) + 1)
  }, [day, location.search])
  const affirmation = affirmationFor(day)
  const video = baseVideo()
  // Reward wheel draws a bonus exercise from any day up to today.
  const bonusPool = useMemo(() => bonusesUpTo(day), [day])
  const bonus = bonusPool.length > 0
  const [bonusPick, setBonusPick] = useState<BonusExercise | null>(null)
  const [stage, setStage] = useState<Stage>('instructions')
  const [skipBonus, setSkipBonus] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  // Smart tutorial: full step-by-step for the first ~3 days, a compact reminder with an optional expander afterwards.
  const guided = (loadProfile()?.lessonCompletions ?? []).length < 9
  const [remaining, setRemaining] = useState(PRACTICE_SECONDS)
  const [running, setRunning] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [newDiscovery, setNewDiscovery] = useState(false)
  const wasCompleted = useRef(completed.includes(day))
  const player = useRef<VideoPlayerHandle>(null)
  const remainingMs = useRef(PRACTICE_SECONDS * 1000)
  // Leaving a session always goes straight back to the map.
  const returnTo = '/'

  useEffect(() => { setIntro(0); setSaid(1); setStage('instructions'); setRemaining(PRACTICE_SECONDS); remainingMs.current = PRACTICE_SECONDS * 1000; setRunning(false); setExitOpen(false); setNewDiscovery(false); setSkipBonus(false); setBonusPick(null); wasCompleted.current=completed.includes(day) }, [day, session])
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
    if (running && (stage === 'practice' || stage === 'bonus') && remaining > 0 && remaining <= 3 && (loadProfile()?.chime ?? true)) playGameSound('tap')
  }, [remaining]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (stage === 'practice' && remaining === 0) {
      setRunning(false)
      setNewDiscovery(!wasCompleted.current)
      // First session today raises the streak: celebrate it on the streak screen next.
      if (!doneToday) { try { sessionStorage.setItem('fitjoy.streakUp', String(streak)) } catch { /* private mode */ } setStreakUp(true) }
      completeLesson(day, session)
      // Diamond booster from the shop doubles this session's reward.
      const boost = loadProfile()?.boost ?? 0, gain = boost > 0 ? XP_SESSION * 2 : XP_SESSION
      saveProfile({ xp: (loadProfile()?.xp ?? 0) + gain, ...(boost > 0 ? { boost: boost - 1 } : {}) })
      setEarned(gain)
      if (loadProfile()?.chime ?? true) playGameSound('success')
      setStage('done')
    }
    if (stage === 'bonus' && remaining === 0) {
      setRunning(false)
      saveProfile({ xp: (loadProfile()?.xp ?? 0) + XP_BONUS })
      setEarned(XP_BONUS)
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
    if (stage === 'practice' || stage === 'bonus') { player.current?.pause(); setRunning(false); setExitOpen(true); return }
    if (stage === 'bonusSpin') { setStage('story'); return }
    if (stage === 'instructions' && intro_ > 0) { setIntro(intro_ - 1); return }
    navigate(returnTo, { replace: true })
  }
  const done = sessionsDone(day)
  const nextRoute = finished && day===90 && done>=SESSIONS_PER_DAY ? (loadProfile()?.checks?.end ? '/compare' : '/check/end') : done<SESSIONS_PER_DAY && day===current ? `/workouts/${day}?session=${done+1}` : '/'
  const nextLabel = finished && day===90 && done>=SESSIONS_PER_DAY ? L('Zum abschließenden Selbsttest', 'Đến tự kiểm tra cuối hành trình') : done<SESSIONS_PER_DAY && day===current ? L(`Weiter zu Mal ${done+1}`, `Tập lần ${done+1}`) : L('Zurück zu Heute', 'Về Hôm nay')

  const xp = loadProfile()?.xp ?? 0
  const practising = stage === 'practice' || stage === 'bonus'
  // Intro steps fill the first quarter of the bar (visibly advancing per "Weiter"), practice fills the rest.
  const introSteps = guided ? 3 : 2
  const progress = stage === 'instructions' ? 0.05 + (intro_ / introSteps) * 0.25 : practising ? 0.3 + 0.7 * (1 - remaining / PRACTICE_SECONDS) : 1
  const episode = episodeFor(day)
  // Per-session story beat (before / middle / closing), translated — so each lượt reads as its own moment and matches its scene.
  const beat = storyBeat(day, session)
  const chat: { text: string; me?: boolean; who?: Who }[] = [{ text: L(beat.de, beat.vi) }]
  const sceneUrl = session >= 2 && day <= STORY_SESSION_SCENES ? `/story/day${day}_s${session}.webp`
    : day <= STORY_SCENES ? `/story/day${day}.webp` : `/map/${regionFor(day).id}.webp`

  const cheer = remaining > 40 ? L('Ganz ruhig. Halt dich fest, wenn du magst.', 'Thật thong thả. Cứ vịn nếu bạn muốn nhé.')
    : remaining > 20 ? L('Super, du machst das toll!', 'Tuyệt lắm, cứ thế nhé!')
    : remaining > 5 ? L('Fast geschafft!', 'Sắp xong rồi!')
    : L('Noch ein kleines bisschen …', 'Chút xíu nữa thôi …')
  return <div className="flex flex-col gap-3 px-4 pb-4">
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 py-2 backdrop-blur">
      <button type="button" aria-label={L('Zurück', 'Quay lại')} title={L('Zurück', 'Quay lại')} onClick={back} className="cartoon-back">
        <BackArrow />
      </button>
      <div className="game-progress flex-1" role="progressbar" aria-label={L('Fortschritt', 'Tiến độ')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${progress * 100}%`, transition: 'width .3s linear' }} /></div>
      <span className="flex items-center gap-1 font-black text-orange-500"><Flame size={20} fill="currentColor" />{streak}</span>
    </header>

    {stage === 'instructions' && <section key={intro_} className="intro-flow flex min-h-[calc(100dvh-140px)] flex-col gap-4">
      {intro_ === 0 && <>
        <div className="story-scene" style={{ backgroundImage: `url(${sceneUrl})` }}>
          <span className="story-scene-title">{L(episode.title.de, episode.title.vi)}</span>
        </div>
        <div className="flex items-start gap-2"><Vestibu mood="wave" className="w-16 shrink-0" /><div className="chat flex-1" aria-live="polite" ref={chatEnd}>
          {chat.map((m, i) => <p key={i} style={{ animationDelay: `${i * 0.35}s` }} className={`chat-line ${m.me ? 'me' : ''} ${m.who === 'p' ? 'pip' : ''}`}>{m.who === 'p' && <img src="/map/seagull.webp" alt="Pip" className="chat-pip" />}{m.text}</p>)}
        </div></div>
      </>}
      {intro_ === 1 && !guided && <>
        <SessionCoach session={session} moment="guide" compact />
        <div className="reminder-card">
        <span className="reminder-eyebrow">{L('Deine Übung', 'Bài tập')}</span>
        <b className="reminder-title">{baseText.title}</b>
        {!showSteps && <p className="reminder-lead">{baseText.steps[0]}</p>}
        <button type="button" className="reminder-toggle" aria-expanded={showSteps} onClick={() => setShowSteps(v => !v)}>
          <span>{showSteps ? L('Anleitung ausblenden', 'Ẩn hướng dẫn') : L('Ganze Anleitung ansehen', 'Xem đầy đủ hướng dẫn')}</span>
          <ChevronDown size={18} className={`reminder-chev ${showSteps ? 'open' : ''}`} />
        </button>
        {showSteps && <ol className="reminder-steps">{baseText.steps.map((s, i) => <li key={i} className="duo-step"><b>{i + 1}</b><span>{s}</span></li>)}</ol>}
        </div>
      </>}
      {intro_ === 1 && guided && <>
        <SessionCoach session={session} moment="guide" />
        <h2 className="text-2xl font-black">{L('So geht die Übung', 'Cách tập')}</h2>
        <ol className="flex flex-col gap-2">{baseText.steps.map((s, i) => <li key={i} className="duo-step"><b>{i + 1}</b><span>{s}</span></li>)}</ol>
      </>}
      {intro_ === 2 && guided && <>
        <Talk text={L('Sprich diesen Satz laut, während du die Position hältst.', 'Hãy đọc to câu này khi giữ tư thế nhé.')} mood="encourage" />
        <Affirmation big />
      </>}
      {intro_ < (guided ? 2 : 1)
        ? <button type="button" className={`${primary} intro-cta`} onClick={() => setIntro(intro_ + 1)}>{L('Weiter', 'Tiếp tục')}</button>
        : <button type="button" className={`${primary} intro-cta`} onClick={() => start('practice')}>{L('Übung starten', 'Bắt đầu tập')} · {PRACTICE_SECONDS} {L('Sekunden', 'giây')}</button>}
    </section>}

    {stage === 'practice' && <>
      <SessionCoach session={session} moment={running?'practice':'pause'} text={running?cheer:coachCopy(session,'pause')} compact />
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-brand-deep">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      {/* TEMP: test skip */}<button type="button" className="self-center text-sm font-bold text-gray-500 underline" onClick={() => { remainingMs.current = 0; setRemaining(0) }}>{L('Überspringen (Test)', 'Bỏ qua (test)')}</button>
      <VideoPlayer key={`${day}:practice`} ref={player} src={video} poster={poster} autoPlay loop onPlaybackChange={setRunning} />
      <Affirmation big />
      <button type="button" className={primary} onClick={togglePlayback}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {(stage === 'done' || stage === 'bonusDone') && <section className="intro-flow flex min-h-[calc(100dvh-140px)] flex-col gap-4 text-center">
      <Confetti />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <SessionCoach session={session} moment="done" cheer text={stage==='bonusDone'?L('Deine freiwillige Minute ist geschafft. Gut gemacht!','Xong phút tùy chọn rồi. Giỏi lắm!'):undefined}/>
        <h2 className="text-3xl font-black text-brand-deep">{L('Gut gemacht!', 'Làm tốt lắm!')}</h2>
        <p className="font-bold">+{earned} {L('Punkte','điểm')} · {L('Gesamt','Tổng')} {xp}</p>
      </div>
      <button className={`${primary} intro-cta`} onClick={()=>setStage(stage==='done'&&bonus?'bonusOffer':'story')}>{L('Weiter','Tiếp tục')}</button>
    </section>}

    {stage === 'bonusOffer' && <section className="intro-flow flex min-h-[calc(100dvh-140px)] flex-col items-center gap-4 text-center">
      <SessionCoach session={session} moment="bonus" cheer text={L('Lust auf eine Extra-Übung? Dreh und schau, welche du bekommst!','Thử thêm một bài tập nhé? Quay xem bạn nhận bài nào!')}/>
      <h2 className="text-2xl font-black">{L('Bonus-Übung','Bài tập bonus')}</h2>
      <button className={`${primary} intro-cta`} onClick={()=>setStage('bonusSpin')}>{L('Übung erdrehen','Quay ra bài tập')}</button>
      <button className={secondary} onClick={()=>setStage('story')}>{L('Heute nicht','Hôm nay thôi')}</button>
    </section>}

    {stage === 'bonusSpin' && <section className="intro-flow flex min-h-[calc(100dvh-140px)] flex-col items-center gap-4 text-center">
      <SessionCoach session={session} moment="bonus" cheer text={bonusPick?L('Diese Bonus-Übung hast du erdreht. Los geht es!','Bạn quay trúng bài này. Bắt đầu nào!'):L('Gleich siehst du, welche Bonus-Übung du bekommst.','Chờ xem bạn nhận bài bonus nào nhé.')}/>
      <BonusSpinner pool={bonusPool} picked={bonusPick} onPick={setBonusPick}/>
      {bonusPick && <button type="button" className={`${primary} intro-cta`} onClick={()=>start('bonus')}>{L('Übung starten','Bắt đầu tập')} · {PRACTICE_SECONDS} {L('Sekunden','giây')}</button>}
    </section>}

    {stage === 'story' && <section className="intro-flow flex min-h-[calc(100dvh-140px)] flex-col gap-4">
      <StoryBeat day={day} session={session}/>
      {streakUp?<Link className={`${primary} intro-cta`} to={`/streak?up=1&next=${encodeURIComponent(nextRoute)}`} replace>{L('Weiter','Tiếp tục')}</Link>:<Link className={`${primary} intro-cta`} to={nextRoute} replace>{nextLabel}</Link>}
    </section>}

    {stage === 'bonus' && bonusPick && <>
      <SessionCoach session={session} moment={running?'practice':'pause'} text={running?cheer:coachCopy(session,'pause')} compact />
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-rust">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      {/* TEMP: test skip */}<button type="button" className="self-center text-sm font-bold text-gray-500 underline" onClick={() => { remainingMs.current = 0; setRemaining(0) }}>{L('Überspringen (Test)', 'Bỏ qua (test)')}</button>
      <VideoPlayer key={`${day}:bonus`} ref={player} src={video} poster={poster} autoPlay loop onPlaybackChange={setRunning} />
      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-5 border-2 border-mint shadow-[0_4px_0_#cfe7e5]">
        <p className="text-xs font-bold tracking-wide text-rust uppercase">Bonus · {categoryLabel(bonusPick.kategorie)}</p>
        <h2 className="text-xl font-black">{bonusPick.titel}</h2>
        <p className="text-[15px] leading-6">{bonusPick.anleitung}</p>
      </section>
      <Affirmation big />
      <button type="button" className={primary} onClick={togglePlayback}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {exitOpen && <ExitMinuteDialog stay={()=>setExitOpen(false)} leave={()=>navigate(returnTo,{replace:true})}/>}
  </div>
}
