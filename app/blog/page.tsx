import { Hero } from '@/components/common/Hero';
import { Section } from '@/components/common/Section';
import BlogCard from '@/components/features/Blog/BlogCard';
import { createClient } from '@/lib/supabase/server';

export default async function Blog() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, author, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <>
      <Hero title="Our Blog" />
      <Section>
        <p className="w-full text-center text-muted-foreground">
          Our latest articles on basketball training, drills, and coaching tips.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles?.map(article => (
            <BlogCard article={article} key={article.id} />
          ))}
        </ul>
      </Section>
    </>
  );
}
