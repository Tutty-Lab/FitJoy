import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { computeStats } from '../../services/adminApi'
import { useMembers } from '../useMembers'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return <Card size="sm" className="bg-white"><CardContent>
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
  </CardContent></Card>
}

function FunnelChart({ data }: { data: { day: number; members: number }[] }) {
  return <Card className="bg-white">
    <CardHeader><CardTitle>Program participation</CardTitle></CardHeader>
    <CardContent>
      <ChartContainer config={{ members: { label: 'Members', color: '#1a8a99' } }} className="h-[220px] w-full">
        <AreaChart accessibilityLayer data={data} margin={{ left: -20, right: 12, top: 12 }}>
          <defs><linearGradient id="participationFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-members)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--color-members)" stopOpacity={0.03}/></linearGradient></defs>
          <CartesianGrid vertical={false}/>
          <XAxis dataKey="day" tickLine={false} axisLine={false} ticks={[1, 5, 10, 15, 22]} tickFormatter={v => `Day ${v}`} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false}/>
          <ChartTooltip content={<ChartTooltipContent labelFormatter={v => `Day ${v}`} />} />
          <Area type="monotone" dataKey="members" stroke="var(--color-members)" fill="url(#participationFill)" strokeWidth={2}/>
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
}

export default function Dashboard() {
  const { members, error } = useMembers()
  const stats = useMemo(() => computeStats(members ?? []), [members])
  const recent = useMemo(() => [...(members ?? [])].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 6), [members])
  if (error) return <p role="alert" className="text-[#ba1a1a]">{error}</p>
  if (!members) return <p role="status" className="text-[#6f7472]">Loading…</p>
  const pct = (n: number) => Math.round((n / stats.pctBase) * 100)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-3"><h1 className="text-xl font-semibold tracking-tight">Dashboard</h1></div>

      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Members" value={stats.total} />
        <Stat label="Active 7 days" value={stats.active7} sub={`${pct(stats.active7)}% of members`} />
        <Stat label="Base-exercise sessions" value={stats.sessions} />
        <Stat label="Finished 90 days" value={stats.finishers} sub={`${pct(stats.finishers)}% completion`} />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.2fr_1fr]">
        <FunnelChart data={stats.funnel} />
        <Card className="bg-white">
          <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>Newest members</CardTitle><Link to="/admin/users" className="text-xs font-medium text-brand-deep hover:underline">View all</Link></div></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>Member</TableHead><TableHead className="text-right">Days</TableHead><TableHead className="text-right">Joined</TableHead></TableRow></TableHeader>
              <TableBody>{recent.map(m => <TableRow key={m.id}><TableCell className="max-w-40"><p className="truncate font-medium">{m.name || '—'}</p>{m.email && <p className="truncate text-xs text-slate-500">{m.email}</p>}</TableCell><TableCell className="text-right"><Badge variant="outline">{m.completed}/90</Badge></TableCell><TableCell className="text-right text-xs text-slate-500">{m.joined}</TableCell></TableRow>)}
              {!recent.length && <TableRow><TableCell colSpan={3} className="py-8 text-center text-slate-500">No members yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
