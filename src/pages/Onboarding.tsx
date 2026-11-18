import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Vestibu from '../components/Vestibu'
import { StreakFlame } from '../components/GameEffects'
import { playGameSound, stopGameAudio } from '../lib/gameAudio'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Flame, ShieldCheck, Target } from 'lucide-react'
import { L } from '../lib/i18n'
import { loadProfile, saveProfile } from '../lib/profile'

export default function Onboarding() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  useEffect(() => () => stopGameAudio(), [])
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(loadProfile()?.goal ?? '')
  const [days, setDays] = useState(loadProfile()?.streakGoal ?? 7)
  const titles = [L('Hallo! Ich bin Vestibu.', 'Chào bạn! Mình là Vestibu.'), L('Was möchtest du erreichen?', 'Bạn muốn đạt điều gì?'), L('Dein erster Streak beginnt hier.', 'Chuỗi ngày đầu tiên bắt đầu ở đây.'), L('Ein kleiner Anstoß. Jeden Tag.', 'Một lời nhắc nhỏ. Mỗi ngày.'), L('Bereit für deinen ersten Schritt?', 'Sẵn sàng bước đầu tiên chưa?')]
  const next = () => {
    if (step < 4) { stopGameAudio(); playGameSound('tap'); setStep(step + 1); return }
    saveProfile({ gameOnboarded: true, goal, streakGoal: days })
    navigate(loadProfile()?.checks?.start || loadProfile()?.checkPostponed ? '/' : '/check/start', { replace: true })
  }
  return <div className="game-onboarding">
    <header className="flex items-center gap-4"><button aria-label={L('Zurück', 'Quay lại')} disabled={step === 0} onClick={() => setStep(step - 1)} className="p-2 disabled:opacity-25"><ArrowLeft /></button><div className="game-progress flex-1" role="progressbar" aria-label={L('Einrichtung', 'Thiết lập')} aria-valuemin={0} aria-valuemax={5} aria-valuenow={step + 1}><span style={{ width: `${(step + 1) * 20}%` }} /></div></header>
    <AnimatePresence mode="wait" initial={false}><motion.main key={step} initial={reduced ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -16 }} transition={{duration: .16}} className="flex flex-1 flex-col justify-center gap-6 py-8">
      <div className="flex items-center gap-3"><Vestibu mood={step === 4 ? 'celebrate' : 'wave'} className="w-28 shrink-0" /><h1 className="game-speech text-xl font-black">{titles[step]}</h1></div>
      {step === 0 && <><p className="text-center text-lg text-slate-600">{L('Dein Gleichgewicht ist ein Abenteuer. Wir gehen es gemeinsam an – eine Minute nach der anderen.', 'Thăng bằng là một hành trình. Mình cùng đi nhé, từng phút một.')}</p><p className="text-center font-bold">{L('90 Tage. Kleine Schritte. Dein Tempo.', '90 ngày. Từng bước nhỏ. Theo nhịp của bạn.')}</p></>}
      {step === 1 && <div className="grid gap-3">{[L('Sicherer im Alltag', 'Vững vàng hơn mỗi ngày'), L('Mehr Vertrauen in meinen Körper', 'Tự tin hơn với cơ thể'), L('Eine gesunde Gewohnheit', 'Xây dựng thói quen tốt')].map(text => <button key={text} aria-pressed={goal === text} className={`game-choice ${goal === text ? 'selected' : ''}`} onClick={() => setGoal(text)}><Target className="text-brand" />{text}{goal === text && <Check className="ml-auto shrink-0" />}</button>)}</div>}
      {step === 2 && <><div className="game-flame"><StreakFlame lit /></div><p className="text-center text-slate-600">{L('Eine abgeschlossene Minute pro Tag hält deine Flamme am Leben. Welches Ziel motiviert dich?', 'Hoàn thành một phút mỗi ngày để giữ ngọn lửa. Mục tiêu nào truyền động lực cho bạn?')}</p><div className="grid grid-cols-3 gap-3">{[3,7,14].map(n => <button key={n} aria-pressed={days === n} className={`game-choice flex-col ${days === n ? 'selected' : ''}`} onClick={() => setDays(n)}><strong className="text-3xl">{n}</strong>{L('Tage', 'ngày')}</button>)}</div></>}
      {step === 3 && <><div className="widget-phone" role="img" aria-label={L('Vorschau des FitJoy-Widgets auf dem iPhone', 'Minh họa widget FitJoy trên iPhone')}><div className="widget-phone-island" /><div className="widget-phone-screen"><div className="widget-preview"><div className="widget-preview-streak"><Flame fill="currentColor" /><strong>7</strong></div><Vestibu mood="wave" /><strong>FitJoy</strong><span>{L('Eine Minute für dich.', 'Một phút cho bạn.')}</span></div><div className="widget-apps" aria-hidden="true">{Array.from({length:6}, (_, i) => <i key={i} />)}</div></div><div className="widget-phone-home" /></div><p className="text-center text-slate-600">{L('Mit dem iPhone-Widget bleibt dein Streak im Blick. Halte den Home-Bildschirm gedrückt, tippe auf Bearbeiten → Widget hinzufügen und suche FitJoy.', 'Giữ màn hình chính iPhone, chọn Sửa → Thêm tiện ích, tìm FitJoy để theo dõi chuỗi ngày.')}</p><p className="text-center text-xs text-slate-500">{L('Optional. Du kannst es jederzeit später hinzufügen.', 'Không bắt buộc. Bạn có thể thêm sau.')}</p></>}
      {step === 4 && <><div className="game-choice"><ShieldCheck className="shrink-0 text-brand" /><p>{L('Zuerst lernen wir dein Gleichgewicht kennen. Übe mit sicherem Halt und pausiere, wenn du dich unwohl fühlst.', 'Trước tiên, mình tìm hiểu khả năng thăng bằng của bạn. Tập gần chỗ vịn chắc chắn, dừng khi thấy khó chịu.')}</p></div></>}
    </motion.main></AnimatePresence><footer className="game-footer"><button disabled={step === 1 && !goal} className="game-primary w-full" onClick={next}>{step === 4 ? L('Los geht’s', 'Bắt đầu thôi') : L('Weiter', 'Tiếp tục')}</button></footer>
  </div>
}
