import BackArrow from '../../components/BackArrow'
import ExitMinuteDialog from '../../components/ExitMinuteDialog'
import { StoryBeat } from '../../components/StoryReward'
import Vestibu from '../../components/Vestibu'
import { Confetti } from '../../components/GameEffects'
import { playGameSound, unlockGameAudio } from '../../lib/gameAudio'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { completeLesson, sessionsDone, useCompleted } from '../../lib/progress'
import { affirmationFor, baseText, categoryLabel, baseVideo, localBonusFor, localDay, PRACTICE_SECONDS, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../../data/program'
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer'
import { loadProfile, saveProfile } from '../../lib/profile'
import { episodeFor, regionFor } from '../../data/story'
import { dialogFor, type Who } from '../../data/storyDialog'
import { Flame, Gem } from 'lucide-react'
import poster from '../../assets/home/vestibu-welcome.png'
import { L, lang } from '../../lib/i18n'
import { clayPrimary, claySecondary } from '../../components/clay'

type Stage = 'instructions' | 'practice' | 'done' | 'bonus' | 'bonusDone'

// 05a instructions → 05b 60-second practice → 05c congratulations + bonus question → 06 bonus.
const XP_SESSION = 10
const XP_BONUS = 5

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
  // Leaving a session always goes straight back to the map.
  const returnTo = '/'

  useEffect(() => { setIntro(0); setSaid(1); setStage('instructions'); setRemaining(PRACTICE_SECONDS); remainingMs.current = PRACTICE_SECONDS * 1000; setRunning(false); setExitOpen(false); setNewDiscovery(false); wasCompleted.current=completed.includes(day) }, [day, session])
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
      saveProfile({ xp: (loadProfile()?.xp ?? 0) + XP_SESSION })
      setEarned(XP_SESSION)
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
    if (stage === 'bonus' || stage === 'practice') { player.current?.pause(); setRunning(false); setExitOpen(true); return }
    if (stage === 'instructions' && intro_ > 0) { setIntro(intro_ - 1); return }
    navigate(returnTo, { replace: true })
  }
  const done = sessionsDone(day)
  const nextRoute = finished && day===90 && done>=SESSIONS_PER_DAY ? (loadProfile()?.checks?.end ? '/compare' : '/check/end') : done<SESSIONS_PER_DAY && day===current ? `/workouts/${day}?session=${done+1}` : '/'
  const nextLabel = finished && day===90 && done>=SESSIONS_PER_DAY ? L('Zum abschließenden Selbsttest', 'Đến tự kiểm tra cuối hành trình') : done<SESSIONS_PER_DAY && day===current ? L(`Weiter zu Mal ${done+1}`, `Tập lần ${done+1}`) : L('Zurück zu Heute', 'Về Hôm nay')

  const xp = loadProfile()?.xp ?? 0
  const practising = stage === 'practice' || stage === 'bonus'
  const progress = stage === 'instructions' ? 0.04 + intro_ * 0.03 : practising ? 0.1 + 0.9 * (1 - remaining / PRACTICE_SECONDS) : 1
  const episode = episodeFor(day)
  // What Vestibu says before each session: the day's story leads into session 1, sessions 2 and 3 pick it up.
  const intro = session === 1 ? episode.before[lang]
    : session === 2 ? L(`Schön, dass du wieder da bist! „${episode.reward.de}“ wartet noch auf uns.`, `Bạn quay lại rồi! “${episode.reward.vi}” vẫn đang chờ mình.`)
    : L('Letzte Runde für heute! Danach erfährst du, wie die Geschichte heute endet.', 'Lượt cuối hôm nay! Tập xong bạn sẽ biết câu chuyện hôm nay kết thúc thế nào.')
  const sentences = (t: string) => t.match(/[^.!?…]+[.!?…]+[“”"]?/g)?.map(x => x.trim()).filter(Boolean) ?? [t]
  const scene = dialogFor(day, session)
  const chat: { text: string; me?: boolean; who?: Who }[] = scene ? scene.pre.map(x => ({ text: x[lang], me: x.who === 'me', who: x.who })) : session === 1
    ? [{ text: content.begruessung }, ...sentences(episode.before[lang]).map(text => ({ text })), { text: L('Los geht’s!', 'Đi thôi!'), me: true }, { text: L('Super! Erst kurz die Übung, dann legen wir los.', 'Tuyệt! Xem nhanh cách tập rồi mình bắt đầu nhé.') }]
    : session === 2
      ? [{ text: L('Da bist du ja wieder!', 'A, bạn quay lại rồi!') }, { text: L(`Weißt du noch? Heute geht es um „${episode.reward.de}“.`, `Nhớ không? Hôm nay là chuyện về “${episode.reward.vi}”.`) }, { text: L('Ich bin bereit für Runde zwei.', 'Mình sẵn sàng cho lượt hai.'), me: true }, { text: L('Dann weiter! Nach dieser Runde geht unsere Geschichte weiter.', 'Vậy tiếp nào! Tập xong lượt này, câu chuyện sẽ đi tiếp.') }]
      : [{ text: L('Letzte Runde für heute!', 'Lượt cuối hôm nay rồi!') }, { text: L(`„${episode.reward.de}“ ist fast an seinem Platz.`, `“${episode.reward.vi}” sắp về đúng chỗ rồi.`) }, { text: L('Wie endet es?', 'Rồi sẽ kết thúc thế nào?'), me: true }, { text: L('Das erfährst du gleich nach dieser Runde.', 'Tập xong lượt này bạn sẽ biết ngay.') }]
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

    {stage === 'instructions' && <section key={intro_} className="intro-flow flex min-h-[calc(100dvh-76px)] flex-col gap-4">
      {intro_ === 0 && <>
        <div className="story-scene" style={{ backgroundImage: `url(/map/${regionFor(day).id}.webp)` }}>
          <span className="story-scene-tag">{L(`Tag ${day} · ${session}. von ${SESSIONS_PER_DAY} Mal`, `Ngày ${day} · lần ${session}/${SESSIONS_PER_DAY}`)}</span>
          <span className="story-scene-title">{episode.reward[lang]}</span>
        </div>
        <div className="flex items-start gap-2"><Vestibu mood="wave" className="w-16 shrink-0" /><div className="chat flex-1" aria-live="polite" ref={chatEnd}>
          {chat.map((m, i) => <p key={i} style={{ animationDelay: `${i * 0.35}s` }} className={`chat-line ${m.me ? 'me' : ''} ${m.who === 'p' ? 'pip' : ''}`}>{m.who === 'p' && <img src="/map/seagull.webp" alt="Pip" className="chat-pip" />}{m.text}</p>)}
        </div></div>
      </>}
      {intro_ === 1 && <>
        <h2 className="text-2xl font-black">{L('So geht die Übung', 'Cách tập')}</h2>
        <ol className="flex flex-col gap-2">{baseText.steps.map((s, i) => <li key={i} className="duo-step"><b>{i + 1}</b><span>{s}</span></li>)}</ol>
      </>}
      {intro_ === 2 && <>
        <Talk text={L('Sprich diesen Satz laut, während du die Position hältst.', 'Hãy đọc to câu này khi giữ tư thế nhé.')} mood="encourage" />
        <Affirmation big />
      </>}
      {intro_ < 2
        ? <button type="button" className={`${primary} intro-cta`} onClick={() => setIntro(intro_ + 1)}>{L('Weiter', 'Tiếp tục')}</button>
        : <button type="button" className={`${primary} intro-cta`} onClick={() => start('practice')}>{L('Übung starten', 'Bắt đầu tập')} · {PRACTICE_SECONDS} {L('Sekunden', 'giây')}</button>}
    </section>}

    {stage === 'practice' && <>
      <Talk text={cheer} mood="encourage" />
      <div role="timer" aria-label={L('Verbleibende Zeit', 'Thời gian còn lại')} className="text-center text-6xl font-black tabular-nums text-brand-deep">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
      <VideoPlayer key={`${day}:practice`} ref={player} src={video} poster={poster} autoPlay loop onPlaybackChange={setRunning} />
      <Affirmation big />
      <button type="button" className={primary} onClick={togglePlayback}>{running ? L('Pause', 'Tạm dừng') : L('Fortsetzen', 'Tiếp tục')}</button>
    </>}

    {stage === 'done' && <Done xp={xp} streak={streak} earned={earned} title={L('Gut gemacht!', 'Làm tốt lắm!')}>
      <StoryBeat day={day} session={session} />
      {streakUp ? <Link className={primary} to={`/streak?up=1&next=${encodeURIComponent(nextRoute)}`} replace>{L('Weiter', 'Tiếp tục')}</Link> : <Link className={primary} to={nextRoute} replace>{nextLabel}</Link>}
      <button type="button" className={secondary} onClick={() => start('practice')}>{L('Nochmal üben', 'Tập lại')}</button>
      {bonus && <button type="button" className={secondary} onClick={() => start('bonus')}>{L(`Bonus · +${XP_BONUS} Punkte`, `Bonus · +${XP_BONUS} điểm`)}</button>}
    </Done>}

    {stage === 'bonus' && bonus && <>
      <Talk text={cheer} mood="encourage" />
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

    {stage === 'bonusDone' && <Done xp={xp} streak={streak} earned={earned} title={L('Bonus geschafft!', 'Xong bonus!')}>
      <Link className={primary} to={nextRoute} replace>{nextLabel}</Link>
      <button type="button" className={secondary} onClick={() => start('bonus')}>{L('Nochmal üben', 'Tập lại')}</button>
    </Done>}
    {exitOpen && <ExitMinuteDialog stay={()=>setExitOpen(false)} leave={()=>navigate(returnTo,{replace:true})}/>}
  </div>
}
