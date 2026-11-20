import { IslandTree, IslandHouse, IslandLighthouse, IslandFlowers } from './IslandArt'

export const adventurePoints = [[220,265],[150,355],[98,447],[147,540],[224,626],[294,716],[254,808],[177,898],[115,986],[203,1080]]
const road = adventurePoints.reduce((path,[x,y],i)=>i===0?`M${x} ${y}`:`${path} C${adventurePoints[i-1][0]} ${y-47} ${x} ${adventurePoints[i-1][1]+47} ${x} ${y}`,'')

function Bridge({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y}) rotate(-18)`}><path d="M-42-20h84v45h-84Z" fill="#986a49"/><path d="M-42-24h84v40h-84Z" fill="#efc48a"/>{[-30,-15,0,15,30].map(v=><path key={v} d={`M${v}-22v36`} stroke="#bc8e5f" strokeWidth="3"/>)}<path d="M-44-31h88m-88 56h88" stroke="#775440" strokeWidth="5" strokeLinecap="round"/></g>
}
function Mushroom({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}><ellipse cy="8" rx="16" ry="5" fill="#327a5b33"/><path d="M-4-7h8v16h-8Z" fill="#fff1cc"/><path d="M-16-6q1-23 16-23T16-6Z" fill="#e98279"/><g fill="#ffdfaf"><circle cx="-7" cy="-14" r="3"/><circle cx="5" cy="-21" r="3"/><circle cx="8" cy="-10" r="2"/></g></g>
}

/** Region-specific terrain, landmarks and restoration, shared by map and journal. */
export default function RegionScenery({region,restored,compact=false}:{region:'forest'|'lighthouse';restored:number;compact?:boolean}) {
  const forest=region==='forest'
  const scenery=<>
    <rect width="400" height="1200" fill={forest?'#d1e6be':'#9bdce9'}/>
    {forest ? <>
      <path d="M0 0h400v210q-70-55-139-16T0 174Z" fill="#b0d598"/>
      <path d="M17 0q80 180 13 335T55 650Q10 780 57 939T15 1200M380 0q-48 175-5 310t-8 330q-60 151-8 296t-2 264" fill="none" stroke="#8dc68e" strokeWidth="58"/>
      <path d="M380 121Q233 170 273 300T174 510Q75 566 152 683t-1 177Q80 951 12 1031" fill="none" stroke="#77b7ad" strokeWidth="57"/>
      <path d="M380 115Q233 164 273 294T174 504Q75 560 152 677t-1 177Q80 945 12 1025" fill="none" stroke="#9ce0d0" strokeWidth="43"/>
      <g stroke="#d9fff0" strokeWidth="3" strokeLinecap="round"><path d="M299 174h25m-56 174h22m-126 239h22m-30 170h24M64 976h28"/></g>
    </> : <>
      <path d="M44 150Q90 80 172 131Q235 77 322 137L358 310 325 455 359 620 329 790 295 935 276 1136Q172 1211 65 1120L35 941 64 786 30 620 63 464 25 310Z" transform="translate(0 22)" fill="#6a9ba6" stroke="#7cbdc8" strokeWidth="18"/>
      <path d="M44 150Q90 80 172 131Q235 77 322 137L358 310 325 455 359 620 329 790 295 935 276 1136Q172 1211 65 1120L35 941 64 786 30 620 63 464 25 310Z" fill="#b5d298" stroke="#efe2b9" strokeWidth="12" strokeLinejoin="round"/>
      <g fill="none" stroke="#d9f7f4" strokeWidth="4" strokeLinecap="round"><path d="M5 160h23m332 224h30M8 578h24m329 163h28M5 940h29m285 210h45"/></g>
      <g fill="#789fa8"><path d="m347 483 27-13 13 32-35 10Z"/><path d="m12 825 22-10 14 28-36 6Z"/><path d="m315 1070 29-12 13 28-37 10Z"/></g>
    </>}
    <path d={road} fill="none" stroke={forest?'#93b984':'#93ad80'} strokeWidth="48" strokeLinecap="round" transform="translate(0 5)"/>
    <path d={road} fill="none" stroke={forest?'#d7b784':'#d3ba93'} strokeWidth="40" strokeLinecap="round"/>
    <path d={road} fill="none" stroke={forest?'#f5dcaa':'#fff0ce'} strokeWidth="31" strokeLinecap="round"/>
    <path d={road} fill="none" stroke="#fff6d7" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round"/>
    {forest ? <>
      <IslandTree x={100} y={185} scale={1.7}/><g transform="translate(104 155)"><path d="M-20 12v44m35-44v44" stroke="#966940" strokeWidth="6"/><path d="M-20 28h35m-35 12h35" stroke="#e4b87c" strokeWidth="4"/></g><IslandHouse x={100} y={141} scale={.72} restored={restored>0}/>
      <IslandTree x={300} y={183} scale={1.2}/><IslandTree x={348} y={225} scale={.72}/>
      <Bridge x={157} y={526}/><Bridge x={180} y={898}/>
      {[[55,325,.9],[320,405,1.1],[331,592,.9],[65,734,1.1],[316,872,.8],[61,1060,1],[298,1131,.85]].map(([x,y,s])=><IslandTree key={y} x={x} y={y} scale={s}/>)}
      <Mushroom x={77} y={396}/><Mushroom x={282} y={564}/><Mushroom x={100} y={830}/>
      <g transform="translate(280 1010)"><ellipse cy="10" rx="27" ry="11" fill="#73b0a1"/><ellipse cy="5" rx="23" ry="10" fill={restored>=20?'#a9e9da':'#b7d4bd'}/><path d="M0 5v-24m-7 7 7-11 7 11" fill="none" stroke="#79bca8" strokeWidth="4" strokeLinecap="round"/></g>
      <g fill={restored>=10?'#fff3a6':'#c4d6aa'}>{[[211,176],[252,387],[91,574],[266,839],[168,1042]].map(([x,y])=><g key={y}><circle cx={x} cy={y} r="7" opacity=".3"/><circle cx={x} cy={y} r="3"/></g>)}</g>
    </> : <>
      <IslandLighthouse x={267} y={203} scale={1.1} lit={restored>0}/><IslandHouse x={114} y={191} scale={.8} restored={restored>=5}/>
      <g transform="translate(296 445)"><ellipse cy="10" rx="34" ry="12" fill="#8aaf99"/><path d="M-30 0h60v9h-60Z" fill="#f5e8c2"/><path d="M-21 0v-20m42 20v-20m-42 7h42" stroke="#5c9091" strokeWidth="4"/><path d="m-10-18 8-27 25 9-7 19Z" fill="#368e9a"/><path d="m1-43 22 7" stroke="#92d8d8" strokeWidth="8"/></g>
      {[[64,358,.65],[84,643,.72],[300,976,.66]].map(([x,y,s])=><IslandTree key={y} x={x} y={y} scale={s}/>)}
      <g transform="translate(100 795)"><path d="M-32 0h64v22h-64Z" fill="#c4bda2"/><path d="M-32 0 0-15 32 0 0 12Z" fill="#eee6cf"/><path d="M0-10v-48" stroke="#61909a" strokeWidth="5"/><path d="m3-59 31 11-31 11Z" fill={restored>=15?'#ef927e':'#a8bcb2'}/></g>
      <IslandLighthouse x={280} y={1117} scale={.62} lit={restored>=25}/>
      <g fill="none" stroke="#508d9e" strokeWidth="3" strokeLinecap="round"><path d="m65 91 9-5 9 5m236 490 8-5 8 5m-252 510 8-5 8 5"/></g>
    </>}
    {[[195,205],[80,472],[242,580],[194,762],[80,946],[253,1140]].map(([x,y],i)=><IslandFlowers key={y} x={x} y={y} active={restored>i*5}/>)}
  </>
  return compact ? <svg viewBox="0 65 400 250" width="400" height="250" overflow="hidden">{scenery}</svg> : scenery
}
