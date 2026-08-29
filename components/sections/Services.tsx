import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { urlForImage } from '@/sanity/lib/image'
import type { ServiceEntry } from '@/sanity/lib/queries'

export function Services({ services }: { services: ServiceEntry[] }) {
  if (!services.length) return null

  return (
    <section id="services" className="theme-dark bg-ink py-24 sm:py-32">
      <div className="container-page">
        <SplitHeading
          text="Services"
          as="h2"
          className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl"
        />

        <div className="mt-10 sm:mt-14">
          {services.map((service, i) => {
            const previewUrl = urlForImage(service.previewImage)?.width(320).height(220).url()
            return (
              <Reveal
                key={service._id}
                amount={0.2}
                className={`grid grid-cols-[2.75rem_1fr] items-start gap-x-6 gap-y-4 border-t border-[var(--line)] py-10 sm:grid-cols-[4rem_1fr_auto] sm:gap-x-10 sm:py-12 ${
                  i === services.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="font-display text-2xl font-bold text-accent sm:text-3xl">
                  /{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
                    {service.title}
                  </h3>
                  {service.items && service.items.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
                      {service.items.map((item) => (
                        <li key={item} className="font-body text-sm text-[var(--on-surface-soft)]">
                          — {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {previewUrl && (
                  <div className="relative col-span-2 h-40 w-full overflow-hidden rounded-xl sm:col-span-1 sm:h-28 sm:w-40">
                    <Image
                      src={previewUrl}
                      alt={service.previewImage?.alt || `${service.title} service preview`}
                      fill
                      placeholder={service.previewImage?.lqip ? 'blur' : 'empty'}
                      blurDataURL={service.previewImage?.lqip}
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}




