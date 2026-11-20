import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import AdventureMap from '../components/AdventureMap'
import MapJoin from '../components/MapJoin'
import { regionFor, restoredInRegion } from '../data/story'
import { sessionsDone, useCompleted } from '../lib/progress'
import { L } from '../lib/i18n'

export default function Home() {
  const {completed,current,statusOf}=useCompleted()
  const navigate=useNavigate()
  const path=useRef<HTMLDivElement>(null)
  const [hint,setHint]=useState('')
  const [showTop,setShowTop]=useState(false)
  useEffect(()=>{
    const update=()=>setShowTop(window.scrollY>window.innerHeight*.65)
    update()
    window.addEventListener('scroll',update,{passive:true})
    return()=>window.removeEventListener('scroll',update)
  },[])
  useLayoutEffect(()=>{
    path.current?.querySelector('.is-current button')?.scrollIntoView({block:'center',behavior:'instant'})
  },[current])
  useEffect(()=>{if(!hint)return;const timer=setTimeout(()=>setHint(''),5000);return()=>clearTimeout(timer)},[hint])
  return <div ref={path} className="journey-map">
    <h1 className="sr-only">{L('Dein Inselweg','Hành trình trên đảo')}</h1>
    {Array.from({length:9},(_,chapter)=>{
      const region=regionFor(chapter*10+1)
      return <div className="journey-chapter" key={chapter}><AdventureMap chapter={chapter} current={current} statusOf={statusOf} region={region} restored={restoredInRegion(completed,region)} onPick={(day,status)=>status==='locked'?setHint(L('Dieser Tag öffnet an einem neuen Kalendertag nach der ersten Übung des vorherigen Tages.','Ngày này mở vào ngày lịch mới, sau lần tập đầu của ngày trước.')):navigate(day===90&&sessionsDone(day)>=3?`/days/${day}`:`/workouts/${day}?session=${Math.min(3,sessionsDone(day)+1)}`)}/>{chapter<8&&<MapJoin from={region.id} to={regionFor((chapter+1)*10+1).id}/>}</div>
    })}
    {showTop&&<button type="button" className="map-to-top" aria-label={L('Zum Anfang der Karte','Lên đầu bản đồ')} title={L('Zum Anfang der Karte','Lên đầu bản đồ')} onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><svg viewBox="0 0 40 40" width="32" height="32" aria-hidden="true"><path d="M20 5 5 21h9v13h12V21h9Z" fill="#fff0aa" stroke="#8e682b" strokeWidth="2.5" strokeLinejoin="round"/><path d="m12 19 8-8 8 8" fill="none" stroke="#fffbdc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
    {hint&&<div className="game-toast" role="status"><p>{hint}</p><button aria-label={L('Schließen','Đóng')} onClick={()=>setHint('')}><X size={18}/></button></div>}
  </div>
}
