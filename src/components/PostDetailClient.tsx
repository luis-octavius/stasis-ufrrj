// src/components/PostDetailClient.tsx
"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase"; // Adjust path as needed for the component
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link"; // Import Link

// Define a interface para os dados do post (adapte conforme a estrutura real dos seus posts)
interface PostData {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    content: string;
    authorId: string;
    // AGORA ESPERAMOS QUE createdAt JÁ SEJA UM OBJETO DATE OU NULL
    createdAt: Date | null;
}

interface PostDetailClientProps {
    initialPostData?: PostData | null; // Recebe os dados iniciais do server component (pode ser null)
    slug: string; // Recebe o slug do server component
}


export default function PostDetailClient({ initialPostData, slug }: PostDetailClientProps) {
    const router = useRouter();

    // Use initial data if available, otherwise set to null initially
    // Corrigido o erro de tipagem aqui: use initialPostData ?? null
    const [post, setPost] = useState<PostData | null>(initialPostData ?? null);
    const [loading, setLoading] = useState(initialPostData === undefined); // Set loading based on if initialData was provided (undefined indicates no data yet)
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Authentication check (optional for viewing, but useful for showing edit button)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [auth]);

    // Fetch post data if not provided initially (e.g., if using ISR or client-side navigation without initial data)
    // NOTE: With static export and generateStaticParams, initialPostData SHOULD be provided during build/SSR.
    // This useEffect is more for fallback or other rendering strategies.
    useEffect(() => {
        if (initialPostData === undefined && slug) { // Only fetch if initialData was explicitly NOT provided (undefined)
             const fetchPost = async () => {
                setLoading(true);
                try {
                    console.log(`Fetching post with slug: ${slug} in client component (fallback)`);
                    const postsCollection = collection(db, "posts");
                    const q = query(postsCollection, where("slug", "==", slug));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0];
                        const postData = { ...doc.data(), id: doc.id } as PostData;
                        // NOTE: Assuming createdAt is already a Date or null from server component
                        setPost(postData);
                        console.log("Post found in client component:", postData);
                    } else {
                        setPost(null);
                        console.log(`No post found with slug: ${slug} in client component`);
                    }
                } catch (error) {
                    console.error("Error fetching post in client component:", error);
                    setPost(null); // Clear post on error
                } finally {
                    setLoading(false);
                     console.log("Post fetch finished in client component.");
                }
             };
             fetchPost();
        } else {
             // Use console.log with more specific message based on initialData
            if (initialPostData === null) {
                console.log("Initial post data was null (post not found on server).");
            } else if (initialPostData) {
                console.log("Using initial post data provided by server.");
            } else {
                console.log("Initial data is undefined and slug is missing.");
            }

            // If initialData was provided (even if null), we are not loading client-side data
             if (initialPostData !== undefined) {
                 setLoading(false);
             }
        }
    }, [slug, initialPostData]); // Depend on slug and initialPostData


    if (loading || loadingAuth) {
      return <div className="container mx-auto px-4 py-8 text-center">Carregando postagem...</div>;
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-600">
                Postagem não encontrada.
            </div>
        );
    }

    // Format date if createdAt is a Date object
    // A lógica de formatação ainda é necessária, mas agora esperamos um Date ou null
    const formattedDate = post.createdAt instanceof Date
        ? post.createdAt.toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Data Indisponível';


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
             {post.imageUrl && (
                <div className="mb-6">
                    {/* Consider using Next.js Image component for optimization */}
                    <img
                        src={post.imageUrl}
                        alt={`Imagem da postagem: ${post.title}`}
                        className="w-full h-64 object-cover rounded-md"
                    />
                </div>
            )}
            <p className="text-gray-600 text-sm mb-4">
                Por {post.authorId} em {formattedDate} {/* Use authorId, you might want to fetch author name later */}
            </p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Render HTML content */}

             {/* Edit Button (conditionally rendered) */}
            {user && user.uid === post.authorId && (
                <div className="mt-8">
                    <Link href={`/postagens/edit/${post.slug}`}>
                        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Editar Postagem
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
