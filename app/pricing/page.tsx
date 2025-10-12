import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import Testimonials from '@/components/testimonials';
import tiers from '@/data/tiers';
import { CheckIcon, MinusIcon, MailIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  return (
    <>
      <Hero title="Our Pricing" />
      <Section>
        <p className="w-full text-center text-muted-foreground">
          Choose a plan that fits your game. Upgrade or cancel anytime.
        </p>
      </Section>
      <Section>
        <div
          className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1
            "
        >
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={[
                'relative rounded-md border shadow-sm bg-background',
                tier.popular ? 'ring-2 ring-brand1' : 'border-foreground/10',
              ].join(' ')}
            >
              {tier.popular && (
                <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-brand1 px-3 py-1 text-xs font-semibold text-black shadow">
                  <StarIcon size={14} />
                  Best value
                </div>
              )}

              <div className="p-4 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.tagline}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price.includes('$') && (
                    <span className="text-muted-foreground">
                      {' '}
                      / billed monthly
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map(f => (
                    <li key={f.text} className="flex items-start gap-3">
                      {f.included ? (
                        <CheckIcon className="mt-0.5" size={18} />
                      ) : (
                        <MinusIcon className="mt-0.5 opacity-50" size={18} />
                      )}
                      <span
                        className={f.included ? '' : 'text-muted-foreground'}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {tier.cta.href.startsWith('mailto:') ? (
                  <Link
                    href={tier.cta.href}
                    className="mt-auto inline-flex items-center justify-center gap-1 rounded border border-brand1 border-2 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition"
                  >
                    {tier.cta.label}
                    <MailIcon size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <Link
                    href={tier.cta.href}
                    className={
                      tier.cta.variant === 'primary'
                        ? 'inline-flex items-center justify-center rounded bg-brand1 text-black px-4 py-2 hover:opacity-90 transition'
                        : 'inline-flex items-center justify-center rounded border border-brand1 border-2 px-4 py-2 hover:bg-accent hover:text-accent-foreground transition'
                    }
                  >
                    {tier.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Testimonials />
    </>
  );
}
