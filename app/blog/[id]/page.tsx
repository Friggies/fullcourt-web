import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import { createClient } from '@/lib/supabase/server';
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
        <article className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </Section>
    </>
  );
}
