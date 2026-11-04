import { neon } from '@neondatabase/serverless'
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Shared helpers for the Vercel Functions in /api. Files starting with "_" are not routed.

export const sql = neon(process.env.DATABASE_URL!)

const SECRET = process.env.AUTH_SECRET!
const TOKEN_DAYS = 30

export type Session = { sub: string; role: 'user' | 'admin'; exp: number }

export function hashPassword(pw: string) {
  const salt = randomBytes(16)
  return `${salt.toString('hex')}:${scryptSync(pw, salt, 64).toString('hex')}`
}

export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(':')
  const a = Buffer.from(hash, 'hex')
  const b = scryptSync(pw, Buffer.from(salt, 'hex'), 64)
  return a.length === b.length && timingSafeEqual(a, b)
}

const b64 = (s: string) => Buffer.from(s).toString('base64url')
const sign = (body: string) => createHmac('sha256', SECRET).update(body).digest('base64url')

// Compact HMAC-signed token (JWT-like); the client sends it as `Authorization: Bearer`.
export function issueToken(sub: string, role: Session['role']) {
  const body = b64(JSON.stringify({ sub, role, exp: Date.now() + TOKEN_DAYS * 864e5 }))
  return `${body}.${sign(body)}`
}

export function readSession(req: VercelRequest): Session | null {
  const token = (req.headers.authorization ?? '').replace(/^Bearer /, '')
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = sign(body)
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
  const s = JSON.parse(Buffer.from(body, 'base64url').toString()) as Session
  return s.exp > Date.now() ? s : null
}

type Handler = (req: VercelRequest, res: VercelResponse, session: Session | null) => Promise<unknown>

// Wraps a handler with method routing, auth and uniform JSON errors.
export function route(handlers: Partial<Record<string, Handler>>, opts: { auth?: 'user' | 'admin' } = {}) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const h = handlers[req.method ?? 'GET']
    if (!h) return res.status(405).json({ error: 'Method not allowed' })
    const session = readSession(req)
    if (opts.auth && !session) return res.status(401).json({ error: 'Sign in required' })
    if (opts.auth === 'admin' && session?.role !== 'admin') return res.status(403).json({ error: 'Admins only' })
    try {
      const out = await h(req, res, session)
      if (!res.headersSent) res.status(200).json(out ?? { ok: true })
    } catch (e) {
      console.error(e)
      if (!res.headersSent) res.status(500).json({ error: 'Server error' })
    }
  }
}

export const body = <T>(req: VercelRequest) => (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as T
