import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ThreadList } from "@/components/chat/thread-list";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function ChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const { user, logoutMutation } = useAuth();

  return (
    <div className="h-screen flex">
      {/* サイドバー */}
      <div className="w-80 border-r flex flex-col">
        <div className="h-14 border-b flex items-center justify-between px-4 flex-shrink-0">
          <h1 className="font-semibold">AI Chat</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-muted-foreground">
                {user?.username}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-hidden">
          <ThreadList
            selectedThreadId={selectedThreadId}
            onThreadSelect={setSelectedThreadId}
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedThreadId ? (
          <>
            <div className="flex-1 overflow-hidden">
              <MessageList threadId={selectedThreadId} isLoading={isLoading} />
            </div>
            <MessageInput threadId={selectedThreadId} onLoadingChange={setIsLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            チャットを選択するか、新規チャットを作成してください
          </div>
        )}
      </div>
    </div>
  );
}