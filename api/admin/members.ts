import { body, hashPassword, route, sql } from '../_lib.js'

// Every member with progress counts, for the admin console.
export default route(
  {
    async PATCH(req, res, session) {
      const input = body<{ id: string; name: string; username: string; password?: string }>(req)
      if (!/^[0-9a-f-]{36}$/i.test(input.id ?? '') || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 120 || typeof input.username !== 'string' || !input.username.trim() || input.username.length > 64 || (input.password !== undefined && (typeof input.password !== 'string' || input.password.length < 8 || input.password.length > 128))) return res.status(400).json({ error: 'Enter a name, username and a password of 8–128 characters when resetting.' })
      const username = input.username.trim().toLowerCase()
      const [existing] = await sql`select id from users where lower(username)=${username} and id<>${input.id}::uuid`
      if (existing) return res.status(409).json({ error: 'Username already exists' })
      const [user] = input.password
        ? await sql`update users set name=${input.name.trim()},username=${username},password_hash=${hashPassword(input.password)} where id=${input.id}::uuid returning id`
        : await sql`update users set name=${input.name.trim()},username=${username} where id=${input.id}::uuid returning id`
      if (!user) return res.status(404).json({ error: 'User not found' })
      await sql`insert into audit_events(actor_id,action,entity_type,entity_id) values(${session?.sub},${input.password ? 'user.password_reset' : 'user.updated'},'user',${input.id})`
      return { ok: true }
    },
    async GET() {
      return sql`
        select u.id, coalesce(u.username, u.email) as email, u.name, u.data->>'goal' as goal, to_char(u.created_at, 'YYYY-MM-DD') as joined,
          (select count(*)::int from completions c where c.user_id = u.id) as completed,
          coalesce(jsonb_array_length(case when jsonb_typeof(u.data->'lessonCompletions') = 'array' then u.data->'lessonCompletions' end), 0) as sessions,
          coalesce((select array_agg(to_char(a.date, 'YYYY-MM-DD') order by a.date) from activity_days a where a.user_id = u.id), '{}') as dates
        from users u order by u.created_at desc`
    },
  },
  { auth: 'admin' },
)
