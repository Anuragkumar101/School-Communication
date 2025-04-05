import ChatWidget from "@/components/chat/chat-widget";

const ChatPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Classroom Chat</h1>
        <p className="text-muted-foreground">
          Stay connected with your classmates in real-time
        </p>
      </div>

      <ChatWidget />
    </div>
  );
};

export default ChatPage;
