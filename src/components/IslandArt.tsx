/** Shared original scenery: layered shapes, a consistent overhead view and one light direction. */
export function IslandTree({ x, y, scale = 1, muted = false }: { x: number; y: number; scale?: number; muted?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="19" rx="25" ry="9" fill="#2c9c6633" />
    <path d="M-5 1h10v23q-5 5-10 0Z" fill="#b88453" /><path d="M0 4h5v20l-5 2" fill="#976a47" />
    <g className="island-tree-crown">
    <path d="M-27-12q-8-17 9-23-2-20 18-21 20-1 24 17 20 0 20 18 8 18-10 25-13 9-29 2-22 8-32-7Z" fill={muted ? '#a6c8b1' : '#289c70'} />
    <path d="M-28-18q-1-15 14-18 0-17 17-17 16 1 19 15 16 0 17 14-13 11-27 3-19 11-40 3Z" fill={muted ? '#b5d3bc' : '#54c27d'} />
    <path d="M-10-40q11-10 20 1" stroke={muted ? '#c5dfc9' : '#8add8d'} strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  </g>
}

export function IslandHouse({ x, y, scale = 1, restored = true }: { x: number; y: number; scale?: number; restored?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="30" rx="45" ry="12" fill="#319b5c25" />
    <path d="M-33-23h66v49q-33 13-66 0Z" fill="#fff1cf" /><path d="M15-23h18v49l-18 4Z" fill="#e6ce9e" />
    <path d="M-43-26 0-61 44-26v9L0-47-43-17Z" fill={restored ? '#c85254' : '#91aaa2'} />
    <path d="M-43-26 0-61 44-26 0-35Z" fill={restored ? '#f07f71' : '#b4c6bb'} />
    <path d="m-23-39 21-17 25 20" fill="none" stroke={restored ? '#ffb18c' : '#d1dbcd'} strokeWidth="5" strokeLinecap="round" />
    <path d="M-24-14h18v18h-18Z" fill={restored ? '#83d9d4' : '#bbcdc0'} /><path d="M-15-14V4m-9-9h18" stroke="#fff9e6" strokeWidth="3" />
    <path d="M6 29V-5q0-13 12-13T30-5v31Z" fill="#279290" /><path d="M12 27V-5q0-8 6-8t7 8v31Z" fill="#176f7f" /><circle cx="21" cy="8" r="2" fill="#ffd479" />
    <path d="M-30 26h20v5h-20Z" fill="#d6b78e" /><path d="M-26 23h12v6h-12Z" fill="#f0cb94" />
    <path d="M-33 7h29v5h-29Z" fill="#c39265" /><path d="M-29 7V2m9 5V1m9 6V2" stroke={restored ? '#54b875' : '#a5bca6'} strokeWidth="6" strokeLinecap="round" />
    {restored && <g fill="#ffd067"><circle cx="-29" cy="0" r="3" /><circle cx="-20" cy="-2" r="3" /><circle cx="-11" cy="0" r="3" /></g>}
  </g>
}

export function IslandLighthouse({ x, y, scale = 1, lit = false }: { x: number; y: number; scale?: number; lit?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="13" rx="35" ry="12" fill="#32976d33" />
    <path d="m-25 9 9-87h32l10 87q-25 10-51 0" fill="#fff5dd" /><path d="m8-78 8 1 10 86-17 4Z" fill="#e5ddc4" />
    <path d="m-20-42 40 2-3-23-35-2Z" fill="#f08070" /><path d="m-24-3 48 3-3-21-43-3Z" fill="#f08070" />
    <path d="M-21-103h42v26h-42Z" fill={lit ? '#ffe58a' : '#82cdd1'} /><path d="M-15-100v20m15-20v20m15-20v20" stroke="#217e88" strokeWidth="4" />
    <path d="m-27-103 27-25 28 25Z" fill="#1e8290" /><path d="m-17-110 17-16 18 16Z" fill="#41b0b2" />
    <path d="M-27-77h54v7h-54Z" fill="#298a91" /><path d="M-6 11V-5q0-8 6-8t7 8v17Z" fill="#247e87" />
    {lit && <path className="island-beam" d="m-21-101-65-19v48l65-8m42-21 65-19v48l-65-8" fill="#fff6ae" opacity=".55" />}
  </g>
}

export function IslandBoat({ x, y, scale = 1 }: { x:number; y:number; scale?:number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cy="27" rx="38" ry="7" fill="#118fa62b" /><g className="island-boat-body"><path d="M-31 9h65q-6 23-32 23T-31 9" fill="#aa6045" /><path d="M-29 9h61v7h-61Z" fill="#ffcb8b" />
    <path d="M1 9v-67" stroke="#a16d4f" strokeWidth="4" strokeLinecap="round" /><path d="m6-55 29 48H6Z" fill="#fff7de" /><path d="m-4-44-25 37h25Z" fill="#ff9775" />
    </g>
  </g>
}

export function IslandDock({ x,y }: {x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-22-10h44v104q-22 9-44 0Z" fill="#a36b46" /><path d="M-22-16h44V88q-22 7-44 0Z" fill="#e9b879" />
    {[0,18,36,54,72].map(v=><g key={v}><path d={`M-19 ${v}h38`} stroke="#c18c59" strokeWidth="3" /><circle cx="-14" cy={v+7} r="1.5" fill="#b18155" /><circle cx="14" cy={v+7} r="1.5" fill="#b18155" /></g>)}
    {[-26,26].map(v=><g key={v}><path d={`M${v-4} 0v50q4 5 8 0V0Z`} fill="#976944" /><ellipse cx={v} rx="5" ry="3" fill="#f7cd91" /></g>)}
  </g>
}

export function IslandFlowers({ x,y,active = true }: {x:number;y:number;active?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="7" rx="13" ry="5" fill="#4db870" />
    <path d="M-7 3v-10m12 11v-17" stroke="#379964" strokeWidth="3" strokeLinecap="round" />
    <g fill={active ? '#fff4af' : '#a3c8a4'}><circle cx="-7" cy="-10" r="5" /><circle cx="6" cy="-17" r="6" /></g>
    <g fill="#f5b64f"><circle cx="-7" cy="-10" r="2" /><circle cx="6" cy="-17" r="2.5" /></g>
  </g>
}
