// src/app/new-post/page.tsx
"use client";
import { useState } from "react";
import { storage, db } from "../../../lib/firebase"; // Import db
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Fix the import path for firebase. It should be relative to the current file.
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { v4 as uuidv4 } from "uuid"; // To generate unique file names
import { useRouter } from 'next/navigation'; // Import useRouter

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission
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
        setUploadError("Failed to upload image. Please try again.");
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
      });
      console.log("Document written with ID: ", docRef.id);
      // Redirect to success page
      router.push('/postagens/success'); // Redirect here
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle the error, e.g., show an error message to the user
      // You might want to set an error state here to display a message on the page
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success or failure
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Enter post title"
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
              placeholder="Enter post slug (e.g., my-first-post)"
              required
            />
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Enter image URL (optional)"
            />
          </div>
          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              disabled={isUploading || isSubmitting} // Disable input while uploading or submitting
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
              Content
            </label>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={isUploading || isSubmitting} // Disable button while uploading or submitting
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? "Creating Post..." : isUploading ? "Uploading Image..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    );
}
