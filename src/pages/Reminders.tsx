import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Switch, SectionTitle } from '../components/shared'
import { loadProfile, saveProfile } from '../lib/profile'
import { DEFAULT_TIMES, ensureNotificationPermission } from '../lib/reminders'
import coach from '../assets/home/mascot.png'
import icAlarm from '../assets/onboarding/r-alarm.svg'
import icBell from '../assets/onboarding/r-bell.svg'
import icSunset from '../assets/onboarding/r-sunset.svg'
import { L } from '../lib/i18n'

const slots = [
  { title: L('Morgens', 'Buổi sáng'), icon: icAlarm, w: 15.975, h: 14.738, bg: 'bg-[#ffe3d3]', card: 'bg-white' },
  { title: L('Mittags', 'Buổi trưa'), icon: icBell, w: 12, h: 15, bg: 'bg-[#e7efee]', card: 'bg-white' },
  { title: L('Abends', 'Buổi tối'), icon: icSunset, w: 16.5, h: 15, bg: 'bg-[#ffdcc5]', card: 'bg-white' },
]

export default function Reminders() {
  const p = loadProfile()
  const [times, setTimes] = useState<string[]>(p?.reminderTimes ?? DEFAULT_TIMES)
  const [on, setOn] = useState<boolean[]>(p?.reminders ?? [true, true, true])
  const [saved, setSaved] = useState(false)

  const update = (t: string[], o: boolean[]) => {
    setTimes(t)
    setOn(o)
    saveProfile({ reminderTimes: t, reminders: o })
    if (o.some((v,i)=>v&&!on[i])) ensureNotificationPermission()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="stagger flex flex-col gap-5 px-4 pt-2 pb-6">
      <h1 className="text-xl font-black">{L('Erinnerungen', 'Nhắc tập')}</h1>
      <p className="flow-note">{L('Diese Erinnerungen funktionieren, solange die App geöffnet ist. Eine Zustellung bei geschlossener App ist noch nicht eingerichtet.', 'Lời nhắc hiện hoạt động khi ứng dụng đang mở. Gửi lời nhắc lúc đóng ứng dụng chưa được thiết lập.')}</p>
      <div className="flex gap-4 overflow-hidden rounded-[28px] border-2 border-[#ffd9c2] bg-[#ffece1] p-4 shadow-[0_4px_0_#ffd9c2]">
        <div className="relative shrink-0 self-start">
          <img src={coach} alt="Vestibu" className="size-16 object-contain" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs leading-4 font-bold tracking-[0.48px] text-[#d9652c]">{L('3 Erinnerungen am Tag', '3 lời nhắc mỗi ngày')}</span>
          <p className="text-sm leading-[22.75px] font-medium text-[#7a3412]">
            {L('Wähle Zeiten, die zu deinem Alltag passen – für deine 3 × 1 Minute ⏰', 'Chọn giờ phù hợp với ngày của bạn – cho 3 × 1 phút tập ⏰')}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={saved && <span className="text-xs leading-4 font-bold text-[#13707e]">{L('Gespeichert ✓', 'Đã lưu ✓')}</span>}>{L('Erinnerungszeiten', 'Giờ nhắc')}</SectionTitle>
        {slots.map((s, i) => (
          <div key={s.title} className={`flex flex-col gap-3 rounded-[28px] p-4 border-2 border-mint shadow-[0_4px_0_#cfe7e5] ${s.card} ${on[i] ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className={`flex size-11 items-center justify-center rounded-full ${s.bg}`}>
                  <img src={s.icon} alt="" style={{ width: s.w, height: s.h }} />
                </span>
                <span>
                  <span className="block text-base leading-5 font-bold">{s.title}</span>
                </span>
              </span>
              <Switch label={`${L('Erinnerung', 'Nhắc')} ${s.title}`} on={on[i]} onChange={() => update(times, on.map((v, j) => (j === i ? !v : v)))} />
            </div>
            <label className="flex items-center justify-between rounded-[48px] bg-[#f3f6f5] py-1 pr-1 pl-4">
              <span className="text-sm leading-5 font-semibold text-[#3f4a4b]">{L('Uhrzeit', 'Giờ')}</span>
              <input
                type="time"
                value={times[i]}
                disabled={!on[i]}
                onChange={e => update(times.map((t, j) => (j === i ? e.target.value : t)), on)}
                className="rounded-full bg-white px-4 py-2 text-lg leading-6 font-bold text-[#13707e] outline-none focus:ring-2 focus:ring-brand"
              />
            </label>
          </div>
        ))}
      </section>

    </div>
  )
}
