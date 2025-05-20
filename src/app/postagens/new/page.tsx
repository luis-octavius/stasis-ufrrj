// src/app/postagens/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../../lib/firebase"; // Adjust path as needed
import { collection, query, orderBy, startAfter, limit, getDocs, DocumentData } from "firebase/firestore"; // Import Firestore functions
import Link from "next/link"; // Import Link
import { onAuthStateChanged, User } from "firebase/auth"; // Import onAuthStateChanged and User type


export default function PostagensPage() {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null); // For pagination
  const [loadingMore, setLoadingMore] = useState(false); // For pagination loading state
  const [hasMore, setHasMore] = useState(true); // For pagination, whether there are more posts to load
  const [user, setUser] = useState<User | null>(null); // State to hold user information
  const [loadingAuth, setLoadingAuth] = useState(true); // State to indicate auth loading


  const POSTS_PER_PAGE = 5; // Define how many posts to load per page

  // Authentication check to determine if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false); // Auth loading finished
    });
    return () => unsubscribe();
  }, [auth]); // Dependency on auth


  // Fetch initial posts
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setLoading(true);
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));
        const querySnapshot = await getDocs(q);

        const initialPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(initialPosts);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE); // Check if there are potentially more posts

      } catch (error) {
        console.error("Error fetching initial posts:", error);
        // Handle error fetching posts
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();

  }, []); // Empty dependency array means this runs only once on component mount


  // Fetch more posts for pagination
   const fetchMorePosts = async () => {
     if (!lastDoc || !hasMore || loadingMore) return; // Stop if no last doc, no more posts, or already loading

     setLoadingMore(true);
     try {
       const postsCollection = collection(db, "posts");
       const q = query(postsCollection, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(POSTS_PER_PAGE));
       const querySnapshot = await getDocs(q);

       const newPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setPosts(prevPosts => [...prevPosts, ...newPosts]);
       setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
       setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE); // Check if there are potentially more posts

     } catch (error) {
       console.error("Error fetching more posts:", error);
       // Handle error fetching more posts
     } finally {
       setLoadingMore(false);
     }
   };


  if (loading || loadingAuth) {
    return <div className="text-center mt-8">Carregando postagens...</div>; // Mensagem em português
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Descrição sobre o stásis */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo ao ΣΤΑΣΙΣ</h2> {/* Título da descrição */}
        <p className="text-gray-700">
          O ΣΤΑΣΙΣ é um espaço dedicado à divulgação de conteúdo relevante para a comunidade. Aqui você encontrará anúncios de cursos, informações sobre eventos, e publicações ou artigos sobre diversos temas. Explore as postagens abaixo para ficar atualizado!
        </p> {/* Descrição em português */}
      </div>


      {/* Botão para Criar Nova Postagem (condicional) */}
      {user && ( // Show button only if user is logged in
        <div className="mb-6 text-right"> {/* Align button to the right */}
            <Link href="/postagens/new" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Criar Nova Postagem {/* Texto do botão em português */}
            </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Últimas Postagens</h1> {/* Título em português */}

      {posts.length === 0 && !loading && (
          <p className="text-center text-gray-600">Nenhuma postagem encontrada.</p> // Mensagem em português
      )}

      {/* List of posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2> {/* Título da postagem */}
             {post.createdAt && <p className="text-sm text-gray-500 mb-2">Publicado em: {new Date(post.createdAt.seconds * 1000).toLocaleDateString('pt-BR')}</p>} {/* Data de publicação */}
            {post.imageUrl && (
              <div className="mb-4">
                <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-md" />
              </div>
            )}
            <p className="text-gray-700 line-clamp-3">{post.content}</p> {/* Preview do conteúdo */}
            <Link href={`/postagens/${post.slug}`} className="text-indigo-600 hover:underline mt-2 inline-block">
              Ler mais {/* Texto do link em português */}
            </Link>
          </div>
        ))}
      </div>

       {/* Pagination/Load more button */}
      {hasMore && (
          <div className="text-center mt-8">
              <button
                  onClick={fetchMorePosts}
                  disabled={loadingMore}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                  {loadingMore ? "Carregando mais..." : "Carregar Mais Postagens"} {/* Texto do botão em português */}
              </button>
          </div>
      )}
    </div>
  );
}
