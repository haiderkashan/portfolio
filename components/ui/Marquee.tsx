import { cn } from '@/lib/utils'

export function Marquee({
  items,
  className,
  duration = 26,
  separator = '•',
}: {
  items: string[]
  className?: string
  duration?: number
  separator?: string
}) {
  const content = items.join(`  ${separator}  `) + `  ${separator}  `

  return (
    <div className={cn('pause-on-hover relative overflow-hidden', className)}>
      <div
        className="animate-marquee flex w-max will-change-transform"
        style={{ animationDuration: `${duration}s` }}
      >
        <span className="whitespace-nowrap pr-6">{content}</span>
        <span className="whitespace-nowrap pr-6" aria-hidden="true">
          {content}
        </span>
      </div>
    </div>
  )
}
