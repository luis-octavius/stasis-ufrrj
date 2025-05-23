// src/app/postagens/edit/[slug]/page.tsx
// NO "use client"; HERE

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase"; // Adjust path

import EditPostClient from "../../../../components/EditPostClient"; // Import the client component

// Define a interface para os dados do post
interface PostData {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  content: string;
  authorId: string;
  createdAt: Date | null; // Expect Date or null
}

// Função para gerar parâmetros estáticos para o build
export async function generateStaticParams() {
  console.log("Running generateStaticParams for edit page...");

  try {
    const postsCollection = collection(db, "posts");
    const querySnapshot = await getDocs(postsCollection);

    const params = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.slug && typeof data.slug === "string") {
          console.log("Found post with slug for edit:", data.slug);
          return { slug: data.slug };
        }
        return null;
      })
      .filter((param) => param !== null);

    console.log("generateStaticParams for edit returning:", params);
    return params;
  } catch (error) {
    console.error("Error in generateStaticParams for edit:", error);
    throw error; // Re-throw the error to fail the build explicitly
  }
}

// Server Component Page
export default async function EditPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params; // Get slug from params

  // Fetch the specific post data on the server side
  let postData: PostData | null = null;
  try {
    console.log(
      `Fetching post data on server for edit page with slug: ${slug}`,
    );
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const rawData = doc.data(); // Get raw data

      // Convert Timestamp to Date on the server
      let createdAtDate: Date | null = null;
      if (
        rawData.createdAt instanceof Timestamp &&
        typeof rawData.createdAt.toDate === "function"
      ) {
        createdAtDate = rawData.createdAt.toDate();
      }

      postData = {
        id: doc.id,
        title: rawData.title,
        slug: rawData.slug,
        imageUrl: rawData.imageUrl,
        content: rawData.content,
        authorId: rawData.authorId,
        createdAt: createdAtDate, // Use the converted date
      } as PostData;

      console.log("Post data fetched on server for edit:", postData);
      // Pass fetched data to the client component
      return <EditPostClient initialPostData={postData} slug={slug} />;
    } else {
      console.log(`No post found on server for edit page with slug: ${slug}`);
      // Pass null if post not found
      return <EditPostClient initialPostData={null} slug={slug} />;
    }
  } catch (error) {
    console.error("Error fetching post data on server for edit:", error);
    // Pass null if error occurs
    return <EditPostClient initialPostData={null} slug={slug} />;
  }
}
