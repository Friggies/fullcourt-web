import { Article } from '@/lib/types';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogCard({ article }: { article: Article }) {
  return (
    <li className="relative w-full">
      <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-foreground shadow">
        <CalendarIcon size={12} />
        {new Date(article.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        })}
      </div>

      <Link
        href={`/blog/${article.id}`}
        className="relative block w-full overflow-hidden rounded-md border shadow-sm"
      >
        <div className="relative w-full aspect-[16/9] bg-muted">
          <Image
            src={`https://crbswbfgtbkjinzagblg.supabase.co/storage/v1/object/public/article_thumbnails/${article.title
              .toLowerCase()
              .replaceAll(' ', '-')}.webp`}
            alt={`${article.title} preview`}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={`data:image/webp;base64,UklGRiAFAABXRUJQVlA4IBQFAABQRwCdASrCAf0AP/3+/3+/u7+7pNIa2/A/iWNu3w9j9cXyTVgw/XjF1o/kFY3YgMHydYjFfpnhOsQDA4Mq31iMV+Uvvtyqdpts56PH79brYOxpCW6dK1wnBevQJmNaVPakDddUMVEjTRWcrFQmcI+sCrM/wEJ+63+WDQqp4jwR8L1PY1jO2bBDkyKOWyOjc1GiD6KNumxkjdvL7QT++9zMqoX0LD9yGMf7FPP6c0SsaoQrCHbGl68zOiPipf9R7Dt6hvXwdo92iGxQGP6DOmO40KL1YRPpYObIhrDwcogH4BArW0ZgjVGs/wm3DTbgJpK7Cyvg9c8QvwenjkyTW7FTkzmYixCstS8s/cv5ErYFs6/0Tq3ADIntfbRrq85jBTiJ5KX4MbTYOexBgL2kykumg+SE5RzScBBQ4yu7QxLmujPeN/QIhhxIfY0ng6FEMvMjZgieTWxQgQd3WBvkQBpaL6Mmx2vG0xaZrVmV8OD7Q2PJjuUDAf4GZFI7yzpxC5MhgbQtHNekI0wEANTFiYwvF2fi1feyQ4Mfpd8pnC8YWD+qSFbDo7krod3gkipgOIGAU1v9FN3kqp/Lqy+/QCYLHjIGtEMN+uSP5mSQOa/niVTQBgezqEkh1C9Yih9lyqV8EoRh/Xx010vkWjMwNoSxgI0IR5HveKGu3sSkVU4s79JyMB2HG36lsJizTyGK2KdGiWVlDtNjOKMYevtFLaNTWHvEvyKLtZcXKllcBzvcCcoplPG6PsYxTkcK5+07WHqGDgAA/peND2YVC/vf80Yc1iWjtVBj8ajJ2w/88bLWyHJ8k9Lu1Z7Cfcd2pYwplIOQBuCX8YmePzpS8ULodEVj5Qf9Rpyuf20/Z4wf8+pglo6Bnh5S0dkjyiA5z9QJvoB8Ovv7CP7OPuFVExJWqQv1mgd70wrwaMr39mHFDTZIFpk5SB4brNq+XYjjyLbO1Av0/g4VF0t23ZBUmioTYjnx2BGP+ZOP3lzav5af4C39JKUiFgAsb4czGBgDIh8cEO+n2y60ZTXen+HVk5zWZ9RrCfm1geeOJmsDqDC76qIVGaaxrWM51Z/U4VoHJcdwuBonepxQ/GJCrQt1kiLiJxGBsA4ETnF8psutLj6XqdzsHtPhni8xrxbJAkIZp+RBziryZl5Pt1lPWPxEPAIWlZacIz9jrxxIXsWxilzCiAK3f2QdWrm0MnyTaA3wcmqK7niOyIi03xodrAu6qo9Afyfc+65oaR+jOYEl4i7KtMQ1hYWJOz3Trph4hGdp7CZS3BxYHKM0eUw4+LK3YAf8UimpFvcGGvyDc6jpODkwqNJSXh9A9CsV6tXZ76aNK5aV74TTkRk21l6xu10B2FYc79AIKnQOmPUyU5oS1KPQeX+cmWTw3a9A4JmyAxjkA3Yfc7K0s4Qi2apz0EJDjfl3e1K3hqVhhLnc1RTS4Hz2xvcwA+j1yWH+y7P+THkruqvtEtQscGYfnkM2dpuQ1KSFQoPe3NAOkbGsRl1Gr9ggOUG6PPqXcaSWk/GdtBOHUCmUZZzTaAvWzMwFu2X8bhVAeBbawDGHzMEH7s3smeF1KmQB9YZl3qNNvHaw14KOL7ugvQeAdGemvaks1wq2oYGQnwkpM+0ZudAIaO0Ly7wM5ve4TQtVVMD9KWy8dYV+1yGXxuplkw8gREKQ4yRFGQk9TY9s1RJCGFs5YA+jNdqYVIompEc9YferUfVnevaWuuzhCR++lQAA`}
          />
        </div>

        <div className="absolute bottom-0 w-full bg-background/60 backdrop-blur-sm p-4">
          <h2 className="text-lg font-semibold leading-tight">
            {article.title}
          </h2>
        </div>
      </Link>
    </li>
  );
}
