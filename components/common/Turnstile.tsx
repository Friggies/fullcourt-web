import Script from 'next/script';

type TurnstileWidgetProps = {
  action: string;
};

export function TurnstileWidget({ action }: TurnstileWidgetProps) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-action={action}
        data-size="flexible"
      />
    </>
  );
}
