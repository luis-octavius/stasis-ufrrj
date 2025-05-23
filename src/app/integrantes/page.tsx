// src/app/integrantes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Import auth
import { getMembers, deleteMember } from "../../lib/integrantes"; // Import Firestore functions for members
import { Member } from "../../lib/types"; // Import Member interface
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Link from "next/link"; // Import Link
import MemberCard from "../../components/integrantes/MemberCard"; // Import the updated MemberCard component
import { Button } from "@/components/ui/button"; // Adjust path as needed for your Button component
import { PlusCircle } from "lucide-react"; // Icon for Add button

// Remove the old metadata export if it was here, as this is now a Client Component.
// Metadata should be in a layout.tsx or page.tsx server component file in app directory.

export default function IntegrantesPage() {
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Still useful for initial auth state
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  const router = useRouter();

  // Authentication Check and Admin Check
  // Authentication Check and Admin Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      // Lógica de verificação de admin: Todo usuário logado é um admin.
      if (currentUser) {
        setIsAdmin(true); // Se há um usuário logado, ele é admin.
      } else {
        setIsAdmin(false); // Se não há usuário logado, não é admin.
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []); // No dependencies related to fetching here, runs once for auth

  // Fetch Members when auth state is determined (and user might be an admin)
  useEffect(() => {
    // Only fetch members after auth state is confirmed (loadingAuth is false)
    if (!loadingAuth) {
      const fetchMembers = async () => {
        setLoadingMembers(true);
        setError(null);
        try {
          const membersList = await getMembers();
          setMembers(membersList);
        } catch (err) {
          console.error("Error fetching members:", err);
          setError(`Erro ao carregar integrantes: ${(err as Error).message}`);
        } finally {
          setLoadingMembers(false);
        }
      };

      fetchMembers();
    }
  }, [loadingAuth]); // Dependency on loadingAuth ensures fetch runs after auth check

  const handleDelete = async (memberId: string) => {
    if (!user || !isAdmin) {
      console.warn(
        "Ação não permitida: usuário não autenticado ou não é admin.",
      );
      return;
    }
    if (!confirm("Tem certeza que deseja remover este integrante?")) return; // Confirmação

    setLoadingMembers(true); // Show loading while deleting
    setError(null);
    try {
      await deleteMember(memberId);
      console.log("Integrante removido com sucesso! ID:", memberId);
      // Remove the member from the local state
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== memberId),
      );
    } catch (err) {
      console.error("Error removing member:", err);
      setError(`Erro ao remover integrante: ${(err as Error).message}`);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleEdit = (memberId: string) => {
    if (!user || !isAdmin) {
      console.warn(
        "Ação não permitida: usuário não autenticado ou não é admin.",
      );
      return;
    }
    // Redirect to the admin page with the member ID as a query parameter
    router.push(`/integrantes/admin?id=${memberId}`);
  };

  // Show loading state while authenticating initially
  if (loadingAuth) {
    return <div className="text-center mt-8">Verificando autenticação...</div>;
  }

  // Now that auth is loaded, show loading for members fetch if still loading
  if (loadingMembers) {
    return <div className="text-center mt-8">Carregando integrantes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold uppercase-ancient text-center text-primary mb-6">
        Nossos Integrantes
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Add Member Button (Visible only for Admins) */}
      {isAdmin && (
        <div className="text-center mb-8">
          {/* Remove asChild and wrap the Link inside the Button */}
          <Button className="flex items-center justify-center">
            {" "}
            {/* Add flex styles directly to Button */}
            <Link
              href="/integrantes/admin"
              className="flex items-center justify-center"
            >
              {" "}
              {/* Keep Link for navigation */}
              <PlusCircle size={20} className="mr-2" />
              Adicionar Novo Integrante
            </Link>
          </Button>
        </div>
      )}

      {members.length === 0 && !loadingMembers ? (
        <p className="text-center text-xl text-foreground/70 py-10">
          Informações sobre os integrantes serão disponibilizadas em breve.
        </p>
      ) : (
        // Use the grid layout you had previously, or adapt it if needed
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {members.map((member) => (
            // Pass isAdmin and handlers to MemberCard
            <MemberCard
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
