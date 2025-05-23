// src/lib/postagens.ts

import { collection, query, orderBy, limit, getDocs, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from './firebase'; // Assuming your firebase config is exported from firebase.ts
import { Post } from './types';

export async function getRecentPosts(limitAmount: number = 10): Promise<Post[]> {
  try {
    const postsCollectionRef = collection(db, 'posts');
    // Order by 'createdAt' field (Timestamp), descending
    const q = query(
      postsCollectionRef,
      orderBy('createdAt', 'desc'),
      limit(limitAmount)
    );

    const querySnapshot = await getDocs(q);

    const posts: Post[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData; // Explicitly cast for TypeScript
      // Safely get createdAt and convert to Date, then to ISO string for the Post interface
      let createdAtDate: Date | null = null;
      if (data.createdAt instanceof Timestamp) {
        createdAtDate = data.createdAt.toDate();
      } else if (data.createdAt instanceof Date) {
        createdAtDate = data.createdAt;
      }

      return {
        id: doc.id,
        title: data.title || 'Sem Título', // Provide fallback
        date: createdAtDate ? createdAtDate.toISOString() : new Date().toISOString(), // Convert Date to ISO string, provide fallback
        author: data.author || 'Autor Desconhecido', // Provide fallback
        imageUrl: data.imageUrl || '', // Provide fallback
        excerpt: data.excerpt || (data.content?.substring(0, 150) + '...') || 'Sem resumo', // Provide fallback, truncate content if excerpt is missing
        content: data.content || '', // Provide fallback
        slug: data.slug || doc.id, // Provide fallback
      };
    });

    return posts;
  } catch (error) {
    console.error("Error fetching recent posts for carousel:", error);
    // Re-throw the error so it can be caught in page.tsx
    throw new Error("Failed to fetch recent posts for carousel.");
  }
}

// You would add other Firestore interaction functions for posts here
// e.g., addPost, updatePost, deletePost, getPostBySlug
