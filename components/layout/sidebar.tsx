"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FolderOpen, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="hidden h-screen w-64 flex-col bg-gray-50 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 md:flex">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold">IdeaBlob</h1>
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <Link
          href="/chat"
          className={`flex items-center px-4 py-2 rounded-md ${
            pathname === "/chat"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <MessageSquare className="w-5 h-5 mr-3" />
          Chat
        </Link>
        <Link
          href="/notes"
          className={`flex items-center px-4 py-2 rounded-md ${
            pathname === "/notes"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <FolderOpen className="w-5 h-5 mr-3" />
          Notes
        </Link>
        <Link
          href="/profile"
          className={`flex items-center px-4 py-2 rounded-md ${
            pathname === "/profile"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <User className="w-5 h-5 mr-3" />
          Profile
        </Link>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start px-2">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                  <AvatarFallback>
                    {user.displayName ? getInitials(user.displayName) : user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {user.displayName || user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
} 