// src/lib/integrantes.ts

import { db } from "../lib/firebase"; // Adjust path as needed
import { Member } from "../lib/types"; // Adjust path as needed
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";

const integrantesCollection = collection(db, "integrantes");

/**
 * Fetches all members from Firestore, ordered by name.
 * @returns A promise that resolves to an array of Member objects.
 */
export const getMembers = async (): Promise<Member[]> => {
  try {
    const q = query(integrantesCollection, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    const members: Member[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData; // Cast to DocumentData to access fields safely
      return {
        id: doc.id,
        name: data.name,
        areaPesquisa: data.areaPesquisa || undefined, // Use undefined for optional fields not present
        instituicao: data.instituicao,
        curriculoLattes: data.curriculoLattes || undefined,
        imageUrl: data.imageUrl || undefined,
      } as Member; // Cast to Member type
    });
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

/**
 * Adds a new member to Firestore.
 * @param memberData - The member data to add (excluding id).
 * @returns A promise that resolves to the ID of the newly created document.
 */
export const addMember = async (
  memberData: Omit<Member, "id">,
): Promise<string> => {
  try {
    const docRef = await addDoc(integrantesCollection, memberData);
    console.log("New member added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

/**
 * Updates an existing member in Firestore.
 * @param id - The ID of the member document to update.
 * @param memberData - The partial member data to update.
 * @returns A promise that resolves when the update is complete.
 */
export const updateMember = async (
  id: string,
  memberData: Partial<Omit<Member, "id">>,
): Promise<void> => {
  try {
    const memberDocRef = doc(db, "integrantes", id);
    await updateDoc(memberDocRef, memberData);
    console.log("Member updated with ID:", id);
  } catch (error) {
    console.error(`Error updating member ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a member from Firestore.
 * @param id - The ID of the member document to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteMember = async (id: string): Promise<void> => {
  try {
    const memberDocRef = doc(db, "integrantes", id);
    await deleteDoc(memberDocRef);
    console.log("Member deleted with ID:", id);
  } catch (error) {
    console.error(`Error deleting member ${id}:`, error);
    throw error;
  }
};
