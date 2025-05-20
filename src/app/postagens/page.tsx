// src/app/postagens/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Import db
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from "firebase/firestore"; // Import Firestore functions
import Link from "next/link"; // Import Link

const POSTS_PER_PAGE = 5; // Define how many posts to load per page

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null); // To store the last document of the current page
  const [firstVisible, setFirstVisible] = useState<DocumentSnapshot | null>(null); // To store the first document of the current page (for previous button)
  const [hasMore, setHasMore] = useState(true); // To indicate if there are more posts to load
  const [hasPrevious, setHasPrevious] = useState(false); // To indicate if there are previous posts

  // Function to fetch posts
  const fetchPosts = async (direction: "next" | "previous" | "initial" = "initial") => {
    setLoading(true);
    let postsQuery;
    let firstDoc = null;
    let lastDoc = null;

    try {
      const postsCollection = collection(db, "posts");
      let baseQuery = query(postsCollection, orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));

      if (direction === "next" && lastVisible) {
        postsQuery = query(baseQuery, startAfter(lastVisible));
      } else if (direction === "previous" && firstVisible) {
         // To go back, we need to order by ascending and then reverse the results
         // This approach can be complex with Firestore cursors for truly bidirectional pagination
         // For simplicity, we'll implement forward pagination first and then explore previous
         // For now, let's focus on 'initial' and 'next'
         console.warn("Previous pagination is not fully implemented in this example.");
         setLoading(false);
         return;

      } else { // initial
        postsQuery = baseQuery;
        setHasPrevious(false); // No previous page on initial load
      }

      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (postsData.length > 0) {
        firstDoc = querySnapshot.docs[0];
        lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastDoc);
        setFirstVisible(firstDoc);
        setPosts(postsData);

        // Check if there are more posts
        const nextQuery = query(postsCollection, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(1));
        const nextSnapshot = await getDocs(nextQuery);
        setHasMore(!nextSnapshot.empty);

        // Check if there are previous posts (more complex, placeholder for now)
        if (direction === "next") {
             setHasPrevious(true);
        }


      } else {
        setPosts([]);
        setLastVisible(null);
        setFirstVisible(null);
        setHasMore(false);
        if (direction === "initial") {
             setHasPrevious(false);
        }
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
      // You might want to set an error state here
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial posts on component mount
  useEffect(() => {
    fetchPosts("initial");
  }, []); // Empty dependency array ensures this runs only once on mount


   const handleNextPage = () => {
    if (hasMore) {
      fetchPosts("next");
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
        // Placeholder: Implement previous page logic here
        console.log("Implement previous page logic");
        // This will likely involve storing cursors for previous pages or re-fetching
        // based on the firstVisible document, ordered ascending.
    }
  };


  if (loading) {
    return <div className="text-center mt-8">Carregando postagens...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Últimas Postagens</h1> {/* Título em português */}

      {posts.length === 0 && !loading && (
          <p className="text-center text-gray-600">Nenhuma postagem encontrada.</p> // Mensagem em português
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border shadow-md overflow-hidden">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              {/* Display a truncated version of the content */}
              <p className="text-gray-700 text-sm mb-4">
                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
              </p>
              <Link href={`/postagens/${post.slug}`} className="text-indigo-600 hover:underline">
                Ler mais {/* Texto do link em português */}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPrevious || loading}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-gray-200 disabled:opacity-50"
        >
          Anterior {/* Texto do botão em português */}
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Próxima {/* Texto do botão em português */}
        </button>
      </div>
    </div>
  );
}
