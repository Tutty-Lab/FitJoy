export type Category = 'Warm-up' | 'Core & Cardio' | 'Fat Burn' | 'Recovery'

export type Step = { name: string; mins: number; note: string }

export type Workout = {
  day: number
  title: string
  mins: number
  kcal: number
  category: Category
  intensity: 'Gentle' | 'Moderate' | 'Intense'
  moves: number
  blurb: string
  steps: Step[]
  // Replace with each day's real workout video when available.
  video: string
}

const steps: Record<Category, Step[]> = {
  'Warm-up': [
    { name: 'Joint Circles Head to Toe', mins: 2, note: 'Wake up every joint' },
    { name: 'March in Place & Arm Swings', mins: 3, note: 'Raise heart rate gently' },
    { name: 'Hip Openers', mins: 3, note: 'Loosen hips and lower back' },
    { name: 'Deep Breathing Reset', mins: 2, note: 'Slow nasal breathing' },
  ],
  'Core & Cardio': [
    { name: 'Dead Bug Activation', mins: 3, note: 'Brace the deep core' },
    { name: 'Mountain Climbers', mins: 4, note: 'Steady cardio intervals' },
    { name: 'Plank Shoulder Taps', mins: 4, note: 'Anti-rotation strength' },
    { name: 'Bicycle Crunch Finisher', mins: 4, note: 'Obliques & rhythm' },
  ],
  'Fat Burn': [
    { name: 'Jumping Jack Intervals', mins: 4, note: '40s on / 20s off' },
    { name: 'Squat to Reach', mins: 5, note: 'Full body power' },
    { name: 'Skater Hops', mins: 5, note: 'Lateral burn' },
    { name: 'Cool-down Walk', mins: 4, note: 'Bring heart rate down' },
  ],
  Recovery: [
    { name: 'Gentle Neck & Shoulder Release', mins: 2, note: 'Gentle joint rotations' },
    { name: 'Cat-Cow Spine Mobilization', mins: 3, note: 'Awaken spinal mobility' },
    { name: 'Standing Torso Balance Twist', mins: 3, note: 'Intercostal stretch' },
    { name: 'Hamstring & Calf Deep Stretch', mins: 4, note: 'Relax lower limbs' },
  ],
}

const plan: [string, Category, number, number, Workout['intensity']][] = [
  ['Joint Mobility & Deep Breath', 'Warm-up', 10, 50, 'Gentle'],
  ['Neck & Shoulder Tension Relief', 'Recovery', 12, 65, 'Gentle'],
  ['Morning Energy Flow', 'Warm-up', 12, 70, 'Gentle'],
  ['Core Foundations', 'Core & Cardio', 15, 90, 'Moderate'],
  ['Low-Impact Fat Burn', 'Fat Burn', 15, 110, 'Moderate'],
  ['Hips & Lower Back Care', 'Recovery', 12, 60, 'Gentle'],
  ['Cardio Kickstart', 'Core & Cardio', 16, 120, 'Moderate'],
  ['Glutes & Legs Activation', 'Fat Burn', 16, 115, 'Moderate'],
  ['Posture Reset', 'Recovery', 12, 60, 'Gentle'],
  ['Standing Abs Burner', 'Core & Cardio', 16, 110, 'Moderate'],
  ['HIIT Lite Intervals', 'Fat Burn', 18, 140, 'Intense'],
  ['Spine & Hamstring Stretch', 'Recovery', 14, 70, 'Gentle'],
  ['Neck & Shoulders', 'Recovery', 15, 80, 'Gentle'],
  ['Gentle Core Activation', 'Core & Cardio', 15, 90, 'Gentle'],
  ['Full Body Stretch & Mindful Balance', 'Recovery', 18, 95, 'Gentle'],
  ['Upper Body Strength & Tone', 'Core & Cardio', 18, 120, 'Moderate'],
  ['Full-body Fat Burn & Stamina', 'Fat Burn', 18, 130, 'Intense'],
  ['Balance & Stability', 'Warm-up', 14, 75, 'Moderate'],
  ['Power Core Circuit', 'Core & Cardio', 20, 150, 'Intense'],
  ['Deep Stretch & Rest', 'Recovery', 15, 70, 'Gentle'],
  ['Cardio Endurance Challenge', 'Fat Burn', 20, 160, 'Intense'],
  ['Victory Flow: Full Body', 'Fat Burn', 22, 170, 'Moderate'],
]

export const baseWorkouts: Workout[] = plan.map(([title, category, mins, kcal, intensity], i) => ({
  day: i + 1,
  title,
  mins,
  kcal,
  category,
  intensity,
  moves: 8,
  blurb:
    category === 'Recovery'
      ? 'Release neck and shoulder tension, lengthen your spine, and restore positive energy after a long day.'
      : category === 'Warm-up'
        ? 'Gently wake up your joints and muscles to build a safe, energised start to the day.'
        : category === 'Fat Burn'
          ? 'Fun, rhythmic intervals that light up your metabolism without overwhelming your joints.'
          : 'Build a strong, stable centre with controlled core moves and short cardio bursts.',
  steps: steps[category],
  video: '/videos/workout-sample.mp4',
}))

// Admin edits are stored as per-day overrides and layered over the seed data at load.
export const CATALOG_KEY = 'fitjoy.catalog'
function readOverrides(): Record<number, Partial<Workout>> {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_KEY) ?? '{}')
  } catch {
    return {}
  }
}
const overrides = readOverrides()
export const workouts: Workout[] = baseWorkouts.map(w => ({ ...w, ...overrides[w.day] }))

export const categoryColor: Record<Category, string> = {
  'Warm-up': 'text-[#13707e]',
  'Core & Cardio': 'text-[#d9652c]',
  'Fat Burn': 'text-[#944a00]',
  Recovery: 'text-[#3f4a4b]',
}

export const pad = (n: number) => String(n).padStart(2, '0')
