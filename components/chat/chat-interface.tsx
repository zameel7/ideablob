"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { generateResponse } from "@/lib/ai-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Reset API key error state
    setApiKeyError(false);
    
    // Add user message to state
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      // Send to AI service
      const response = await generateResponse([...messages, userMessage]);
      
      // Add AI response to state
      const assistantMessage: Message = { role: "assistant", content: response || "I'm not sure how to respond to that." };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      
      // Check if it's an API key error
      if (error instanceof Error && 
          (error.message.includes("API key") || 
           error.message.includes("unregistered callers"))) {
        setApiKeyError(true);
        toast.error("Google AI API key is missing or invalid");
      } else {
        toast.error("Failed to generate response");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = (noteId: string) => {
    // This could navigate to the note or show a confirmation
    console.log("Note saved with ID:", noteId);
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  // Show API key error message
  if (apiKeyError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">API Key Required</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          To use the AI features, you need to add your Google Generative AI API key in your profile settings.
        </p>
        <Button onClick={navigateToProfile}>
          Go to Profile Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0 mb-16 md:mb-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to IdeaBlob</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Start a conversation with the AI assistant to organize your thoughts, take notes, and get suggestions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full">
              <div className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Ask a question</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  "What are some creative ways to solve this problem?"
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Brainstorm ideas</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  "Help me brainstorm ideas for my new project"
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Take notes</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  "I need to remember to call John tomorrow about the meeting"
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Organize thoughts</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  "Help me organize my thoughts on this topic"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
                onSaveNote={handleSaveNote} 
              />
            ))}
            {isLoading && (
              <div className="p-3 sm:p-4 flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  IdeaBlob is thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 md:relative md:bottom-auto w-full z-10 px-4 md:px-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 