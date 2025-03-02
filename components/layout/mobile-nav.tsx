"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FolderOpen, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 px-4 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800 md:hidden">
      <Link
        href="/chat"
        className={`flex flex-col items-center justify-center w-full h-full ${
          pathname === "/chat" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <MessageSquare size={20} />
        <span className="mt-1 text-xs">Chat</span>
      </Link>
      <Link
        href="/notes"
        className={`flex flex-col items-center justify-center w-full h-full ${
          pathname === "/notes" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <FolderOpen size={20} />
        <span className="mt-1 text-xs">Notes</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center w-full h-full ${
          pathname === "/profile" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <User size={20} />
        <span className="mt-1 text-xs">Profile</span>
      </Link>
    </div>
  );
} 