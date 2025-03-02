"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash, MoreVertical, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/lib/note-service";
import { Category } from "@/lib/category-service";
import { formatDistanceToNow } from "date-fns";
import { MarkdownContent } from "@/lib/markdown-utils";

interface NoteCardProps {
  note: Note;
  categories: Category[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export function NoteCard({ note, categories, onEdit, onDelete }: NoteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get category name
  const getCategoryName = (): string => {
    const category = categories.find(cat => cat.id === note.categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        setIsDeleting(false);
      }
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

  const navigateToNotePage = () => {
    router.push(`/notes/${note.id}`);
  };

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-sm transition-all duration-200 cursor-pointer border rounded-xl overflow-hidden relative"
      onClick={navigateToNotePage}
    >
      {/* Overlay div to make the entire card clickable except for dropdown */}
      <div className="absolute inset-0 z-0" onClick={navigateToNotePage}></div>
      
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0 relative z-10">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-base line-clamp-1">
            {note.title || "Untitled Note"}
          </h3>
          <div className="flex items-center">
            <Badge variant="outline" className="px-2 py-0.5 text-xs rounded-full border-gray-200 text-gray-600 font-normal">
              {getCategoryName()}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 -mt-1 -mr-2 rounded-full" 
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] rounded-lg z-50">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              navigateToNotePage();
            }}
            className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Full Note
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="text-red-600 dark:text-red-400 gap-2"
            >
              <Trash className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow relative z-10">
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-4 markdown-preview">
          {note.content.length > 150 ? (
            <div className="truncate-markdown">
              <MarkdownContent content={note.content.substring(0, 150) + '...'} />
            </div>
          ) : (
            <MarkdownContent content={note.content} />
          )}
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t flex items-center relative z-10">
        <span className="inline-flex items-center">
          {formatDate(note.createdAt)}
        </span>
      </CardFooter>
    </Card>
  );
} 