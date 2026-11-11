import type { Plugin } from 'vite'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Run the same handlers as Vercel, with server-only credentials from .env.local.
export function devApi(): Plugin {
  return {
    name: 'fitjoy-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const routes = ['auth/login', 'auth/signup', 'me', 'catalog', 'completions', 'admin/members', 'admin/licenses', 'redeem']
        const route = url.pathname.replace(/^\/api\//, '')
        if (!url.pathname.startsWith('/api/')) return next()
        if (!routes.includes(route)) { res.statusCode = 404; res.end(); return }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk))
            if (chunks.reduce((n, b) => n + b.length, 0) > 1024 * 1024) {
              res.statusCode = 413; res.end(); return
            }
          }
          const request = req as VercelRequest
          request.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}
          request.query = Object.fromEntries(url.searchParams)
          const response = res as VercelResponse
          response.status = (code: number) => { res.statusCode = code; return response }
          response.json = (value: unknown) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(value))
            return response
          }
          const handler = await server.ssrLoadModule(`/api/${route}.ts`)
          await handler.default(request, response)
        } catch (error) {
          server.config.logger.error(String(error))
          if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: 'Local API error' })) }
        }
      })
    },
  }
}
