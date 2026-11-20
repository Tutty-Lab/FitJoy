import { useEffect, useRef, useState } from 'react'
import { L } from '../lib/i18n'
import type { Region } from '../data/story'

export function useMapMotion() {
  const ref=useRef<HTMLElement>(null)
  useEffect(()=>{
    const section=ref.current
    if(!section)return
    let visible=false
    const update=()=>{section.dataset.moving=String(visible&&!document.hidden)}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update()},{rootMargin:'80px'})
    observer.observe(section)
    document.addEventListener('visibilitychange',update)
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update)}
  },[])
  return ref
}

export default function MapLife({region}:{region:Region['id']}) {
  const [tapped,setTapped]=useState<number|null>(null)
  useEffect(()=>{if(tapped===null)return;const timer=setTimeout(()=>setTapped(null),2200);return()=>clearTimeout(timer)},[tapped])
  const landmarks=region==='harbor'?
    [{x:128,y:165,name:L('Am Hafenhaus spielen','Chạm ngôi nhà bên bến'),text:L('Ein Gruß vom Hafen!','Lời chào từ bến cảng!')},{x:304,y:158,name:L('Den Leuchtturm begrüßen','Chào ngọn hải đăng'),text:L('Hallo, kleiner Leuchtturm!','Chào ngọn hải đăng nhỏ!')}]:region==='forest'?
    [{x:100,y:136,name:L('Am Baumhaus spielen','Chạm ngôi nhà cây'),text:L('Wer raschelt da im Laub?','Ai đang xào xạc trong tán lá?')},{x:280,y:1010,name:L('Die Lichtung begrüßen','Chào khoảng rừng'),text:L('Kleine Lichter im Wald!','Những đốm sáng nhỏ trong rừng!')}]:
    [{x:267,y:160,name:L('Den großen Leuchtturm begrüßen','Chào hải đăng lớn'),text:L('Ein Gruß bis zum Horizont!','Lời chào tới tận chân trời!')},{x:296,y:430,name:L('Am Fernrohr spielen','Chạm kính ngắm'),text:L('Das Meer wartet auf uns.','Biển đang đợi mình kìa.')}]
  return <>
    <svg className="map-atmosphere" viewBox="0 0 400 1200" aria-hidden="true">
      {region==='forest'?<g>{[[210,184],[251,391],[92,574],[268,840],[167,1041]].map(([x,y],i)=><g key={y} transform={`translate(${x} ${y})`}><g className={`map-firefly map-phase-${i%3}`}><circle r="9" fill="#fff1aa" opacity=".2"/><circle r="3" fill="#fff8c1"/></g></g>)}</g>:<g stroke="#e7fffa" strokeWidth="3" fill="none">{[[22,295],[375,455],[15,700],[353,913],[25,1120]].map(([x,y],i)=><g key={y} transform={`translate(${x} ${y})`}><ellipse className={`map-ripple map-phase-${i%3}`} rx="17" ry="5"/></g>)}</g>}
      <g className="map-cloud" fill="#faffff" opacity=".75"><path d="M8 82q0-11 12-12 6-14 19-6 12-3 17 10 12 0 13 8Z"/></g>
      <g className="map-cloud map-cloud-far" fill="#faffff" opacity=".65"><path d="M309 561q0-11 12-12 6-14 19-6 12-3 17 10 12 0 13 8Z"/></g>
      <g className="map-butterfly" transform="translate(225 470)"><g className="map-butterfly-wings" fill="#ffd779" stroke="#d88b52" strokeWidth="1.5"><path d="M0 0C-19-24-22 4 0 7 22 4 19-24 0 0Z"/><path d="M0 0v9"/></g></g>
    </svg>
    {landmarks.map((item,i)=><div key={item.name} className="map-landmark" style={{left:`${item.x/4}%`,top:`${item.y/12}%`}}>
      <button type="button" className="map-landmark-hit" aria-label={item.name} onClick={()=>setTapped(tapped===i?null:i)}><span aria-hidden="true">✦</span></button>
      {tapped===i&&<><span className="map-landmark-message" role="status">{item.text}</span><span className="map-pop" aria-hidden="true">✦</span></>}
    </div>)}
  </>
}
