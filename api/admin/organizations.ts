import { body, route, sql } from '../_lib.js'
export default route({
 async GET(req,res) {
  const id=String(req.query.id??'')
  if(id){
   if(!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({error:'Invalid organization'})
   const [organization]=await sql`select id,name,created_at from organizations where id=${id}::uuid`
   if(!organization) return res.status(404).json({error:'Organization not found'})
   const batches=await sql`select b.id,b.seats,b.valid_until,b.created_at,
    (select count(*)::int from invitation_codes c where c.batch_id=b.id and c.redeemed_at is not null) as redeemed,
    (select count(*)::int from invitation_codes c where c.batch_id=b.id and c.redeemed_at is null and c.revoked_at is null and c.redeem_before>now()) as available
    from license_batches b where b.organization_id=${id}::uuid order by b.created_at desc`
   const members=await sql`select u.id,coalesce(u.username,u.email) as login,u.name,e.source,e.valid_until,e.created_at,
    (select count(*)::int from completions c where c.user_id=u.id) as completed,
    to_char((select max(a.date) from activity_days a where a.user_id=u.id),'YYYY-MM-DD') as last_active
    from entitlements e join users u on u.id=e.user_id where e.organization_id=${id}::uuid order by e.created_at desc`
   const audit=await sql`select a.action,a.metadata,a.created_at,coalesce(u.username,u.email) as actor from audit_events a left join users u on u.id=a.actor_id where a.organization_id=${id}::uuid order by a.created_at desc limit 50`
   return {organization,batches,members,audit}
  }
  return sql`select o.id,o.name,o.created_at,
   count(distinct e.user_id)::int as active_members,
   coalesce(sum(b.seats),0)::int as seats_purchased,
   coalesce(sum((select count(*) from invitation_codes c where c.batch_id=b.id and c.redeemed_at is not null)),0)::int as seats_redeemed
   from organizations o left join entitlements e on e.organization_id=o.id and (e.valid_until is null or e.valid_until>now())
   left join license_batches b on b.organization_id=o.id group by o.id order by o.created_at desc`
 },
 async PATCH(req,res,session) {
  const {id,name}=body<{id?:string;name?:string}>(req)
  if(!id||!/^[0-9a-f-]{36}$/i.test(id)||typeof name!=='string'||!name.trim()||name.length>120) return res.status(400).json({error:'Invalid organization name'})
  const [org]=await sql`update organizations set name=${name.trim()} where id=${id}::uuid returning id,name`
  if(!org) return res.status(404).json({error:'Organization not found'})
  await sql`insert into audit_events(actor_id,organization_id,action,entity_type,entity_id,metadata) values(${session!.sub},${id}::uuid,'organization.updated','organization',${id}::uuid,${JSON.stringify({name:org.name})}::jsonb)`
  return {organization:org}
 }
},{auth:'admin'})
