/**
 * Minimal in-memory rate limiter, keyed by IP.
 *
 * Honest limitation: on serverless platforms (Vercel etc.) this state lives
 * per function instance, so it resets on cold starts and isn't shared
 * across concurrent instances under real load. It will NOT stop a
 * determined attacker. Combined with the honeypot field and field-length
 * validation already in the contact route, it's meant to raise the bar
 * against basic scripted spam at zero infra cost, not to be a real
 * distributed rate limiter. If this endpoint ever gets targeted for real,
 * swap this for Upstash Redis (`@upstash/ratelimit`) or Vercel's Firewall.
 */

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 5

const hits = new Map<string, number[]>()

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  hits.set(key, timestamps)

  if (hits.size > 5000) {
    const cutoff = now - WINDOW_MS
    for (const [k, v] of hits) {
      if (v.every((t) => t < cutoff)) hits.delete(k)
    }
  }

  return false
}
