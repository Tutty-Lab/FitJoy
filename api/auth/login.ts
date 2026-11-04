import { body, issueToken, route, sql, verifyPassword } from '../_lib'

export default route({
  async POST(req, res) {
    const { email, password } = body<{ email: string; password: string }>(req)
    const [u] = await sql`select id, email, name, role, data, password_hash from users where email = ${String(email ?? '').trim().toLowerCase()}`
    if (!u || !verifyPassword(String(password ?? ''), u.password_hash)) return res.status(401).json({ error: 'Wrong email or password' })
    const { password_hash: _h, ...user } = u
    return { token: issueToken(u.id, u.role), user }
  },
})
