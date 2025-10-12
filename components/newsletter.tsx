'use client';

import { Section } from '@/components/section';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('ok');
      setEmail('');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <Section>
      <div className="flex flex-col gap-6 w-full">
        <header className="text-center sm:text-left">
          <span className="text-xs uppercase text-muted-foreground">
            Stay informed
          </span>
          <h2 className="text-xl lg:text-2xl font-semibold">
            Get the newsletter
          </h2>
        </header>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, alias.
          Earum nam voluptates cumque ea quasi modi atque commodi qui quae quam
          minima unde corrupti sunt animi eligendi, dolorem nisi?
        </p>

        <form onSubmit={onSubmit} className="flex w-full gap-2 sm:gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 rounded border"
          >
            {status === 'loading' ? 'Submitting…' : 'Subscribe'}
          </button>
        </form>

        <div aria-live="polite" className="text-sm min-h-[1.25rem]">
          {status === 'ok' && (
            <span className="text-green-600">
              Thanks! Please check your email.
            </span>
          )}
          {status === 'error' && <span className="text-red-600">{error}</span>}
        </div>
      </div>
    </Section>
  );
}
