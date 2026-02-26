import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, author, created_at, content')
    .eq('id', id)
    .single();

  if (error || !article) notFound();

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
          src={`https://crbswbfgtbkjinzagblg.supabase.co/storage/v1/object/public/article_thumbnails/${article.title.toLowerCase().replaceAll(' ', '-')}.webp`}
          alt={`${article.title}`}
          className="block w-auto rounded-lg"
          width={1920}
          height={1080}
        />
        <article className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </Section>
    </>
  );
}
