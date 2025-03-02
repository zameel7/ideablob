"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth-context";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
}

interface UserContextType {
  apiKey: string | null;
  setApiKey: (key: string) => Promise<void>;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  notifications: true,
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setApiKeyState(userData.apiKey || null);
          setPreferences(userData.preferences || defaultPreferences);
        } else {
          // Create a new user document if it doesn't exist
          await setDoc(userDocRef, {
            email: user.email,
            apiKey: null,
            preferences: defaultPreferences,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const setApiKey = async (key: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { apiKey: key });
      setApiKeyState(key);
    } catch (error) {
      console.error("Error updating API key:", error);
      throw error;
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const newPreferences = { ...preferences, ...prefs };
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { preferences: newPreferences });
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        apiKey,
        setApiKey,
        preferences,
        updatePreferences,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; 