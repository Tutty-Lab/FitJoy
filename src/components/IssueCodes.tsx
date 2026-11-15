import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { Button } from './ui/button'

export default function IssueCodes({ organizationId, onIssued }: { organizationId: string; onIssued: () => void }) {
  const [open, setOpen] = useState(false)
  const [seats, setSeats] = useState(10)
  const [expiry, setExpiry] = useState('')
  const [codes, setCodes] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function issue(e: FormEvent) {
    e.preventDefault()
    if (codes.length && !window.confirm('Download the current codes before replacing this list. Continue?')) return
    setBusy(true); setError('')
    try {
      const result = await api<{ codes: string[] }>('admin/licenses', { method: 'POST', body: { organizationId, seats, validUntil: new Date(expiry + 'T23:59:59').toISOString() } })
      setCodes(result.codes); onIssued()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create codes') }
    finally { setBusy(false) }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(['code\n' + codes.join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = 'invitation-codes.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="space-y-3">
    <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Invitations</h2><Button variant="outline" onClick={() => setOpen(!open)} aria-expanded={open}>Add codes</Button></div>
    {open && <form onSubmit={issue} className="flex flex-wrap items-end gap-3 rounded-xl border p-3">
      <label className="grid gap-1 text-sm">Quantity<input type="number" min={1} max={1000} required value={seats} onChange={e => setSeats(Number(e.target.value))} className="h-10 w-24 rounded-md border px-3" /></label>
      <label className="grid gap-1 text-sm">Expires<input type="date" required value={expiry} onChange={e => setExpiry(e.target.value)} className="h-10 rounded-md border px-3" /></label>
      <Button disabled={busy}>{busy ? 'Creating…' : 'Generate codes'}</Button>
    </form>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {codes.length > 0 && <div className="space-y-2 rounded-xl border p-3">
      <p className="text-sm">Save these codes now. Each code works once; codes cannot be retrieved later.</p>
      <textarea aria-label="New redeem codes" readOnly value={codes.join('\n')} className="h-32 w-full rounded-md border p-2 font-mono text-xs" />
      <div className="flex gap-2"><Button variant="outline" onClick={download}>Download CSV</Button><Button variant="outline" onClick={() => { void navigator.clipboard.writeText(codes.join('\n')).catch(() => setError('Copy failed. Select the codes above.')) }}>Copy codes</Button></div>
    </div>}
  </div>
}
