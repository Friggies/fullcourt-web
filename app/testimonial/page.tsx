import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import TestimonialForm from '@/components/pages/testimonial/TestimonialForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Write a Testimonial',
  description: 'Feel good about our product and cause? Tell us about it.',
  alternates: { canonical: '/testimonial' },
  openGraph: {
    url: '/testimonial',
    title: 'Write a Testimonial | FULLCOURT TRAINING',
    description: 'Feel good about our product and cause? Tell us about it.',
  },
  twitter: {
    title: 'Write a Testimonial | FULLCOURT TRAINING',
    description: 'Feel good about our product and cause? Tell us about it.',
  },
};

export default function TestimonialSubmitPage() {
  return (
    <>
      <Hero title="Submit a Testimonial" />
      <Section>
        <TestimonialForm />
      </Section>
    </>
  );
}
