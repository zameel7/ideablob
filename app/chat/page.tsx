"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { AppLayout } from "@/components/layout/app-layout";

export default function ChatPage() {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 h-full">
        <h1 className="text-2xl font-bold mb-6">Chat with IdeaBlob</h1>
        <ChatInterface />
      </div>
    </AppLayout>
  );
} 