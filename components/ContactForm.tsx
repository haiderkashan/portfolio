'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Check, Loader2, AlertCircle } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'
import { FileDropzone } from '@/components/ui/FileDropzone'

type Status = 'idle' | 'loading' | 'success' | 'error'

const TOPIC_OPTIONS = [
  { value: '', label: 'Select a topic...' },
  { value: 'General Query', label: 'General Query' },
  { value: 'Recruitment / Job Opportunity', label: 'Recruitment / Job Opportunity' },
  { value: 'Corporate / Agency Inquiry', label: 'Corporate / Agency Inquiry' },
  { value: 'Freelance / Project Collaboration', label: 'Freelance / Project Collaboration' },
]

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [topic, setTopic] = useState('')

  const fieldInputClass =
    'w-full border-b-2 border-[var(--line)] bg-transparent py-1 font-body text-sm text-ink placeholder:text-[var(--on-surface-faint)]/70 outline-none transition-all duration-150 focus:border-b-4 focus:border-accent focus:pb-[4px]'

  const labelClass =
    'block font-display text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] text-ink mb-1'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const nameVal = (formData.get('name') as string)?.trim() || ''
    const emailVal = (formData.get('email') as string)?.trim() || ''
    const topicVal = (formData.get('topic') as string)?.trim() || ''
    const messageVal = (formData.get('message') as string)?.trim() || ''

    if (!nameVal || !emailVal || !topicVal || !messageVal) {
      setStatus('error')
      setError('Please fill in all required fields (Name, Email, Topic, Message).')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
      setStatus('error')
      setError('Please enter a valid email address.')
      return
    }

    if (selectedFile) {
      formData.set('file', selectedFile)
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Something went wrong. Please try again.')
      setStatus('success')
      form.reset()
      setSelectedFile(null)
      setTopic('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-7"
      >
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
          <Check size={20} strokeWidth={3} />
        </span>
        <div>
          <p className="font-display text-xl font-semibold">Message sent successfully</p>
          <p className="mt-1 font-body text-sm text-[var(--on-surface-soft)]">
            Thanks for reaching out! I&rsquo;ll review your inquiry and get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-5 inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink underline decoration-ink decoration-2 underline-offset-4 hover:text-moss hover:decoration-moss transition-colors"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-3 overflow-visible">
      {/* Honeypot: 'budget' trap for bots */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="budget">Budget</label>
        <input id="budget" name="budget" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Row 1: Name & Email */}
      <div className="grid gap-4 sm:gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-ink font-bold ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={200}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-form-error' : undefined}
            className={fieldInputClass}
            placeholder="Jordan Lee"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-ink font-bold ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-form-error' : undefined}
            className={fieldInputClass}
            placeholder="jordan@example.com"
          />
        </div>
      </div>

      {/* Row 2: Topic & Company */}
      <div className="grid gap-4 sm:gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="topic" className={labelClass}>
            Topic / Inquiry <span className="text-ink font-bold ml-0.5" aria-hidden="true">*</span>
          </label>
          <select
            id="topic"
            name="topic"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-form-error' : undefined}
            className={`${fieldInputClass} cursor-pointer`}
          >
            {TOPIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''} className="bg-paper text-ink">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Organization
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={200}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-form-error' : undefined}
            className={fieldInputClass}
            placeholder="Acme Studio Inc."
          />
        </div>
      </div>

      {/* Row 3: Phone Number & File Upload */}
      <div className="grid gap-4 sm:gap-3 sm:grid-cols-2 sm:items-start">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={50}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-form-error' : undefined}
            className={fieldInputClass}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="file-upload" className={labelClass}>
            File Attachment
          </label>
          <FileDropzone
            file={selectedFile}
            onFileSelect={setSelectedFile}
            onError={setError}
          />
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-ink font-bold ml-0.5" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={2}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'contact-form-error' : undefined}
          className={fieldInputClass}
          placeholder="Tell me about your project, timeline, and goals..."
        />
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            id="contact-form-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-700"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="pt-2">
        <Magnetic className="inline-block">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="group inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                Sending <Loader2 size={15} className="animate-spin" />
              </>
            ) : (
              <>
                Send message
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            )}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}


