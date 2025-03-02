"use client";

import { useState, useEffect } from "react";
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

export function NotesList() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
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
        const fetchedCategories = await getAllCategories(user.uid);
        
        // If no categories, create default ones
        if (fetchedCategories.length === 0) {
          await createDefaultCategories(user.uid);
          const newCategories = await getAllCategories(user.uid);
          setCategories(newCategories);
        } else {
          setCategories(fetchedCategories);
        }
        
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

  // Filter notes by category and search query
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === "all" || note.categoryId === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={handleCategoryChange}>
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No notes found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </p>
              <Button onClick={handleNewNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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