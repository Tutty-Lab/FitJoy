import { chapterFor } from './storyChapters'
import { storyScenes } from './storyScenes'
export { chapterFor, storyChapters } from './storyChapters'
import { storyMid } from './storyMid'
import { storyEnd } from './storyEnd'
export type Copy = { de: string; vi: string }
export type Region = { id: 'harbor' | 'forest' | 'lighthouse'; start: number; end: number; name: Copy; mission: Copy }
export const regions: Region[] = [
  { id:'harbor', start:1, end:30, name:{de:'Der leise Hafen',vi:'Bến cảng bình yên'}, mission:{de:'Wir bringen Licht in den Hafen. Ein kleiner Schritt nach dem anderen.',vi:'Mình cùng thắp sáng bến cảng, từng bước nhỏ một.'} },
  { id:'forest', start:31, end:60, name:{de:'Der Wald der Sinne',vi:'Khu rừng giác quan'}, mission:{de:'Wir entdecken die Wege des Waldes – aufmerksam und ohne Eile.',vi:'Mình khám phá lối đi trong rừng, chú tâm và không vội vã.'} },
  { id:'lighthouse', start:61, end:90, name:{de:'Das Licht am Horizont',vi:'Ngọn hải đăng chân trời'}, mission:{de:'Wir verbinden die Insel mit ihrem Leuchtturm. In deinem Tempo.',vi:'Mình nối hòn đảo với hải đăng. Theo nhịp của bạn.'} },
]
export type Episode = { day: number; title: Copy; before: Copy; after: Copy; reward: Copy }
export const firstWeek: Episode[] = [
  {day:1,title:{de:'Ein Licht im Nebel',vi:'Đốm sáng trong sương'},before:{de:'Hallo, ich bin Vestibu! Der Nebel verdeckt unseren Hafen. Deine erste Minute bringt eine kleine Laterne zum Leuchten.',vi:'Mình là Vestibu! Sương đang phủ kín bến cảng. Phút tập đầu tiên sẽ thắp một chiếc đèn nhỏ.'},after:{de:'Siehst du die Laterne? Unser erster Ankerpunkt ist da. Für heute hast du schon etwas geschafft.',vi:'Bạn thấy chiếc đèn chưa? Điểm tựa đầu tiên đã xuất hiện. Hôm nay bạn đã làm được một điều rồi.'},reward:{de:'Die Hafenlaterne',vi:'Đèn bến cảng'}},
  {day:2,title:{de:'Ein sicherer Anker',vi:'Chiếc neo vững vàng'},before:{de:'Heute finden wir einen Anker für unser Boot. Such dir zuerst einen sicheren Halt für deine Übung.',vi:'Hôm nay mình tìm neo cho chiếc thuyền. Trước khi tập, hãy chọn chỗ vịn chắc chắn nhé.'},after:{de:'Der Anker liegt bereit. Kleine, ruhige Schritte bringen uns weiter.',vi:'Neo đã sẵn sàng. Những bước nhỏ, bình tĩnh sẽ đưa mình đi tiếp.'},reward:{de:'Der kleine Anker',vi:'Chiếc neo nhỏ'}},
  {day:3,title:{de:'Der erste Steg',vi:'Cây cầu đầu tiên'},before:{de:'Zwischen Boot und Insel fehlt ein Steg. Heute legen wir ein neues Brett. Du musst nichts überstürzen.',vi:'Giữa thuyền và đảo còn thiếu một cây cầu. Hôm nay mình đặt thêm tấm ván. Không cần vội đâu.'},after:{de:'Unser Steg wächst. Jede Übung ist ein neues Brett auf unserem Weg.',vi:'Cây cầu đang dài ra. Mỗi buổi tập là thêm một tấm ván trên hành trình.'},reward:{de:'Ein Stück Steg',vi:'Một nhịp cầu'}},
  {day:4,title:{de:'Ein freundlicher Wind',vi:'Cơn gió thân thiện'},before:{de:'Hörst du den Wind? Wir hängen ein Windspiel auf. Achte heute darauf, wie du dich bei der Übung fühlst.',vi:'Bạn nghe tiếng gió không? Mình treo một chiếc chuông gió. Hôm nay hãy để ý cảm giác của bạn khi tập nhé.'},after:{de:'Das Windspiel klingt. Dein Tempo darf jeden Tag anders sein.',vi:'Chuông gió đã reo. Nhịp của bạn có thể khác nhau mỗi ngày.'},reward:{de:'Das Windspiel',vi:'Chiếc chuông gió'}},
  {day:5,title:{de:'Post von der Insel',vi:'Bưu thiếp từ hòn đảo'},before:{de:'Eine leere Postkarte wartet auf uns. Nach deiner Minute schreiben wir unseren ersten Gruß von der Insel.',vi:'Có một tấm bưu thiếp đang đợi. Sau phút tập, mình sẽ gửi lời chào đầu tiên từ đảo.'},after:{de:'Unsere erste Inselpost ist fertig: Schön, dass du dir Zeit für dich nimmst.',vi:'Bưu thiếp đầu tiên đã xong: Thật vui vì bạn dành thời gian cho bản thân.'},reward:{de:'Die erste Inselpost',vi:'Bưu thiếp đầu tiên'}},
  {day:6,title:{de:'Ein Platz zum Ausruhen',vi:'Một chỗ nghỉ chân'},before:{de:'Auch Entdecker brauchen Pausen. Wir bauen eine Bank am Wasser. Übe nur so weit, wie es angenehm bleibt.',vi:'Người khám phá cũng cần nghỉ. Mình đặt một chiếc ghế bên bờ nước. Chỉ tập trong mức bạn thấy dễ chịu nhé.'},after:{de:'Die Bank ist da. Eine Pause nimmt dir nichts von dem, was du schon aufgebaut hast.',vi:'Ghế nghỉ đã có rồi. Nghỉ ngơi không lấy đi những gì bạn đã xây dựng.'},reward:{de:'Die Hafenbank',vi:'Ghế nghỉ bên bến'}},
  {day:7,title:{de:'Unser Hafen erwacht',vi:'Bến cảng thức giấc'},before:{de:'Sieben kleine Schritte liegen auf unserem Weg. Heute setzen wir die Hafenflagge. Danke, dass du mit mir unterwegs bist.',vi:'Bảy bước nhỏ đang chờ trên hành trình. Hôm nay mình dựng cờ bến cảng. Cảm ơn bạn đã đồng hành cùng mình.'},after:{de:'Die Flagge weht! Unser Hafen hat eine Geschichte bekommen – deine. Wir gehen weiter, wann du bereit bist.',vi:'Cờ đã bay! Bến cảng đã có câu chuyện của riêng bạn. Mình đi tiếp khi bạn sẵn sàng nhé.'},reward:{de:'Die Hafenflagge',vi:'Lá cờ bến cảng'}},
]

