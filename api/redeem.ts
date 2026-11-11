import { body, route, sql } from './_lib.js'
import { accessFor, hashCode } from './_access.js'
export default route({
 async POST(req,res,session) {
  const {code}=body<{code?:unknown}>(req)
  if(typeof code!=='string' || code.length>100) return res.status(400).json({error:'Enter your invitation code'})
  const [result]=await sql`select redeem_invitation(${session!.sub}::uuid,${hashCode(code)}) as status`
  if(result.status==='rate_limit') return res.status(429).json({error:'Too many attempts. Try again in 15 minutes.'})
  if(!['redeemed','already_redeemed'].includes(result.status)) return res.status(409).json({error:result.status==='already_active'?'Your program access is already active.':result.status==='different_organization'?'This account belongs to another organization. Contact support.':'Code is invalid, expired or already used.'})
  if(result.status==='redeemed') await sql`insert into audit_events(actor_id,organization_id,action,entity_type,metadata) select ${session!.sub},organization_id,'invitation.redeemed','user',${JSON.stringify({userId:session!.sub})}::jsonb from entitlements where user_id=${session!.sub}`
  return {access:await accessFor(session!.sub)}
 }
},{auth:'user'})
