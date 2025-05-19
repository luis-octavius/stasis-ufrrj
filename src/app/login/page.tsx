// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/postagens/new"); // Redirect to the new post page after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      // Display a user-friendly error message in Portuguese
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email ou senha inválidos.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Formato de email inválido.');
      }
       else {
        setError('Falha ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-foreground uppercase-ancient">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm italic">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email
            </label>
            <input
              type="email" // Corrected type to "email"
              id="email" // Corrected id to "email"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Senha {/* Label em português */}
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required            />
          </div>
          <div>
            <button              type="submit"              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Entrando..." : "Entrar"} {/* Texto do botão em português */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
