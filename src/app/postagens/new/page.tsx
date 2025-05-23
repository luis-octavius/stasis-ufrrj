// src/app/postagens/new/page.tsx
"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../../lib/firebase"; // Removed storage import
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Keep imageUrl for manual URL
  const [content, setContent] = useState("");
  // Removed: [isUploading, setIsUploading]
  const [submitError, setSubmitError] = useState<string | null>(null); // Renamed uploadError to submitError for clarity
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("No user logged in, redirecting to /login");
        router.push("/login");
      } else {
        console.log("User logged in:", currentUser.uid);
        setUser(currentUser);
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !user || loadingAuth) {
      console.log(
        "Submission blocked: isSubmitting =",
        isSubmitting,
        "user =",
        user,
        "loadingAuth =",
        loadingAuth,
      );
      return;
    }
    setSubmitError(null); // Clear previous errors
    setIsSubmitting(true);
    console.log("Form submitted. isSubmitting set to true.");

    // No image upload logic here, using the imageUrl state directly

    // Add data to Firestore
    try {
      console.log("Attempting to add document to Firestore...");
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        slug:
          slug ||
          title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, ""),
        imageUrl: imageUrl, // Use the value from the imageUrl input
        content,
        createdAt: new Date(),
        authorId: user.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      console.log("Redirecting to /postagens/success...");
      router.push("/postagens/success");
    } catch (error: any) {
      // Explicitly type error
      console.error("Error adding document to Firestore:", error);
      let errorMessage = "Falha ao criar postagem. Por favor, tente novamente.";
      if (error.code === "permission-denied") {
        errorMessage =
          "Erro de Permissão: Você não tem permissão para criar postagens. Verifique suas regras de segurança do Firestore.";
      } else if (error.message) {
        errorMessage = `Erro no Firestore: ${error.message}`;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("Firestore operation finished. isSubmitting set to false.");
    }
  };

  // Removed: handleImageUpload function

  if (loadingAuth) {
    return <div className="text-center mt-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Criar Nova Postagem</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <p className="text-red-500 text-sm text-red-500">{submitError}</p>
        )}{" "}
        {/* Use submitError */}
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
            disabled={isSubmitting} // Disable only while submitting
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="Digite a URL da imagem (opcional)"
          />
        </div>
        {/* Removed the file upload input field */}
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
            disabled={isSubmitting || !user} // Disable if submitting or no user
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Criando Postagem..." : "Criar Postagem"}{" "}
            {/* Adjusted button text */}
          </button>
        </div>
      </form>
    </div>
  );
}
