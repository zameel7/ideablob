import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface NoteInput {
  title: string;
  content: string;
  categoryId: string;
  tags?: string[];
}

export const createNote = async (userId: string, noteData: NoteInput): Promise<string> => {
  try {
    const notesCollection = collection(db, "notes");
    const docRef = await addDoc(notesCollection, {
      ...noteData,
      tags: noteData.tags || [],
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (noteId: string, noteData: Partial<NoteInput>): Promise<void> => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

export const getNotesByCategory = async (userId: string, categoryId: string): Promise<Note[]> => {
  try {
    const notesCollection = collection(db, "notes");
    const q = query(
      notesCollection,
      where("userId", "==", userId),
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Note));
  } catch (error) {
    console.error("Error getting notes by category:", error);
    throw error;
  }
};

export const getAllNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesCollection = collection(db, "notes");
    const q = query(
      notesCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Note));
  } catch (error) {
    console.error("Error getting all notes:", error);
    throw error;
  }
}; 