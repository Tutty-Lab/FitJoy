import { Sparkles } from 'lucide-react'
import { episodeFor, storyBeat } from '../data/story'
import { dayStory, phaseTitle } from '../data/storyDays'
import { lang, L } from '../lib/i18n'
import { useCompleted } from '../lib/progress'

export default function StoryReward({ day }: { day: number }) {
  const { completed } = useCompleted()
  if (!completed.includes(day)) return null
  const episode = episodeFor(day)
  return <section className="story-reward w-full text-left" aria-label={L('Inselentdeckung', 'Khám phá trên đảo')}>
    <div className="p-4"><p className="story-eyebrow flex items-center gap-2"><Sparkles size={16} />{L('Deine Entdeckung', 'Khám phá của bạn')}</p><h3 className="mt-1 text-lg font-black">{phaseTitle(day)}</h3><p className="mt-2 text-sm leading-6">{episode.after[lang]}</p></div>
  </section>
}

// Story card on the done screen: the beat this session unlocked (1/3, 2/3, 3/3).
export function StoryBeat({ day, session }: { day: number; session: number }) {
  const episode = episodeFor(day)
  return <section className="story-reward w-full text-left" aria-label={L('Geschichte', 'Câu chuyện')}>
    <div className="p-4"><p className="story-eyebrow flex items-center gap-2"><Sparkles size={16} />{L(`Tag ${day} von 90`, `Ngày ${day}/90`)}</p><h3 className="mt-1 text-lg font-black">{phaseTitle(day)}</h3><p className="mt-2 text-sm leading-6">{dayStory(day)?.story ?? storyBeat(day, session)[lang]}</p></div>
  </section>
}
