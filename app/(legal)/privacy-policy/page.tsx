import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';

export default function PrivacyPolicy() {
  return (
    <>
      <Hero title="Privacy Policy" />

      <Section>
        <p className="w-full text-center text-muted-foreground">
          Last updated: January 5, 2026
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
        <p>
          This Privacy Policy explains how <strong>FULLCOURT TRAINING</strong>{' '}
          (“<strong>we</strong>,” “<strong>us</strong>,” or “
          <strong>our</strong>”) collects, uses, and shares personal information
          when you use our website and our mobile app (together, the
          “Services”).
        </p>
        <p className="mt-2">
          Controller: <strong>FULLCOURT TRAINING</strong>
          <br />
          Contact:{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Scope</h2>
        <p>
          This Policy covers personal information we collect through the
          Services, including when you browse the website, create an account,
          use the app, purchase a subscription, or subscribe to our newsletter.
        </p>
        <p className="mt-2">
          It does not cover third-party websites or services that we do not
          control (for example, YouTube, app stores, or payment providers).
          Those services have their own privacy practices.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">
          Information you provide
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Account information:</strong> your email address when you
            sign up or sign in.
          </li>
          <li>
            <strong>Newsletter information:</strong> your email address when you
            subscribe to our newsletter.
          </li>
          <li>
            <strong>Support communications:</strong> information you include in
            emails you send to us.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">
          Information we store to provide the Services
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Authentication data:</strong> we use Supabase Auth to manage
            sign-in and account access.
          </li>
          <li>
            <strong>Account status:</strong> we store whether your account has
            premium access.
          </li>
          <li>
            <strong>Bookmarks (App only):</strong> if you use the native
            app&apos;s bookmark features, we store bookmark relationships so you
            can see what you bookmarked.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">
          Information collected automatically
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Website usage information:</strong> we use Simple Analytics
            to understand aggregate website usage (for example, which pages are
            visited). It is configured for privacy-friendly, minimal tracking.
          </li>
          <li>
            <strong>Technical data:</strong> like IP address, device and browser
            information, and general logs needed to deliver and secure the
            Services (for example, by our hosting and infrastructure providers).
          </li>
        </ul>

        <p className="mt-3 text-sm text-muted-foreground">
          Note: The Services may use cookies or similar storage where needed for
          essential functionality (for example, maintaining your signed-in
          session and preferences).
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and operate the Services (including account access).</li>
          <li>Deliver premium access and synchronize subscription status.</li>
          <li>
            Send newsletters and updates you request (with an unsubscribe link).
          </li>
          <li>Respond to support requests and communicate with you.</li>
          <li>Maintain security, prevent abuse, and debug issues.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>

        <p className="mt-2">
          If you are in the EEA/UK, our lawful bases typically include{' '}
          <strong>contract</strong> (to provide the Services you request),{' '}
          <strong>consent</strong> (for newsletters),{' '}
          <strong>legitimate interests</strong> (service operation, security,
          and improvement), and <strong>legal obligation</strong> (compliance).
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Email Newsletters (Kit)</h2>
        <p>
          We use <strong>Kit (kit.com)</strong> to manage newsletter subscriber
          lists and email delivery. When you subscribe, your email address is
          processed by Kit as our service provider.
        </p>
        <p className="mt-2">
          You can unsubscribe at any time using the link in any email from us,
          or by contacting us at{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
          .
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Subscriptions & Payments</h2>
        <p>
          We use <strong>RevenueCat</strong> to manage subscriptions and
          entitlements across platforms.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Web subscriptions:</strong> if you subscribe on the website,
            payments are processed through <strong>Stripe</strong> via
            RevenueCat&apos;s web billing setup. We do not receive your full
            payment card number.
          </li>
          <li>
            <strong>iOS subscriptions:</strong> if you subscribe through the iOS
            app, purchases are processed by Apple&apos;s App Store. We receive
            entitlement/subscription status needed to provide premium access.
          </li>
          <li>
            <strong>Android subscriptions:</strong> once available on Google
            Play, purchases will be processed by Google Play. We will receive
            entitlement/subscription status needed to provide premium access.
          </li>
        </ul>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Video Content</h2>
        <p>We provide video content through:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>YouTube:</strong> free videos are embedded or linked using
            standard YouTube functionality. When you play a YouTube video, your
            device connects to YouTube/Google and YouTube may collect usage and
            device data under its own policies.
          </li>
          <li>
            <strong>Supabase Storage:</strong> premium videos are served from
            our Supabase storage bucket.
          </li>
        </ul>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">How We Share Information</h2>
        <p>
          We share personal information with service providers only as needed to
          operate the Services, such as:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Hosting & delivery:</strong> Netlify (website hosting and
            delivery).
          </li>
          <li>
            <strong>Database/auth/storage:</strong> Supabase (account
            authentication, database, and storage). Our Supabase project is
            hosted in <strong>AWS us-east-2</strong>.
          </li>
          <li>
            <strong>Subscriptions:</strong> RevenueCat (subscription management
            and entitlements).
          </li>
          <li>
            <strong>Payments:</strong> Stripe (for web payments via RevenueCat),
            and app store providers (Apple and, when available, Google) for
            in-app purchases.
          </li>
          <li>
            <strong>Newsletter delivery:</strong> Kit (email newsletters).
          </li>
          <li>
            <strong>Analytics:</strong> Simple Analytics (website analytics).
          </li>
          <li>
            <strong>App build pipeline:</strong> Expo services used to build the
            mobile app (build/distribution tooling).
          </li>
          <li>
            <strong>Search tooling:</strong> Google Search Console (to monitor
            and improve how our website appears in Google Search).
          </li>
        </ul>

        <p className="mt-3">
          We may also disclose information if required by law, legal process, or
          to protect rights, safety, and security.
        </p>

        <p className="mt-2">
          We do <strong>not</strong> sell your personal information.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Security</h2>
        <p>
          We use reasonable technical and organizational measures designed to
          protect personal information. However, no method of transmission or
          storage is completely secure. If you believe your account or data has
          been compromised, contact us immediately.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Your Privacy Rights</h2>
        <p>
          Depending on your location, you may have rights over your personal
          information, such as to access, correct, delete, restrict or object to
          processing, portability, and to withdraw consent.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>EEA/UK:</strong> You may also lodge a complaint with your
            local supervisory authority. Where we rely on consent (e.g., for
            newsletters), you can withdraw it at any time without affecting the
            lawfulness of processing before withdrawal.
          </li>
          <li>
            <strong>California:</strong> Subject to exceptions, you may request
            access to, correction of, or deletion of personal information. We do
            not sell personal information and we do not share personal
            information for cross-context behavioral advertising.
          </li>
        </ul>
        <p className="mt-2">
          To exercise your rights, contact us at{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
          . We may need to verify your identity before responding.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Children&apos;s Privacy</h2>
        <p>
          Our Services are not directed to children under the age of 13 (or the
          age of digital consent in your country). We do not knowingly collect
          personal information from children. If you believe a child has
          provided us information, contact us and we will take appropriate steps
          to delete it.
        </p>
        <p className="mt-2">We do not offer parental controls.</p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
        <p>
          We may update this Policy from time to time. The “Last updated” date
          above reflects the most recent changes. Material changes will be
          posted on this page and, where appropriate, notified to you (for
          example, by email).
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          Questions about this Policy or our privacy practices? Email{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
          .
        </p>
      </Section>
    </>
  );
}
