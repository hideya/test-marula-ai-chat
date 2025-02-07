import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function MessageInput({ 
  threadId, 
  onLoadingChange 
}: { 
  threadId: number;
  onLoadingChange: (loading: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    onLoadingChange(true);

    try {
      // まず、ユーザーのメッセージをキャッシュに追加
      const optimisticMessage = {
        id: Date.now(),
        threadId,
        content: message,
        role: "user" as const,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        [`/api/threads/${threadId}/messages`],
        (old: any[] = []) => [...old, optimisticMessage]
      );

      // APIリクエストを送信
      await apiRequest("POST", `/api/threads/${threadId}/messages`, {
        content: message,
      });

      setMessage("");
      // メッセージリストとスレッドリストの両方を更新
      queryClient.invalidateQueries({
        queryKey: [`/api/threads/${threadId}/messages`],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/threads"],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none"
          rows={1}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}