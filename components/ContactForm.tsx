'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'

type Status = 'idle' | 'loading' | 'success' | 'error'

const fieldClass =
  'w-full border-b border-[var(--line)] bg-transparent py-3 font-body text-lg text-ink placeholder:text-[var(--on-surface-faint)] outline-none transition-colors focus:border-accent'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Something went wrong. Please try again.')
      setStatus('success')
      form.reset()
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
        className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-6"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
          <Check size={16} strokeWidth={3} />
        </span>
        <div>
          <p className="font-display text-lg font-semibold">Message sent</p>
          <p className="mt-1 font-body text-sm text-[var(--on-surface-soft)]">
            Thanks for reaching out — I&rsquo;ll get back to you soon.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block font-body text-xs font-medium uppercase tracking-[0.1em] text-[var(--on-surface-faint)]">
          Name
        </label>
        <input id="name" name="name" type="text" required className={fieldClass} placeholder="Jordan Lee" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block font-body text-xs font-medium uppercase tracking-[0.1em] text-[var(--on-surface-faint)]">
          Email
        </label>
        <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block font-body text-xs font-medium uppercase tracking-[0.1em] text-[var(--on-surface-faint)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-none`}
          placeholder="Tell me about your project..."
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="font-body text-sm text-red-600">
          {error}
        </p>
      )}

      <Magnetic className="self-start">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-opacity disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              Sending <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </Magnetic>
    </form>
  )
}
