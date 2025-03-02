"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { AppLayout } from "@/components/layout/app-layout";

export default function ChatPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </AppLayout>
  );
} 