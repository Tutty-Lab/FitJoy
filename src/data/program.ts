import { dayStory } from './storyDays'
// Der Gleichgewichts-Code: 90-day plan. Texts come from Michaela's Excel via
// vestibu-inhalte.json (regenerate with scripts/import-vestibu.py, no code changes needed).
import content from './vestibu-inhalte.json'
import contentVi from './vestibu-inhalte.vi.json'
import { L, lang } from '../lib/i18n'

export const PROGRAM_DAYS = 90
export const SESSIONS_PER_DAY = 3
export const PRACTICE_SECONDS = 60

// TEMP for customer testing: every day is open. Set back to false to restore the advent-calendar unlock.
export const TEST_UNLOCK_ALL = false

export type BonusCategory = 'Gleichgewicht' | 'Wahrnehmung' | 'Entspannung' | 'Bewegung'
export type BonusExercise = { id: string; nr: string; kategorie: BonusCategory; titel: string; anleitung: string }
export type ProgramDay = { tag: number; phase: string; begruessung: string; affirmation: string; bonusImpuls: string; bonusUebung: string | null }

export const programDays = content.tage as ProgramDay[]
export const bonusExercises = content.bonusUebungen as BonusExercise[]

// The one base exercise, identical for all 90 days and done up to three times a day.
export const baseExercise = {
  title: 'Grundübung',
  original:
    'Stell dich aufrecht hin, oder setze dich aufrecht auf einen stabilen Stuhl mit beiden Füße am Boden. Hebe ein Knie langsam an und neige gleichzeitig den Kopf behutsam in seine Richtung. Nähere beide nur so weit einander an, wie es angenehm bleibt, halte die Position während du deine Affirmation sprichst und kehre langsam in die aufrechte Ausgangsposition zurück. Wechsle die Seite und führe die Bewegung abwechselnd zweimal mit jedem Knie aus.',
  steps: [
    'Stell dich aufrecht hin oder setz dich aufrecht auf einen stabilen Stuhl, beide Füße am Boden.',
    'Hebe ein Knie langsam an und neige gleichzeitig den Kopf behutsam in seine Richtung.',
    'Nähere Kopf und Knie nur so weit an, wie es angenehm bleibt.',
    'Halte die Position, während du deine Affirmation laut sprichst.',
    'Kehre langsam in die aufrechte Ausgangsposition zurück.',
    'Wechsle die Seite – abwechselnd zweimal mit jedem Knie.',
  ],
  // AI-generated video to be supplied; placeholder until then.
  video: '/videos/workout-sample.mp4',
}

const clampDay = (day: number) => Math.min(PROGRAM_DAYS, Math.max(1, Math.floor(day)))

// Admin edits live in the shared catalog cache (fitjoy.catalog, mirrored to workout_overrides):
// day 1–90 = per-day text overrides, day 0 = program-wide settings (base exercise video).
type Overrides = Record<number, Partial<ProgramDay> & { video?: string }>
export const CATALOG_KEY = 'fitjoy.catalog'
export function readOverrides(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_KEY) ?? '{}') as Overrides
  } catch {
    return {}
  }
}
const pickText = (o: Partial<ProgramDay> = {}) => Object.fromEntries((['begruessung', 'affirmation', 'bonusImpuls', 'bonusUebung'] as const).filter(k => o[k] !== undefined).map(k => [k, o[k]]))

export const excelDay = (day: number): ProgramDay => programDays[clampDay(day) - 1]
export const dayContent = (day: number): ProgramDay => ({ ...excelDay(day), ...pickText(readOverrides()[clampDay(day)]) })
export const baseVideo = () => readOverrides()[0]?.video || baseExercise.video

export const phaseIndex = (day: number) => Math.ceil(clampDay(day) / 30)

// The bonus changes every 3 days (30 blocks). First valid assignment in the block wins;
// otherwise use the seeded random order approved by the customer.
// Fixed pseudo-random order (seeded), so every user sees the same exercise in a block and it never repeats within 90 days.
const shuffled = (() => {
  const list = [...bonusExercises]
  let seed = 90
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]] }
  return list
})()

export function bonusFor(day: number): BonusExercise | undefined {
  const d = clampDay(day)
  const blockStart = Math.floor((d - 1) / 3) * 3 + 1
  const assigned = [blockStart, blockStart + 1, blockStart + 2].map(n => bonusExercises.find(b => b.id === dayContent(n).bonusUebung)).find(Boolean)
  return assigned ?? shuffled[(blockStart - 1) / 3]
}

// Until the customer delivers per-day affirmations, show a default so there is always a sentence to speak.
export const affirmationFor = (day: number) => (lang === 'de' && dayStory(day)?.affirmation) || dayContent(day).affirmation || L('Ich stehe sicher. Mein Gleichgewicht wird jeden Tag stärker.', 'Tôi đứng vững. Sự thăng bằng của tôi mỗi ngày một mạnh hơn.')

// ---- User-facing, language-aware views (admin keeps working on the German originals above) ----
type ViDay = { begruessung: string; bonusImpuls: string; phase: string }
const viDays = contentVi.tage as ViDay[]
const viBonus = contentVi.bonusUebungen as Record<string, { titel: string; anleitung: string }>

export const localDay = (day: number): ProgramDay => (lang === 'vi' ? { ...dayContent(day), ...viDays[clampDay(day) - 1], ...pickText(readOverrides()[clampDay(day)]) } : dayContent(day))
export function localBonusFor(day: number): BonusExercise | undefined {
  const b = bonusFor(day)
  return b && lang === 'vi' && viBonus[b.id] ? { ...b, ...viBonus[b.id] } : b
}
// Distinct bonus exercises already unlocked by day 1..day — the pool the reward wheel draws from.
export function bonusesUpTo(day: number): BonusExercise[] {
  const seen = new Map<string, BonusExercise>()
  for (let d = 1; d <= clampDay(day); d++) { const b = localBonusFor(d); if (b) seen.set(b.id, b) }
  return [...seen.values()]
}
const categoryVi: Record<BonusCategory, string> = { Gleichgewicht: 'Thăng bằng', Wahrnehmung: 'Cảm nhận', Entspannung: 'Thư giãn', Bewegung: 'Vận động' }
export const categoryLabel = (c: BonusCategory) => (lang === 'vi' ? categoryVi[c] ?? c : c)

export const baseText = lang === 'vi'
  ? {
      title: 'Bài tập cơ bản',
      steps: [
        'Đứng thẳng hoặc ngồi thẳng trên một chiếc ghế chắc chắn, hai bàn chân đặt trên sàn.',
        'Nâng chậm một đầu gối, đồng thời nghiêng đầu nhẹ nhàng về phía đầu gối đó.',
        'Đưa đầu và đầu gối lại gần nhau chỉ trong mức còn dễ chịu.',
        'Giữ tư thế trong khi đọc to câu khẳng định của bạn.',
        'Từ từ trở về tư thế đứng/ngồi thẳng ban đầu.',
        'Đổi bên – luân phiên mỗi đầu gối hai lần.',
      ],
    }
  : { title: baseExercise.title, steps: baseExercise.steps }
