"use client";

import { useState } from "react";
import { Check, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { createNote } from "@/lib/note-service";
import { suggestCategory, suggestTags } from "@/lib/ai-service";
import { MarkdownContent } from "@/lib/markdown-utils";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
  onSaveNote: (noteId: string) => void;
}

export function ChatMessage({ message, onSaveNote }: ChatMessageProps) {
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const saveAsNote = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Get category suggestion
      const suggestedCategory = await suggestCategory(message.content);
      
      // Get category ID (for now we'll use a default)
      // In a real app, you'd match this with your categories
      const categoryId = "default";
      
      // Get tag suggestions
      const suggestedTags = await suggestTags(message.content);
      
      // Create the note
      const noteId = await createNote(user.uid, {
        title: message.content.split('\n')[0].substring(0, 50), // Use first line as title
        content: message.content,
        categoryId,
        tags: suggestedTags,
      });
      
      toast.success("Saved as note");
      onSaveNote(noteId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex gap-3 p-3 sm:p-4 ${message.role === "assistant" ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}>
      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        {message.role === "user" ? (
          <>
            <AvatarImage src={user?.photoURL || ""} alt="User" />
            <AvatarFallback>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/bot-avatar.png" alt="Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
        <div className="font-medium text-sm sm:text-base">
          {message.role === "user" ? user?.displayName || user?.email || "You" : "IdeaBlob AI"}
        </div>
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 overflow-hidden">
          <MarkdownContent content={message.content} />
        </div>
        {message.role === "assistant" && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 sm:h-8 px-2 text-xs"
              onClick={copyToClipboard}
            >
              {isCopied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {isCopied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 sm:h-8 px-2 text-xs"
              onClick={saveAsNote}
              disabled={isSaving}
            >
              <Save className="w-3 h-3 mr-1" />
              {isSaving ? "Saving..." : "Save as Note"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 