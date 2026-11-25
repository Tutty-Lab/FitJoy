import { useId } from 'react'
import type { Region } from '../data/story'

const water={harbor:'#a4e4e9',forest:'#d1e6be',lighthouse:'#9bdce9'}
const ground={harbor:'#92d17b',forest:'#d1e6be',lighthouse:'#b5d298'}

/** Overlaps both scenes; the path's endpoints match day 10 and the next day 1. */
export default function MapJoin({from,to}:{from:Region['id'];to:Region['id']}) {
  const id=useId().replace(/:/g,'')
  const path='M203 0 C203 125 220 225 220 385'
  return <svg className="map-join" viewBox="0 0 400 385" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-sea`} x2="0" y2="1"><stop stopColor={water[from]}/><stop offset="1" stopColor={water[to]}/></linearGradient>
      <linearGradient id={`${id}-land`} x2="0" y2="1"><stop stopColor={ground[from]}/><stop offset="1" stopColor={ground[to]}/></linearGradient>
      <linearGradient id={`${id}-fade`} x2="0" y2="1"><stop stopColor="white" stopOpacity="0"/><stop offset=".22" stopColor="white"/><stop offset=".65" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
      <mask id={`${id}-mask`}><rect width="400" height="385" fill={`url(#${id}-fade)`}/></mask>
    </defs>
    <path d={path} stroke="#5a4634" strokeWidth="7" strokeDasharray="0.5 20" strokeLinecap="round" opacity=".28" fill="none" transform="translate(0 2)"/>
    <path d={path} stroke="#fff6e4" strokeWidth="5" strokeDasharray="0.5 20" strokeLinecap="round" opacity=".9" fill="none"/>
  </svg>
}
