"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { 
  Note, 
  NoteInput, 
  getAllNotes, 
  getNotesByCategory, 
  createNote, 
  updateNote, 
  deleteNote 
} from "@/lib/note-service";
import { 
  Category, 
  getAllCategories, 
  createDefaultCategories 
} from "@/lib/category-service";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NotesListProps {
  searchQuery?: string;
}

export function NotesList({ searchQuery = "" }: NotesListProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  // Fetch categories and notes
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch categories
        let fetchedCategories = await getAllCategories(user.uid);
        
        // If no categories, create default ones
        if (fetchedCategories.length === 0) {
          await createDefaultCategories(user.uid);
          fetchedCategories = await getAllCategories(user.uid);
        }
        
        // Remove any potential duplicates by ID
        const uniqueCategories = Array.from(
          new Map(fetchedCategories.map(cat => [cat.id, cat])).values()
        );
        
        setCategories(uniqueCategories);
        
        // Fetch all notes
        const fetchedNotes = await getAllNotes(user.uid);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load notes and categories");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Filter notes based on category and search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Filter by category
      const categoryMatch = selectedCategory === "all" || note.categoryId === selectedCategory;
      
      // Filter by search query
      const searchMatch = searchQuery === "" || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });
  }, [notes, selectedCategory, searchQuery]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Handle note creation/update
  const handleSaveNote = async (noteId: string | null, data: NoteInput) => {
    if (!user) return;
    
    try {
      if (noteId) {
        // Update existing note
        await updateNote(noteId, data);
        
        // Update local state
        setNotes(notes.map(note => 
          note.id === noteId 
            ? { ...note, ...data, updatedAt: new Date() as any } 
            : note
        ));
      } else {
        // Create new note
        const newNoteId = await createNote(user.uid, data);
        
        // Refresh notes to get the new one with server timestamp
        const updatedNotes = await getAllNotes(user.uid);
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  };

  // Handle note deletion
  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      
      // Update local state
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
      throw error;
    }
  };

  // Open editor for creating a new note
  const handleNewNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  // Open editor for editing an existing note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Your Notes</h1>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Skeleton className="h-4 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="border rounded-lg p-1.5 mb-6">
            <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
              <TabsList className="w-full flex flex-wrap justify-start bg-transparent">
                <TabsTrigger value="all" className="flex-grow-0 px-4 py-2 data-[state=active]:bg-background">
                  All Notes
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-grow-0 px-4 py-2 data-[state=active]:bg-background"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No notes found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {selectedCategory === "all"
                  ? "You haven't created any notes yet."
                  : `You don't have any notes in the "${getCategoryName(selectedCategory)}" category.`}
              </p>
              <Button onClick={() => setIsEditorOpen(true)}>
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  categories={categories}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </>
      )}

      <NoteEditor
        note={editingNote}
        categories={categories}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
} 