// src/app/postagens/[slug]/page.tsx
// NO "use client"; HERE

import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'; // Import Timestamp type
import { db } from '../../../lib/firebase'; // Direct import is okay for server code

import PostDetailClient from '../../../components/PostDetailClient'; // Import the client component

// Define a interface para os dados do post
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


// Função para gerar parâmetros estáticos para o build
export async function generateStaticParams() {
  console.log("Running generateStaticParams...");

  try {
    const postsCollection = collection(db, 'posts');
    const querySnapshot = await getDocs(postsCollection);

    const params = querySnapshot.docs.map((doc) => {
      const data = doc.data();
       if (data.slug && typeof data.slug === 'string') {
           console.log("Found post with slug:", data.slug);
           return { slug: data.slug };
       }
       return null;
    }).filter(param => param !== null);

    console.log("generateStaticParams returning:", params);
    return params;

  } catch (error) {
    console.error("Error in generateStaticParams:", error);
     throw error;
  }
}

// Server Component Page
export default async function PostDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params; // Get slug from params passed by Next.js

    // Fetch the specific post data on the server side
    let postData: PostData | null = null;
    try {
        console.log(`Fetching post data on server for slug: ${slug}`);
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const rawData = doc.data(); // Get raw data
            const postData = { ...rawData, id: doc.id } as PostData; // Cast to PostData structure

            // !! ADICIONADA A LÓGICA DE CONVERSÃO DE TIMESTAMP AQUI NO SERVER COMPONENT !!
            if (rawData.createdAt instanceof Timestamp && typeof rawData.createdAt.toDate === 'function') {
                postData.createdAt = rawData.createdAt.toDate();
            } else {
                postData.createdAt = null; // Ensure it's null if not a valid timestamp
            }


            console.log("Post data fetched on server:", postData);
             return <PostDetailClient initialPostData={postData} slug={slug} />; // Render client component with data
        } else {
             console.log(`No post found on server for slug: ${slug}`);
             // If post not found, render client component with null data
             return <PostDetailClient initialPostData={null} slug={slug} />;
        }
    } catch (error) {
        console.error("Error fetching post data on server:", error);
        // If error during fetch, render client component with null data and error state might be handled there
         return <PostDetailClient initialPostData={null} slug={slug} />;
    }

    // This line might not be reached if returning within try/catch, but good practice
    // return <PostDetailClient initialPostData={postData} slug={slug} />;
}
