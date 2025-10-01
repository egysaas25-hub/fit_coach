import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockMessages = [
  { from: 'trainer', text: 'Hi John, how was your workout today?', time: '10:30 AM' },
  { from: 'client', text: 'It was great, thanks for asking!', time: '10:32 AM' },
  { from: 'trainer', text: 'Awesome! Remember to drink plenty of water.', time: '10:33 AM' },
  { from: 'client', text: 'Will do!', time: '10:35 AM' },
];

export default function ClientMessagesPage() {
  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
          {mockMessages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.from === 'client' ? 'justify-end' : ''}`}>
              {msg.from === 'trainer' && (
                <Avatar>
                  <AvatarImage src="/placeholder.jpg" alt="Trainer" />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg px-4 py-2 ${msg.from === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p>{msg.text}</p>
                <p className="text-xs text-muted-foreground text-right mt-1">{msg.time}</p>
              </div>
              {msg.from === 'client' && (
                <Avatar>
                  <AvatarImage src="/placeholder.jpg" alt="Client" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t flex items-center gap-2">
          <Input placeholder="Type your message..." />
          <Button>Send</Button>
        </div>
      </Card>
    </div>
  );
}