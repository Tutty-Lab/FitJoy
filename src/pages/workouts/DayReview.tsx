import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Vestibu from '../../components/Vestibu'
import { episodeFor } from '../../data/story'
import { affirmationFor, localDay, PROGRAM_DAYS, SESSIONS_PER_DAY } from '../../data/program'
import { sessionsDone, useCompleted } from '../../lib/progress'
import { L, lang } from '../../lib/i18n'
import { loadProfile } from '../../lib/profile'

export default function DayReview() {
  const day=Number(useParams().day)
  const {statusOf}=useCompleted()
  if(!Number.isInteger(day)||day<1||day>PROGRAM_DAYS||statusOf(day)==='locked')return <Navigate to="/" replace/>
  return <DaySteps key={day} day={day}/>
}

function DaySteps({day}:{day:number}) {
  const [step,setStep]=useState(()=>sessionsDone(Number(day))>0?2:0)
  const navigate=useNavigate()
  const heading=useRef<HTMLHeadingElement>(null)
  const {completed,current,finished,waitingForTomorrow}=useCompleted()
  const done=sessionsDone(day), episode=episodeFor(day)
  const finalCheck=finished&&day===90&&done>=SESSIONS_PER_DAY
  const destination=finalCheck?(loadProfile()?.checks?.end?'/compare':'/check/end'):`/workouts/${day}?session=${Math.min(SESSIONS_PER_DAY,done+1)}`
  const titles=[L('Schön, dass du da bist','Thật vui vì bạn ở đây'),L('Dein Gedanke für heute','Lời nhắn dành cho hôm nay'),L('Deine nächste Minute','Phút tập tiếp theo của bạn')]
  useEffect(()=>{heading.current?.focus({preventScroll:true});window.scrollTo(0,0)},[step])
  return <div className="day-steps">
    <header className="flex items-center gap-3">
      <button type="button" className="flow-back p-2" aria-label={L('Zurück','Quay lại')} onClick={()=>step>0?setStep(step-1):navigate('/',{replace:true})}><ArrowLeft/></button>
      <div className="flex-1"><p className="flow-note mb-2">{L('Tag','Ngày')} {day} · {L(`Schritt ${step+1} von 3`,`Bước ${step+1}/3`)}</p><div className="game-progress" role="progressbar" aria-label={L('Vorbereitung','Chuẩn bị')} aria-valuemin={0} aria-valuemax={3} aria-valuenow={step+1} aria-valuetext={titles[step]}><span style={{width:`${(step+1)/3*100}%`}}/></div></div>
    </header>
    <section key={step} className="day-step-content">
      <Vestibu mood={step===2?'encourage':'wave'} className="mx-auto w-28"/>
      <h1 ref={heading} tabIndex={-1} className="text-2xl font-black outline-none">{titles[step]}</h1>
      {step===0 && <><blockquote className="game-speech font-bold leading-7">„{localDay(day).begruessung}“</blockquote><div><h2 className="font-bold mb-2">{episode.title[lang]}</h2><p className="text-sm leading-6">{completed.includes(day)?episode.after[lang]:episode.before[lang]}</p></div></>}
      {step===1 && <><blockquote className="flow-card text-xl font-bold text-brand-deep leading-8">„{affirmationFor(day)}“</blockquote><p className="flow-note">{L('Dieser Satz begleitet deine Übung. Du siehst ihn während deiner Minute noch einmal.','Câu này sẽ đồng hành cùng bài tập. Bạn sẽ thấy lại câu này trong phút tập.')}</p></>}
      {step===2 && <><ol className="flow-session-list" aria-label={L('Abgeschlossene Minuten','Các phút đã hoàn thành')}>{[1,2,3].map(n=><li key={n} data-done={n<=done}>{L('Minute','Phút')} {n}{n<=done&&<Check size={16} className="inline ml-1"/>}</li>)}</ol><p>{done<SESSIONS_PER_DAY?L(`Du hast ${done} von 3 Minuten geschafft. Als Nächstes kommt Minute ${done+1}, mit Anleitung und 60 Sekunden Übungszeit.`,`Bạn đã xong ${done}/3 phút. Tiếp theo là phút ${done+1}, có hướng dẫn và 60 giây tập.`):L('Alle drei Minuten sind geschafft. Du kannst die Grundübung wiederholen; deine Entdeckungen bleiben dieselben.','Bạn đã hoàn thành cả ba phút. Có thể tập lại bài cơ bản; khám phá đã nhận vẫn được giữ.')}</p><p className="flow-note">{L('Stelle einen stabilen Stuhl bereit. Pausiere bei Schwindel oder Unwohlsein.','Chuẩn bị ghế chắc chắn. Tạm dừng khi chóng mặt hoặc khó chịu.')}</p></>}
    </section>
    {step===2&&day===current&&waitingForTomorrow&&<p role="status" className="flow-note">{L(`Tag ${current+1} öffnet morgen. Deine bisherigen Entdeckungen bleiben erhalten.`,`Ngày ${current+1} mở vào ngày mai. Các khám phá đã nhận vẫn được giữ.`)}</p>}
    <footer className="day-step-footer">{step<2?<button type="button" className="game-primary w-full" onClick={()=>setStep(step+1)}>{L('Weiter','Tiếp tục')}</button>:<Link className="game-primary block text-center" to={destination} state={{from:`/days/${day}`}}>{finalCheck?(loadProfile()?.checks?.end?L('Meine Ergebnisse','Xem kết quả'):L('Abschließenden Selbsttest starten','Bắt đầu tự kiểm tra cuối hành trình')):done<SESSIONS_PER_DAY?L(`Minute ${done+1} starten`,`Bắt đầu phút ${done+1}`):L('Nochmal üben','Tập lại')}</Link>}</footer>
  </div>
}
