import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import { CheckIcon, MinusIcon, MailIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '0$',
      tagline: 'Get started with animated drills',
      cta: {
        label: 'Get Started Free',
        href: '/auth/sign-up',
        variant: 'secondary' as const,
      },
      popular: false,
      features: [
        { text: 'Access to free drills', included: true },
        { text: 'Save drills to your profile', included: true },
        { text: 'Access to premium drills', included: false },
        { text: 'Priority email support', included: false },
      ],
    },
    {
      name: 'Premium',
      price: '15$',
      tagline: 'Everything you need to level up',
      cta: {
        label: 'Go Premium Now',
        href: '/auth/sign-up?plan=premium',
        variant: 'primary' as const,
      },
      popular: true, // highlight this card
      features: [
        { text: 'Access to free drills', included: true },
        { text: 'Save drills to your profile', included: true },
        { text: 'Access to premium drills', included: true },
        { text: 'Priority email support', included: true },
      ],
    },
    {
      name: 'Business',
      price: 'Contact us',
      tagline: 'For clubs & organizations',
      cta: {
        label: 'Contact sales',
        href: 'mailto:contact@fullcourt-training.com',
        variant: 'outline' as const,
      },
      popular: false,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Multiple premium accounts', included: true },
        { text: 'Custom drill animations', included: true },
        { text: 'Priority phone support', included: true },
      ],
    },
  ];

  return (
    <>
      <Hero title="Our Pricing" />
      <Section>
        <p className="w-full text-center text-muted-foreground">
          Choose a plan that fits your game. Upgrade or cancel anytime.
        </p>
      </Section>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={[
                'relative rounded-2xl border shadow-sm bg-background',
                tier.popular ? 'ring-2 ring-primary' : 'border-foreground/10',
              ].join(' ')}
            >
              {tier.popular && (
                <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
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
                    className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent hover:text-accent-foreground mt-auto transition"
                  >
                    {tier.cta.label}
                    <MailIcon size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <Link
                    href={tier.cta.href}
                    className={
                      tier.cta.variant === 'primary'
                        ? 'inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition'
                        : tier.cta.variant === 'secondary'
                        ? 'inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 hover:bg-accent hover:text-accent-foreground transition'
                        : 'inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-accent hover:text-accent-foreground transition'
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
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-background p-5">
            <h4 className="font-semibold mb-2">Free tier includes saving</h4>
            <p className="text-sm text-muted-foreground">
              Users on Free can access the library of free drills and save them
              to their profile to build a personal playbook.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <h4 className="font-semibold mb-2">Premium unlocks everything</h4>
            <p className="text-sm text-muted-foreground">
              Get full access to all drills, plays, premium animations, and new
              releases as they drop.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <h4 className="font-semibold mb-2">Business: request animations</h4>
            <p className="text-sm text-muted-foreground">
              Clubs and organizations can request custom animations of their own
              drills and plays. We’ll work with your staff to deliver exactly
              what you need.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
