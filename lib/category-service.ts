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

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
}

export const createCategory = async (userId: string, categoryData: CategoryInput): Promise<string> => {
  try {
    const categoriesCollection = collection(db, "categories");
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, categoryData: Partial<CategoryInput>): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getAllCategories = async (userId: string): Promise<Category[]> => {
  try {
    const categoriesCollection = collection(db, "categories");
    const q = query(
      categoriesCollection,
      where("userId", "==", userId),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Category));
  } catch (error) {
    console.error("Error getting all categories:", error);
    throw error;
  }
};

// Default categories to create for new users
export const defaultCategories: CategoryInput[] = [
  {
    name: "Personal",
    icon: "user",
    color: "#3b82f6", // blue
  },
  {
    name: "Work",
    icon: "briefcase",
    color: "#10b981", // green
  },
  {
    name: "Ideas",
    icon: "lightbulb",
    color: "#f59e0b", // amber
  },
  {
    name: "To-Do",
    icon: "check-square",
    color: "#ef4444", // red
  },
];

// Create default categories for a new user
export const createDefaultCategories = async (userId: string): Promise<void> => {
  try {
    for (const category of defaultCategories) {
      await createCategory(userId, category);
    }
  } catch (error) {
    console.error("Error creating default categories:", error);
    throw error;
  }
}; 