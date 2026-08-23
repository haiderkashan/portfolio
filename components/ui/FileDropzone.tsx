'use client'

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'

interface FileDropzoneProps {
  file: File | null
  maxSizeBytes?: number
  onFileSelect: (file: File | null) => void
  onError: (errorMessage: string) => void
}

export function FileDropzone({
  file,
  maxSizeBytes = 10 * 1024 * 1024,
  onFileSelect,
  onError,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function validateAndSelect(selected: File) {
    if (selected.size > maxSizeBytes) {
      onError(`File size must be under ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`)
      return
    }
    onError('')
    onFileSelect(selected)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0])
    }
  }

  function handleDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0])
    }
  }

  function handleRemove() {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        id="file-upload"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        className="sr-only"
      />

      {!file ? (
        <label
          htmlFor="file-upload"
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          className={`group flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl border py-2.5 px-3.5 transition-all duration-200 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
            isDragging
              ? 'border-accent bg-accent/20 text-ink ring-2 ring-accent'
              : 'border-[var(--line)] bg-[var(--surface-raised)]/70 hover:border-ink hover:bg-black/5 text-ink'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <UploadCloud
              size={17}
              className="shrink-0 text-ink transition-transform duration-200 group-hover:scale-110"
            />
            <span className="truncate font-body text-xs font-medium text-ink">
              Attach file or drop here
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-medium text-[var(--on-surface-faint)]">
            PDF/IMG &le;10MB
          </span>
        </label>
      ) : (
        <div className="flex min-h-[44px] items-center justify-between rounded-xl border-2 border-accent bg-[var(--surface-raised)] px-3.5 py-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="shrink-0 text-ink" />
            <span className="truncate font-body text-xs font-medium text-ink" title={file.name}>
              {file.name}
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-[var(--on-surface-faint)]">
              ({(file.size / (1024 * 1024)).toFixed(1)}MB)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 -m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-soft)] hover:bg-black/10 hover:text-ink transition-colors"
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
