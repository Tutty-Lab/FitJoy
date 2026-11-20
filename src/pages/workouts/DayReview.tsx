import BackArrow from '../../components/BackArrow'
import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
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
  const [step,setStep]=useState(0)
  const navigate=useNavigate()
  const heading=useRef<HTMLHeadingElement>(null)
  const {completed,current,finished,waitingForTomorrow}=useCompleted()
  const done=sessionsDone(day), episode=episodeFor(day)
  const finalCheck=finished&&day===90&&done>=SESSIONS_PER_DAY
  const destination=finalCheck?(loadProfile()?.checks?.end?'/compare':'/check/end'):`/workouts/${day}?session=${Math.min(SESSIONS_PER_DAY,done+1)}`
  const titles=[L('Schön, dass du da bist','Thật vui vì bạn ở đây'),L('Dein Gedanke für heute','Lời nhắn dành cho hôm nay')]
  useEffect(()=>{heading.current?.focus({preventScroll:true});window.scrollTo(0,0)},[step])
  return <div className="day-steps">
    <header className="flex items-center gap-3">
      <button type="button" className="cartoon-back" aria-label={L('Zurück','Quay lại')} onClick={()=>navigate('/',{replace:true})}><BackArrow /></button>
      <div className="flex-1"><div className="game-progress" role="progressbar" aria-label={L('Vorbereitung','Chuẩn bị')} aria-valuemin={0} aria-valuemax={2} aria-valuenow={step+1} aria-valuetext={titles[step]}><span style={{width:`${(step+1)/2*100}%`}}/></div></div>
    </header>
    <section key={step} className="day-step-content">
      <Vestibu mood={step===1?'encourage':'wave'} className="mx-auto w-28"/>
      <h1 ref={heading} tabIndex={-1} className="text-2xl font-black outline-none">{titles[step]}</h1>
      {step===0 && <><blockquote className="game-speech font-bold leading-7">„{localDay(day).begruessung}“</blockquote><div><h2 className="font-bold mb-2">{episode.title[lang]}</h2><p className="text-sm leading-6">{completed.includes(day)?episode.after[lang]:episode.before[lang]}</p></div></>}
      {step===1 && <><blockquote className="flow-card text-xl font-bold text-brand-deep leading-8">„{affirmationFor(day)}“</blockquote></>}
    </section>
    <footer className="day-step-footer">{step<1?<button type="button" className="game-primary w-full" onClick={()=>setStep(step+1)}>{L('Weiter','Tiếp tục')}</button>:<Link className="game-primary block text-center" to={destination} state={{from:`/days/${day}`}}>{finalCheck?(loadProfile()?.checks?.end?L('Meine Ergebnisse','Xem kết quả'):L('Abschließenden Selbsttest starten','Bắt đầu tự kiểm tra cuối hành trình')):done<SESSIONS_PER_DAY?L(`Mal ${done+1} starten`,`Bắt đầu lần ${done+1}`):L('Nochmal üben','Tập lại')}</Link>}</footer>
  </div>
}
