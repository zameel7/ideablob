"use client";

import { FolderOpen, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 md:hidden">
      <div className="grid h-full grid-cols-3 mx-auto">
        <Link
          href="/chat"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            pathname === "/chat"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="text-xs">Chat</span>
        </Link>
        <Link
          href="/notes"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            pathname === "/notes"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <FolderOpen className="w-6 h-6 mb-1" />
          <span className="text-xs">Notes</span>
        </Link>
        <Link
          href="/profile"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            pathname === "/profile"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
} 