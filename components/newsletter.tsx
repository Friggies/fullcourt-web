'use client';

import { useState } from 'react';
import { Card } from './atoms/Card';
import Image from 'next/image';
import { Court } from './atoms/Court';
import Button from './atoms/Button';
import Link from 'next/link';
import { Line } from './line';

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
    <Court className="my-5">
      <Image
        src={'/animations/passing.gif'}
        alt="Fun Passing Animation"
        unoptimized
        priority
        width={1080}
        height={1080}
        className="h-[100px] sm:h-[150px] w-auto  animate-spin-slow"
      />
      <Card>
        <span className="text-xs uppercase text-muted-foreground">
          Stay informed
        </span>
        <h2 className="text-xl lg:text-2xl font-semibold">
          Sign Up for the Newsletter
        </h2>

        <p>
          We will pass along exciting information about new drills, plays,
          sponsored content and updates to FULLCOURT TRAINING.
        </p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-2 sm:gap-3"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="text-base flex-1 border-2 border-brand1 rounded px-3 py-2 bg-white"
          />
          <Button
            variant="fill"
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 rounded border"
          >
            {status === 'loading' ? 'Submitting…' : 'Subscribe'}
          </Button>
        </form>
        <div aria-live="polite" className="text-sm">
          {status === 'ok' && (
            <span className="text-green-600">
              Thanks! Please check your email.
            </span>
          )}
          {status === 'error' && <span className="text-red-600">{error}</span>}
        </div>
        <Line />
        <p className="text-muted-foreground text-xs">
          By subscribing, you agree to our{' '}
          <Link className="underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </Court>
  );
}
