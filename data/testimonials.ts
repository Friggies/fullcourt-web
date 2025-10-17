type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  rating?: number;
  avatar?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus Lin',
    role: 'Head Coach',
    quote:
      'The animated drills make spacing and timing so much easier to teach. Our practices run smoother.',
    rating: 5,
    avatar: '/images/avatars/marcus_lin.jpeg',
  },
  {
    name: 'Ray Donovan',
    role: 'Assistant Coach',
    quote:
      'Defense clicked once the players could see rotations in motion. Film sessions went from sleepy to sharp.',
    rating: 5,
    avatar: '/images/avatars/ray_donovan.jpeg',
  },
  {
    name: 'Eli Torres',
    role: 'Point Guard',
    quote:
      'I memorize sets faster because I can replay the reads at game speed. Huge help on late-game ATOs.',
    rating: 4,
    avatar: '/images/avatars/eli_torres.jpeg',
  },
  {
    name: 'Luca Bennett',
    role: 'Shooting Guard',
    quote:
      'The off-ball movement tutorials leveled up my catch-and-shoot rhythm. It feels like a walkthrough for shooters.',
    rating: 5,
    avatar: '/images/avatars/luca_bennett.jpeg',
  },
  {
    name: 'Tariq Adams',
    role: 'Power Forward',
    quote:
      'Screens, seals, and short-roll decisions finally make sense. The spacing diagrams are clutch.',
    rating: 5,
    avatar: '/images/avatars/tariq_adams.jpeg',
  },
  {
    name: 'Chris Walker',
    role: 'Center',
    quote:
      'Post entry timing and help-side coverage are so much clearer with the animations. Our rim protection jumped.',
    rating: 4,
    avatar: '/images/avatars/chris_walker.jpeg',
  },
];

export default TESTIMONIALS;
