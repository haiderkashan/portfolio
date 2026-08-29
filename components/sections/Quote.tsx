import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'

const CORNERS = [
  'left-[2%] top-[8%] -rotate-6',
  'right-[4%] top-[14%] rotate-3',
  'left-[6%] bottom-[10%] rotate-2',
  'right-[2%] bottom-[6%] -rotate-3',
]

export function Quote({
  statement,
  signature,
  floatingImages,
}: {
  statement: string
  signature?: string
  floatingImages: string[]
}) {
  return (
    <section className="theme-light relative overflow-hidden bg-paper pt-10 pb-28 sm:pt-14 sm:pb-36">
      {floatingImages.slice(0, 4).map((src, i) => (
        <Reveal
          key={`${src}-${i}`}
          delay={0.15 + i * 0.12}
          y={0}
          amount={0.4}
          className={`pointer-events-none absolute hidden h-24 w-32 overflow-hidden rounded-xl shadow-lg sm:block md:h-28 md:w-36 ${CORNERS[i % CORNERS.length]}`}
        >
          <Image src={src} alt="" fill sizes="144px" className="object-cover" />
        </Reveal>
      ))}

      <div className="container-page relative">
        <SplitHeading
          text={statement}
          as="p"
          className="text-balance mx-auto max-w-4xl text-center font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl"
        />
        {signature && (
          <Reveal delay={0.3} className="mt-8 text-center">
            <span className="font-script text-3xl font-semibold text-ink sm:text-4xl">
              — {signature} —
            </span>
          </Reveal>
        )}
      </div>
    </section>
  )
}




