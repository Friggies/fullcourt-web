import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

import { rateLimiters } from '@/lib/upstash';
import {
  applyRateLimitHeaders,
  limitByIp,
  rateLimitExceeded,
} from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const runtime = 'nodejs'; // required for sharp (not Edge)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);
}

export async function POST(req: Request) {
  try {
    const rate = await limitByIp(req, rateLimiters.testimonialSubmit);

    if (!rate.success) {
      return rateLimitExceeded(
        rate,
        'Too many testimonial submissions from this IP. Please try again later.'
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: 'Server not configured (missing env vars).' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const form = await req.formData();

    const turnstileToken = String(
      form.get('cf-turnstile-response') ?? ''
    ).trim();

    if (!turnstileToken) {
      return NextResponse.json(
        { ok: false, error: 'Missing Turnstile token.' },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      undefined;

    const turnstile = await verifyTurnstileToken({
      token: turnstileToken,
      ip,
    });

    if (!turnstile.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Verification failed. Please try again.',
        },
        { status: 400 }
      );
    }

    if (turnstile.action && turnstile.action !== 'testimonial_submit') {
      return NextResponse.json(
        { ok: false, error: 'Invalid Turnstile action.' },
        { status: 400 }
      );
    }

    const display_name = String(form.get('display_name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const title = String(form.get('title') ?? '').trim();
    const content = String(form.get('content') ?? '').trim();
    const ratingRaw = String(form.get('rating') ?? '').trim();
    const rating = Number(ratingRaw);

    if (!display_name || !content || !title || !email) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Missing required fields (name/content/email/title).',
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, error: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    const file = form.get('image');
    let publicUrl: string | null = null;

    if (file && file instanceof File && file.size > 0) {
      const MAX_BYTES = 5 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { ok: false, error: 'Image too large (max 5MB).' },
          { status: 400 }
        );
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { ok: false, error: 'Invalid file type. Please upload an image.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      const webpBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(256, 256, { fit: 'cover' })
        .webp()
        .toBuffer();

      const bucket = 'testimonial_headshots';
      const safeName = slugify(display_name || 'user');
      const filename = `${safeName}-${crypto.randomUUID()}.webp`;
      const path = filename;

      const upload = await supabase.storage
        .from(bucket)
        .upload(path, webpBuffer, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (upload.error) {
        return NextResponse.json(
          { ok: false, error: `Image upload failed: ${upload.error.message}` },
          { status: 500 }
        );
      }

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      publicUrl = pub.publicUrl;
    }

    const insert = await supabase
      .from('testimonials')
      .insert({
        email,
        display_name,
        title,
        content,
        image: publicUrl,
        rating,
      })
      .select('id')
      .single();

    if (insert.error) {
      return NextResponse.json(
        { ok: false, error: `DB insert failed: ${insert.error.message}` },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { ok: true, id: insert.data.id },
      { status: 200 }
    );

    applyRateLimitHeaders(response, rate);
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unexpected error.' },
      { status: 500 }
    );
  }
}
