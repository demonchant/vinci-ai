import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
