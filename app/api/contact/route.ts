import { NextResponse } from 'next/server'
import { getWriteClient } from '@/sanity/lib/client'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages sent recently. Please try again later.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, message, company } = (body ?? {}) as Record<string, unknown>

  // Honeypot: a hidden field real visitors never fill in.
  if (typeof company === 'string' && company.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedMessage = message.trim()

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
  }
  if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (trimmedName.length > 200 || trimmedEmail.length > 200 || trimmedMessage.length > 5000) {
    return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 })
  }

  try {
    const client = getWriteClient()
    await client.create({
      _type: 'contactSubmission',
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      submittedAt: new Date().toISOString(),
      handled: false,
    })
  } catch (error) {
    console.error('[contact] Failed to save submission:', error)
    return NextResponse.json(
      {
        error:
          'Could not send your message right now — the Sanity write token may not be configured yet. Please email me directly instead.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
