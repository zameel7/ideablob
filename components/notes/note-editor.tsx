"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Note, NoteInput } from "@/lib/note-service";
import { Category } from "@/lib/category-service";
import { X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
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
      title: note?.title || "",
      content: note?.content || "",
      categoryId: note?.categoryId || (categories[0]?.id || ""),
      tags: note?.tags.join(", ") || "",
    },
  });

  // Update form when note changes
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title || "",
        content: note.content,
        categoryId: note.categoryId,
        tags: note.tags.join(", "),
      });
    } else {
      form.reset({
        title: "",
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
        title: values.title,
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
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-8">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              {note ? "Edit Note" : "Create Note"}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="mt-1.5">
            {note
              ? "Make changes to your note here"
              : "Add a new note to your collection"}
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Note title"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Content</FormLabel>
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
                  <FormLabel className="text-base font-medium">Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Tags</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="work, important, todo"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-1.5">
                    Separate tags with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <SheetFooter className="pt-6 border-t mt-8">
              <div className="flex justify-end space-x-4 w-full mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="px-6">
                  {isLoading
                    ? note
                      ? "Updating..."
                      : "Creating..."
                    : note
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
} 