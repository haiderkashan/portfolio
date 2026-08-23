import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function buildHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`
}

/** Compact page list: 1 … 4 5 [6] 7 8 … 12 - never more than ~7 entries. */
function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push('ellipsis')
    result.push(page)
  })
  return result
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  const pageList = getPageList(currentPage, totalPages)
  const pillClass =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--line)] px-3.5 font-display text-sm font-medium transition-all hover:bg-accent hover:border-accent hover:text-ink focus-visible:bg-accent focus-visible:text-ink'

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2 sm:mt-20">
      {currentPage > 1 ? (
        <Link href={buildHref(basePath, currentPage - 1)} aria-label="Previous page" className={pillClass}>
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={cn(pillClass, 'pointer-events-none opacity-30')} aria-hidden="true">
          <ChevronLeft size={16} />
        </span>
      )}

      {pageList.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-1 font-body text-sm text-[var(--on-surface-faint)]">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(basePath, page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              pillClass,
              page === currentPage && 'border-accent bg-accent text-ink hover:text-ink'
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(basePath, currentPage + 1)} aria-label="Next page" className={pillClass}>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={cn(pillClass, 'pointer-events-none opacity-30')} aria-hidden="true">
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
