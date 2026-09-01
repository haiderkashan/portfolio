import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
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
  const last = parts.pop() ?? ''
  return [parts.join(' '), last]
}

