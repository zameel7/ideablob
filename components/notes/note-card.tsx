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
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer border-muted">
      <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-base line-clamp-1">
            {note.title || "Untitled Note"}
          </h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              {getCategoryName()}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              navigateToNotePage();
            }}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Note
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="text-red-600 dark:text-red-400"
            >
              <Trash className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-grow" onClick={navigateToNotePage}>
        <div className="mt-3 text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400 line-clamp-4">
          {note.content.length > 150
            ? `${note.content.substring(0, 150)}...`
            : note.content}
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-3 text-xs text-gray-500 dark:text-gray-400 border-t" onClick={navigateToNotePage}>
        {formatDate(note.createdAt)}
      </CardFooter>
    </Card>
  );
} 