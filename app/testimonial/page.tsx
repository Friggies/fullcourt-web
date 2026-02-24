'use client';

import Button from '@/components/common/Button';
import { useMemo, useState } from 'react';

type ApiOk = {
  ok: true;
  id: number;
};

type ApiErr = {
  ok: false;
  error: string;
};

export default function TestimonialSubmitPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiOk | ApiErr | null>(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    // Basic client validation (server also validates)
    if (
      !displayName.trim() ||
      !content.trim() ||
      !title.trim() ||
      !email.trim()
    ) {
      setResult({
        ok: false,
        error: 'Please fill in your name, title, email and testimonial.',
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
      if (imageFile) form.set('image', imageFile);

      const res = await fetch('/api/testimonial', {
        method: 'POST',
        body: form,
      });

      const json = (await res.json()) as ApiOk | ApiErr;

      if (!res.ok || !json.ok) {
        setResult({
          ok: false,
          error: (json as ApiErr).error || 'Submission failed.',
        });
        return;
      }

      setResult(json);
      // Reset form on success
      setDisplayName('');
      setEmail('');
      setTitle('');
      setContent('');
      setRating(5);
      setImageFile(null);
    } catch (err: any) {
      setResult({ ok: false, error: err?.message ?? 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Submit a Testimonial</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Display Name</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="e.g. Mads N."
            maxLength={80}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Title</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Coach or Shooting Guard"
            maxLength={80}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            maxLength={200}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Rating</label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>
                {r} / 5
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Testimonial</label>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What did you like? What changed for you?"
            rows={5}
            maxLength={1200}
            required
          />
          <div className="text-xs text-muted-foreground">
            {content.length}/1200
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 rounded-full object-cover border"
            />
          )}
          <div className="text-xs text-muted-foreground">
            Tip: a square-ish image works best.
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent_all_purposes"
            required
            className="mt-1 h-4 w-4 rounded border"
          />
          <span className="text-muted-foreground">
            I agree that FULLCOURT TRAINING may use my testimonial, name, and
            image for marketing and other promotional purposes across all
            channels (website, social media, email, ads, and similar), may edit
            or format it (including translation), and may publish it worldwide
            without time limits.
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          variant="fill"
          className="w-full"
        >
          {loading ? 'Submitting…' : 'Submit Testimonial'}
        </Button>

        {result && (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              result.ok ? 'border-green-500' : 'border-red-500'
            }`}
          >
            {result.ok ? (
              <div className="space-y-1">
                <div>Thanks! Your testimonial was submitted.</div>
              </div>
            ) : (
              <div>{result.error}</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
