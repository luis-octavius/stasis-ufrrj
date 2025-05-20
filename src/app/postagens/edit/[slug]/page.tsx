// src/app/postagens/edit/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { storage, db, auth } from "../../../../lib/firebase"; // Adjust path as needed
import { doc, getDocs, updateDoc, collection, query, where } from "firebase/firestore"; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Import Storage functions
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams(); // Get parameters from the URL
  const slug = params.slug as string; // Get the slug from the URL parameters

  const [title, setTitle] = useState("");
  const [currentSlug, setCurrentSlug] = useState(""); // State for the current slug of the post
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null); // State to hold user information
  const [loadingAuth, setLoadingAuth] = useState(true); // State to indicate auth loading
  const [loadingPost, setLoadingPost] = useState(true); // State to indicate post loading
  const [postId, setPostId] = useState<string | null>(null); // State to hold the Firestore document ID

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Fetch post data based on slug
  useEffect(() => {
    if (!slug || loadingAuth || !user) {
        // Don't fetch if slug is not available, auth is loading, or user is not logged in
        return;
    }

    const fetchPost = async () => {
        setLoadingPost(true);
        try {
            const postsCollection = collection(db, "posts");
            // Create a query to find the post by slug
            const q = query(postsCollection, where("slug", "==", slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No matching post found!");
                // Optionally, redirect to a 404 page or show a message
                router.push('/postagens/not-found'); // Example redirect to a not found page
                return;
            }

            // Assuming slug is unique, there should be only one document
            const postDoc = querySnapshot.docs[0];
            const postData = postDoc.data();

            // Check if the logged-in user is the author of the post
            if (postData.authorId !== user.uid) {
                console.warn("User is not the author of this post. Redirecting.");
                // Redirect to a forbidden page or home
                router.push('/'); // Example redirect to home
                return;
            }


            // Set state with fetched data
            setPostId(postDoc.id); // Store the document ID
            setTitle(postData.title);
            setCurrentSlug(postData.slug); // Store the current slug
            setImageUrl(postData.imageUrl || ""); // Use empty string if imageUrl is null/undefined
            setContent(postData.content);

        } catch (error) {
            console.error("Error fetching post:", error);
            // Handle error fetching post, e.g., show an error message
        } finally {
            setLoadingPost(false);
        }
    };

    fetchPost();

  }, [slug, loadingAuth, user, router]); // Rerun when slug, auth state, user, or router changes


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || !user || !postId) return; // Prevent submission if already submitting, not logged in, or no post ID

    setIsSubmitting(true);
    setUploadError(null); // Clear previous errors

    let finalImageUrl = imageUrl; // Start with the current image URL

    // Handle image upload if a new file is selected
    if (imageFile) {
      setIsUploading(true);
      try {
        // Optionally, delete the old image from storage if it exists
        if (imageUrl) {
            try {
                const oldImageRef = ref(storage, imageUrl);
                await deleteObject(oldImageRef);
                console.log("Old image deleted successfully");
            } catch (deleteError) {
                console.warn("Could not delete old image:", deleteError);
                // Continue with the new upload even if old image deletion fails
            }
        }

        const storageRef = ref(
          storage,
          `post-images/${uuidv4()}-${imageFile.name}`,
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(finalImageUrl); // Update state with new image URL
      } catch (error) {
        console.error("Error uploading new image:", error);
        setUploadError("Falha ao enviar a nova imagem. Por favor, tente novamente.");
        setIsUploading(false);
        setIsSubmitting(false);
        return; // Stop submission if new upload fails
      } finally {
        setIsUploading(false);
      }
    } else if (imageUrl === "" && imageFile === null) {
        // If imageUrl was cleared and no new file was selected, remove image from storage
        if (imageUrl) { // Only try to delete if there was a previous image URL
             try {
                const oldImageRef = ref(storage, imageUrl);
                await deleteObject(oldImageRef);
                console.log("Old image deleted successfully because imageUrl was cleared");
                 finalImageUrl = ""; // Clear the finalImageUrl as well
            } catch (deleteError) {
                console.warn("Could not delete old image after clearing URL:", deleteError);
                 // Continue even if deletion fails
            }
        }
         finalImageUrl = ""; // Ensure imageUrl is empty in the document
    }


    // Update post data in Firestore
    try {
      const postRef = doc(db, "posts", postId); // Get the document reference
      await updateDoc(postRef, {
        title,
        slug: currentSlug, // Use the currentSlug state for updates
        imageUrl: finalImageUrl, // Use the final image URL
        content,
        // createdAt and authorId should not be changed during update
      });
      console.log("Document updated successfully!");
      router.push(`/postagens/${currentSlug}`); // Redirect to the updated post page
    } catch (error) {
      console.error("Error updating document: ", error);
      setUploadError("Falha ao atualizar a postagem. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(""); // Clear the current imageUrl when a new file is selected
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null); // Clear the selected file
    setImageUrl(""); // Clear the current image URL
  };


  // Show loading state while authenticating or fetching post
  if (loadingAuth || loadingPost) {
    return <div className="text-center mt-8">Carregando postagem...</div>; // Mensagem em português
  }

   // If slug is not found or user is not authorized, the redirects in useEffect will handle it
  // If we reach here, it means the user is authenticated, the post was found, and the user is the author

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Postagem</h1> {/* Título em português */}
       {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Digite o título da postagem"
            required
          />
        </div>
         {/* Displaying the slug is optional, but useful for reference */}
         <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={currentSlug} // Displaying the current slug
              onChange={(e) => setCurrentSlug(e.target.value)} // Allow editing the slug
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Edite o slug da postagem"
              required
            />
          </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL da Imagem Existente
          </label>
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Imagem da Postagem" className="max-h-40 object-cover rounded-md" />
              <button
                 type="button" // Use type="button" to prevent form submission
                 onClick={handleRemoveImage}
                 className="mt-2 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                 Remover Imagem
              </button>
            </div>
          )}
           {!imageUrl && !imageFile && (
               <p className="mt-1 text-sm text-gray-500">Nenhuma imagem selecionada.</p>
           )}
        </div>
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Enviar Nova Imagem
          </label>
          <input
            disabled={isUploading || isSubmitting}
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Conteúdo
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Edite o conteúdo da sua postagem aqui..."
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Atualizando Postagem..." : isUploading ? "Enviando Imagem..." : "Atualizar Postagem"} {/* Texto do botão em português */}
          </button>
        </div>
      </form>
    </div>
  );
}
