import { getStatsDrills } from '@/lib/stats-drills';

export async function getTiers() {
  const { freeCount, premiumCount } = await getStatsDrills();

  const freeAccess = `Access to ${freeCount} free drills and plays`;
  const premiumAccess = `Access to ${premiumCount} premium drills and plays`;

  return [
    {
      name: 'Free',
      price: '0$',
      tagline: 'Get started with animated drills',
      cta: {
        label: 'Get Started',
        href: '/auth/sign-up',
        variant: 'secondary' as const,
      },
      popular: false,
      features: [
        { text: 'Save drills and plays to your profile', included: true },
        { text: freeAccess, included: true },
        { text: premiumAccess, included: false },
        { text: 'Priority email support', included: false },
      ],
    },
    {
      name: 'Premium',
      price: '15$',
      tagline: 'For serious players & coaches',
      cta: {
        label: 'Go Premium Now',
        href: '/profile',
        variant: 'primary' as const,
      },
      popular: true,
      features: [
        { text: 'Save drills and plays to your profile', included: true },
        { text: freeAccess, included: true },
        { text: premiumAccess, included: true },
        { text: 'Priority email support', included: true },
      ],
    },
    {
      name: 'Business',
      price: 'Contact us',
      tagline: 'For clubs & organizations',
      cta: {
        label: 'Contact Us',
        href: 'mailto:sales@fullcourt-training.com',
        variant: 'outline' as const,
      },
      popular: false,
      features: [
        { text: 'Multiple premium accounts', included: true },
        { text: 'Custom animations', included: true },
        { text: 'Newsletter & SoMe exposure', included: true },
        { text: 'Dedicated contact person', included: true },
      ],
    },
  ];
}
