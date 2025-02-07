import { useQuery } from "@tanstack/react-query";
import { Thread } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export function ThreadList({
  selectedThreadId,
  onThreadSelect,
}: {
  selectedThreadId?: number;
  onThreadSelect: (threadId: number) => void;
}) {
  const { toast } = useToast();
  const { data: threads = [] } = useQuery<Thread[]>({
    queryKey: ["/api/threads"],
  });

  const createThread = async () => {
    try {
      const res = await apiRequest("POST", "/api/threads");
      const thread = await res.json();
      onThreadSelect(thread.id);
      // スレッドリストを再取得
      queryClient.invalidateQueries({ queryKey: ["/api/threads"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new thread",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Button onClick={createThread} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {threads.map((thread) => (
            <Button
              key={thread.id}
              variant={selectedThreadId === thread.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onThreadSelect(thread.id)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {thread.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}