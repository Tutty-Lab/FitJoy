import { useState } from 'react'
import { loadProfile } from '../lib/profile'
import { playGameSound } from '../lib/gameAudio'
import { L } from '../lib/i18n'
import type { Region } from '../data/story'

// Hidden quirky details on the map: tap one and it gives a gentle reaction (sound + a short line).
// Positions are % of the map area; mirrored on flipped chapters so they stay on their object.
type Spot = { x: number; y: number; de: string; vi: string }

const HOTSPOTS: Record<Region['id'], Spot[]> = {
  harbor: [ // inside the cozy house
    { x: 22, y: 7, de: 'Der Kessel pfeift leise.', vi: 'Ấm nước reo khe khẽ.' },
    { x: 46, y: 36, de: 'Psst – die Katze schläft.', vi: 'Suỵt – mèo đang ngủ.' },
    { x: 57, y: 52, de: 'Eine Tasse schwebt?!', vi: 'Tách trà bay lơ lửng?!' },
    { x: 71, y: 57, de: 'Da huscht eine Maus!', vi: 'Có chú chuột chạy qua!' },
    { x: 60, y: 85, de: 'Ein Fernrohr zu den Sternen.', vi: 'Kính ngắm sao trên gác.' },
  ],
  forest: [ // old village lane
    { x: 74, y: 7, de: 'Die Turmuhr zerläuft …', vi: 'Đồng hồ trên tháp đang chảy …' },
    { x: 17, y: 22, de: 'Eine Katze im Fenster.', vi: 'Có mèo trong ô cửa sổ.' },
    { x: 53, y: 42, de: 'Ein fliegender Schirm!', vi: 'Chiếc ô biết bay!' },
    { x: 28, y: 70, de: 'Rosen klettern am Tor.', vi: 'Hoa hồng leo bên cổng.' },
    { x: 66, y: 60, de: 'Ein Vogel auf dem Briefkasten.', vi: 'Chú chim đậu trên hòm thư.' },
  ],
  lighthouse: [ // dreamy park
    { x: 26, y: 11, de: 'Enten auf dem Teich.', vi: 'Đàn vịt trên hồ.' },
    { x: 50, y: 40, de: 'Ein leuchtendes Papierboot.', vi: 'Thuyền giấy phát sáng.' },
    { x: 76, y: 29, de: 'Die Gartenuhr tropft …', vi: 'Đồng hồ trong vườn nhỏ giọt …' },
    { x: 20, y: 56, de: 'Eine Laterne schwebt.', vi: 'Chiếc đèn lồng lơ lửng.' },
    { x: 58, y: 80, de: 'Ein Picknick wartet.', vi: 'Tấm khăn dã ngoại đang chờ.' },
  ],
}

export default function MapHotspots({ region, flip }: { region: Region['id']; flip: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  const spots = HOTSPOTS[region] ?? []
  let timer = 0
  const tap = (i: number) => {
    if (loadProfile()?.chime ?? true) playGameSound('tap')
    setOpen(i)
    window.clearTimeout(timer)
    timer = window.setTimeout(() => setOpen(c => (c === i ? null : c)), 2600)
  }
  return <>
    {spots.map((s, i) => {
      const left = flip ? 100 - s.x : s.x
      return <button key={i} type="button" className={`map-spot ${open === i ? 'open' : ''}`} style={{ left: `${left}%`, top: `${s.y}%` }} aria-label={L(s.de, s.vi)} onClick={() => tap(i)}>
        <span className="map-spot-dot" aria-hidden="true" />
        {open === i && <span className="map-spot-bubble">{L(s.de, s.vi)}</span>}
      </button>
    })}
  </>
}
