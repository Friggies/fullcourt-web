import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import Testimonials from '@/components/pages/frontpage/testimonials';
import tiers from '@/data/tiers';
import { createClient } from '@/lib/supabase/server';
import { CheckIcon, MinusIcon, MailIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Pricing() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Default: anonymous users -> no profile, not premium
  let hasProfile = false;
  let isPremium = false;

  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, premium')
      .eq('id', user.id)
      .maybeSingle(); // ✅ returns null if no row

    if (!error && profile) {
      hasProfile = true;
      isPremium = Boolean(profile.premium);
    }
  }

  return (
    <>
      <Hero title="Our Pricing" />
      <Section>
        <p className="w-full text-center text-muted-foreground">
          Choose a plan that fits your game. Upgrade or cancel anytime.
        </p>
      </Section>

      <Section>
        <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1">
          {tiers.map(tier => {
            const isFreeTier = tier.name === 'Free';
            const isPremiumTier = tier.name === 'Premium';

            const ctaDisabled =
              (isFreeTier && hasProfile) || (isPremiumTier && isPremium);

            const ctaLabel = ctaDisabled
              ? isPremiumTier
                ? 'Current Plan'
                : 'Already Signed Up'
              : tier.cta.label;

            const baseCtaClasses =
              'mt-auto inline-flex items-center justify-center gap-1 rounded px-4 py-2 transition';

            const variantClasses =
              tier.cta.variant === 'primary'
                ? 'bg-brand1 text-black hover:opacity-90'
                : 'border-brand1 border-2 hover:bg-accent hover:text-accent-foreground';

            const disabledClasses = ctaDisabled
              ? 'opacity-50 cursor-not-allowed pointer-events-none'
              : '';

            return (
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
                    Best Value
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

                  <ul
                    className="space-y-3 mb-6"
                    aria-label={`${tier.name} features`}
                  >
                    {tier.features.map(f => {
                      const status = f.included ? 'Included' : 'Not included';

                      return (
                        <li key={f.text} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={f.included ? '' : 'opacity-50'}
                          >
                            {f.included ? (
                              <CheckIcon
                                className="mt-0.5"
                                size={18}
                                focusable="false"
                              />
                            ) : (
                              <MinusIcon
                                className="mt-0.5"
                                size={18}
                                focusable="false"
                              />
                            )}
                          </span>

                          <span
                            className={
                              f.included ? '' : 'text-muted-foreground'
                            }
                          >
                            <span className="sr-only">{status}:</span>
                            {f.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {tier.cta.href.startsWith('mailto:') ? (
                    <Link
                      href={tier.cta.href}
                      className={[
                        baseCtaClasses,
                        'border-brand1 border-2 hover:bg-accent hover:text-accent-foreground',
                      ].join(' ')}
                    >
                      {tier.cta.label}
                      <MailIcon size={16} strokeWidth={1.5} />
                    </Link>
                  ) : ctaDisabled ? (
                    <button
                      type="button"
                      disabled
                      className={[
                        baseCtaClasses,
                        variantClasses,
                        disabledClasses,
                      ].join(' ')}
                    >
                      {ctaLabel}
                    </button>
                  ) : (
                    <Link
                      href={tier.cta.href}
                      className={[baseCtaClasses, variantClasses].join(' ')}
                    >
                      {ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Testimonials />
    </>
  );
}
