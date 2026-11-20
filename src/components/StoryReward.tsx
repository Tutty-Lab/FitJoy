import { Sparkles } from 'lucide-react'
import { episodeFor } from '../data/story'
import { lang, L } from '../lib/i18n'
import { useCompleted } from '../lib/progress'

export default function StoryReward({ day }: { day: number }) {
  const { completed } = useCompleted()
  if (!completed.includes(day)) return null
  const episode = episodeFor(day)
  return <section className="story-reward w-full text-left" aria-label={L('Inselentdeckung', 'Khám phá trên đảo')}>
    <div className="p-4"><p className="story-eyebrow flex items-center gap-2"><Sparkles size={16} />{L('Deine Entdeckung', 'Khám phá của bạn')}</p><h3 className="mt-1 text-lg font-black">{episode.reward[lang]}</h3><p className="mt-2 text-sm leading-6">{episode.after[lang]}</p></div>
  </section>
}
