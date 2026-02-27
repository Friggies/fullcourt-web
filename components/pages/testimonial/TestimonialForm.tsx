'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/common/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ApiOk = {
  ok: true;
  id: number;
};

type ApiErr = {
  ok: false;
  error: string;
};

export default function TestimonialForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiOk | ApiErr | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

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
      setDisplayName('');
      setEmail('');
      setTitle('');
      setContent('');
      setRating(5);
      setImageFile(null);
    } catch {
      setResult({ ok: false, error: 'Something went wrong.' });
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
      />

      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="e.g. Coach or Shooting Guard"
        maxLength={80}
        required
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
      />

      <Label htmlFor="rating">Rating</Label>
      <select
        id="rating"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
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
      />
      <div className="text-xs text-muted-foreground">{content.length}/1200</div>

      <Label htmlFor="headshot">Image (optional)</Label>
      <input
        id="headshot"
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

      <label>
        <Checkbox name="consent_all_purposes" required className="mr-2" />
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
  );
}
