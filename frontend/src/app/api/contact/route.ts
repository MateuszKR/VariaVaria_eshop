import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

async function verifyRecaptcha(token: string | undefined) {
  try {
    if (!token) return false
    const secret = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    if (!secret) return false
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const data = await res.json()
    return !!data.success
  } catch {
    return false
  }
}

function validate(body: any) {
  const errors: string[] = []
  if (!body?.name || typeof body.name !== 'string' || !body.name.trim()) errors.push('Name is required')
  if (!body?.email || typeof body.email !== 'string' || !body.email.trim()) errors.push('Email is required')
  else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(body.email)) errors.push('Invalid email')
  }
  if (!body?.topic || typeof body.topic !== 'string' || !body.topic.trim()) errors.push('Topic is required')
  if (!body?.message || typeof body.message !== 'string' || !body.message.trim()) errors.push('Content is required')
  return errors
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, topic, message, captchaToken } = body || {}

    const errors = validate(body)
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }

    const captchaOk = await verifyRecaptcha(captchaToken)
    if (!captchaOk) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }

    let transporter: nodemailer.Transporter
    const smtpHost = process.env.SMTP_HOST
    if (smtpHost) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER as string,
          pass: process.env.SMTP_PASS as string,
        } : undefined,
      })
    } else {
      // Fallback to Ethereal test account to prevent 500s in development
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
    }

    const to = 'killer33@o2.pl'
    const subject = `[Contact] ${topic}`
    const text = `New contact message\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      (phone ? `Telephone: ${phone}\n` : '') +
      `Topic: ${topic}\n\n` +
      `Content:\n${message}\n`

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin:0 0 12px;">New contact message</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
          <tr><td style="font-weight:bold;">Name</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="font-weight:bold;">Email</td><td>${escapeHtml(email)}</td></tr>
          ${phone ? `<tr><td style=\"font-weight:bold;\">Telephone</td><td>${escapeHtml(phone)}</td></tr>` : ''}
          <tr><td style="font-weight:bold;">Topic</td><td>${escapeHtml(topic)}</td></tr>
        </table>
        <h3 style="margin:16px 0 8px;">Content</h3>
        <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Contact@varia.eshop',
      to,
      subject,
      text,
      html,
      replyTo: email,
    })

    const previewUrl = nodemailer.getTestMessageUrl?.(info) || undefined
    return NextResponse.json({ ok: true, previewUrl })
  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}


