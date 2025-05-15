// src/app/new-post/page.tsx
"use client";
import { useState } from "react";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Fix the import path for firebase. It should be relative to the current file.
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        setIsUploading(false);
        return; // Stop submission if upload fails
      } finally {
        setIsUploading(false);
      }
    }

    // Here you would typically handle the submission with finalImageUrl, e.g., send to an API
    console.log("New Post Data:", { title, slug, finalImageUrl, content });
    // Reset form or navigate to another page after successful post creation
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              disabled={isUploading}
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
              disabled={isUploading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isUploading ? "Uploading Image..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    );
  };
}
