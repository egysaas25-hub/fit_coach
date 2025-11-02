'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Send,
  Flag,
  MessageSquare,
  User,
  AlertTriangle,
  Info,
  AlertCircle,
  Phone,
  Video,
  MoreVertical,
  ThumbsUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define interfaces for data structures
interface Thread {
  id: number;
  clientCode: string;
  clientName: string;
  unreadCount: number;
  status: 'active' | 'inactive';
  goal: string;
  currentRound: number;
  totalRounds: number;
  renewalCount: number;
  lastMessage: string;
  lastMessageTime: string;
  assignedTrainer: string;
  trainerTag: string;
  hasFlag: boolean;
  flagSeverity: 'critical' | 'warning' | 'coach' | 'info' | null;
  online: boolean;
}

interface Message {
  id: number;
  sender: 'client' | 'trainer' | 'comment';
  senderName: string;
  trainerTag?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isReply?: boolean;
  isInternal?: boolean;
}

interface GroupedThreads {
  [key: string]: Thread[];
}

const mockThreads: Thread[] = [
  {
    id: 1,
    clientCode: 'C001',
    clientName: 'Anna Carter',
    unreadCount: 3,
    status: 'active',
    goal: 'Fat Loss',
    currentRound: 2,
    totalRounds: 12,
    renewalCount: 1,
    lastMessage: 'Thanks for the meal plan update!',
    lastMessageTime: '10:30 AM',
    assignedTrainer: 'Mike Johnson',
    trainerTag: 'JT',
    hasFlag: false,
    flagSeverity: null,
    online: true,
  },
  // ... (other threads unchanged)
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'client',
    senderName: 'Anna Carter',
    content: 'Hi! I have a question about my meal plan for this week.',
    timestamp: '10:20 AM',
    isRead: true,
  },
  // ... (other messages unchanged)
];

