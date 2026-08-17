import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getWriteClient } from '@/sanity/lib/client'
import { isRateLimited } from '@/lib/rate-limit'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function getEmailTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

function generateEmailHtml(data: {
  name: string
  email: string
  topic: string
  company?: string
  phone?: string
  message: string
  fileName?: string
  fileSize?: number
}) {
  const safeMessage = data.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f5; margin: 0; padding: 24px; color: #111; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #eae8e1; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .header { background: #0a0a08; padding: 24px 28px; }
    .header p { margin: 0 0 6px 0; color: #f4cf00; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em; }
    .content { padding: 28px; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #111; font-weight: 500; }
    .field-value a { color: #0a0a08; text-decoration: underline; }
    .message-box { background: #faf8f2; border-left: 4px solid #f4cf00; padding: 16px 18px; border-radius: 0 8px 8px 0; margin-top: 6px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #222; }
    .attachment-box { background: #f4f4f2; border: 1px solid #e2e0d8; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; margin-top: 6px; }
    .footer { padding: 18px 28px; background: #faf8f2; border-top: 1px solid #eae8e1; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>Portfolio Contact Form</p>
      <h1>${data.topic}</h1>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">From</div>
        <div class="field-value"><strong>${data.name}</strong> &lt;<a href="mailto:${data.email}">${data.email}</a>&gt;</div>
      </div>
      ${
        data.company
          ? `
      <div class="field-group">
        <div class="field-label">Company / Organization</div>
        <div class="field-value">${data.company}</div>
      </div>`
          : ''
      }
      ${
        data.phone
          ? `
      <div class="field-group">
        <div class="field-label">Phone Number</div>
        <div class="field-value"><a href="tel:${data.phone}">${data.phone}</a></div>
      </div>`
          : ''
      }
      <div class="field-group">
        <div class="field-label">Message</div>
        <div class="message-box">${safeMessage}</div>
      </div>
      ${
        data.fileName
          ? `
      <div class="field-group">
        <div class="field-label">Attached File</div>
        <div class="attachment-box">
          📎 <strong>${data.fileName}</strong> ${data.fileSize ? `(${(data.fileSize / (1024 * 1024)).toFixed(2)} MB)` : ''} &bull; Attached to this email & saved in Sanity
        </div>
      </div>`
          : ''
      }
    </div>
    <div class="footer">
      Hit &ldquo;Reply&rdquo; in your email client to reply directly to ${data.name} (${data.email}).
    </div>
  </div>
</body>
</html>
`
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages sent recently. Please try again later.' },
      { status: 429 }
    )
  }

  let name = ''
  let email = ''
  let topic = ''
  let message = ''
  let company = ''
  let phone = ''
  let budget = ''
  let file: File | null = null

  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData()
      name = (formData.get('name') as string) || ''
      email = (formData.get('email') as string) || ''
      topic = (formData.get('topic') as string) || ''
      message = (formData.get('message') as string) || ''
      company = (formData.get('company') as string) || ''
      phone = (formData.get('phone') as string) || ''
      budget = (formData.get('budget') as string) || ''

      const rawFile = formData.get('file')
      if (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0) {
        file = rawFile as File
      }
    } catch {
      return NextResponse.json({ error: 'Failed to process form submission.' }, { status: 400 })
    }
  } else {
    try {
      const body = await request.json()
      name = body?.name || ''
      email = body?.email || ''
      topic = body?.topic || ''
      message = body?.message || ''
      company = body?.company || ''
      phone = body?.phone || ''
      budget = body?.budget || ''
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }
  }

  // Honeypot: 'budget' is a hidden field real users never fill in.
  // If filled, silently acknowledge with 200 OK.
  if (typeof budget === 'string' && budget.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const trimmedName = typeof name === 'string' ? name.trim() : ''
  const trimmedEmail = typeof email === 'string' ? email.trim() : ''
  const trimmedTopic = typeof topic === 'string' ? topic.trim() : ''
  const trimmedMessage = typeof message === 'string' ? message.trim() : ''
  const trimmedCompany = typeof company === 'string' ? company.trim() : ''
  const trimmedPhone = typeof phone === 'string' ? phone.trim() : ''

  // Mandatory fields check
  if (!trimmedName || !trimmedEmail || !trimmedTopic || !trimmedMessage) {
    return NextResponse.json(
      { error: 'Please fill in all required fields (Name, Email, Topic, Message).' },
      { status: 400 }
    )
  }

  // Strict format & length validation
  if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (trimmedName.length > 200) {
    return NextResponse.json({ error: 'Name must be 200 characters or fewer.' }, { status: 400 })
  }

  if (trimmedEmail.length > 200) {
    return NextResponse.json({ error: 'Email must be 200 characters or fewer.' }, { status: 400 })
  }

  if (trimmedTopic.length > 200) {
    return NextResponse.json({ error: 'Topic selection is invalid.' }, { status: 400 })
  }

  if (trimmedMessage.length > 5000) {
    return NextResponse.json({ error: 'Message must be 5000 characters or fewer.' }, { status: 400 })
  }

  if (trimmedCompany.length > 200) {
    return NextResponse.json({ error: 'Company name must be 200 characters or fewer.' }, { status: 400 })
  }

  if (trimmedPhone.length > 50) {
    return NextResponse.json({ error: 'Phone number must be 50 characters or fewer.' }, { status: 400 })
  }

  // Validate file if present
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Attachment file size exceeds 10MB limit.' }, { status: 400 })
    }
  }

  let fileBuffer: Buffer | null = null
  if (file) {
    fileBuffer = Buffer.from(await file.arrayBuffer())
  }

  // 1. Write to Sanity Dataset
  try {
    const client = getWriteClient()
    let assetRef: { _type: 'file'; asset: { _type: 'reference'; _ref: string } } | undefined

    if (file && fileBuffer) {
      const assetDoc = await client.assets.upload('file', fileBuffer, {
        filename: file.name,
        contentType: file.type || undefined,
      })
      if (assetDoc?._id) {
        assetRef = {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: assetDoc._id,
          },
        }
      }
    }

    await client.create({
      _type: 'contactSubmission',
      name: trimmedName,
      email: trimmedEmail,
      topic: trimmedTopic,
      ...(trimmedCompany ? { company: trimmedCompany } : {}),
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      message: trimmedMessage,
      ...(assetRef ? { attachment: assetRef } : {}),
      submittedAt: new Date().toISOString(),
      handled: false,
    })
  } catch (error) {
    console.error('[contact] Failed to save submission to Sanity:', error)
    return NextResponse.json(
      {
        error:
          'Could not send your message right now — the Sanity write token may not be configured yet. Please email me directly instead.',
      },
      { status: 500 }
    )
  }

  // 2. Automated Gmail Notification via Nodemailer
  const transporter = getEmailTransporter()
  if (transporter) {
    try {
      const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.GMAIL_USER!
      const emailHtml = generateEmailHtml({
        name: trimmedName,
        email: trimmedEmail,
        topic: trimmedTopic,
        company: trimmedCompany,
        phone: trimmedPhone,
        message: trimmedMessage,
        fileName: file?.name,
        fileSize: file?.size,
      })

      await transporter.sendMail({
        from: `"Portfolio Notification" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        replyTo: `"${trimmedName}" <${trimmedEmail}>`,
        subject: `[Portfolio Contact] ${trimmedTopic}: ${trimmedName}`,
        text: `New contact submission from ${trimmedName} (${trimmedEmail})\nTopic: ${trimmedTopic}\nCompany: ${trimmedCompany || 'N/A'}\nPhone: ${trimmedPhone || 'N/A'}\n\nMessage:\n${trimmedMessage}`,
        html: emailHtml,
        attachments:
          file && fileBuffer
            ? [
                {
                  filename: file.name,
                  content: fileBuffer,
                  contentType: file.type || undefined,
                },
              ]
            : [],
      })
    } catch (emailError) {
      console.error('[contact] Failed to dispatch Gmail notification:', emailError)
      // We don't fail the client request here because the submission was already persisted to Sanity.
    }
  } else {
    console.warn(
      '[contact] GMAIL_USER or GMAIL_APP_PASSWORD not set in environment. Skipping email notification.'
    )
  }

  return NextResponse.json({ ok: true })
}
