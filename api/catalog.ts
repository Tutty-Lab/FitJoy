import { body, readSession, route, sql } from './_lib.js'

// GET is public (the app needs the catalog before sign-in); writes are admin-only.
export default route({
  async GET() {
    const rows = await sql`select day, data from workout_overrides`
    return Object.fromEntries(rows.map(r => [r.day, r.data]))
  },
  async PUT(req, res) {
    const s = readSession(req)
    if (s?.role !== 'admin') return res.status(403).json({ error: 'Admins only' })
    const { day, data } = body<{ day: number; data: object }>(req)
    if (!Number.isInteger(day) || day < 1 || day > 22) return res.status(400).json({ error: 'Invalid day' })
    await sql`insert into workout_overrides (day, data, updated_by) values (${day}, ${JSON.stringify(data)}::jsonb, ${s.sub})
      on conflict (day) do update set data = excluded.data, updated_at = now(), updated_by = excluded.updated_by`
  },
  async DELETE(req, res) {
    const s = readSession(req)
    if (s?.role !== 'admin') return res.status(403).json({ error: 'Admins only' })
    await sql`delete from workout_overrides where day = ${Number(req.query.day)}`
  },
})
