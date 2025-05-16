"use client";
import Link from "next/link";

export default function PostSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Post Created Successfully!</h1>
      <p className="text-gray-700 mb-6">
        Your new post has been successfully published.
      </p>
      <Link href="/postagens" passHref>
        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Go to Posts
        </button>
      </Link>
    </div>
  );
}