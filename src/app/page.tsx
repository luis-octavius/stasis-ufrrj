import { mockPosts } from "@/lib/data";
import PostCarousel from "@/components/home/PostCarousel";
import Image from "next/image";

const LaurelWreathSectionIcon = () => (
  <div aria-hidden="true" className="my-12 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      className="inline-block w-auto h-12 text-accent opacity-50"
      data-ai-hint="laurel decoration"
    >
      <defs>
        <path
          id="decorated-leaf"
          d="M0,0 C10,-5 20,-5 30,0 C20,5 10,5 0,0 Z"
          fill="currentColor"
        />
      </defs>
      {/* Left branch */}
      <g transform="translate(100, 30) scale(0.7, 0.7)">
        {[...Array(6)].map((_, i) => (
          <use
            key={`left-leaf-deco-${i}`}
            href="#decorated-leaf"
            transform={`rotate(${-75 + i * 25}) translate(40, 0) scale(0.9) rotate(10)`}
          />
        ))}
      </g>
      {/* Right branch */}
      <g transform="translate(100, 30) scale(-0.7, 0.7)">
        {[...Array(6)].map((_, i) => (
          <use
            key={`right-leaf-deco-${i}`}
            href="#decorated-leaf"
            transform={`rotate(${-75 + i * 25}) translate(40, 0) scale(0.9) rotate(10)`}
          />
        ))}
      </g>
    </svg>
  </div>
);

export default function HomePage() {
  const latestPosts = [...mockPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="text-center py-12 bg-card shadow-xl rounded-lg overflow-hidden">
        {/* <div className="relative w-36 h-36 mx-auto mb-6">
           <Image 
            src="https://picsum.photos/200/200?random=100"
            alt="Stásis UFRRJ Logo Concept"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-background shadow-md"
            data-ai-hint="philosophy wisdom symbol"
            priority
          />
        </div> */}
        <h2 className="text-5xl md:text-6xl font-bold uppercase-ancient text-primary mb-4">
          ΣΤΑΣΙΣ <span className="text-accent">UFRRJ</span>
        </h2>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8 px-4">
          Grupo de Pesquisa em Filosofia da Universidade Federal Rural do Rio de
          Janeiro.
        </p>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto px-4">
          Explorando os caminhos do pensamento, da antiguidade à
          contemporaneidade. Participe de nossos debates, palestras e
          publicações.
        </p>
      </section>

      <LaurelWreathSectionIcon />

      <section>
        <h3 className="text-4xl font-semibold uppercase-ancient text-center mb-10 text-primary">
          Últimas Postagens
        </h3>
        <PostCarousel posts={latestPosts} />
      </section>

      <LaurelWreathSectionIcon />

      <section className="py-12 bg-secondary/20 rounded-lg shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold uppercase-ancient mb-6 text-primary">
            Sobre o Grupo
          </h3>
          <p className="text-xl font-normal text-foreground/80 max-w-2xl mx-auto mb-4">
            O <strong>Stásis (ΣΤΆΣΙΣ)</strong> é um grupo de pesquisa em filosofia
            da <strong>UFRRJ</strong> que investiga as dinâmicas do conflito
            político, tomando como eixo central o conceito grego de{" "}
            <em>stásis</em> – a guerra civil na Antiguidade clássica. Nosso
            objetivo é articular o pensamento de filósofos como Platão e
            Aristóteles, que refletiram profundamente sobre a stásis, com as
            crises políticas do mundo atual, no qual divisões radicais,
            polarizações e colapsos institucionais ecoam os mesmos desafios
            enfrentados pelas <em>póleis</em> gregas.
          </p>
        </div>
      </section>
    </div>
  );
}
