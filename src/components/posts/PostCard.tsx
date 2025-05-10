import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, UserCircle2 } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden bg-card group">
      {post.imageUrl && (
        <CardHeader className="p-0">
          <Link href={`/postagens/${post.slug}`} className="block relative w-full h-56">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-105"
              data-ai-hint="article philosophy event"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </CardHeader>
      )}
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-xl lg:text-2xl font-semibold mb-3 uppercase-ancient text-primary">
          <Link href={`/postagens/${post.slug}`} className="hover:text-accent transition-colors duration-200">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs text-card-foreground/70 mb-3 space-x-4">
          <span className="inline-flex items-center">
            <UserCircle2 size={14} className="mr-1.5 text-accent" />
            {post.author}
          </span>
          <span className="inline-flex items-center">
            <CalendarDays size={14} className="mr-1.5 text-accent" />
            {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </CardDescription>
        <p className="text-sm text-card-foreground/90 line-clamp-4 leading-relaxed">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors group/button text-sm">
          <Link href={`/postagens/${post.slug}`}>
            Continuar Lendo <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
