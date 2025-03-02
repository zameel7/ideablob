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
      <div className="container mx-auto px-5 py-10 md:px-10 md:py-12 max-w-7xl">
        <div className="relative mb-10 max-w-md mx-auto md:mx-0 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
          <Search className="absolute left-8 top-[22px] h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-12 h-12 text-base border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <NotesList searchQuery={searchQuery} />
      </div>
    </AppLayout>
  );
} 