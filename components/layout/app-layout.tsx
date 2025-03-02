"use client";

import { useAuth } from "@/lib/auth-context";
import { useUser } from "@/lib/user-context";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { AuthPage } from "../auth/auth-page";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { apiKey, loading: userLoading } = useUser();

  // Show loading state
  if (authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated or no API key, show auth page
  if (!user || !apiKey) {
    return <AuthPage />;
  }

  // Main app layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
} 