export default function MessengerPage() {
  const [selectedThread, setSelectedThread] = useState<Thread>(mockThreads[0]);
  const [viewMode, setViewMode] = useState<'active-read' | 'active-unread' | 'inactive'>('active-read');
  const [groupBy, setGroupBy] = useState<'round' | 'goal' | 'renewal'>('round');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [showCommentDialog, setShowCommentDialog] = useState<boolean>(false);

  const filteredThreads = mockThreads.filter((thread) => {
    const matchesSearch =
      thread.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.clientCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (viewMode) {
      case 'active-read':
        return thread.status === 'active' && thread.unreadCount === 0;
      case 'active-unread':
        return thread.status === 'active' && thread.unreadCount > 0;
      case 'inactive':
        return thread.status === 'inactive';
      default:
        return true;
    }
  });

  const groupedThreads = (): GroupedThreads => {
    const groups: GroupedThreads = {};

    filteredThreads.forEach((thread) => {
      let groupKey: string;
      switch (groupBy) {
        case 'round':
          groupKey = `Round ${thread.currentRound}/${thread.totalRounds}`;
          break;
        case 'goal':
          groupKey = thread.goal;
          break;
        case 'renewal':
          groupKey =
            thread.renewalCount === 0 ? 'First-time' : thread.renewalCount === 1 ? 'Second' : 'Third+';
          break;
        default:
          groupKey = 'All';
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(thread);
    });

    return groups;
  };

  const groups = groupedThreads();

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      console.log('Adding internal comment:', commentInput);
      setCommentInput('');
      setShowCommentDialog(false);
    }
  };

  const handleFlag = (severity: 'critical' | 'warning' | 'coach' | 'info' | null) => {
    console.log('Flagging thread with severity:', severity);
  };

  const getCountByMode = (mode: 'active-read' | 'active-unread' | 'inactive') => {
    return mockThreads.filter((t) => {
      switch (mode) {
        case 'active-read':
          return t.status === 'active' && t.unreadCount === 0;
        case 'active-unread':
          return t.status === 'active' && t.unreadCount > 0;
        case 'inactive':
          return t.status === 'inactive';
        default:
          return false;
      }
    }).length;
  };

  const getFlagIcon = (severity: 'critical' | 'warning' | 'coach' | 'info' | null) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'coach':
        return <User className="h-3 w-3 text-blue-500" />;
      case 'info':
        return <Info className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Thread List */}
        <div className="w-96 border-r border-border flex flex-col bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Messenger</h2>
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connected
              </Badge>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Toggles with Counts */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={viewMode === 'active-read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('active-read')}
                className="flex-1"
              >
                Read ({getCountByMode('active-read')})
              </Button>
              <Button
                variant={viewMode === 'active-unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('active-unread')}
                className="flex-1"
              >
                Unread ({getCountByMode('active-unread')})
              </Button>
              <Button
                variant={viewMode === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('inactive')}
                className="flex-1"
              >
                Inactive ({getCountByMode('inactive')})
              </Button>
            </div>

            {/* Group By Selector */}
            {viewMode !== 'inactive' && (
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round">Group by Check-in Round</SelectItem>
                  <SelectItem value="goal">Group by Goal</SelectItem>
                  <SelectItem value="renewal">Group by Renewal Count</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Thread List with Grouping */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groups).map(([groupName, threads]) => (
              <div key={groupName}>
                <div className="px-4 py-2 bg-muted/50 text-sm font-medium sticky top-0 z-10">
                  {groupName} ({threads.length})
                </div>

                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full p-4 border-b border-border hover:bg-accent/50 transition-colors text-left ${
                      selectedThread?.id === thread.id ? 'bg-accent' : ''
                    } ${thread.unreadCount > 0 ? 'bg-primary/5 font-semibold' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {thread.clientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {thread.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${thread.unreadCount > 0 ? 'font-bold' : 'font-medium'}`}>
                            {thread.clientCode}—{thread.clientName}
                            {thread.unreadCount > 0 && ` (${thread.unreadCount})`}
                          </span>
                          {thread.hasFlag && (
                            <div className="flex items-center">{getFlagIcon(thread.flagSeverity)}</div>
                          )}
                        </div>

                        {groupBy === 'round' && (
                          <Badge variant="outline" className="text-xs mb-1">
                            Round {thread.currentRound}/{thread.totalRounds}
                          </Badge>
                        )}

                        <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{thread.lastMessageTime}</span>
                          <Badge variant="secondary" className="text-xs">
                            @{thread.assignedTrainer.split(' ')[0]} {thread.trainerTag}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedThread.clientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedThread.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedThread.clientCode}—{selectedThread.clientName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{selectedThread.goal}</span>
                    <span>•</span>
                    <span>
                      Round {selectedThread.currentRound}/{selectedThread.totalRounds}
                    </span>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs">
                      @{selectedThread.assignedTrainer.split(' ')[0]} {selectedThread.trainerTag}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Superior Trainer Tools Bar */}
          <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Actions:</span>

            <Button size="sm" variant="default">
              <Send className="h-3 w-3 mr-2" />
              Reply
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCommentDialog(!showCommentDialog)}
            >
              <MessageSquare className="h-3 w-3 mr-2" />
              Comment
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Flag className="h-3 w-3 mr-2" />
                  Flag
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFlag('info')}>
                  <Info className="h-4 w-4 mr-2 text-gray-500" />
                  Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFlag('coach')}>
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  Coach Needed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFlag('warning')}>
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  Warning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFlag('critical')}>
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Critical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-auto text-xs text-muted-foreground">
              💡 Reply = Client sees | Comment = Staff only
            </div>
          </div>

          {/* Internal Comment Dialog */}
          {showCommentDialog && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Internal Comment (Staff Only - Not visible to client)
                  </p>
                  <Textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add internal note for team members..."
                    className="mb-2 bg-white dark:bg-gray-800"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddComment}>
                      Save Comment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCommentDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div key={message.id}>
                {message.isInternal ? (
                  <div className="flex justify-center my-2">
                    <div className="max-w-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-3 w-3 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                          Internal Comment - {message.senderName} (@{message.senderName.split(' ')[0]}{' '}
                          {message.trainerTag})
                        </span>
                      </div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{message.content}</p>
                      <p className="text-xs text-yellow-600 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${message.sender === 'client' ? '' : 'justify-end'}`}>
                    <div className={`max-w-md ${message.sender === 'client' ? '' : 'text-right'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'trainer' && (
                          <Badge variant="secondary" className="text-xs">
                            @{message.senderName.split(' ')[0]} {message.trainerTag}
                          </Badge>
                        )}
                        {message.sender === 'client' && (
                          <span className="text-xs font-medium">{message.senderName}</span>
                        )}
                        {message.isReply && (
                          <Badge variant="outline" className="text-xs">
                            <Send className="h-2 w-2 mr-1" />
                            Reply
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`inline-block rounded-lg px-4 py-2 ${
                          message.sender === 'client' ? 'bg-accent' : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 items-center">
              <Button variant="ghost" size="icon">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to client..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}