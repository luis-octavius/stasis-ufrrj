// src/app/postagens/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Import db
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentSnapshot, Timestamp } from "firebase/firestore"; // Import Firestore functions, add Timestamp
import Link from "next/link"; // Import Link
import Image from "next/image"; // Import Image component if you use it
import { User, CalendarDays, ArrowRight } from "lucide-react"; // Import icons used in carousel card

// Import your UI components - Adjust paths based on where these components are defined in your project
// Assuming these are from a library like Shadcn UI or similar
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Example paths - ADJUST THESE
import { Button } from "@/components/ui/button"; // Example path - ADJUST THIS

const POSTS_PER_PAGE = 6; // Increase posts per page for a better grid layout

// Update the PostData interface to include 'author' and 'excerpt'
interface PostData {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    content: string; // Still keep content, but use excerpt for the card
    authorId: string; // Keep authorId
    author: string; // Add author name
    excerpt: string; // Add post excerpt
    // Assuming createdAt is already a Date or Timestamp when fetched
    createdAt: Date | Timestamp | null; // Allow Date or Timestamp from fetch
}


export default function PostsPage() {
  const [posts, setPosts] = useState<PostData[]>([]); // Use PostData type
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);


  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    let postsQuery;
    let lastDoc = null;

    try {
      const postsCollection = collection(db, "posts");
      // Ensure orderBy is correct and fields like 'author' and 'excerpt' are included in your Firestore documents
      let baseQuery = query(postsCollection, orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));

      if (lastVisible) {
        postsQuery = query(baseQuery, startAfter(lastVisible));
      } else { // initial load
        postsQuery = baseQuery;
      }

      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => {
           const rawData = doc.data();
           // Convert Timestamp to Date if necessary, ensure all fields are present
           let createdAtDate: Date | null = null;
            if (rawData.createdAt instanceof Timestamp && typeof rawData.createdAt.toDate === 'function') {
                 createdAtDate = rawData.createdAt.toDate();
            } else if (rawData.createdAt instanceof Date) {
                 createdAtDate = rawData.createdAt;
            } else {
                 createdAtDate = null; // Or handle cases where it's not a valid date
            }

           return {
               id: doc.id,
               ...rawData,
               createdAt: createdAtDate, // Use the converted date
               // Ensure 'author' and 'excerpt' are present in rawData from Firestore
               author: rawData.author || 'Autor Desconhecido', // Provide fallback
               excerpt: rawData.excerpt || rawData.content?.substring(0, 150) || 'Sem resumo', // Provide fallback or use truncated content
           } as PostData; // Cast to PostData
        });


      if (postsData.length > 0) {
        lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastDoc);
        setPosts(prevPosts => [...prevPosts, ...postsData]); // Append new posts

        // Check if there are more posts AFTER the last loaded document
        const nextQuery = query(postsCollection, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(1));
        const nextSnapshot = await getDocs(nextQuery);
        setHasMore(!nextSnapshot.empty);

      } else {
         // If no posts were fetched in this call
         setHasMore(false);
         if (!lastVisible) { // If it was the initial fetch and no posts
             setPosts([]);
         }
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
      // You might want to set an error state here
      setHasMore(false); // Assume no more posts on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array ensures this runs only once on mount


   const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(); // Call fetchPosts to load the next page
    }
  };

    // Format date function (can be moved outside or to a utility)
   const formatDate = (date: Date | null): string => {
       if (!date) return 'Data Indisponível';
       // Check if it's a valid Date object before formatting
       if (date instanceof Date && !isNaN(date.getTime())) {
            return date.toLocaleDateString("pt-BR", {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
             });
       }
       return 'Data Inválida';
   };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl uppercase-ancient font-bold mb-6">Últimas Postagens</h1>

      {posts.length === 0 && !loading && lastVisible === null && ( // Show message only if no posts were ever loaded
          <p className="text-center text-gray-600">Nenhuma postagem encontrada.</p>
      )}

      {/* Adjust grid layout for potentially larger cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          // Use the structure from the carousel card
          <div key={post.id} className="p-1 h-full"> {/* Outer div with padding/height */}
              <Card className="flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card overflow-hidden group"> {/* Card component */}
                <CardHeader className="p-0"> {/* CardHeader */}
                  <Link
                    href={`/postagens/${post.slug}`}
                    className="block relative w-full h-48" // Adjust height if needed, was h-48 in carousel
                  >
                    {/* Use Next.js Image component */}
                    {post.imageUrl && (
                       <Image
                         src={post.imageUrl}
                         alt={post.title}
                         layout="fill" // Use layout="fill" with parent being relative and having height/width
                         objectFit="cover"
                         className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                         // data-ai-hint="philosophy event article" // Optional hint
                       />
                    )}
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow p-4"> {/* CardContent */}
                  <CardTitle className="text-lg font-semibold mb-2 leading-tight uppercase-ancient text-primary group-hover:text-accent transition-colors"> {/* CardTitle */}
                    <Link href={`/postagens/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  {/* Author and Date section */}
                  <div className="text-xs text-card-foreground/70 mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="flex items-center mb-1 sm:mb-0">
                      <User size={12} className="mr-1 text-accent" />{" "}
                      {post.author} {/* Use post.author */}
                    </span>
                    <span className="flex items-center">
                      <CalendarDays size={12} className="mr-1 text-accent" />{" "}
                       {formatDate(post.createdAt instanceof Timestamp ? post.createdAt.toDate() : post.createdAt)} {/* Format the date */}
                    </span>
                  </div>
                  {/* Post Excerpt */}
                  <p className="text-sm text-card-foreground/90 line-clamp-3">
                    {post.excerpt} {/* Use post.excerpt */}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0"> {/* CardFooter */}
                  <Button
                    asChild // Use asChild to render Link as the button content
                    variant="link"
                    className="text-accent hover:text-accent/80 p-0 text-sm"
                  >
                    <Link
                      href={`/postagens/${post.slug}`}
                      className="flex items-center"
                    >
                      Ler Mais <ArrowRight className="ml-1.5 h-4 w-4" /> {/* Icon */}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
        ))}
      </div>

      {/* Load More Button (Replacing pagination controls for simpler infinite loading) */}
      <div className="flex justify-center mt-8">
        {hasMore && (
             <button
               onClick={handleLoadMore}
               disabled={loading}
               className="px-6 py-3 border rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {loading ? "Carregando..." : "Carregar Mais Postagens"}
             </button>
        )}
         {!hasMore && posts.length > 0 && !loading && (
              <p className="text-center text-gray-600">Todas as postagens foram carregadas.</p>
         )}
      </div>
    </div>
  );
}
