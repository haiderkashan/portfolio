'use client'

import { useState, type ReactNode } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

  function handleShow() {
    setIsHovered(true)
    if (imageUrl) {
      window.dispatchEvent(
        new CustomEvent('cursor-preview:show', {
          detail: { src: imageUrl, alt: imageAlt || '' },
        })
      )
    }
  }

  function handleHide() {
    setIsHovered(false)
    window.dispatchEvent(new CustomEvent('cursor-preview:hide'))
  }

  return (
    <StaggerItem
      as="div"
      className={`${className} ${isHovered ? 'bg-[var(--surface-raised)]' : ''}`}
    >
      <div
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
      >
        {children}
      </div>
    </StaggerItem>
  )
}
