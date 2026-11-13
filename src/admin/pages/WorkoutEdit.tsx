import { useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { Category, Step, Workout } from '../../data/workouts'
import { getWorkout, isEdited, resetWorkout, saveWorkout } from '../../services/catalog'
import { api } from '../../lib/api'

const categories: Category[] = ['Warm-up', 'Core & Cardio', 'Fat Burn', 'Recovery']
const intensities: Workout['intensity'][] = ['Gentle', 'Moderate', 'Intense']
const field = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand'

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold tracking-[0.48px] text-[#6f7472] uppercase">{text}</span>
      {children}
    </label>
  )
}

export default function WorkoutEdit() {
  const navigate = useNavigate()
  const day = Number(useParams().day)
  const lesson = new URLSearchParams(window.location.search).get('lesson') ?? '1'
  const original = getWorkout(day)
  const [w, setW] = useState<Workout | undefined>(original)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)
  if (!w || !original) return <Navigate to="/admin/workouts" replace />

  const set = <K extends keyof Workout>(k: K, v: Workout[K]) => {
    setW({ ...w, [k]: v })
    setSaved(false)
  }
  const setStep = (i: number, patch: Partial<Step>) => set('steps', w.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  async function save() {
    const { day: _day, ...patch } = w!
    try {
      await saveWorkout(day, patch)
      setSaved(true)
      setSaveError('')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function uploadVideo(file: File) {
    if (file.size > 100 * 1024 * 1024) return setSaveError('Video must be smaller than 100 MB')
    setUploading(true); setSaveError('')
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read video')); reader.readAsDataURL(file) })
      const result = await api<{ url: string }>('admin/video-upload', { method: 'POST', body: { day, filename: file.name, contentType: file.type, data } })
      set('video', result.url)
    } catch (e) { setSaveError(e instanceof Error ? e.message : 'Upload failed') } finally { setUploading(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/workouts" className="text-sm font-semibold text-[#13707e]">← Workouts</Link>
          <h1 className="text-2xl font-black">Day {day} · Lesson {lesson}: {w.title}</h1>
        </div>
        <div className="flex gap-2">
          {isEdited(day) && (
            <button
              onClick={async () => {
                await resetWorkout(day)
                navigate(0)
              }}
              className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[#3f4a4b]"
            >
              Reset to default
            </button>
          )}
          <button onClick={save} className="h-10 rounded-full bg-brand px-5 text-sm font-bold text-white">{saved ? 'Saved ✓' : 'Save changes'}</button>
        </div>
      </div>
      {saveError && <p role="alert" className="text-sm text-[#ba1a1a]">{saveError}</p>}

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <Label text="Title"><input className={field} value={w.title} onChange={e => set('title', e.target.value)} /></Label>
        <Label text="Category">
          <select className={field} value={w.category} onChange={e => set('category', e.target.value as Category)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </Label>
        <Label text="Minutes"><input type="number" min={1} className={field} value={w.mins} onChange={e => set('mins', Number(e.target.value))} /></Label>
        <Label text="kcal (approx.)"><input type="number" min={0} className={field} value={w.kcal} onChange={e => set('kcal', Number(e.target.value))} /></Label>
        <Label text="Intensity">
          <select className={field} value={w.intensity} onChange={e => set('intensity', e.target.value as Workout['intensity'])}>
            {intensities.map(c => <option key={c}>{c}</option>)}
          </select>
        </Label>
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-[#13707e] hover:bg-mint">
            {uploading ? 'Uploading…' : 'Upload video to storage'}
            <input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void uploadVideo(file); e.currentTarget.value = '' }} className="sr-only" />
          </label>
          <p className="text-[11px] text-slate-500">MP4/WebM/QuickTime, max 100 MB. Save changes after upload.</p>
        </div>
        <div className="md:col-span-2">
          <Label text="Description">
            <textarea rows={3} className={`${field} h-auto py-2`} value={w.blurb} onChange={e => set('blurb', e.target.value)} />
          </Label>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Steps</h2>
          <button onClick={() => set('steps', [...w.steps, { name: 'New step', mins: 2, note: '' }])} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#13707e]">+ Add step</button>
        </div>
        {w.steps.map((s, i) => (
          <div key={i} className="grid items-end gap-2 md:grid-cols-[2rem_1fr_6rem_1fr_auto]">
            <span className="pb-2.5 text-sm font-bold text-[#6f7472]">{i + 1}</span>
            <Label text="Name"><input className={field} value={s.name} onChange={e => setStep(i, { name: e.target.value })} /></Label>
            <Label text="Mins"><input type="number" min={1} className={field} value={s.mins} onChange={e => setStep(i, { mins: Number(e.target.value) })} /></Label>
            <Label text="Note"><input className={field} value={s.note} onChange={e => setStep(i, { note: e.target.value })} /></Label>
            <button aria-label={`Remove step ${i + 1}`} onClick={() => set('steps', w.steps.filter((_, j) => j !== i))} className="h-10 rounded-xl px-3 text-sm font-semibold text-[#ba1a1a] hover:bg-slate-100">Remove</button>
          </div>
        ))}
      </section>

      {w.video && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="pb-3 text-base font-bold">Video preview</h2>
          <video src={w.video} controls playsInline preload="metadata" className="aspect-video w-full max-w-xl rounded-2xl bg-black" />
        </section>
      )}
    </div>
  )
}
