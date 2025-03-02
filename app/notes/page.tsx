"use client";

import { NotesList } from "@/components/notes/notes-list";
import { AppLayout } from "@/components/layout/app-layout";

export default function NotesPage() {
  return (
    <AppLayout>
      <NotesList />
    </AppLayout>
  );
} 