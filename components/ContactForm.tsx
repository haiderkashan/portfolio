'use client'

import { useState, useRef, type FormEvent, type DragEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Check, Loader2, UploadCloud, FileText, X, AlertCircle } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'

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
  const [isDragging, setIsDragging] = useState(false)
  const [topic, setTopic] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldInputClass =
    'w-full border-b-2 border-[var(--line)] bg-transparent py-2 font-body text-base text-ink placeholder:text-[var(--on-surface-faint)]/70 outline-none transition-all duration-150 focus:border-b-4 focus:border-accent focus:pb-[6px]'

  const labelClass =
    'block font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-ink mb-1.5'

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB.')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB.')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  function removeFile() {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
            className="mt-5 inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-visible">
      {/* Honeypot: 'budget' trap for bots */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="budget">Budget</label>
        <input id="budget" name="budget" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Row 1: Name & Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={200}
            className={fieldInputClass}
            placeholder="Jordan Lee"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            className={fieldInputClass}
            placeholder="jordan@example.com"
          />
        </div>
      </div>

      {/* Row 2: Topic & Company */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="topic" className={labelClass}>
            Topic / Inquiry <span className="text-accent">*</span>
          </label>
          <select
            id="topic"
            name="topic"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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
            className={fieldInputClass}
            placeholder="Acme Studio Inc."
          />
        </div>
      </div>

      {/* Row 3: Phone Number & File Upload */}
      <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={50}
            className={fieldInputClass}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className={labelClass}>
            File Attachment
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="file"
            id="file-upload"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border py-2.5 px-3.5 transition-all duration-200 shadow-sm ${
                isDragging
                  ? 'border-accent bg-accent/15 text-ink ring-2 ring-accent/30'
                  : 'border-[var(--line)] bg-[var(--surface-raised)]/70 hover:border-accent hover:bg-accent/10 text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <UploadCloud size={17} className="shrink-0 text-accent transition-transform duration-200 group-hover:scale-110" />
                <span className="truncate font-body text-xs font-medium text-ink">
                  Attach file or drop here
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-medium text-[var(--on-surface-faint)]">
                PDF/IMG &le;10MB
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border-2 border-accent/40 bg-[var(--surface-raised)] px-3.5 py-2 shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="shrink-0 text-accent" />
                <span className="truncate font-body text-xs font-medium text-ink" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-[var(--on-surface-faint)]">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(1)}MB)
                </span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 shrink-0 rounded-full p-1 text-[var(--on-surface-soft)] hover:bg-black/10 hover:text-ink transition-colors"
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={3}
          className={fieldInputClass}
          placeholder="Tell me about your project, timeline, and goals..."
        />
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600"
            role="alert"
          >
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="pt-2 pl-2 overflow-visible">
        <Magnetic className="self-start overflow-visible">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-all duration-200 disabled:opacity-60 hover:brightness-105 shadow-sm"
          >
            {status === 'loading' ? (
              <>
                Sending <Loader2 size={15} className="animate-spin" />
              </>
            ) : (
              <>
                Send message
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}

