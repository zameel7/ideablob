"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, ArrowLeft, Trash } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Note, updateNote, deleteNote } from "@/lib/note-service";
import { Category, getAllCategories } from "@/lib/category-service";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { NoteEditor } from "@/components/notes/note-editor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MarkdownContent } from "@/lib/markdown-utils";

// Function to get a single note by ID
const getNoteById = async (noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    
    if (noteSnap.exists()) {
      return {
        id: noteSnap.id,
        ...noteSnap.data()
      } as Note;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting note:", error);
    throw error;
  }
};

export default function NotePage() {
  const params = useParams();
  const id = params?.id as string;
  
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;
      
      try {
        // Fetch note
        const fetchedNote = await getNoteById(id);
        setNote(fetchedNote);
        
        // Fetch categories
        const fetchedCategories = await getAllCategories(user.uid);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note");
        router.push("/notes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, id, router]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleDelete = async () => {
    if (!note || isDeleting) return;
    
    if (confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        await deleteNote(note.id);
        toast.success("Note deleted");
        router.push("/notes");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
        setIsDeleting(false);
      }
    }
  };

  const handleSaveNote = async (noteId: string | null, data: any) => {
    if (!note) return;
    
    try {
      await updateNote(note.id, data);
      
      // Refresh note data
      const updatedNote = await getNoteById(note.id);
      setNote(updatedNote);
      
      setIsEditorOpen(false);
      toast.success("Note updated");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "Unknown date";
    
    try {
      const timestamp = date.toDate ? date.toDate() : new Date(date);
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 max-w-5xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/notes")}
            className="mb-6 -ml-2 hover:bg-muted/60 rounded-lg flex items-center h-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
          
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          ) : note ? (
            <>
              <Card className="overflow-hidden border-muted/60 shadow-sm rounded-xl">
                <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {note.title || "Untitled Note"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="px-3 py-1 rounded-md">
                        {getCategoryName(note.categoryId)}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2.5 py-0.5 rounded-md">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditorOpen(true)}
                      className="h-9 px-4 rounded-lg"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="h-9 px-4 rounded-lg"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-base markdown-content">
                      <MarkdownContent content={note.content} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 sm:p-8 pt-0 border-t text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatDate(note.updatedAt)}
                </CardFooter>
              </Card>
              
              <NoteEditor
                note={note}
                categories={categories}
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveNote}
              />
            </>
          ) :
            <div className="text-center py-16 border rounded-xl bg-muted/10">
              <h3 className="text-lg font-medium mb-2">Note not found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                The note you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Button onClick={() => router.push("/notes")} className="px-4 rounded-lg">
                Go back to Notes
              </Button>
            </div>
          }
        </div>
      </div>
    </AppLayout>
  );
} 