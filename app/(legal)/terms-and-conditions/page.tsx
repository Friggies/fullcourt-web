import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <>
      <Hero title="Terms & Conditions" />

      <Section>
        <p className="w-full text-center text-muted-foreground">
          Last updated: January 5, 2026
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Agreement to These Terms</h2>
        <p>
          These Terms &amp; Conditions (“<strong>Terms</strong>”) govern your
          use of <strong>FULLCOURT TRAINING</strong> (the “
          <strong>Services</strong>
          ”), including our website and our native mobile applications (iOS and
          Android when available).
        </p>
        <p className="mt-2">
          By accessing or using the Services, creating an account, or purchasing
          a subscription, you agree to these Terms. If you do not agree, do not
          use the Services.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
        <p>
          The Services are operated by <strong>FULLCOURT TRAINING</strong>.
        </p>
        <p className="mt-2">
          Contact:{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">The Services</h2>
        <p>
          FULLCOURT TRAINING provides a digital basketball playbook with
          animated basketball drills and plays (animated video/animations plus
          descriptive text). Premium subscriptions expand the playbook by
          unlocking additional premium drills and plays.
        </p>
        <p className="mt-2">
          We may add, remove, or update content and features over time to
          improve the Services or comply with legal/technical requirements.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
        <p>
          The Services are not intended for children under 13. If you are under
          18, you must have permission from a parent or legal guardian to use
          the Services and to make purchases.
        </p>
        <p className="mt-2">
          You are responsible for ensuring your use of the Services is lawful in
          your jurisdiction.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Accounts</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Registration:</strong> You create an account using your
            email address.
          </li>
          <li>
            <strong>Security:</strong> You are responsible for maintaining the
            confidentiality of your login credentials and for all activity under
            your account.
          </li>
          <li>
            <strong>No sharing:</strong> You may not share, sell, transfer, or
            sublicense your account to anyone else.
          </li>
          <li>
            <strong>Multiple devices:</strong> You may use your account on your
            own devices (present and future), provided you do not share access
            with others.
          </li>
        </ul>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">
          Subscriptions, Billing &amp; Cancellation
        </h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">Plans</h3>
        <p>
          We offer Free and Premium access. Premium is a monthly subscription
          that unlocks premium drills and plays.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Pricing</h3>
        <p className="mt-2">
          Pricing is shown on our{' '}
          <Link className="underline" href="/pricing">
            pricing page
          </Link>
          .
        </p>
        <p>
          Pricing may vary slightly due to store pricing tiers, currency
          conversion, and taxes.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">How billing works</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Web:</strong> Web subscriptions are processed through Stripe
            via RevenueCat web billing. We do not receive your full payment card
            number.
          </li>
          <li>
            <strong>iOS:</strong> Subscriptions purchased in the iOS app are
            processed by Apple (App Store).
          </li>
          <li>
            <strong>Android:</strong> When available, subscriptions purchased in
            the Android app are processed by Google (Google Play).
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">
          Auto-renewal &amp; cancellation
        </h3>
        <p>
          Premium subscriptions generally auto-renew unless you cancel.
          Cancellation stops future renewals. How you cancel depends on where
          you purchased:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>
            <strong>Web:</strong> Cancel via the RevenueCat web portal (as made
            available to you during purchase/management).
          </li>
          <li>
            <strong>iOS:</strong> Cancel in your Apple ID subscription settings.
          </li>
          <li>
            <strong>Android:</strong> Cancel in your Google Play subscription
            settings (when available).
          </li>
        </ul>
        <p className="mt-2">
          After cancellation, you will generally retain access until the end of
          the current paid period, unless otherwise indicated at purchase or
          required by the platform you purchased through.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Refunds</h3>
        <p>
          <strong>No refunds</strong> except where required by law. Purchases
          made through Apple or Google are also subject to their refund policies
          and processes.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">
          License, Permitted Use &amp; Restrictions
        </h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable
          license to access and use the Services and the content solely for your
          personal or internal coaching/team practice purposes, in accordance
          with these Terms.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Permitted use</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            You may view drills/plays and use them to teach, explain, and run
            practices.
          </li>
          <li>
            You may display the content on larger screens (e.g., TV/projector)
            to help players/coaches understand drills and plays.
          </li>
          <li>
            You may show content to teams/players/coaches during instruction,
            provided you do not give them a way to save, download, or
            redistribute premium content.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Restrictions</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>No account sharing:</strong> You may not share access to
            your account.
          </li>
          <li>
            <strong>No copying or redistribution:</strong> You may not copy,
            reproduce, distribute, publish, transmit, sell, sublicense, or
            otherwise exploit any portion of the Services or content.
          </li>
          <li>
            <strong>No downloading/screen recording:</strong> You may not
            download, screen record, capture, or otherwise extract premium
            content (in whole or in part) for storage or redistribution.
          </li>
          <li>
            <strong>No scraping or API access:</strong> You may not access the
            content through automated means (including scraping, crawling, or
            use of an API) unless we explicitly authorize it in writing.
          </li>
        </ul>

        <p className="mt-2">
          Free content that appears on third-party platforms (for example,
          YouTube) may also be available directly on those platforms, but these
          Terms still prohibit using automated methods to scrape or bulk extract
          content from our Services.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
        <p>
          The Services, including all drills, plays, animations, text, design,
          software, and branding, are owned by FULLCOURT TRAINING and/or its
          licensors and are protected by intellectual property laws. Except for
          the limited license granted above, no rights are granted to you.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Use the Services in bad faith or for unlawful purposes.</li>
          <li>
            Attempt to bypass paywalls, access controls, or security measures.
          </li>
          <li>Interfere with or disrupt the Services or related systems.</li>
          <li>
            Reverse engineer, decompile, or attempt to derive source code except
            where such restriction is prohibited by law.
          </li>
        </ul>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">
          Termination &amp; Suspension
        </h2>
        <p>
          We may suspend or terminate your access to the Services (including any
          Premium access) if we reasonably believe you have violated these
          Terms, acted in bad faith, attempted to redistribute premium content,
          or otherwise harmed the Services or other users.
        </p>
        <p className="mt-2">
          You may stop using the Services at any time. To request account
          deletion, email{' '}
          <Link
            className="underline"
            href="mailto:contact@fullcourt-training.com"
          >
            contact@fullcourt-training.com
          </Link>
          .
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Disclaimers</h2>
        <p>
          The Services and content are provided for general educational and
          training information purposes only. They are not medical advice and do
          not replace professional medical guidance.
        </p>
        <p className="mt-2">
          Basketball training and physical activity involve inherent risks. You
          assume all risks associated with your use of the Services and your
          participation in any drills/activities described.
        </p>
        <p className="mt-2">
          To the maximum extent permitted by law, the Services are provided “as
          is” and “as available,” without warranties of any kind, including
          implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, FULLCOURT TRAINING will not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits, revenue, data, or goodwill,
          arising out of or related to your use of the Services.
        </p>
        <p className="mt-2">
          To the maximum extent permitted by law, our total liability for any
          claim arising out of or relating to the Services will not exceed the
          amount you paid to us for the Services in the 12 months before the
          event giving rise to the claim (or, if you have not paid, 0).
        </p>
        <p className="mt-2">
          Nothing in these Terms limits any consumer rights that cannot be
          limited under applicable law, or liability that cannot be excluded
          (such as liability for intent or gross negligence where applicable).
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Indemnity</h2>
        <p>
          To the extent permitted by law, you agree to indemnify and hold
          harmless FULLCOURT TRAINING from and against claims, liabilities,
          damages, losses, and expenses (including reasonable legal fees)
          arising from your misuse of the Services or your violation of these
          Terms.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Privacy</h2>
        <p>
          Our collection and use of personal information is described in our{' '}
          <a className="underline" href="/privacy-policy">
            Privacy Policy
          </a>
          . By using the Services, you acknowledge that you have read it.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. The “Last updated” date
          above reflects the most recent changes. If changes are material, we
          will post the updated Terms on this page and may also provide
          additional notice where appropriate.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
        <p>
          These Terms are governed by the laws of Denmark, without regard to
          conflict of law principles. Subject to mandatory consumer protections,
          courts located in Denmark will have jurisdiction over disputes arising
          out of or relating to these Terms or the Services.
        </p>
      </Section>

      <Section>
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          Questions about these Terms? Email{' '}
          <a className="underline" href="mailto:contact@fullcourt-training.com">
            contact@fullcourt-training.com
          </a>
          .
        </p>
      </Section>
    </>
  );
}
