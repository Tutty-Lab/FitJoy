import { put } from '@vercel/blob'
import { body, route } from '../_lib.js'

const MAX_BYTES = 100 * 1024 * 1024
const TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

export default route({
  async POST(req, res, session) {
    const input = body<{ day?: number; filename?: string; contentType?: string; data?: string }>(req)
    if (!Number.isInteger(input.day) || input.day! < 1 || input.day! > 22 || !input.filename || !input.data || !TYPES.has(input.contentType ?? '')) {
      return res.status(400).json({ error: 'Upload an MP4, WebM or QuickTime video for a valid lesson' })
    }
    const raw = Buffer.from(input.data.replace(/^data:[^;]+;base64,/, ''), 'base64')
    if (!raw.length || raw.length > MAX_BYTES) return res.status(413).json({ error: 'Video must be smaller than 100 MB' })
    const safe = input.filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
    const blob = await put(`lessons/day-${input.day}-${Date.now()}-${safe}`, raw, { access: 'public', contentType: input.contentType, addRandomSuffix: false })
    return { url: blob.url, size: raw.length, contentType: input.contentType, uploadedBy: session!.sub }
  },
}, { auth: 'admin' })
