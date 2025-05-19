// src/app/new-post/page.tsx
"use client";
import { useState, useEffect } from "react"; // Import useEffect
import { storage, db, auth } from "../../../lib/firebase"; // Import db and auth
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { v4 as uuidv4 } from "uuid"; // To generate unique file names
import { useRouter } from 'next/navigation'; // Import useRouter
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import onAuthStateChanged and signOut
import Link from "next/link"; // Import Link for logout button

export default function NewPostPage() { 
  const router = useRouter(); // Initialize router
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(""); // Consider adding a state for slug generation if needed
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state for form submission
  const [user, setUser] = useState<any>(null); // State to hold user information
  const [loadingAuth, setLoadingAuth] = useState(true); // State to indicate auth loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // User is not logged in, redirect to login page
        router.push('/login');
      } else {
        // User is logged in
        setUser(currentUser);
        setLoadingAuth(false); // Auth loading finished
      }
    });
    // Clean up the subscription
    return () => unsubscribe();
  }, [auth, router]); // Added auth to dependencies

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !user) return; // Prevent submission if already submitting or not logged in
    setUploadError(null); // Clear previous errors on new submission
    setIsSubmitting(true); // Set submitting state

    let finalImageUrl = imageUrl;

    if (imageFile) {
      setIsUploading(true);
      setUploadError(null);
      const storageRef = ref(
        storage,
        `post-images/${uuidv4()}-${imageFile.name}`,
      );
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(finalImageUrl); // Update state with uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadError("Falha ao enviar imagem. Por favor, tente novamente."); // Mensagem em português
        setIsUploading(false); // Reset uploading state
        setIsSubmitting(false); // Reset submitting state on error
        return; // Stop submission if upload fails
      } finally {
        setIsUploading(false);
      }
    }

    // Add data to Firestore
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Use slug if provided, otherwise generate from title
        imageUrl: finalImageUrl, // Use finalImageUrl which could be uploaded URL or manual URL
        content,
        createdAt: new Date(), // Add a timestamp
        authorId: user.uid, // Add the authenticated user's ID
      });
      console.log("Document written with ID: ", docRef.id);
      // Redirect to success page
      router.push('/postagens/success'); // Redirect here
    } catch (error: any) { // Explicitly type error as any for easier access to properties
      console.error("Error adding document: ", error);
      if (error.code === 'permission-denied') {
          setUploadError("Você não tem permissão para criar postagens.");
      } else {
          setUploadError("Falha ao criar postagem. Por favor, tente novamente.");
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success or failure
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error, e.g., show a message
    }
  };

  // Show a loading state or null while authentication status is being determined
  if (loadingAuth) {
    return <div className="text-center mt-8">Carregando...</div>; // Mensagem em português
  }

  // If user is not logged in, this component won't be rendered due to the redirect in useEffect
  // Render the form if the user is logged in
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flex container for title and logout button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Criar Nova Postagem</h1> {/* Título em português */}
        {user && ( // Show logout button only if user is logged in
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sair ({user.email}) {/* Texto do botão de sair e email do usuário */}
          </button>
        )}
      </div>

      {/* Form for creating a new post */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
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
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Digite o slug da postagem (ex: minha-primeira-postagem)"
            required
          />
        </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL da Imagem
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            placeholder="Digite a URL da imagem (opcional)"
          />
        </div>
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Enviar Imagem
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
            placeholder="Escreva o conteúdo da sua postagem aqui..."
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Criando Postagem..." : isUploading ? "Enviando Imagem..." : "Criar Postagem"}
          </button>
        </div>
      </form> {/* End of the form */}

      {user && ( // Show logout button only if user is logged in
        <div className="mt-4 text-right">
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none">
            Sair ({user.email}) {/* Texto do botão de sair e email do usuário */}
          </button>
        </div>
      )}
    </div> // <-- Fechamento da div principal
  );
}