import { createHash } from 'node:crypto'
import { sql } from './_lib.js'
export const hashCode = (code: string) => createHash('sha256').update(code.replace(/[-\s]/g, '').toUpperCase()).digest('hex')
export async function accessFor(userId: string) {
 const [row] = await sql`select u.role, e.source, e.valid_until, o.name as organization,
 (u.role='admin' or (e.user_id is not null and (e.valid_until is null or e.valid_until>now()))) as active
 from users u left join entitlements e on e.user_id=u.id left join organizations o on o.id=e.organization_id where u.id=${userId}`
 return row ?? {active:false}
}
