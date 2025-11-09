'use client';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMessageThreads, useMessages, useSendMessage } from '@/lib/hooks/api/useMessages';
import { useUserStore } from '@/lib/store/user.store';

const mockMessages = [
  { from: 'trainer', text: 'Hi John, how was your workout today?', time: '10:30 AM' },
  { from: 'client', text: 'It was great, thanks for asking!', time: '10:32 AM' },
  { from: 'trainer', text: 'Awesome! Remember to drink plenty of water.', time: '10:33 AM' },
  { from: 'client', text: 'Will do!', time: '10:35 AM' },
];

export default function ClientMessagesPage() {
  const { user } = useUserStore();
  const { data: threadsData, isLoading: threadsLoading } = useMessageThreads({ limit: 10 });
  const activeThreadId = threadsData?.data?.[0]?.id || '';
  const { data: messages, isLoading: messagesLoading } = useMessages(activeThreadId, { limit: 50 });
  const { mutate: sendMessage, isPending } = useSendMessage(activeThreadId);

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
          {threadsLoading || messagesLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user?.id ? 'justify-end' : ''}`}>
                {msg.senderId !== user?.id && (
                  <Avatar>
                    <AvatarImage src="/placeholder.jpg" alt="Sender" />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-4 py-2 ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p>{msg.content}</p>
                  <p className="text-xs text-muted-foreground text-right mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                {msg.senderId === user?.id && (
                  <Avatar>
                    <AvatarImage src="/placeholder.jpg" alt="You" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No messages yet</div>
          )}
        </CardContent>
        <MessageInput onSend={(text) => { if (activeThreadId) sendMessage(text); }} disabled={isPending || !activeThreadId} />
      </Card>
    </div>
  );
}

function MessageInput({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = React.useState('');
  return (
    <div className="p-4 border-t flex items-center gap-2">
      <Input placeholder="Type your message..." value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => { if (value.trim()) { onSend(value.trim()); setValue(''); } }} disabled={disabled}>Send</Button>
    </div>
  );
}
