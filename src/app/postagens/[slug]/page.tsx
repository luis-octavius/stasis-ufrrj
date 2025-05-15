import { mockPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, UserCircle2 } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Não Encontrado - ΣΤΑΣΙΣ UFRRJ",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.title} - ΣΤΑΣΙΣ UFRRJ`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl
        ? [post.imageUrl, ...previousImages]
        : previousImages,
      type: "article",
      authors: [post.author],
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 md:p-10 rounded-lg shadow-xl">
      <div className="mb-8">
        <Button
          variant="outline"
          asChild
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <Link href="/postagens">
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Voltar para Postagens
          </Link>
        </Button>
      </div>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase-ancient text-primary mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="text-sm text-foreground/70 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center">
            <UserCircle2 size={16} className="mr-1.5 text-accent" />
            Por {post.author}
          </span>
          <span className="inline-flex items-center">
            <CalendarDays size={16} className="mr-1.5 text-accent" />
            {new Date(post.date).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </header>

      {post.imageUrl && (
        <div className="relative w-full h-64 md:h-80 mb-10 rounded-lg overflow-hidden shadow-md">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="article detail philosophy event"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none" // prose styles applied from globals.css
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="my-12 border-border" />

      <div className="text-center">
        <Button
          variant="default"
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/">
            <ArrowLeft size={18} className="mr-2" />
            Voltar para Início
          </Link>
        </Button>
      </div>
    </article>
  );
}
