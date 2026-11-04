import { route, sql } from '../_lib.js'

// Every member with progress counts, for the admin console.
export default route(
  {
    async GET() {
      return sql`
        select u.id, u.email, u.name, u.data->>'goal' as goal, to_char(u.created_at, 'YYYY-MM-DD') as joined,
          (select count(*)::int from completions c where c.user_id = u.id) as completed,
          coalesce((select array_agg(to_char(a.date, 'YYYY-MM-DD') order by a.date) from activity_days a where a.user_id = u.id), '{}') as dates
        from users u order by u.created_at desc`
    },
  },
  { auth: 'admin' },
)
