import { Button, buttonVariants } from '../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { baseExercise, baseVideo, bonusExercises, bonusFor, dayContent, excelDay, PROGRAM_DAYS, type ProgramDay } from '../../data/program'
import { getDayOverride, saveDay } from '../../services/catalog'
import { api } from '../../lib/api'

const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand'
type Form = Pick<ProgramDay, 'begruessung' | 'affirmation' | 'bonusImpuls'> & { bonusUebung: string }

function Label({ text, hint, children }: { text: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">{text}</span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

// /admin/workouts/0 = base exercise video (all days); /admin/workouts/1–90 = day texts and bonus.
export default function WorkoutEdit() {
  const day = Number(useParams().day)
  const isBase = day === 0
  const load = (): Form => { const c = dayContent(day || 1); return { begruessung: c.begruessung, affirmation: c.affirmation, bonusImpuls: c.bonusImpuls, bonusUebung: c.bonusUebung ?? '' } }
  const [f, setF] = useState<Form>(load)
  const [video, setVideo] = useState(baseVideo())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  useEffect(() => { setF(load()); setVideo(baseVideo()); setSaved(false); setError('') }, [day]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!Number.isInteger(day) || day < 0 || day > PROGRAM_DAYS) return <Navigate to="/admin/workouts" replace />

  const xl = excelDay(day || 1)
  const set = (k: keyof Form, v: string) => { setF({ ...f, [k]: v }); setSaved(false) }
  const blockStart = Math.floor((day - 1) / 3) * 3 + 1
  const effectiveBonus = bonusFor(day || 1)

  async function save() {
    setSaving(true)
    try {
      if (isBase) await saveDay(0, { ...getDayOverride(0), video: video === baseExercise.video ? undefined : video })
      else await saveDay(day, {
        begruessung: f.begruessung !== xl.begruessung ? f.begruessung : undefined,
        affirmation: f.affirmation !== xl.affirmation ? f.affirmation : undefined,
        bonusImpuls: f.bonusImpuls !== xl.bonusImpuls ? f.bonusImpuls : undefined,
        bonusUebung: f.bonusUebung !== (xl.bonusUebung ?? '') ? f.bonusUebung : undefined,
      })
      setSaved(true); setError('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed') } finally { setSaving(false) }
  }

  async function reset() {
    await saveDay(day, {})
    setF(load()); setVideo(baseVideo()); setSaved(true)
  }

  async function uploadVideo(file: File) {
    if (file.size > 100 * 1024 * 1024) return setError('Video must be smaller than 100 MB')
    setUploading(true); setError('')
    try {
      const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = () => reject(new Error('Could not read video')); r.readAsDataURL(file) })
      const result = await api<{ url: string }>('admin/video-upload', { method: 'POST', body: { day: 0, filename: file.name, contentType: file.type, data } })
      setVideo(result.url); setSaved(false)
    } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed') } finally { setUploading(false) }
  }

  const changed = (k: keyof Form) => f[k] !== ((xl[k as keyof ProgramDay] as string | null) ?? '')

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/workouts" className="text-sm font-semibold text-[#13707e]"><ArrowLeft aria-hidden="true" className="mr-2 inline size-4" />Program</Link>
          <h1 className="text-xl font-semibold tracking-tight">{isBase ? `Base exercise · ${baseExercise.title}` : `Day ${day} · ${xl.phase}`}</h1>
        </div>
        <div className="flex gap-2">
          {!isBase && day > 1 && <Link className={buttonVariants({ variant: 'outline' })} to={`/admin/workouts/${day - 1}`}>← Day {day - 1}</Link>}
          {!isBase && day < PROGRAM_DAYS && <Link className={buttonVariants({ variant: 'outline' })} to={`/admin/workouts/${day + 1}`}>Day {day + 1} →</Link>}
          <Button variant="outline" onClick={reset} disabled={saving}>Reset to Excel</Button>
          <Button disabled={saving || uploading} onClick={save}>{saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}</Button>
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-[#ba1a1a]">{error}</p>}

      {isBase ? (
        <section className="grid items-start gap-5 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">Instructions (same for all 90 days)</p>
            <ol className="list-decimal space-y-1 pl-5">{baseExercise.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            <p className="text-xs text-slate-500">Text is fixed by the customer brief; change it in src/data/program.ts.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">Video (used on every day)</span>
            <label className="relative flex h-10 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-3 text-sm font-semibold text-[#13707e] hover:bg-mint focus-within:ring-2 focus-within:ring-brand">
              {uploading ? 'Uploading...' : 'Replace video'}
              <input aria-label="Upload video" type="file" accept="video/mp4,video/webm,video/quicktime" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void uploadVideo(file); e.currentTarget.value = '' }} className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
            <video src={video} controls playsInline preload="metadata" className="mt-3 aspect-video w-full max-w-sm rounded-xl bg-black" />
          </div>
        </section>
      ) : (
        <section className="grid items-start gap-5 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Label text="Tägliche Begrüßung (Vestibu)" hint={changed('begruessung') && 'Overrides Excel'}><textarea rows={3} className={field} value={f.begruessung} onChange={e => set('begruessung', e.target.value)} /></Label>
            <p className="text-sm text-slate-500">Custom texts are displayed verbatim in both languages. Automatic translation is not applied.</p>
            <Label text="Deine Affirmation" hint={!f.affirmation ? 'Empty – the app shows a sample affirmation.' : changed('affirmation') && 'Overrides Excel'}><textarea rows={2} className={field} value={f.affirmation} onChange={e => set('affirmation', e.target.value)} /></Label>
            <Label text="Bonus-Minuten Impuls" hint={changed('bonusImpuls') && 'Overrides Excel'}><input className={field} value={f.bonusImpuls} onChange={e => set('bonusImpuls', e.target.value)} /></Label>
          </div>
          <div className="flex flex-col gap-4">
            <Label text={`Bonus exercise · block days ${blockStart}–${blockStart + 2}`} hint={day === blockStart ? 'The first valid pick in this block applies to all three days.' : <Link to={`/admin/workouts/${blockStart}`} className="underline">Edit the bonus on day {blockStart} for all three days.</Link>}>
              <select className={field} disabled={day !== blockStart} value={day === blockStart ? f.bonusUebung : effectiveBonus?.id ?? ''} onChange={e => set('bonusUebung', e.target.value)}>
                <option value="">— Not chosen (use block pick / placeholder) —</option>
                {(['Gleichgewicht', 'Wahrnehmung', 'Entspannung', 'Bewegung'] as const).map(k => (
                  <optgroup key={k} label={k}>{bonusExercises.filter(b => b.kategorie === k).map(b => <option key={b.id} value={b.id}>{b.titel}{b.nr !== 'ohne Nummer' ? ` (#${b.nr})` : ''}</option>)}</optgroup>
                ))}
              </select>
            </Label>
            {(() => { const b = bonusExercises.find(x => x.id === f.bonusUebung) ?? effectiveBonus; return b && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold">{b.titel} <span className="ml-1 rounded-full bg-mint px-2 py-0.5 text-xs text-brand-deep">{b.kategorie}</span></p>
                {!f.bonusUebung && <p className="mt-1 text-xs text-amber-700">Currently shown to users (not chosen for this day).</p>}
                <p className="mt-2 text-slate-600">{b.anleitung}</p>
              </div>) })()}
          </div>
        </section>
      )}
    </div>
  )
}
