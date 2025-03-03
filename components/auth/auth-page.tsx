"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ApiKeyForm } from "./api-key-form";
import { useAuth } from "@/lib/auth-context";
import { useUser } from "@/lib/user-context";
import Image from "next/image";
import { useTheme } from "next-themes";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const { apiKey } = useUser();
  const { resolvedTheme } = useTheme();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // If user is logged in but doesn't have an API key, show the API key form
  if (user && !apiKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <Image 
                src={resolvedTheme === "dark" ? "/iconWhite.png" : "/icon.png"} 
                alt="IdeaBlob Logo" 
                width={150} 
                height={150} 
                priority
              />
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              AI-powered note-taking and organization
            </p>
          </div>
          <ApiKeyForm />
        </div>
      </div>
    );
  }

  // If user is not logged in, show login/signup forms
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Image 
              src={resolvedTheme === "dark" ? "/iconWhite.png" : "/icon.png"} 
              alt="IdeaBlob Logo" 
              width={150} 
              height={150} 
              priority
            />
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI-powered note-taking and organization
          </p>
        </div>
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignupForm onToggle={toggleForm} />
        )}
      </div>
    </div>
  );
} 