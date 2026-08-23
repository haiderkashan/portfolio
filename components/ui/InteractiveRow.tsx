'use client'

import { useState, type ReactNode } from 'react'
import { StaggerItem } from '@/components/ui/Reveal'
import { CursorFollowPreview } from '@/components/ui/CursorFollowPreview'

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

  return (
    <StaggerItem
      as="div"
      className={`${className} ${isHovered ? 'bg-[var(--surface-raised)]' : ''}`}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {children}
      </div>
      {imageUrl && (
        <CursorFollowPreview src={imageUrl} alt={imageAlt} visible={isHovered} />
      )}
    </StaggerItem>
  )
}
