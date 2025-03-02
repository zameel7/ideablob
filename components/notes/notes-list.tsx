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
    <div className="space-y-6">
      <div className="flex flex-row justify-end md:hidden">
        <Button onClick={() => setIsEditorOpen(true)} className="h-10 px-4 rounded-full flex items-center gap-2 bg-gray-900 hover:bg-gray-800">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border rounded-xl">
              <CardHeader className="p-4 pb-2 space-y-1.5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2 border-t">
                <Skeleton className="h-3 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto pb-3 -mx-1">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="bg-transparent h-auto flex gap-2 p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-background rounded-full px-6 py-2.5 h-auto border data-[state=active]:border-transparent"
                >
                  All Notes
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-background rounded-full px-6 py-2.5 h-auto border data-[state=active]:border-transparent"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button 
              onClick={() => setIsEditorOpen(true)} 
              className="h-10 px-4 rounded-full flex items-center gap-2 bg-gray-900 hover:bg-gray-800 hidden md:flex"
            >
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-muted/10">
              <h3 className="text-lg font-medium mb-2">No notes found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {selectedCategory === "all"
                  ? "You haven't created any notes yet."
                  : `You don't have any notes in the "${getCategoryName(selectedCategory)}" category.`}
              </p>
              <Button onClick={() => setIsEditorOpen(true)} className="rounded-full">
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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