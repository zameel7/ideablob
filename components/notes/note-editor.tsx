"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Note, NoteInput } from "@/lib/note-service";
import { Category } from "@/lib/category-service";

const formSchema = z.object({
  content: z.string().min(1, { message: "Note content is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  tags: z.string().optional(),
});

interface NoteEditorProps {
  note?: Note;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteId: string | null, data: NoteInput) => Promise<void>;
}

export function NoteEditor({ note, categories, isOpen, onClose, onSave }: NoteEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: note?.content || "",
      categoryId: note?.categoryId || (categories[0]?.id || ""),
      tags: note?.tags.join(", ") || "",
    },
  });

  // Update form when note changes
  useEffect(() => {
    if (note) {
      form.reset({
        content: note.content,
        categoryId: note.categoryId,
        tags: note.tags.join(", "),
      });
    } else {
      form.reset({
        content: "",
        categoryId: categories[0]?.id || "",
        tags: "",
      });
    }
  }, [note, categories, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const noteData: NoteInput = {
        content: values.content,
        categoryId: values.categoryId,
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      };
      
      await onSave(note?.id || null, noteData);
      toast.success(note ? "Note updated" : "Note created");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(note ? "Failed to update note" : "Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{note ? "Edit Note" : "Create Note"}</SheetTitle>
          <SheetDescription>
            {note
              ? "Make changes to your note here"
              : "Add a new note to your collection"}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your note here..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="work, important, todo"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? note
                      ? "Updating..."
                      : "Creating..."
                    : note
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
} 