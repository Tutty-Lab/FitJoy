import { randomBytes } from 'node:crypto'
import { body, route, sql } from '../_lib.js'
import { hashCode } from '../_access.js'
export default route({
 async GET() {
  const organizations=await sql`select id,name from organizations order by created_at desc`
  const batches=await sql`select b.*,o.name as organization,
   (select count(*)::int from invitation_codes c where c.batch_id=b.id and c.redeemed_at is not null) as redeemed,
   (select count(*)::int from invitation_codes c where c.batch_id=b.id and c.revoked_at is not null) as revoked
   from license_batches b join organizations o on o.id=b.organization_id order by b.created_at desc`
  return {organizations,batches}
 },
 async POST(req,res) {
  const input=body<{name?:string;organizationId?:string;seats?:number;validUntil?:string}>(req)
  if(input.name!==undefined) {
   if(typeof input.name!=='string'||!input.name.trim()||input.name.length>120) return res.status(400).json({error:'Enter an organization name (up to 120 characters)'})
   const [organization]=await sql`insert into organizations(name) values(${input.name.trim()}) returning id,name`
   return {organization}
  }
  if(typeof input.organizationId!=='string'||!/^[0-9a-f-]{36}$/i.test(input.organizationId)||!Number.isInteger(input.seats)||input.seats!<1||input.seats!>1000||!input.validUntil||!Number.isFinite(Date.parse(input.validUntil))||Date.parse(input.validUntil)<=Date.now()) return res.status(400).json({error:'Choose organization, 1–1000 seats and a future expiry date'})
  const codes=Array.from({length:input.seats!},()=>randomBytes(12).toString('hex').toUpperCase().match(/.{4}/g)!.join('-'))
  const hashes=codes.map(hashCode)
  const [batch]=await sql`with batch as (
   insert into license_batches(organization_id,seats,valid_until) values(${input.organizationId}::uuid,${input.seats!},${input.validUntil}::timestamptz) returning *
  ), codes as (
   insert into invitation_codes(batch_id,code_hash,redeem_before) select batch.id,h,batch.valid_until from batch cross join unnest(${hashes}::text[]) as h returning id
  ) select batch.*,(select count(*) from codes) as issued from batch`
  return {batch,codes}
 },
 async DELETE(req,res) {
  const id=String(req.query.batchId??'')
  if(!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({error:'Invalid batch'})
  const revoked=await sql`update invitation_codes set revoked_at=now() where batch_id=${id}::uuid and redeemed_at is null and revoked_at is null returning id`
  return {revoked:revoked.length}
 }
},{auth:'admin'})
