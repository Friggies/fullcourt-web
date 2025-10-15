const tiers = [
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
      { text: 'Access to free drills', included: true },
      { text: 'Save drills to your profile', included: true },
      { text: 'Access to premium drills', included: false },
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
      label: 'Contact us',
      href: 'mailto:sales@fullcourt-training.com',
      variant: 'outline' as const,
    },
    popular: false,
    features: [
      { text: 'Multiple premium accounts', included: true },
      { text: 'Custom drill animations', included: true },
      { text: 'Newsletter & SoMe exposure', included: true },
      { text: 'Premium support', included: true },
    ],
  },
];
export default tiers;
