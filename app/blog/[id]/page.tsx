import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { createClient } from '@/lib/supabase/server';
import { stripMarkdown, truncate } from '@/lib/utils';

type Props = { params: Promise<{ id: string }> };

const getArticle = cache(async (id: string) => {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, author, created_at, content')
    .eq('id', id)
    .single();

  if (error || !article) return null;
  return article;
});

function articleImageUrl(title: string) {
  const filename = title.toLowerCase().replaceAll(' ', '-');
  return `https://crbswbfgtbkjinzagblg.supabase.co/storage/v1/object/public/article_thumbnails/${filename}.webp`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const description =
    truncate(stripMarkdown(article.content ?? ''), 160) ||
    'Read the latest FULLCOURT TRAINING article.';

  const ogImage = articleImageUrl(article.title);

  return {
    title: article.title,
    description,
    alternates: { canonical: `/blog/${article.id}` },
    openGraph: {
      type: 'article',
      url: `/blog/${article.id}`,
      title: article.title,
      description,
      publishedTime: article.created_at,
      authors: article.author ? [article.author] : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <>
      <Hero title={article.title} />
      <Section>
        <div className="mt-2 text-sm text-muted-foreground flex justify-between">
          <p>By {article.author}</p>
          <p>
            Published{' '}
            {new Date(article.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Image
          src={articleImageUrl(article.title)}
          alt={article.title}
          className="block w-auto rounded-lg"
          width={1920}
          height={1080}
          placeholder="blur"
          blurDataURL={`data:image/webp;base64,UklGRiAFAABXRUJQVlA4IBQFAABQRwCdASrCAf0AP/3+/3+/u7+7pNIa2/A/iWNu3w9j9cXyTVgw/XjF1o/kFY3YgMHydYjFfpnhOsQDA4Mq31iMV+Uvvtyqdpts56PH79brYOxpCW6dK1wnBevQJmNaVPakDddUMVEjTRWcrFQmcI+sCrM/wEJ+63+WDQqp4jwR8L1PY1jO2bBDkyKOWyOjc1GiD6KNumxkjdvL7QT++9zMqoX0LD9yGMf7FPP6c0SsaoQrCHbGl68zOiPipf9R7Dt6hvXwdo92iGxQGP6DOmO40KL1YRPpYObIhrDwcogH4BArW0ZgjVGs/wm3DTbgJpK7Cyvg9c8QvwenjkyTW7FTkzmYixCstS8s/cv5ErYFs6/0Tq3ADIntfbRrq85jBTiJ5KX4MbTYOexBgL2kykumg+SE5RzScBBQ4yu7QxLmujPeN/QIhhxIfY0ng6FEMvMjZgieTWxQgQd3WBvkQBpaL6Mmx2vG0xaZrVmV8OD7Q2PJjuUDAf4GZFI7yzpxC5MhgbQtHNekI0wEANTFiYwvF2fi1feyQ4Mfpd8pnC8YWD+qSFbDo7krod3gkipgOIGAU1v9FN3kqp/Lqy+/QCYLHjIGtEMN+uSP5mSQOa/niVTQBgezqEkh1C9Yih9lyqV8EoRh/Xx010vkWjMwNoSxgI0IR5HveKGu3sSkVU4s79JyMB2HG36lsJizTyGK2KdGiWVlDtNjOKMYevtFLaNTWHvEvyKLtZcXKllcBzvcCcoplPG6PsYxTkcK5+07WHqGDgAA/peND2YVC/vf80Yc1iWjtVBj8ajJ2w/88bLWyHJ8k9Lu1Z7Cfcd2pYwplIOQBuCX8YmePzpS8ULodEVj5Qf9Rpyuf20/Z4wf8+pglo6Bnh5S0dkjyiA5z9QJvoB8Ovv7CP7OPuFVExJWqQv1mgd70wrwaMr39mHFDTZIFpk5SB4brNq+XYjjyLbO1Av0/g4VF0t23ZBUmioTYjnx2BGP+ZOP3lzav5af4C39JKUiFgAsb4czGBgDIh8cEO+n2y60ZTXen+HVk5zWZ9RrCfm1geeOJmsDqDC76qIVGaaxrWM51Z/U4VoHJcdwuBonepxQ/GJCrQt1kiLiJxGBsA4ETnF8psutLj6XqdzsHtPhni8xrxbJAkIZp+RBziryZl5Pt1lPWPxEPAIWlZacIz9jrxxIXsWxilzCiAK3f2QdWrm0MnyTaA3wcmqK7niOyIi03xodrAu6qo9Afyfc+65oaR+jOYEl4i7KtMQ1hYWJOz3Trph4hGdp7CZS3BxYHKM0eUw4+LK3YAf8UimpFvcGGvyDc6jpODkwqNJSXh9A9CsV6tXZ76aNK5aV74TTkRk21l6xu10B2FYc79AIKnQOmPUyU5oS1KPQeX+cmWTw3a9A4JmyAxjkA3Yfc7K0s4Qi2apz0EJDjfl3e1K3hqVhhLnc1RTS4Hz2xvcwA+j1yWH+y7P+THkruqvtEtQscGYfnkM2dpuQ1KSFQoPe3NAOkbGsRl1Gr9ggOUG6PPqXcaSWk/GdtBOHUCmUZZzTaAvWzMwFu2X8bhVAeBbawDGHzMEH7s3smeF1KmQB9YZl3qNNvHaw14KOL7ugvQeAdGemvaks1wq2oYGQnwkpM+0ZudAIaO0Ly7wM5ve4TQtVVMD9KWy8dYV+1yGXxuplkw8gREKQ4yRFGQk9TY9s1RJCGFs5YA+jNdqYVIompEc9YferUfVnevaWuuzhCR++lQAA`}
        />
        <article className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </Section>
    </>
  );
}
