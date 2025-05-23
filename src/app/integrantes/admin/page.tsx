// src/app/integrantes/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Import auth
import { getMembers, addMember, updateMember, deleteMember } from "../../../lib/integrantes"; // Import Firestore functions for members
import { Member } from "../../../lib/types"; // Import Member interface
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import IntegranteForm from "../../../components/integrantes/IntegranteForm"; // Import the form component
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui buttons
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Assuming shadcn/ui cards for member list display
import { Trash2, Pencil } from "lucide-react"; // Icons for edit/delete

export default function AdminIntegrantesPage() {
    const [user, setUser] = useState<FirebaseAuthUser | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [members, setMembers] = useState<Member[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the form
    const initialFormData: Omit<Member, 'id'> = {
        name: '',
        areaPesquisa: '',
        instituicao: '',
        curriculoLattes: '',
        imageUrl: '',
    };
    const [formData, setFormData] = useState<Omit<Member, 'id'>>(initialFormData);
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false); // Loading state specifically for form operations


    const router = useRouter();

    // Authentication Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // Not logged in, redirect to login
                router.push('/login'); // Adjust login route if different
            } else {
                // Logged in
                setUser(currentUser);
            }
            setLoadingAuth(false);
        });

        return () => unsubscribe(); // Cleanup subscription
    }, [router]); // Dependency on router

    // Fetch Members when authenticated
    useEffect(() => {
        if (user) {
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
    }, [user]); // Dependency on user

    // --- Form and Member Management Functions ---

    // Linha 98: Implementação da função resetForm
    const resetForm = () => {
        setFormData(initialFormData);
        setEditingMemberId(null);
    };


    const handleAddMember = async (formData: Omit<Member, 'id'>) => {
        if (!user) return; // Verifica se o usuário está logado
        setFormLoading(true); // Use formLoading for form operations
        setError(null);
        try {
            const newMemberId = await addMember(formData); // Chama a função addMember do Firestore
            console.log("Integrante adicionado com sucesso! ID:", newMemberId);
            // Melhorar: Adicionar o novo membro ao estado local sem refetch completo
            const newMember: Member = { id: newMemberId, ...formData };
            setMembers(prevMembers => [...prevMembers, newMember]);

            resetForm(); // Limpa o formulário
        } catch (err) {
            console.error("Erro ao adicionar integrante:", err);
            setError(`Erro ao adicionar integrante: ${(err as Error).message}`);
        } finally {
            setFormLoading(false); // Use formLoading
        }
    };

     const handleUpdateMember = async (formData: Omit<Member, 'id'>) => {
        if (!user || !editingMemberId) return;
        setFormLoading(true); // Use formLoading
        setError(null);
        try {
            await updateMember(editingMemberId, formData);
             console.log("Integrante atualizado com sucesso! ID:", editingMemberId);
            // Atualizar o membro no estado local
            setMembers(prevMembers => prevMembers.map(member =>
                member.id === editingMemberId ? { ...member, ...formData, id: editingMemberId } : member
            ));
            resetForm(); // Limpa o formulário
        } catch (err) {
            console.error("Erro ao atualizar integrante:", err);
            setError(`Erro ao atualizar integrante: ${(err as Error).message}`);
        } finally {
            setFormLoading(false); // Use formLoading
        }
    };

    const handleDeleteMember = async (memberId: string) => {
        if (!user || !confirm("Tem certeza que deseja remover este integrante?")) return; // Confirmação antes de deletar
         setLoadingMembers(true); // Pode mostrar loading enquanto remove
        setError(null);
        try {
            await deleteMember(memberId);
            console.log("Integrante removido com sucesso! ID:", memberId);
            // Remover o membro do estado local
            setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
             // Se o membro removido era o que estava sendo editado, resetar o formulário
            if (editingMemberId === memberId) {
                resetForm();
            }
        } catch (err) {
            console.error("Erro ao remover integrante:", err);
            setError(`Erro ao remover integrante: ${(err as Error).message}`);
        } finally {
             setLoadingMembers(false); // Pode remover loading
        }
    };

    // Linha 256: Implementação da função handleEditMember
    const handleEditMember = (member: Member) => {
         setFormData(member); // Preenche o formulário com os dados do membro
         setEditingMemberId(member.id); // Define o ID do membro que está sendo editado
    };


    // Show loading state while authenticating
    if (loadingAuth) {
        return <div className="text-center mt-8">Verificando autenticação...</div>;
    }

    // If not authenticated, useEffect redirects
    if (!user) {
        return <div className="text-center mt-8 text-red-600">Redirecionando para login...</div>;
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Gerenciar Integrantes</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Formulário de Adição/Edição */}
            <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
                 <h2 className="text-xl font-semibold mb-4">{editingMemberId ? "Editar Integrante" : "Adicionar Novo Integrante"}</h2>
                 <IntegranteForm
                    initialData={formData}
                    onSubmit={editingMemberId ? handleUpdateMember : handleAddMember}
                 />
                 {editingMemberId && (
                     <Button
                        variant="outline"
                        onClick={resetForm}
                        className="mt-4"
                        disabled={formLoading} // Disable while form operation is in progress
                     >
                        Cancelar Edição
                     </Button>
                 )}
            </div>


            {/* Lista de Integrantes */}
            <h2 className="text-xl font-semibold mb-4">Integrantes Atuais</h2>
             {loadingMembers ? (
                <div className="text-center">Carregando integrantes...</div>
             ) : (
                 members.length === 0 ? (
                    <p className="text-center text-gray-600">Nenhum integrante encontrado.</p>
                 ) : (
                    <ul className="space-y-4">
                         {members.map((member) => (
                            <li key={member.id} className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-gray-50">
                                <div>
                                    <div className="font-semibold">{member.name}</div>
                                    <div className="text-sm text-gray-600">{member.instituicao}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditMember(member)} // Linha 256 corrigida
                                         disabled={formLoading || loadingMembers} // Disable while form operation is in progress
                                    >
                                         <Pencil size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteMember(member.id)}
                                         disabled={formLoading || loadingMembers} // Disable while form operation is in progress
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                 )
             )}
        </div>
    );
}
