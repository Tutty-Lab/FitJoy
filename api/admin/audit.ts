import { route, sql } from '../_lib.js'
export default route({
 async GET(req) {
  const limit=Math.min(100,Math.max(1,Number(req.query.limit??50)))
  return sql`select a.id,a.action,a.entity_type,a.entity_id,a.metadata,a.created_at,u.username,u.email,o.name as organization
    from audit_events a left join users u on u.id=a.actor_id left join organizations o on o.id=a.organization_id
    order by a.created_at desc limit ${limit}`
 }
},{auth:'admin'})
