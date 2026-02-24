import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

export const runtime = 'nodejs'; // required for sharp (not Edge)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

    // Optional image handling
    const file = form.get('image');
    let publicUrl: string | null = null;

    if (file && file instanceof File && file.size > 0) {
      const MAX_BYTES = 5 * 1024 * 1024; // 5MB
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

      // Convert to a reasonable headshot: square crop + webp compression
      const webpBuffer = await sharp(inputBuffer)
        .rotate() // respects EXIF orientation
        .resize(256, 256, { fit: 'cover' })
        .webp()
        .toBuffer();

      const bucket = 'testimonial_headshots';
      const safeName = slugify(display_name || 'user');
      const filename = `${safeName}-${crypto.randomUUID()}.webp`;
      const path = filename; // or `headshots/${filename}`

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

    // Insert testimonial row
    const insert = await supabase
      .from('testimonials')
      .insert({
        email,
        display_name,
        title,
        content,
        image: publicUrl, // store public URL (or store path if you prefer)
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

    return NextResponse.json({ ok: true, id: insert.data.id }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Unexpected error.' },
      { status: 500 }
    );
  }
}
