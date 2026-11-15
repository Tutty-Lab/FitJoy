import { lang } from '../lib/i18n'
// "My Balance Check" (Der Gleichgewichts-Code, Michaela von der Nahmer).
// Done barefoot on day 1 and again on day 90, then compared.

export type TaskGroup = 'Stehen' | 'Gehen' | 'Sitzen'
export type Task = { id: string; title: string; detail: string; unit: string }

export const tasks: Task[] = [
  { id: 'parallel', title: 'Parallelstand', detail: '30 Sekunden · Füße eng nebeneinander', unit: 'Sek.' },
  { id: 'parallel-eyes', title: 'Augen geschlossen · Parallelstand', detail: '30 Sekunden · Füße eng nebeneinander', unit: 'Sek.' },
  { id: 'tandem', title: 'Tandemstand', detail: '30 Sekunden · Füße auf einer Linie, Zehen an der Ferse', unit: 'Sek.' },
  { id: 'tandem-eyes', title: 'Augen geschlossen · Tandemstand', detail: '30 Sekunden · Füße auf einer Linie, Zehen an der Ferse', unit: 'Sek.' },
  { id: 'flamingo-light-r', title: 'Flamingo leicht, rechts', detail: '30 Sekunden · Rechter Fuß ruht auf linkem Fuß', unit: 'Sek.' },
  { id: 'flamingo-light-l', title: 'Flamingo leicht, links', detail: '30 Sekunden · Linker Fuß ruht auf rechtem Fuß', unit: 'Sek.' },
  { id: 'flamingo-r', title: 'Einbeinstand, rechts', detail: '30 Sekunden', unit: 'Sek.' },
  { id: 'flamingo-l', title: 'Einbeinstand, links', detail: '30 Sekunden', unit: 'Sek.' },
  { id: 'steps-eyes', title: 'Augen geschlossen · Auf der Stelle gehen', detail: '50 Schritte auf der Stelle', unit: 'Schritte' },
  { id: 'mat-parallel', title: 'Parallelstand auf gerollter Matte', detail: '30 Sekunden · Füße eng nebeneinander', unit: 'Sek.' },
  { id: 'mat-hip', title: 'Hüftbreiter Stand auf gerollter Matte', detail: '30 Sekunden', unit: 'Sek.' },
  { id: 'cushion', title: 'Parallelstand auf Luftkissen', detail: '30 Sekunden · Füße eng nebeneinander', unit: 'Sek.' },
  { id: 'tandem-fwd', title: 'Tandemgang vorwärts', detail: '3 m · Langsam auf einer Linie gehen', unit: 'm' },
  { id: 'tandem-back', title: 'Tandemgang rückwärts', detail: '3 m · Langsam auf einer Linie gehen', unit: 'm' },
  { id: 'toes-fwd', title: 'Zehenspitzengang vorwärts', detail: '3 m · Langsam auf Zehenspitzen', unit: 'm' },
  { id: 'toes-back', title: 'Zehenspitzengang rückwärts', detail: '3 m · Langsam auf Zehenspitzen', unit: 'm' },
  { id: 'dynamic', title: 'Über Hindernisse gehen', detail: 'Langsam über 10 Gegenstände steigen', unit: 'Gegenstände' },
  { id: 'sit-stand', title: 'Aufstehen und Hinsetzen', detail: '10-mal langsam hinsetzen und aufstehen', unit: 'Mal' },
]

// PDF form: Schwindel, Ausgleich durch Arme, Körper schwankt, Festhalten, Boden fixieren, Körper steif, Linie verlassen, Abbruch.
export const observations = ['Schwindel', 'Ausgleich durch Arme', 'Körper schwankt', 'Festhalten', 'Boden fixieren', 'Körper steif', 'Linie verlassen', 'Abbruch']

// Tasks 1–12 Stehen, 13–17 Gehen, 18 Sitzen.
export const groupOf = (index: number): TaskGroup => (index < 12 ? 'Stehen' : index < 17 ? 'Gehen' : 'Sitzen')
export const groups: TaskGroup[] = ['Stehen', 'Gehen', 'Sitzen']

export { PROGRAM_DAYS } from './program'

// Vietnamese display texts. Stored values (ids, observation strings, group keys) stay German.
const viTasks: Record<string, [string, string, string]> = {
  parallel: ['Đứng chụm chân', '30 giây · Hai bàn chân sát nhau', 'giây'],
  'parallel-eyes': ['Nhắm mắt · Đứng chụm chân', '30 giây · Hai bàn chân sát nhau', 'giây'],
  tandem: ['Đứng nối gót', '30 giây · Hai bàn chân trên một đường, mũi chân chạm gót', 'giây'],
  'tandem-eyes': ['Nhắm mắt · Đứng nối gót', '30 giây · Hai bàn chân trên một đường, mũi chân chạm gót', 'giây'],
  'flamingo-light-r': ['Hạc nhẹ, bên phải', '30 giây · Bàn chân phải đặt lên bàn chân trái', 'giây'],
  'flamingo-light-l': ['Hạc nhẹ, bên trái', '30 giây · Bàn chân trái đặt lên bàn chân phải', 'giây'],
  'flamingo-r': ['Đứng một chân, bên phải', '30 giây', 'giây'],
  'flamingo-l': ['Đứng một chân, bên trái', '30 giây', 'giây'],
  'steps-eyes': ['Nhắm mắt · Bước tại chỗ', '50 bước tại chỗ', 'bước'],
  'mat-parallel': ['Đứng chụm chân trên thảm cuộn', '30 giây · Hai bàn chân sát nhau', 'giây'],
  'mat-hip': ['Đứng rộng bằng hông trên thảm cuộn', '30 giây', 'giây'],
  cushion: ['Đứng chụm chân trên đệm hơi', '30 giây · Hai bàn chân sát nhau', 'giây'],
  'tandem-fwd': ['Đi nối gót tiến', '3 m · Đi chậm trên một đường thẳng', 'm'],
  'tandem-back': ['Đi nối gót lùi', '3 m · Đi chậm trên một đường thẳng', 'm'],
  'toes-fwd': ['Đi kiễng chân tiến', '3 m · Đi chậm trên mũi chân', 'm'],
  'toes-back': ['Đi kiễng chân lùi', '3 m · Đi chậm trên mũi chân', 'm'],
  dynamic: ['Bước qua chướng ngại vật', 'Bước chậm qua 10 đồ vật', 'đồ vật'],
  'sit-stand': ['Đứng lên và ngồi xuống', 'Ngồi xuống và đứng lên chậm 10 lần', 'lần'],
}
const viObs: Record<string, string> = { Schwindel: 'Chóng mặt', 'Ausgleich durch Arme': 'Dùng tay giữ thăng bằng', 'Körper schwankt': 'Người lắc lư', Festhalten: 'Phải vịn', 'Boden fixieren': 'Nhìn chằm xuống sàn', 'Körper steif': 'Người cứng đờ', 'Linie verlassen': 'Lệch khỏi đường', Abbruch: 'Phải dừng' }
const viGroup: Record<TaskGroup, string> = { Stehen: 'Đứng', Gehen: 'Đi', Sitzen: 'Ngồi' }
export const taskText = (t: Task) => (lang === 'vi' && viTasks[t.id] ? { title: viTasks[t.id][0], detail: viTasks[t.id][1], unit: viTasks[t.id][2] } : t)
export const obsLabel = (o: string) => (lang === 'vi' ? viObs[o] ?? o : o)
export const groupLabel = (g: TaskGroup) => (lang === 'vi' ? viGroup[g] : g)
