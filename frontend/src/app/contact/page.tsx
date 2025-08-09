'use client'

import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-hot-toast'
import { useI18n } from '@/lib/i18n'

interface FormState {
  name: string
  email: string
  phone: string
  topic: string
  message: string
}

export default function ContactPage() {
  const { t } = useI18n()
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', topic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

  const validate = (): string | null => {
    if (!form.name.trim()) return t('contact.validation.nameRequired')
    if (!form.email.trim()) return t('contact.validation.emailRequired')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) return t('contact.validation.emailInvalid')
    if (!form.topic.trim()) return t('contact.validation.topicRequired')
    if (!form.message.trim()) return t('contact.validation.contentRequired')
    if (!captchaToken) return t('contact.validation.captchaRequired')
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { toast.error(err); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send message')
      }
      toast.success(t('contact.success'))
      setForm({ name: '', email: '', phone: '', topic: '', message: '' })
      setCaptchaToken(null)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container-max section-padding py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-soft p-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">{t('contact.title')}</h1>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('contact.name')} *</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('contact.email')} *</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('contact.telephone')}</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('contact.topic')} *</label>
              <input className="input-field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('contact.content')} *</label>
              <textarea rows={6} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div>
              <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? t('contact.sending') : t('contact.send')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


