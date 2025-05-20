// src/components/EditPostClient.tsx
"use client";

import { useState, useEffect } from "react";
import { storage, db, auth } from "../lib/firebase"; // Adjust path
import { doc, getDocs, updateDoc, collection, query, where, DocumentData, Timestamp } from "firebase/firestore"; // Import Timestamp
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter } from 'next/navigation'; // No need for useParams here, receive slug via props
import { onAuthStateChanged, User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

// Define a interface para os dados do post (adapte conforme a estrutura real dos seus posts)
interface PostData {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    content: string;
    authorId: string;
    createdAt: Date | null; // Expect Date or null
}

interface EditPostClientProps {
    initialPostData?: PostData | null; // Data from Server Component
    slug: string; // Slug from Server Component
}

export default function EditPostClient({ initialPostData, slug }: EditPostClientProps) {
  const router = useRouter();
  // const params = useParams(); // Not needed here
  // const slug = params.slug as string; // Not needed here

  const [title, setTitle] = useState(initialPostData?.title || "");
  // Use a state for the slug that can be edited
  const [editedSlug, setEditedSlug] = useState(initialPostData?.slug || "");
  const [imageUrl, setImageUrl] = useState(initialPostData?.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState(initialPostData?.content || "");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingPost, setLoadingPost] = useState(initialPostData === undefined); // Loading based on initial data
  const [postId, setPostId] = useState<string | null>(initialPostData?.id || null); // Get postId from initial data

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

  // Fetch post data if not provided initially (fallback logic)
  useEffect(() => {
    // Only fetch if initial data was NOT provided (undefined) and slug is available
    if (initialPostData === undefined && slug) {
      const fetchPost = async () => {
        setLoadingPost(true);
        try {
            console.log(`Fetching post with slug: ${slug} in client component (fallback)`);
            const postsCollection = collection(db, "posts");
            const q = query(postsCollection, where("slug", "==", slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No matching post found in client fallback!");
                router.push('/postagens/not-found'); // Redirect if not found
                return;
            }

            const postDoc = querySnapshot.docs[0];
            const postData = { ...postDoc.data(), id: postDoc.id } as PostData;

            // !! Check authorization in client component !!
            if (!user || postData.authorId !== user.uid) {
                console.warn("User is not the author of this post. Redirecting.");
                router.push('/'); // Redirect if not authorized
                return;
            }

            setPostId(postData.id);
            setTitle(postData.title);
            setEditedSlug(postData.slug); // Use editedSlug state
            setImageUrl(postData.imageUrl || "");
            setContent(postData.content);

        } catch (error) {
            console.error("Error fetching post in client fallback:", error);
            // Handle error
        } finally {
            setLoadingPost(false);
        }
      };
      // Only fetch if user is loaded and authenticated and initialData is undefined
      if (!loadingAuth && user) {
         fetchPost();
      }

    } else if (initialPostData !== undefined) {
        // If initialData was provided (even if null), set loadingPost to false immediately
         setLoadingPost(false);
         // If initial data was provided, check authorization immediately
         if (initialPostData && (!user || initialPostData.authorId !== user.uid)) {
             // Delay slightly to allow auth state to potentially update if it's still loading very briefly
             const checkAuth = () => {
                if (!user || initialPostData.authorId !== user.uid) {
                     console.warn("User is not the author based on initial data. Redirecting.");
                     router.push('/');
                 }
             };
             // Check auth immediately if user is already loaded, otherwise wait for auth useEffect
             if (!loadingAuth) {
                 checkAuth();
             } else {
                 // Wait for auth to load, then check
                 const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                      if (!currentUser || initialPostData.authorId !== currentUser.uid) {
                         console.warn("User is not the author after auth load. Redirecting.");
                         router.push('/');
                     }
                      unsubscribe(); // Unsubscribe after check
                 });
             }
         } else if (initialPostData === null) {
             // If initial data was null (post not found by server)
             console.log("Initial post data was null. Redirecting to not found.");
              router.push('/postagens/not-found');
         }
    } else {
         console.log("Initial data was undefined but slug was missing.");
         // Handle case where slug is missing
          router.push('/postagens/not-found');
    }

  }, [slug, initialPostData, loadingAuth, user, router]); // Depend on relevant states and props


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check authorization again before submitting
     if (!user || initialPostData?.authorId !== user.uid || !postId || isSubmitting || isUploading) {
         console.warn("Submission blocked: Not authorized, no post ID, submitting, or uploading.");
         return;
     }


    setIsSubmitting(true);
    setUploadError(null);

    let finalImageUrl = imageUrl;

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
            }
        }

        const storageRef = ref(
          storage,
          `post-images/${user.uid}/${uuidv4()}-${imageFile.name}` // Store under user's ID for better organization (optional)
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(finalImageUrl);
      } catch (error) {
        console.error("Error uploading new image:", error);
        setUploadError("Falha ao enviar a nova imagem. Por favor, tente novamente.");
        setIsUploading(false);
        setIsSubmitting(false);
        return;
      } finally {
        setIsUploading(false);
      }
    } else if (initialPostData?.imageUrl && imageUrl === "" && imageFile === null) {
        // If imageUrl was cleared in the form and there was an initial image, delete from storage
         try {
            const oldImageRef = ref(storage, initialPostData.imageUrl);
            await deleteObject(oldImageRef);
            console.log("Old image deleted successfully because imageUrl was cleared");
             finalImageUrl = ""; // Clear the finalImageUrl as well
        } catch (deleteError) {
            console.warn("Could not delete old image after clearing URL:", deleteError);
        }
         finalImageUrl = ""; // Ensure imageUrl is empty in the document
    } else {
        // If no new file is selected and imageUrl was not cleared, keep the existing one
         finalImageUrl = imageUrl;
    }


    // Update post data in Firestore
    try {
      if (!postId) {
          console.error("Cannot update post: Post ID is missing.");
           setUploadError("Erro interno: ID da postagem não encontrado.");
           setIsSubmitting(false);
           return;
      }
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title,
        slug: editedSlug, // Use the state for the edited slug
        imageUrl: finalImageUrl,
        content,
        // createdAt and authorId should not be changed during update
      });
      console.log("Document updated successfully!");
      router.push(`/postagens/${editedSlug}`); // Redirect to the updated post page using the edited slug
    } catch (error: any) { // Explicitly type error
      console.error("Error updating document: ", error);
      let errorMessage = "Falha ao atualizar a postagem. Por favor, tente novamente.";
      if (error.code === 'permission-denied') {
          errorMessage = "Erro de Permissão: Você não tem permissão para atualizar esta postagem. Verifique suas regras de segurança do Firestore.";
      } else if (error.message) {
           errorMessage = `Erro no Firestore: ${error.message}`;
      }
      setUploadError(errorMessage);
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
  // Also check if initial data was undefined, indicating client-side fetch is needed
  if (loadingAuth || loadingPost || (initialPostData === undefined && (!user || !slug))) {
    return <div className="text-center mt-8">Carregando postagem para edição...</div>;
  }

   // If initialData was null (post not found by server), the useEffect already redirected
   // If initialData exists but user is not authorized, the useEffect already redirected

  // If we reach here, it means initialData was provided (and not null), auth is loaded,
  // and the user is the author, OR the client-side fetch completed successfully.
  // We also need to check if postData is null *after* potential client fetch.
  if (!postId) { // If no initial data AND no post found after fallback fetch
       return (
            <div className="container mx-auto px-4 py-8 text-center text-red-600">
                Postagem não encontrada ou você não tem permissão para editá-la.
            </div>
        );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Postagem</h1>
       {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}\
       {/* Use the post state if it was fetched client-side, otherwise use initialPostData if available and not null */}
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
            value={title} // Use state
            onChange={(e) => setTitle(e.target.value)} // Use state setter
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Digite o título da postagem"
            required
          />
        </div>
         {/* Displaying and allowing editing of the slug */}
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
              value={editedSlug} // Use state for edited slug
              onChange={(e) => setEditedSlug(e.target.value)} // Allow editing the slug
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
          {/* Display existing image or indication */}
          {(imageUrl || (initialPostData?.imageUrl && !imageFile)) && ( // Show if there's an imageUrl state or initial imageUrl and no new file
            <div className="mt-2">
              {/* Use imageUrl state for the displayed image */}
              <img src={imageUrl || initialPostData?.imageUrl} alt="Imagem da Postagem" className="max-h-40 object-cover rounded-md" />
              <button
                 type="button" // Use type="button" to prevent form submission
                 onClick={handleRemoveImage}
                 className="mt-2 text-sm text-red-600 hover:text-red-800 focus:outline-none"
              >
                 Remover Imagem
              </button>
            </div>
          )}
           {!imageUrl && !imageFile && !initialPostData?.imageUrl && ( // Show message if no image at all
               <p className="mt-1 text-sm text-gray-500">Nenhuma imagem selecionada.</p>
           )}
            {imageFile && ( // Show selected new file name
                 <p className="mt-1 text-sm text-gray-500">Nova imagem selecionada: {imageFile.name}</p>
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
            value={content} // Use state
            onChange={(e) => setContent(e.target.value)} // Use state setter
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Edite o conteúdo da sua postagem aqui..."
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isUploading || isSubmitting || !postId} // Disable if uploading, submitting, or no post ID
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Atualizando Postagem..." : isUploading ? "Enviando Imagem..." : "Atualizar Postagem"}
          </button>
        </div>
      </form>
    </div>
  );
}
