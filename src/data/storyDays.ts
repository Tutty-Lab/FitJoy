// "Schatzsuche – Momente sammeln": official 90-day companion story (one short story per day, read after the exercise).
// Source: Vestibu_90_Tage_Begleitgeschichte.xlsx, sheet "Vestibu · 90 Tagesfolgen". German only for now.
import data from './storyDays.de.json'
import { L } from '../lib/i18n'

export type DayStory = { day: number; phase: string; story: string; affirmation: string }
const days = data.days as DayStory[]

export const storyIntro = data.intro as string
export const dayStory = (day: number): DayStory | undefined => days[day - 1]

const phaseVi: Record<string, string> = {
  'Ankommen und bemerken': 'Bắt đầu và để ý',
  'Spuren im Alltag verbinden': 'Nối các dấu vết thường ngày',
  'Regelmäßig tun und weiter entdecken': 'Đều đặn và khám phá tiếp',
}
export const phaseTitle = (day: number) => { const p = dayStory(day)?.phase ?? ''; return L(p, phaseVi[p] ?? p) }
