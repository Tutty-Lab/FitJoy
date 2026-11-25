import PaintedLife from './PaintedLife'
import { sessionsDone } from '../lib/progress'
import MapLife, { useMapMotion } from './MapLife'
import RegionScenery, { adventurePoints } from './RegionScenery'
import { Check, Gift, LockKeyhole, Play, Trophy } from 'lucide-react'
import { IslandTree, IslandHouse, IslandLighthouse, IslandBoat, IslandDock, IslandFlowers } from './IslandArt'
import { L } from '../lib/i18n'
import type { Region } from '../data/story'

const width = 400
const points = adventurePoints
// Painted backgrounds (public/map/<region>.webp); the road and stops are drawn on top.
const painted = true
const land = 'M45 158Q51 102 122 127Q144 82 207 107Q244 58 305 113Q371 115 369 190Q404 229 358 301Q391 353 347 409Q355 464 305 512Q350 553 358 618Q397 683 349 749Q373 795 322 858Q335 918 290 973Q318 1040 274 1110Q241 1175 169 1158Q93 1172 65 1115Q17 1081 42 1013Q7 963 56 897Q26 847 66 782Q24 726 60 664Q14 615 55 551Q20 504 44 442Q12 388 50 329Q14 274 57 222Q22 194 45 158Z'
export default function AdventureMap({chapter,current,statusOf,onPick,region,restored}:{chapter:number;current:number;statusOf:(day:number)=>string;onPick:(day:number,status:string)=>void;region:Region;restored:number}) {
  const motionRef=useMapMotion()
  const road=points.reduce((path,[x,y],i)=>i===0?`M${x} ${y}`:`${path} C${points[i-1][0]} ${y-47} ${x} ${points[i-1][1]+47} ${x} ${y}`,'')
  return <section ref={motionRef} data-moving="false" className={`adventure-map detail adventure-${region.id}`} aria-label={L('Dein Inselweg', 'Hành trình trên đảo')}>
    <div className="adventure-water">
      {painted ? <svg viewBox="0 0 400 1200" className="adventure-scenery" aria-hidden="true">
        <image href={`/map/${region.id}.webp`} x="0" y="0" width="400" height="1200" preserveAspectRatio="xMidYMid slice" transform={chapter%2 ? 'translate(400 0) scale(-1 1)' : undefined} />
        {/* Style B: faint haloed dotted trail instead of a thick road, so scene details stay visible. */}
        <path d={road} fill="none" stroke="#0b1e2e55" strokeWidth="11" strokeDasharray="0.1 20" strokeLinecap="round" />
        <path d={road} fill="none" stroke="#fffdf3" strokeWidth="6" strokeDasharray="0.1 20" strokeLinecap="round" />
      </svg> : <svg viewBox="0 0 400 1200" className="adventure-scenery" aria-hidden="true">
        {region.id !== 'harbor' ? <RegionScenery region={region.id} restored={restored} /> : <>
        <rect width="400" height="1200" fill="#a4e4e9" />
        <path d="M0 64q100-33 200 0t200 0v-64H0Z" fill="#c6f0ed" /><path d="M0 1180q90-35 200 0t200 0v20H0Z" fill="#86d7df" />
        <g className="map-wave-lines" fill="none" stroke="#daf8f5" strokeWidth="4" strokeLinecap="round">{[[24,87],[315,59],[8,320],[356,444],[12,602],[353,911],[15,1146]].map(([x,y])=><path key={y} d={`M${x} ${y}h28m8 0h10`} />)}</g>
        <path d={land} transform="translate(0 13)" fill="#55b8ad" stroke="#8bd7ce" strokeWidth="26" />
        <path d={land} fill="#92d17b" stroke="#f8dfa0" strokeWidth="17" strokeLinejoin="round" />
        <path d={land} fill="none" stroke="#77bf74" strokeWidth="3" />
        <path d="M70 190q63-75 129-30t118 19M70 572q50-37 97-5m70 418q43-40 52-96" fill="none" stroke="#a8de86" strokeWidth="26" strokeLinecap="round" />
        <path d={road} fill="none" stroke="#72ba6c" strokeWidth="46" strokeLinecap="round" transform="translate(0 5)" />
        <path d={road} fill="none" stroke="#e9bf77" strokeWidth="40" strokeLinecap="round" />
        <path d={road} fill="none" stroke="#ffdf9c" strokeWidth="32" strokeLinecap="round" />
        <path d={road} fill="none" stroke="#fff0bd" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
        <IslandDock x={76} y={192} /><IslandBoat x={29} y={288} scale={.63} />
        <IslandHouse x={128} y={181} scale={.83} restored={restored>0} />
        <IslandLighthouse x={304} y={197} scale={.62} lit={restored>0} />
        <IslandTree x={64} y={166} scale={.67} /><IslandTree x={207} y={160} scale={.55} />
        <IslandTree x={295} y={353} scale={.9} /><IslandTree x={333} y={379} scale={.55} />
        <IslandTree x={69} y={599} scale={.7} /><IslandTree x={98} y={639} scale={.48} />
        <IslandTree x={307} y={960} scale={.7} /><IslandTree x={275} y={1000} scale={.46} />
        <IslandHouse x={102} y={760} scale={.85} restored={restored>=5} />
        <g transform="translate(314 538)"><ellipse cy="21" rx="24" ry="7" fill="#62ad6240" /><path d="M-21 0h42v12h-42Zm4 12v13m34-13v13" fill="#d2a26a" stroke="#a5784e" strokeWidth="4" strokeLinejoin="round" /><path d="M-22-12h44v12h-44Z" fill={restored>=6?'#f2c58c':'#adc69b'} /></g>
        <IslandFlowers x={298} y={276} active={restored>0} /><IslandFlowers x={81} y={361} active={restored>=2} /><IslandFlowers x={219} y={453} active={restored>=3} /><IslandFlowers x={280} y={630} active={restored>=4} /><IslandFlowers x={174} y={771} active={restored>=5} /><IslandFlowers x={88} y={881} active={restored>=6} /><IslandFlowers x={253} y={1112} active={restored>=7} />
        <g fill="#62b971">{[[50,426],[332,656],[77,1068],[310,833]].map(([x,y])=><g key={y} transform={`translate(${x} ${y})`}><ellipse rx="17" ry="10" /><ellipse cx="12" cy="-8" rx="13" ry="12" fill="#75c976" /><path d="m-9-4 2-9m3 10 3-8" stroke="#a7de88" strokeWidth="3" strokeLinecap="round" /></g>)}</g>
        <g fill="#f9ffff"><path d="M28 45q-2-13 13-14 7-16 22-7 12-3 17 10 14 0 15 11Z" /><path d="M249 30q-1-10 11-12 7-12 18-5 11-3 15 9 13-1 15 8Z" /></g>
        <g stroke="#388b95" strokeWidth="2.5" fill="none" strokeLinecap="round"><path d="m240 84 6-3 6 3m15-16 5-3 5 3m-190 37 5-3 5 3" /></g>
        </>}
      </svg>}
      {painted ? <PaintedLife region={region.id} flip={chapter%2===1}/> : <MapLife region={region.id}/>}
      {points.map(([x,y],i)=>{
        const day=chapter*10+i+1,status=statusOf(day),now=day===current,mins=sessionsDone(day),partial=status==='completed'&&mins>0&&mins<3
        return <div className={`adventure-stop ${now?'is-current':''}`} key={day} style={{left:`${x/width*100}%`,top:`${y/1200*100}%`}}>
          {now && <span className="adventure-here">{mins>0?L(`Weiter · ${mins}/3`,`Tiếp tục · ${mins}/3`):L('Hier starten','Bắt đầu ở đây')}</span>}
          <button className={`adventure-node ${status} ${now?'now':''}`} aria-label={L(`Tag ${day}: ${status==='locked'?'gesperrt':partial?`${mins} von 3 Mal`:status==='completed'?'abgeschlossen':'starten'}`,`Ngày ${day}: ${status==='locked'?'chưa mở':partial?`${mins}/3 lần`:status==='completed'?'đã xong':'bắt đầu'}`)} onClick={()=>onPick(day,status)}>
            {partial?<span className="text-lg font-black">{mins}/3</span>:status==='completed'?<Check />:i===9?<Trophy />:i===4?<Gift />:now?<Play fill="currentColor" />:<LockKeyhole />}
          </button><span className="adventure-day">{L('Tag','Ngày')} {day}</span>
        </div>
      })}
    </div>
  </section>
}
