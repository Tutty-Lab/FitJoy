import { body, route, sql } from './_lib'

// The signed-in user's profile and progress.
export default route(
  {
    async GET(_req, res, s) {
      const [user] = await sql`select email, name, role, data from users where id = ${s!.sub}`
      if (!user) return res.status(404).json({ error: 'Account not found' })
      const completed = await sql`select day from completions where user_id = ${s!.sub} order by day`
      const dates = await sql`select to_char(date, 'YYYY-MM-DD') as date from activity_days where user_id = ${s!.sub}`
      return { user, completed: completed.map(r => r.day), dates: dates.map(r => r.date) }
    },
    async PUT(req, _res, s) {
      const { name, data } = body<{ name: string; data: object }>(req)
      await sql`update users set name = ${name ?? ''}, data = ${JSON.stringify(data ?? {})}::jsonb, updated_at = now() where id = ${s!.sub}`
    },
  },
  { auth: 'user' },
)
