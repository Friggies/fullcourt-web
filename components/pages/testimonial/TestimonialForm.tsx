'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/common/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getClientApiError } from '@/lib/client-rate-limit';
import Image from 'next/image';

type ApiOk = {
  ok: true;
  id: number;
};

type ApiErr = {
  ok: false;
  error: string;
};

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

export default function TestimonialForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isCoolingDown = cooldownUntil !== null && cooldownUntil > Date.now();

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!cooldownUntil) return;

    const remainingMs = cooldownUntil - Date.now();
    if (remainingMs <= 0) {
      setCooldownUntil(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldownUntil(null);
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldownUntil]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (isCoolingDown) {
      setFeedback({
        type: 'error',
        message: 'Please wait a bit before submitting again.',
      });
      return;
    }

    if (
      !displayName.trim() ||
      !content.trim() ||
      !title.trim() ||
      !email.trim()
    ) {
      setFeedback({
        type: 'error',
        message: 'Please fill in your name, title, email and testimonial.',
      });
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.set('display_name', displayName.trim());
      form.set('email', email.trim());
      form.set('title', title.trim());
      form.set('content', content.trim());
      form.set('rating', String(rating));

      if (imageFile) {
        form.set('image', imageFile);
      }

      const res = await fetch('/api/testimonial', {
        method: 'POST',
        body: form,
        headers: {
          'x-deployment-id': process.env.NEXT_DEPLOYMENT_ID!,
        },
      });

      if (!res.ok) {
        const apiError = await getClientApiError(res, 'Submission failed.');

        if (apiError.isRateLimited && apiError.retryAfterMs) {
          setCooldownUntil(Date.now() + apiError.retryAfterMs);
        }

        setFeedback({
          type: 'error',
          message: apiError.message,
        });
        return;
      }

      const json = (await res.json()) as ApiOk | ApiErr;

      if (!json.ok) {
        setFeedback({
          type: 'error',
          message: json.error || 'Submission failed.',
        });
        return;
      }

      setFeedback({
        type: 'success',
        message: 'Thanks! Your testimonial was submitted.',
      });

      setDisplayName('');
      setEmail('');
      setTitle('');
      setContent('');
      setRating(5);
      setImageFile(null);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      <Label htmlFor="displayName">Display Name</Label>
      <Input
        id="displayName"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        placeholder="e.g. Mads N."
        maxLength={80}
        required
        disabled={loading || isCoolingDown}
      />

      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="e.g. Coach or Shooting Guard"
        maxLength={80}
        required
        disabled={loading || isCoolingDown}
      />

      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        maxLength={200}
        required
        disabled={loading || isCoolingDown}
      />

      <Label htmlFor="rating">Rating</Label>
      <select
        id="rating"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        disabled={loading || isCoolingDown}
      >
        {[5, 4, 3, 2, 1].map(r => (
          <option key={r} value={r}>
            {r} / 5
          </option>
        ))}
      </select>

      <Label htmlFor="content">Testimonial</Label>
      <textarea
        id="content"
        className="min-h-20 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What did you like? What changed for you?"
        rows={5}
        maxLength={1200}
        required
        disabled={loading || isCoolingDown}
      />
      <div className="text-xs text-muted-foreground">{content.length}/1200</div>

      <Label htmlFor="headshot">Image (optional)</Label>
      <input
        id="headshot"
        type="file"
        accept="image/*"
        onChange={e => setImageFile(e.target.files?.[0] ?? null)}
        disabled={loading || isCoolingDown}
      />

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          className="h-16 w-16 rounded-full object-cover border"
        />
      )}

      <div className="text-xs text-muted-foreground">
        Tip: a square-ish image works best.
      </div>

      <label>
        <Checkbox
          name="consent_all_purposes"
          required
          className="mr-2"
          disabled={loading || isCoolingDown}
        />
        <span className="text-muted-foreground">
          I agree that FULLCOURT TRAINING may use my testimonial, name, and
          image for marketing and other promotional purposes across all channels
          (website, social media, email, ads, and similar), may edit or format
          it (including translation), and may publish it worldwide without time
          limits.
        </span>
      </label>

      <Button
        type="submit"
        disabled={loading || isCoolingDown}
        variant="fill"
        className="w-full"
      >
        {loading
          ? 'Submitting...'
          : isCoolingDown
            ? 'Please wait...'
            : 'Submit Testimonial'}
      </Button>

      <div aria-live="polite">
        {feedback && (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              feedback.type === 'success'
                ? 'border-green-500'
                : 'border-red-500'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    </form>
  );
}
