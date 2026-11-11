import { route, sql } from './_lib.js'
import { hashCode } from './_access.js'
export default route({ async GET(req,res) {
 const code=String(req.query.code??'').trim(); if(!code||code.length>100)return res.status(400).json({error:'Invalid invitation'})
 const [row]=await sql`select o.id as organization_id,o.name as organization,b.valid_until,(c.redeemed_at is not null) as redeemed,(c.revoked_at is not null or c.redeem_before<=now() or b.valid_until<=now()) as expired from invitation_codes c join license_batches b on b.id=c.batch_id join organizations o on o.id=b.organization_id where c.code_hash=${hashCode(code)}`
 if(!row||row.redeemed||row.expired)return res.status(404).json({error:'This invitation is no longer available'})
 return {organization:{id:row.organization_id,name:row.organization},validUntil:row.valid_until}
} })
