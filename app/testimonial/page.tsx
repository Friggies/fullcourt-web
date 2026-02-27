import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import TestimonialForm from '@/components/pages/testimonial/TestimonialForm';

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
