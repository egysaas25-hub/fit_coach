'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  ChevronRight,
  ChevronLeft,
  MessageCircle,
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
import { Thread, Message, GroupedThreads, Comment } from '@/types/communication';

const mockThreads: Thread[] = [
  {
    id: 1,
    clientCode: 'C001',
    clientName: 'Anna Carter',
    phone: '+20123456789',
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
  {
    id: 2,
    clientCode: 'C002',
    clientName: 'John Smith',
    phone: '+20123456790',
    unreadCount: 0,
    status: 'active',
    goal: 'Hypertrophy',
    currentRound: 5,
    totalRounds: 12,
    renewalCount: 2,
    lastMessage: 'Can we reschedule tomorrow?',
    lastMessageTime: '9:45 AM',
    assignedTrainer: 'Sarah Lee',
    trainerTag: 'JT',
    hasFlag: true,
    flagSeverity: 'warning',
    online: true,
  },
  {
    id: 3,
    clientCode: 'C003',
    clientName: 'Emily Davis',
    phone: '+20123456791',
    unreadCount: 1,
    status: 'active',
    goal: 'Rehab',
    currentRound: 1,
    totalRounds: 8,
    renewalCount: 0,
    lastMessage: 'How should I adjust for my knee pain?',
    lastMessageTime: 'Yesterday',
    assignedTrainer: 'Mike Johnson',
    trainerTag: 'SA',
    hasFlag: true,
    flagSeverity: 'critical',
    online: false,
  },
  {
    id: 4,
    clientCode: 'C004',
    clientName: 'David Wilson',
    phone: '+20123456792',
    unreadCount: 0,
    status: 'inactive',
    goal: 'Fat Loss',
    currentRound: 12,
    totalRounds: 12,
    renewalCount: 3,
    lastMessage: 'Subscription ended, thanks!',
    lastMessageTime: '3 days ago',
    assignedTrainer: 'Sarah Lee',
    trainerTag: 'JT',
    hasFlag: false,
    flagSeverity: null,
    online: false,
  },
  {
    id: 5,
    clientCode: 'C005',
    clientName: 'Sarah Miller',
    phone: '+20123456793',
    unreadCount: 2,
    status: 'active',
    goal: 'Hypertrophy',
    currentRound: 3,
    totalRounds: 12,
    renewalCount: 0,
    lastMessage: 'When should I increase weights?',
    lastMessageTime: '11:15 AM',
    assignedTrainer: 'Mike Johnson',
    trainerTag: 'JT',
    hasFlag: false,
    flagSeverity: null,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'client',
    senderName: 'Anna Carter',
    content: 'Hi! I have a question about my meal plan for this week.',
    timestamp: '10:20 AM',
    isRead: true,
    comments: [],
  },
  {
    id: 2,
    sender: 'trainer',
    senderName: 'Mike Johnson',
    trainerTag: 'JT',
    content: 'Of course! What would you like to know?',
    timestamp: '10:22 AM',
    isRead: true,
    isReply: true,
    comments: [
      {
        id: 1,
        senderName: 'Sarah Lee',
        trainerTag: 'SA',
        content: 'Client is doing well, staying consistent with check-ins',
        timestamp: '10:23 AM',
      },
    ],
  },
  {
    id: 4,
    sender: 'client',
    senderName: 'Anna Carter',
    content: 'Can I substitute chicken with fish in meal 3?',
    timestamp: '10:25 AM',
    isRead: true,
    comments: [],
  },
  {
    id: 5,
    sender: 'trainer',
    senderName: 'Mike Johnson',
    trainerTag: 'JT',
    content: 'Absolutely! Just make sure to use the same portion size. Fish is a great alternative.',
    timestamp: '10:27 AM',
    isRead: true,
    isReply: true,
    comments: [],
  },
  {
    id: 6,
    sender: 'client',
    senderName: 'Anna Carter',
    content: 'Thanks for the meal plan update!',
    timestamp: '10:30 AM',
    isRead: false,
    comments: [],
  },
];

export default function CommunicationWhatsAppPage() {
  const [selectedThread, setSelectedThread] = useState<Thread>(mockThreads[0]);
  const [viewMode, setViewMode] = useState<'active-read' | 'active-unread' | 'inactive'>('active-read');
  const [groupBy, setGroupBy] = useState<'round' | 'goal' | 'renewal'>('round');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [activeCommentMessageId, setActiveCommentMessageId] = useState<number | null>(null);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState<boolean>(true);

  // Filter threads based on view mode
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

  // Group threads
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

  const handleAddComment = (messageId: number) => {
    if (commentInput.trim()) {
      console.log(`Adding comment to message ${messageId}:`, commentInput);
      // In a real app, update mockMessages with the new comment
      setCommentInput('');
      setActiveCommentMessageId(null);
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
      <div className="flex-1 grid grid-cols-[384px_1fr_320px] h-full">
        {/* First Column - Thread List */}
        <div className="border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">WhatsApp Messages</h2>
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connected
              </Badge>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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

        {/* Second Column - Chat Area */}
        <div className="border-r border-border flex flex-col">
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
                    <span>Round {selectedThread.currentRound}/{selectedThread.totalRounds}</span>
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
          <div className="p-3 bg-muted/30 border-b border-border flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Actions:</span>
            <Button size="sm" variant="default">
              <Send className="h-3 w-3 mr-2" />
              Reply
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
          <div className="flex-1 overflow-y-auto p-4 space-y-0">
            {mockMessages.map((message, index) => (
              <div
                key={message.id}
                className="grid grid-cols-[1fr_auto] items-start gap-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-accent/20"
                style={{ gridRow: index + 1 }}
              >
                <div className={`flex ${message.sender === 'client' ? 'justify-start' : 'justify-end'} items-start`}>
                  <div className={`max-w-2xl ${message.sender === 'client' ? '' : 'text-right'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {message.sender === 'trainer' && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            @{message.senderName.split(' ')[0]} {message.trainerTag}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setActiveCommentMessageId(
                                activeCommentMessageId === message.id ? null : message.id
                              )
                            }
                            className={`${activeCommentMessageId === message.id ? 'bg-yellow-50 border-yellow-200' : ''} transition-all duration-200`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            {message.comments?.length ? (
                              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                                {message.comments.length}
                              </Badge>
                            ) : null}
                          </Button>
                        </div>
                      )}
                      {message.sender === 'client' && (
                        <span className="text-sm font-medium">{message.senderName}</span>
                      )}
                      {message.isReply && (
                        <Badge variant="outline" className="text-xs">
                          <Send className="h-2 w-2 mr-1" />
                          Reply
                        </Badge>
                      )}
                    </div>
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-full ${
                        message.sender === 'client' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                  </div>
                </div>
                <div className="w-px bg-muted/30 self-stretch mx-2"></div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
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

        {/* Third Column - Collapsible Comments */}
        <div
          className={`bg-card border-l border-border flex flex-col transition-all duration-300 ease-in-out ${
            isCommentPanelOpen ? 'w-80' : 'w-0 overflow-hidden'
          }`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-yellow-600" />
              <h3 className="text-sm font-semibold">Internal Comments</h3>
              <Badge variant="secondary" className="text-xs">
                {mockMessages.filter((m) => m.comments?.length).length} messages
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommentPanelOpen(!isCommentPanelOpen)}
              className="h-8 w-8"
            >
              {isCommentPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          {isCommentPanelOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-0">
              {mockMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`py-3 px-3 border-b border-border/50 last:border-b-0 ${
                    activeCommentMessageId === message.id
                      ? 'bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200/50'
                      : 'hover:bg-accent/20'
                  } transition-all duration-200 ${message.sender !== 'trainer' ? 'opacity-30' : ''}`}
                  style={{ gridRow: index + 1 }}
                >
                  {message.sender === 'trainer' ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Msg #{message.id}</span>
                          {message.comments?.length ? (
                            <Badge variant="secondary" className="text-xs">
                              {message.comments.length} comment{message.comments.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : null}
                        </div>
                        {activeCommentMessageId === message.id && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAddComment(message.id)}
                              className="h-6 px-3 text-xs"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveCommentMessageId(null)}
                              className="h-6 px-3 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                      {activeCommentMessageId === message.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add internal comment on this trainer message..."
                            className="text-sm bg-background border-border/50"
                            rows={3}
                          />
                        </div>
                      ) : (
                        <>
                          {message.comments && message.comments.length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                              {message.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="bg-yellow-50/60 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-800/60 rounded-md p-3"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                    <span className="text-xs font-medium text-yellow-900 dark:text-yellow-100 truncate">
                                      {comment.senderName} (@{comment.trainerTag})
                                    </span>
                                  </div>
                                  <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                    {comment.content}
                                  </p>
                                  <p className="text-xs text-yellow-600 mt-1">{comment.timestamp}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic text-center py-4">
                              No comments yet
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-4">
                      Comments only available for trainer messages
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!isCommentPanelOpen && (
            <div className="flex items-center justify-center h-full border-l border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCommentPanelOpen(true)}
                className="h-12 w-12"
              >
                <MessageCircle className="h-5 w-5 text-yellow-600" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}