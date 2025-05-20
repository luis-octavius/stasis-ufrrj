// src/app/postagens/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../../lib/firebase"; // Adjust path as needed
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import { useParams, useRouter } from 'next/navigation'; // Import useParams and useRouter
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import Link from "next/link"; // Import Link

export default function ViewPostPage() {
  const router = useRouter();
  const params = useParams(); // Get parameters from the URL
  const slug = params.slug as string; // Get the slug from the URL parameters

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // State to hold user information
  const [loadingAuth, setLoadingAuth] = useState(true); // State to indicate auth loading


   // Authentication check (optional for viewing, but useful for showing edit button)
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
       setUser(currentUser);
       setLoadingAuth(false);
     });
     return () => unsubscribe();
   }, [auth]); // Dependency on auth


  // Fetch post data based on slug
  useEffect(() => {
    if (!slug) {
        // Don't fetch if slug is not available
        return;
    }

    const fetchPost = async () => {
        setLoading(true);
        try {
            const postsCollection = collection(db, "posts");
            // Create a query to find the post by slug
            const q = query(postsCollection, where("slug", "==", slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No matching post found for slug:", slug);
                // Redirect to a 404 page or show a message
                router.push('/postagens/not-found'); // Example redirect to a not found page
                return;
            }

            // Assuming slug is unique, there should be only one document
            const postDoc = querySnapshot.docs[0];
            setPost({ id: postDoc.id, ...postDoc.data() });

        } catch (error) {
            console.error("Error fetching post:", error);
            // Handle error fetching post, e.g., show an error message
             router.push('/postagens/not-found'); // Redirect on error as well
        } finally {
            setLoading(false);
        }
    };

    fetchPost();

  }, [slug, router]); // Rerun when slug or router changes


  if (loading || loadingAuth) {
    return <div className="text-center mt-8">Carregando postagem...</div>; // Mensagem em português
  }

   // If post is null, it means it wasn't found and we redirected, but adding a check here is good practice
  if (!post) {
      return null; // Or a loading indicator, but the redirect should handle this
  }


  return (
    <div className="container mx-auto px-4 py-8">
        {/* Back button or link (optional) */}
         <div className="mb-6">
             <Link href="/postagens" className="text-indigo-600 hover:underline">
                 &larr; Voltar para as Postagens {/* Texto do link em português */}
             </Link>
         </div>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1> {/* Título da postagem */}

       {/* Display edit button only if user is logged in and is the author */}
       {user && user.uid === post.authorId && (
           <div className="mb-4">
               <Link href={`/postagens/edit/${post.slug}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                   Editar Postagem {/* Texto do botão em português */}
               </Link>
           </div>
       )}

      {post.imageUrl && (
        <div className="mb-6">
          <img src={post.imageUrl} alt={post.title} className="w-full h-80 object-cover rounded-md" />
        </div>
      )}

      <div className="prose max-w-none"> {/* Using 'prose' class for basic typography, requires @tailwindcss/typography plugin */}
        <p>{post.content}</p> {/* Conteúdo da postagem */}
         {/* You might want to render the content as HTML if you use a rich text editor */}
      </div>

       {/* Display author and date (optional) */}
       <div className="mt-8 text-sm text-gray-600">
           {post.authorId && <p>Autor ID: {post.authorId}</p>} {/* Display author ID (for now) */}
            {post.createdAt && <p>Publicado em: {new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR')}</p>} {/* Display formatted date */}
       </div>

    </div>
  );
}
