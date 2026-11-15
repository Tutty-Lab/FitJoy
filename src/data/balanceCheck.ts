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
