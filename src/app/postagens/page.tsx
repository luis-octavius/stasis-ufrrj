import { mockPosts } from "@/lib/data";
import PostCard from "@/components/posts/PostCard";
import type { Metadata } from "next";

import Link from "next/link";
export const metadata: Metadata = {
  title: "Postagens - ΣΤΑΣΙΣ UFRRJ",
  description:
    "Artigos, ensaios e notícias do Grupo de Estudos em Filosofia ΣΤΑΣΙΣ da UFRRJ.",
};

const GreekPatternLine = () => (
  <div
    className="my-8 h-2 w-full max-w-xs mx-auto overflow-hidden"
    aria-hidden="true"
    data-ai-hint="greek pattern divider"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="1"
        x2="100"
        y2="1"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeDasharray="5 3"
      />
    </svg>
  </div>
);

export default function PostagensPage() {
  const sortedPosts = [...mockPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-card shadow-lg rounded-lg">
        <Link href="/postagens/new">
          <button className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-accent transition-colors duration-200">
            Criar Nova Postagem
          </button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold uppercase-ancient text-primary mb-3">
          Postagens
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto px-4">
          Explore nossos artigos, ensaios e notícias sobre filosofia e eventos
          do grupo.
        </p>
      </section>

      <GreekPatternLine />

      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-foreground/70 py-10">
          Nenhuma postagem encontrada no momento. Volte em breve!
        </p>
      )}
    </div>
  );
}
