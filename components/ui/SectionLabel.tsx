import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

export function SectionLabel({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <Reveal>
      <p
        className={cn(
          'font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent',
          className
        )}
      >
        {children}
      </p>
    </Reveal>
  )
}