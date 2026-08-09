import { clsx, type ClassValue } from 'clsx'

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(input?: string, opts?: Intl.DateTimeFormatOptions) {
  if (!input) return ''
  return new Date(input).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

/** "Jordan Ray Lee" -> ["Jordan Ray", "Lee"], "Cher" -> ["", "Cher"] */
export function splitBrandName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return ['', parts[0] ?? '']
  const last = parts.pop() as string
  return [parts.join(' '), last]
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
