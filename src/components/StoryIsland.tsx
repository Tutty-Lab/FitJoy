import RegionScenery from './RegionScenery'
import { L } from '../lib/i18n'
import type { Region } from '../data/story'
import { IslandTree, IslandHouse, IslandLighthouse, IslandDock, IslandBoat, IslandFlowers } from './IslandArt'

/** Compact panorama uses the same art as the interactive island route. */
export default function StoryIsland({ region, restored = 0 }: { region: Region; restored?: number }) {
  return <svg viewBox="0 0 400 230" className="story-island" role="img" aria-label={L(`${region.name.de}: ${restored} von 30 Inselteilen wiederbelebt`, `${region.name.vi}: đã hồi sinh ${restored}/30 góc đảo`)}>
    {region.id !== 'harbor' ? <RegionScenery region={region.id} restored={restored} compact /> : <>
    <rect width="400" height="230" rx="22" fill="#ade8e9" />
    <path d="M0 39q120-32 220 0t180 0V0H0Z" fill="#d1f3ef" />
    <g fill="none" stroke="#dffff8" strokeWidth="4" strokeLinecap="round"><path d="M17 165h29m-13 27h23m271-28h35m-5 30h24M24 68h26m284-23h28" /></g>
    <path d="M54 133Q42 104 85 89Q100 60 157 77Q197 40 248 69Q302 46 333 89Q371 103 350 139Q333 173 270 173Q231 195 168 178Q87 182 54 150Z" transform="translate(0 9)" fill="#62bbb1" stroke="#90d8cf" strokeWidth="14" />
    <path d="M54 133Q42 104 85 89Q100 60 157 77Q197 40 248 69Q302 46 333 89Q371 103 350 139Q333 173 270 173Q231 195 168 178Q87 182 54 150Z" fill="#9ed780" stroke="#ffe3a4" strokeWidth="10" />
    <path d="M95 145Q145 138 189 146T284 123" fill="none" stroke="#d7ad71" strokeWidth="18" strokeLinecap="round" />
    <path d="M95 141Q145 134 189 142T284 119" fill="none" stroke="#ffdf9c" strokeWidth="15" strokeLinecap="round" />
    <g transform="translate(94 149) scale(.48)"><IslandDock x={0} y={0} /></g>
    <IslandBoat x={49} y={175} scale={.47} />
    <IslandHouse x={141} y={126} scale={.73} restored={restored>0} /><IslandLighthouse x={277} y={125} scale={.64} lit={restored>0} /><IslandTree x={211} y={99} scale={.56} /><IslandTree x={76} y={106} scale={.5} />
    <IslandTree x={322} y={148} scale={.5} /><IslandFlowers x={192} y={161} active={restored>=3} /><IslandFlowers x={246} y={147} active={restored>=5} />
    {restored>=7 && <g transform="translate(211 117)"><path d="M0 0v-32" stroke="#ad784d" strokeWidth="3" /><path d="M2-32 23-24 2-17Z" fill="#f58b6f" /></g>}
    <g fill="#f9ffff"><path d="M29 34q0-10 10-11 5-11 15-4 11-3 16 9 10-1 12 6Z" /><path d="M318 29q0-9 11-10 6-10 15-4 10-2 13 9 11 0 12 5Z" /></g>
    <g stroke="#3a939c" strokeWidth="2" strokeLinecap="round" fill="none"><path d="m180 43 5-3 5 3m17-9 5-3 5 3" /></g>
    </>}
  </svg>
}
