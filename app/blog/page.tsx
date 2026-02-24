import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';

export default function Blog() {
  return (
    <>
      <Hero title="Our Blog" />
      <Section>
        <p className="w-full text-center text-muted-foreground">
          Our latest articles on basketball training, drills, and coaching tips.
        </p>
      </Section>
    </>
  );
}
