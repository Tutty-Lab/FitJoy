// "My Balance Check" (Der Gleichgewichts-Code, Michaela von der Nahmer).
// Done barefoot on day 1 and again after the 22 days, then compared.

export type Task = { id: string; title: string; detail: string; unit: string }

export const tasks: Task[] = [
  { id: 'parallel', title: 'Parallel stance', detail: '30 sec · feet close together, touching', unit: 'sec' },
  { id: 'parallel-eyes', title: 'Eyes closed · Parallel stance', detail: '30 sec · feet close together, touching', unit: 'sec' },
  { id: 'tandem', title: 'Tandem stance', detail: '30 sec · feet in one line, toes touching heel', unit: 'sec' },
  { id: 'tandem-eyes', title: 'Eyes closed · Tandem stance', detail: '30 sec · feet in one line, toes touching heel', unit: 'sec' },
  { id: 'flamingo-light-r', title: 'Flamingo light, right', detail: '30 sec · right foot rests on left foot', unit: 'sec' },
  { id: 'flamingo-light-l', title: 'Flamingo light, left', detail: '30 sec · left foot rests on right foot', unit: 'sec' },
  { id: 'flamingo-r', title: 'Flamingo one-leg stand, right', detail: '30 sec', unit: 'sec' },
  { id: 'flamingo-l', title: 'Flamingo one-leg stand, left', detail: '30 sec', unit: 'sec' },
  { id: 'steps-eyes', title: 'Eyes closed · Marching on the spot', detail: '50 steps on the spot while standing', unit: 'steps' },
  { id: 'mat-parallel', title: 'Parallel stance on a rolled mat', detail: '30 sec · feet close together, touching', unit: 'sec' },
  { id: 'mat-hip', title: 'Hip-width stance on a rolled mat', detail: '30 sec', unit: 'sec' },
  { id: 'cushion', title: 'Parallel stance on an air cushion', detail: '30 sec · feet close together, touching', unit: 'sec' },
  { id: 'tandem-fwd', title: 'Tandem walk forwards', detail: '3 m · feet touching in one line, slowly', unit: 'm' },
  { id: 'tandem-back', title: 'Tandem walk backwards', detail: '3 m · feet touching in one line, slowly', unit: 'm' },
  { id: 'toes-fwd', title: 'Tiptoe walk forwards', detail: '3 m · on tiptoes, slowly', unit: 'm' },
  { id: 'toes-back', title: 'Tiptoe walk backwards', detail: '3 m · on tiptoes, slowly', unit: 'm' },
  { id: 'dynamic', title: 'Dynamic walk', detail: 'Step slowly over 10 objects placed a step apart (e.g. small teddies)', unit: 'items' },
  { id: 'sit-stand', title: 'Sit-to-stand test', detail: '10× sit down on a chair slowly and stand up slowly', unit: 'reps' },
]

export const observations = ['Dizziness', 'Balancing with arms', 'Body sways', 'Holding on', 'Staring at the floor', 'Body stiff', 'Leaving the line', 'Stopped']

export const PROGRAM_DAYS = 22
