'use client'

import { useState, useRef, type ReactNode } from 'react'
import { StaggerItem } from '@/components/ui/Reveal'

export function InteractiveRow({
  children,
  imageUrl,
  imageAlt,
  className = '',
}: {
  children: ReactNode
  imageUrl?: string
  imageAlt?: string
  className?: string
}) {
  const [isActive, setIsActive] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)

  function handleShow(e?: React.MouseEvent | React.FocusEvent) {
    setIsActive(true)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    if (imageUrl) {
      let clientX: number | undefined
      let clientY: number | undefined

      if (e && 'clientX' in e && (e.clientX !== 0 || e.clientY !== 0)) {
        clientX = e.clientX
        clientY = e.clientY
      } else if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect()
        clientX = rect.left + rect.width / 2
        clientY = rect.top + rect.height / 2
      }

      window.dispatchEvent(
        new CustomEvent('cursor-preview:show', {
          detail: {
            src: imageUrl,
            alt: imageAlt || '',
            clientX,
            clientY,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
          },
        })
      )
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    if (imageUrl) {
      window.dispatchEvent(
        new CustomEvent('cursor-preview:move', {
          detail: {
            clientX: e.clientX,
            clientY: e.clientY,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
          },
        })
      )
    }
  }

  function handleHide() {
    setIsActive(false)
    window.dispatchEvent(new CustomEvent('cursor-preview:hide'))
  }

  return (
    <StaggerItem
      as="div"
      className={`${className} ${isActive ? 'bg-[var(--surface-raised)]' : ''}`}
    >
      <div
        ref={rowRef}
        data-interactive-row="true"
        data-image-url={imageUrl}
        data-image-alt={imageAlt || ''}
        onMouseEnter={handleShow}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
      >
        {children}
      </div>
    </StaggerItem>
  )
}
