import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { api } from '../lib/api'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type Invitation = { id: string; redeem_before: string; redeemed_at: string | null; revoked_at: string | null; name: string | null; login: string | null }
type Detail = { batch: { id: string; organization: string; seats: number; created_at: string; valid_until: string }; invitations: Invitation[] }
const date = (value: string) => new Date(value).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
export default function LicenseBatchDetails({ id, inline = false, onChanged }: { id: string; inline?: boolean; onChanged?: () => void }) {
  const [open, setOpen] = useState(inline)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function load() {
    setLoading(true); setError('')
    try { setDetail(await api<Detail>('admin/licenses?batchId=' + encodeURIComponent(id))) }
    catch(e) { setDetail(null); setError(e instanceof Error ? e.message : 'Could not load batch') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (inline) void load() }, [id, inline])
  async function toggle() { if(open) { setOpen(false); return }; setOpen(true); await load() }
  async function revoke(invitationId: string) {
    if (!window.confirm('Revoke this unused invitation?')) return
    setLoading(true); setError('')
    try { await api('admin/licenses?invitationId=' + invitationId, { method: 'DELETE' }); await load(); onChanged?.() }
    catch(e) { setError(e instanceof Error ? e.message : 'Could not revoke invitation') }
    finally { setLoading(false) }
  }
  return <div className="w-full">
    {!inline && <Button variant="outline" size="sm" aria-expanded={open} onClick={toggle}>Batch details<ChevronDown className={`size-4 ${open ? 'rotate-180' : ''}`} /></Button>}
    {open && <div className="space-y-3">
      {loading && <p role="status">Loading…</p>}{error && <p role="alert" className="text-red-600">{error}</p>}
      {!loading && detail && <>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Reference</TableHead><TableHead>Status</TableHead><TableHead>Redeemed by</TableHead><TableHead>Redeemed at</TableHead><TableHead>Valid until</TableHead><TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow></TableHeader>
          <TableBody>{detail.invitations.map(i => <TableRow key={i.id}>
            <TableCell className="font-mono text-xs" title={`Invitation reference: ${i.id}`}><span className="select-all">{i.id.slice(0, 8).toUpperCase()}</span></TableCell>
            <TableCell><Badge variant="outline" className={state(i) === 'Available' ? 'border-teal-200 bg-teal-50 text-teal-800' : state(i) === 'Redeemed' ? 'border-slate-200 bg-slate-100 text-slate-700' : 'text-slate-500'}>{state(i)}</Badge></TableCell>
            <TableCell className="text-sm">{i.redeemed_at ? i.name || 'Account unavailable' : 'Not redeemed'}</TableCell>
            <TableCell className="whitespace-nowrap text-xs">{i.redeemed_at ? date(i.redeemed_at) : '—'}</TableCell>
            <TableCell className="whitespace-nowrap text-xs">{new Date(i.redeem_before).toLocaleDateString()}</TableCell>
            <TableCell>{state(i) === 'Available' && <Button variant="outline" size="sm" disabled={loading} aria-label={`Revoke invitation ${i.id.slice(0, 8)}`} onClick={() => void revoke(i.id)}>Revoke</Button>}</TableCell>
          </TableRow>)}</TableBody>
        </Table>
        {!detail.invitations.length && <p className="py-4 text-center text-sm text-slate-500">No codes issued.</p>}

      </>}
    </div>}
  </div>
}
function state(i: Invitation) {
  if (i.revoked_at) return 'Revoked'
  if (i.redeemed_at) return 'Redeemed'
  return new Date(i.redeem_before).getTime() <= Date.now() ? 'Expired' : 'Available'
}
