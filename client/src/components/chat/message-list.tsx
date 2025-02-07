import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export function MessageList({ threadId, isLoading }: { threadId: number; isLoading?: boolean }) {
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: [`/api/threads/${threadId}/messages`],
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが来たら自動的に最下部にスクロール
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <Avatar className="mt-1">
              {message.role === "assistant" ? (
                <Bot className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Avatar>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === "assistant"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <Avatar className="mt-1">
              <Bot className="h-5 w-5" />
            </Avatar>
            <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}