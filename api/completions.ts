import { body, route, sql } from './_lib'

export default route(
  {
    async POST(req, res, s) {
      const { day, date } = body<{ day: number; date: string }>(req)
      if (!Number.isInteger(day) || day < 1 || day > 22 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Invalid day or date' })
      await sql`insert into completions (user_id, day) values (${s!.sub}, ${day}) on conflict do nothing`
      await sql`insert into activity_days (user_id, date) values (${s!.sub}, ${date}) on conflict do nothing`
    },
  },
  { auth: 'user' },
)
