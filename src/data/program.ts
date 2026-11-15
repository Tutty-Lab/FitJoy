// Der Gleichgewichts-Code: 90-day plan. Texts come from Michaela's Excel via
// vestibu-inhalte.json (regenerate with scripts/import-vestibu.py, no code changes needed).
import content from './vestibu-inhalte.json'

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

// The bonus changes every 3 days (30 blocks). Michaela assigns it per day in the Excel;
// until a block is filled, fall back to the library entry with the block's index so the flow stays testable.
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
  const pick = [d, blockStart, blockStart + 1, blockStart + 2].filter(n => n <= PROGRAM_DAYS).map(n => dayContent(n).bonusUebung).find(Boolean)
  return bonusExercises.find(b => b.id === pick) ?? shuffled[(blockStart - 1) / 3]
}
