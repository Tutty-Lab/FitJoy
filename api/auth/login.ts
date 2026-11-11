import { body, issueToken, route, sql, verifyPassword } from '../_lib.js'

export default route({
  async POST(req, res) {
    const { username, email, password } = body<{ username?: string; email?: string; password?: string }>(req)
    const login = String(username ?? email ?? '').trim().toLowerCase()
    const [u] = await sql`select id, username, email, name, role, data, password_hash from users where lower(username) = ${login} or email = ${login}`
    if (!u || !verifyPassword(String(password ?? ''), u.password_hash)) return res.status(401).json({ error: 'Wrong username or password' })
    const { password_hash: _h, ...user } = u
    return { token: issueToken(u.id, u.role), user }
  },
})
