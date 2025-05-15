"use client";

import type { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

interface PostCarouselProps {
  posts: Post[];
}

export default function PostCarousel({ posts }: PostCarouselProps) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-lg text-foreground/80 py-10">
        Nenhuma postagem recente encontrada.
      </p>
    );
  }

  const plugin = React.useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
      direction: "forward",
    }),
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: posts.length > 1,
      }}
      plugins={[plugin.current]}
      className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-4">
        {posts.map((post) => (
          <CarouselItem
            key={post.id}
            className="pl-4 sm:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1 h-full">
              <Card className="flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card overflow-hidden group">
                <CardHeader className="p-0">
                  <Link
                    href={`/postagens/${post.slug}`}
                    className="block relative w-full h-48"
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint="philosophy event article"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-lg font-semibold mb-2 leading-tight uppercase-ancient text-primary group-hover:text-accent transition-colors">
                    <Link href={`/postagens/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <div className="text-xs text-card-foreground/70 mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="flex items-center mb-1 sm:mb-0">
                      <User size={12} className="mr-1 text-accent" />{" "}
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <CalendarDays size={12} className="mr-1 text-accent" />{" "}
                      {new Date(post.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-card-foreground/90 line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    asChild
                    variant="link"
                    className="text-accent hover:text-accent/80 p-0 text-sm"
                  >
                    <Link
                      href={`/postagens/${post.slug}`}
                      className="flex items-center"
                    >
                      Ler Mais <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {posts.length > 1 && (
        <>
          <CarouselPrevious className="hidden sm:flex absolute left-[-20px] md:left-[-50px] top-1/2 -translate-y-1/2 text-foreground bg-background/60 hover:bg-background/90 border-primary/30 disabled:opacity-30" />
          <CarouselNext className="hidden sm:flex absolute right-[-20px] md:right-[-50px] top-1/2 -translate-y-1/2 text-foreground bg-background/60 hover:bg-background/90 border-primary/30 disabled:opacity-30" />
        </>
      )}
    </Carousel>
  );
}
