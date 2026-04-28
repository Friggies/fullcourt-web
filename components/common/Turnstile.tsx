'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

type TurnstileWidgetProps = {
  action: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          size?: 'normal' | 'flexible' | 'compact';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          'timeout-callback'?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ action }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!sitekey || !containerRef.current || !window.turnstile) {
      return;
    }

    // Prevent duplicate widgets when the component remounts or action changes.
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    containerRef.current.innerHTML = '';

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey,
      action,
      size: 'flexible',
    });
  }, [action]);

  useEffect(() => {
    if (!scriptReady) return;

    renderWidget();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, renderWidget]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <div className="w-full max-w-full min-w-0 overflow-hidden">
        <div
          ref={containerRef}
          className="
            w-full max-w-full min-w-0
            [&_iframe]:block
            [&_iframe]:!w-full
            [&_iframe]:!max-w-full
            [&_iframe]:!min-w-0
          "
        />
      </div>
    </>
  );
}
