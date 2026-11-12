import { body, hashPassword, issueToken, route, sql } from '../_lib.js'

export default route({
  async POST(req, res) {
    const { name, username, password } = body<{ name?: string; username?: string; password?: string }>(req)
    const login = String(username ?? '').trim().toLowerCase()
    if (!login || login.length > 64) return res.status(400).json({ error: 'Username is required and must be 64 characters or fewer' })
    if (typeof password !== 'string' || !password) return res.status(400).json({ error: 'Password is required' })
    const [u] = await sql`insert into users (username, name, password_hash) values (${login}, ${String(name ?? '').trim() || login}, ${hashPassword(password)}) on conflict (lower(username)) do nothing returning id, username, email, name, role, data`
    if (!u) return res.status(409).json({ error: 'This username is already taken' })
    return { token: issueToken(u.id, u.role), user: u }
  },
})
