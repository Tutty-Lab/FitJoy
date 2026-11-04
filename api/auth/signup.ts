import { body, hashPassword, issueToken, route, sql } from '../_lib'

export default route({
  async POST(req, res) {
    const { name, email, password } = body<{ name: string; email: string; password: string }>(req)
    const mail = String(email ?? '').trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(mail) || String(password ?? '').length < 8) return res.status(400).json({ error: 'Valid email and an 8+ character password are required' })
    const exists = await sql`select 1 from users where email = ${mail}`
    if (exists.length) return res.status(409).json({ error: 'An account with this email already exists' })
    const [u] = await sql`insert into users (email, name, password_hash) values (${mail}, ${String(name ?? '').trim()}, ${hashPassword(password)}) returning id, email, name, role, data`
    return { token: issueToken(u.id, u.role), user: u }
  },
})
