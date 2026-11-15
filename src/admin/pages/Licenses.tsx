import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import Organizations from './Organizations'
import { Button } from '../../components/ui/button'
import { api } from '../../lib/api'

export default function Licenses() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  async function create(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      await api('admin/licenses', { method: 'POST', body: { name } })
      setName(''); setOpen(false); setRevision(n => n + 1)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create organization. Try again.') }
    finally { setBusy(false) }
  }
  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1>Organizations & invitations</h1>
      <Button variant="outline" aria-expanded={open} onClick={() => setOpen(!open)} disabled={busy}><Plus aria-hidden="true" />New organization</Button>
    </div>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {open && <form onSubmit={create} className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <label className="grid min-w-0 flex-1 gap-1.5 text-sm font-medium">Organization name<input autoFocus required maxLength={120} value={name} onChange={e => setName(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3" /></label>
      <Button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create organization'}</Button>
      <Button type="button" variant="outline" disabled={busy} onClick={() => { setOpen(false); setError('') }}>Cancel</Button>
    </form>}
    <Organizations key={revision} embedded />
  </div>
}
