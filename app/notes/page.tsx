"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { NotesList } from "@/components/notes/notes-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10 max-w-7xl">
        <div className="flex items-center justify-center mb-8">
          <div className="relative max-w-lg flex-1">
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-14 pr-5 py-6 h-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <NotesList searchQuery={searchQuery} />
      </div>
    </AppLayout>
  );
} 