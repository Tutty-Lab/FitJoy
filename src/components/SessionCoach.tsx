import Vestibu, { type Mood } from './Vestibu'
import { L } from '../lib/i18n'

export type CoachMoment = 'ready' | 'guide' | 'practice' | 'pause' | 'done' | 'bonus'
// Replace null with a generated clip URL, e.g. /vestibu/session-2-ready.mp4.
export const sessionCoachClips: Record<number, Partial<Record<CoachMoment,string>>> = {1:{},2:{},3:{}}
export function coachCopy(session:number,moment:CoachMoment) {
  const n=Math.min(3,Math.max(1,session))-1
  const lines={
    ready:[L('Dein erster kleiner Schritt. Ich bin bei dir.','Lượt đầu rồi. Mình ở đây cùng bạn nhé.'),L('Willkommen zurück! Eine ruhige Minute nur für dich.','Mừng bạn quay lại! Một phút thong thả dành riêng cho bạn.'),L('Deine dritte Runde. Bleib bei deinem angenehmen Tempo.','Lượt thứ ba rồi. Cứ giữ nhịp dễ chịu của bạn nhé.')],
    guide:[L('Schau dir die Bewegung in Ruhe an. Ein stabiler Halt ist immer erlaubt.','Xem động tác thật thong thả. Bạn luôn có thể vịn chỗ chắc chắn.'),L('Eine kleine Erinnerung vor dem Start: nur so weit, wie es angenehm bleibt.','Nhắc nhỏ trước khi bắt đầu: chỉ tập trong mức còn dễ chịu nhé.'),L('Mach es dir sicher und bequem. Wir gehen die Bewegung noch einmal durch.','Chọn chỗ an toàn, thoải mái. Mình cùng xem lại động tác nhé.')],
    practice:[L('Ganz ruhig. Du musst nichts erzwingen.','Thật thong thả. Không cần cố quá sức đâu.'),L('Schön, dass du dir wieder Zeit nimmst.','Thật vui vì bạn lại dành thời gian cho mình.'),L('Dein Tempo zählt. Jeder ruhige Moment darf sein.','Nhịp của bạn là điều quan trọng. Cứ thong thả nhé.')],
    pause:[L('Eine Pause ist in Ordnung. Weiter erst, wenn du bereit bist.','Nghỉ một chút cũng được. Sẵn sàng rồi mình tập tiếp.'),L('Du darfst durchatmen. Deine fertigen Minuten bleiben.','Cứ nghỉ nhé. Những phút đã xong vẫn được giữ.'),L('Kein Druck. Setz dich hin, wenn du eine Pause brauchst.','Không áp lực đâu. Hãy ngồi xuống nếu bạn cần nghỉ.')],
    done:[L('Gut gemacht! Du hast dir deine erste Minute geschenkt.','Giỏi lắm! Bạn vừa dành cho mình phút đầu tiên.'),L('Deine zweite Minute ist geschafft. Danke fürs Wiederkommen!','Xong phút thứ hai rồi. Cảm ơn bạn đã quay lại!'),L('Drei Minuten geschafft. Jetzt darfst du zufrieden ausruhen.','Bạn đã xong ba phút. Giờ yên tâm nghỉ ngơi nhé.')],
    bonus:[L('Noch Lust auf eine freiwillige Minute? Eine Pause ist genauso in Ordnung.','Bạn muốn thêm một phút tùy chọn không? Nghỉ ngơi cũng hoàn toàn ổn.'),L('Ein Extra nur, wenn es sich gut anfühlt.','Chỉ tập thêm nếu bạn thấy dễ chịu nhé.'),L('Dein Tagesplan ist geschafft. Das Extra bleibt freiwillig.','Lộ trình hôm nay đã xong. Phần thêm hoàn toàn tùy chọn.')],
  }
  return lines[moment][n]
}
// Each session uses a different mood for the same moment, so the three daily rounds don't replay the same clip.
const MOODS: Record<CoachMoment, [Mood, Mood, Mood]> = {
  ready: ['wave', 'idle', 'wave'],
  guide: ['think', 'idle', 'think'],
  practice: ['encourage', 'idle', 'encourage'],
  pause: ['rest', 'think', 'rest'],
  done: ['celebrate', 'celebrate', 'celebrate'],
  bonus: ['encourage', 'idle', 'encourage'],
}
export default function SessionCoach({session,moment,text,compact=false,cheer=false}:{session:number;moment:CoachMoment;text?:string;compact?:boolean;cheer?:boolean}) {
  const clip=sessionCoachClips[session]?.[moment]
  const mood:Mood=(MOODS[moment]?.[Math.min(2,Math.max(0,session-1))]) ?? 'idle'
  return <div className={`flex ${compact?'items-center':'flex-col items-center'} gap-3`} data-coach-moment={moment} data-coach-session={session}>
    {clip?<video src={clip} autoPlay muted playsInline loop className={compact?'w-16':'w-32'} onError={e=>{e.currentTarget.hidden=true}}/>:<Vestibu mood={mood} className={compact?'w-16 shrink-0':'w-32'}/>}
    <p className={`game-speech font-bold leading-6 ${cheer?'cheer':''} ${compact?'':'speech-block'}`} role="status">{text??coachCopy(session,moment)}</p>
  </div>
}
