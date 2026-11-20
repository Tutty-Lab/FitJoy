import { Link } from 'react-router-dom'
import { ArrowLeft, Check, LockKeyhole } from 'lucide-react'
import { storyChapters, regionFor, restoredInRegion, episodeFor } from '../data/story'
import { L, lang } from '../lib/i18n'
import { useCompleted } from '../lib/progress'
import StoryIsland from '../components/StoryIsland'

export default function Story() {
  const {completed,current}=useCompleted()
  const region=regionFor(current)
  return <div className="flow-page">
    <header><Link to="/" className="flow-back"><ArrowLeft size={18}/>{L('Heute','Hôm nay')}</Link><h1 className="text-xl font-black">{L('Unser Inselbuch','Nhật ký hòn đảo')}</h1></header>
    <p className="text-sm leading-6">{L('Eine leere Postkarte führt Vestibu vom Hafen durch den Wald zum Leuchtturm. Mit deiner ersten Übungsminute am Tag entdeckst du ein neues Stück dieser Geschichte.','Một tấm bưu thiếp trắng dẫn Vestibu từ bến cảng qua rừng tới hải đăng. Phút tập đầu mỗi ngày giúp bạn khám phá thêm một phần câu chuyện ấy.')}</p>
    <section className="story-card"><StoryIsland region={region} restored={restoredInRegion(completed,region)}/><div className="story-card-body"><h2 className="font-black">{region.name[lang]}</h2><p className="flow-note">{L(`${completed.length}/90 Entdeckungen bleiben in deinem Buch.`,`Đã lưu ${completed.length}/90 khám phá trong nhật ký.`)}</p></div></section>
    {storyChapters.map((chapter,index)=>{
      const count=completed.filter(d=>d>=chapter.start&&d<chapter.start+10).length
      const available=chapter.start<=current
      return <details key={`${chapter.start}:${current}`} className="flow-chapter" open={current>=chapter.start&&current<chapter.start+10}>
        <summary>{L('Kapitel','Chương')} {index+1} · {chapter.title[lang]} <span className="flow-note">({count}/10)</span></summary>
        <p className="flow-note mb-3">{available?chapter.opening[lang]:L(`Diese Geschichte beginnt an Tag ${chapter.start}.`,`Chương này bắt đầu từ ngày ${chapter.start}.`)}</p>
        {available && <ol>{Array.from({length:10},(_,i)=>chapter.start+i).map(day=>{
          const episode=episodeFor(day),earned=completed.includes(day),today=day===current
          return <li key={day}><details className={`story-episode ${earned?'earned':''}`} open={today}>
            <summary><span className="story-episode-number">{earned?<Check size={18}/>:today?day:<LockKeyhole size={16}/>}</span><span><span className="block text-xs text-slate-500">{L('Tag','Ngày')} {day}</span>{earned||today?episode.title[lang]:L('Eine neue Entdeckung','Một khám phá mới')}</span></summary>
            <div className="px-4 pb-4 text-sm leading-6">{earned?<><p>{episode.after[lang]}</p><p className="mt-2 font-bold">{L('Entdeckt: ','Đã khám phá: ')}{episode.reward[lang]}</p></>:today?<><p>{episode.before[lang]}</p><Link className="flow-back" to={`/workouts/${day}`}>{L('Erste Minute starten','Bắt đầu phút đầu tiên')}</Link></>:<p>{L('Diese Seite öffnet an ihrem Programmtag nach deiner ersten Minute.','Trang này mở vào ngày tương ứng sau phút tập đầu.')}</p>}</div>
          </details></li>
        })}</ol>}
      </details>
    })}
    <p className="story-kind-note">{L('Deine Insel bleibt. Eine Pause löscht keine Entdeckung. Die Geschichte bewertet weder deine Gesundheit noch deine Leistung.','Hòn đảo vẫn ở đây. Nghỉ một ngày không mất thành quả. Câu chuyện không đánh giá sức khỏe hay năng lực của bạn.')}</p>
    <Link to="/" className="game-primary text-center">{L('Zur heutigen Minute','Về phút tập hôm nay')}</Link>
  </div>
}
