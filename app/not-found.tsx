import Button from '@/components/common/Button';
import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { MailIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Hero title="We can not find this play" />
      <Section>
        <p>
          We could not find requested resource. You can explore out playbook,
          return to the home page, or contact us from here.
        </p>
        <Button variant="fill" href="/drills">
          Explore Playbook
        </Button>
        <Button href="/">Return to Homepage</Button>
        <Button href="mailto:contact@fullcourt-training.com">
          Contact Us <MailIcon size={16} strokeWidth={1.5} />
        </Button>
      </Section>
    </>
  );
}