export function regionFor(day: number): Region {
  return regions.find(region => day >= region.start && day <= region.end) ?? regions[0]
}
export function episodeFor(day: number): Episode {
  const first = firstWeek.find(episode => episode.day === day)
  if (first) return first
  const chapter = chapterFor(day)
  const index = Math.min(9, Math.max(0, (Math.floor(day) - 1) % 10 || 0))
  const reward = chapter.discoveries[index]
  const next = chapter.discoveries[index + 1]
  const before = storyScenes[day] ?? (index === 0 ? chapter.opening : {
    de:`${chapter.title.de}: Heute entdecken wir „${reward.de}“. Nach deiner ersten Minute geht die Geschichte weiter.`,
    vi:`${chapter.title.vi}: hôm nay mình khám phá “${reward.vi}”. Sau phút tập đầu, câu chuyện sẽ tiếp tục.`,
  })
  return {day,title:reward,before,after:index===9 ? chapter.ending : {
    de:`„${reward.de}“ gehört jetzt zu unserer Inselgeschichte. Als Nächstes wartet „${next.de}“. Für heute darfst du zufrieden sein.`,
    vi:`“${reward.vi}” đã trở thành một phần câu chuyện trên đảo. Tiếp theo là “${next.vi}”. Hôm nay bạn có thể yên tâm nghỉ rồi.`,
  },reward}
}

// Story rewards follow existing unique completed days, never calendar streak or replay count.
export function restoredInRegion(completed: number[], region: Region) {
  return new Set(completed.filter(day => Number.isInteger(day) && day >= region.start && day <= region.end)).size
}
export function earnedEpisodes(completed: number[]) {
  return [...new Set(completed.filter(day=>Number.isInteger(day)&&day>=1&&day<=90))].sort((a,b)=>a-b).map(episodeFor)
}

// One story beat per session, so every practice moves the day's story on:
// 1 = the day's scene, 2 = Vestibu brings the discovery home, 3 = the day closes with what comes next.
export function storyBeat(day: number, session: number): Copy {
  const e = episodeFor(day)
  if (session <= 1) return e.before
  if (session === 2) return storyMid[day] ?? e.before
  return storyEnd[day] ?? e.after
}
