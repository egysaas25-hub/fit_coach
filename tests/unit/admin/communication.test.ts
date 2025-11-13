import { CommunicationService } from '@/lib/api/services/communication.service';
import { 
  useThreads, 
  useThreadMessages,
  useCreateThread,
  useSendMessage,
  useFlagThread
} from '@/lib/hooks/api/useCommunication';
import { Thread, Comment, CommunicationPlatform, ThreadStatus, MessagePriority, FlagSeverity } from '@/types/domain/communication';

// Mock fetch globally
global.fetch = jest.fn();

describe('Communication Service', () => {
  let communicationService: CommunicationService;
  
  beforeEach(() => {
    communicationService = new CommunicationService();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getThreads', () => {
    it('should fetch threads without userId', async () => {
      const mockThreads: Thread[] = [
        { id: '1', title: 'Thread 1', platform: CommunicationPlatform.WhatsApp, userId: '1', lastMessageAt: '2023-11-01', status: ThreadStatus.Open, priority: MessagePriority.Medium, createdAt: '2023-11-01', updatedAt: '2023-11-01' },
        { id: '2', title: 'Thread 2', platform: CommunicationPlatform.WhatsApp, userId: '2', lastMessageAt: '2023-11-02', status: ThreadStatus.Closed, priority: MessagePriority.High, createdAt: '2023-11-02', updatedAt: '2023-11-02' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockThreads),
      });

      const result = await communicationService.getThreads();

      expect(global.fetch).toHaveBeenCalledWith('/api/threads');
      expect(result).toEqual(mockThreads);
    });

    it('should fetch threads with userId', async () => {
      const mockThreads: Thread[] = [
        { id: '1', title: 'Thread 1', platform: CommunicationPlatform.WhatsApp, userId: '1', lastMessageAt: '2023-11-01', status: ThreadStatus.Open, priority: MessagePriority.Medium, createdAt: '2023-11-01', updatedAt: '2023-11-01' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockThreads),
      });

      const result = await communicationService.getThreads('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/threads?userId=1');
      expect(result).toEqual(mockThreads);
    });

    it('should handle fetch errors when getting threads', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(communicationService.getThreads()).rejects.toThrow('Failed to fetch threads');
    });
  });

  describe('getThreadMessages', () => {
    it('should fetch messages for a thread', async () => {
      const mockMessages: Comment[] = [
        { id: '1', threadId: '1', userId: '1', content: 'Hello', createdAt: '2023-11-01', updatedAt: '2023-11-01' },
        { id: '2', threadId: '1', userId: '2', content: 'Hi there', createdAt: '2023-11-01', updatedAt: '2023-11-01' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockMessages),
      });

      const result = await communicationService.getThreadMessages('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/messages');
      expect(result).toEqual(mockMessages);
    });

    it('should handle fetch errors when getting thread messages', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(communicationService.getThreadMessages('1')).rejects.toThrow('Failed to fetch thread messages');
    });
  });

  describe('createThread', () => {
    it('should create a new thread', async () => {
      const mockThread: Thread = {
        id: '3',
        title: 'New Thread',
        platform: CommunicationPlatform.WhatsApp,
        userId: '1',
        lastMessageAt: '2023-11-03',
        status: ThreadStatus.Open,
        priority: MessagePriority.Medium,
        createdAt: '2023-11-03',
        updatedAt: '2023-11-03',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockThread),
      });

      const result = await communicationService.createThread(CommunicationPlatform.WhatsApp, '1', 'New Thread');

      expect(global.fetch).toHaveBeenCalledWith('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform: CommunicationPlatform.WhatsApp, 
          userId: '1', 
          title: 'New Thread', 
          status: 'Open', 
          priority: 'Medium' 
        }),
      });
      expect(result).toEqual(mockThread);
    });

    it('should handle fetch errors when creating a thread', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(communicationService.createThread(CommunicationPlatform.WhatsApp, '1', 'New Thread'))
        .rejects.toThrow('Failed to create thread');
    });
  });

  describe('sendMessage', () => {
    it('should send a message to a thread', async () => {
      const mockMessage: Comment = {
        id: '3',
        threadId: '1',
        userId: '1',
        content: 'New message',
        createdAt: '2023-11-03',
        updatedAt: '2023-11-03',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockMessage),
      });

      const result = await communicationService.sendMessage('1', '1', 'New message');

      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1', content: 'New message' }),
      });
      expect(result).toEqual(mockMessage);
    });

    it('should handle fetch errors when sending a message', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(communicationService.sendMessage('1', '1', 'New message'))
        .rejects.toThrow('Failed to send message');
    });
  });

  describe('flagThread', () => {
    it('should flag a thread with severity', async () => {
      const mockThread: Thread = {
        id: '1',
        title: 'Flagged Thread',
        platform: CommunicationPlatform.WhatsApp,
        userId: '1',
        lastMessageAt: '2023-11-01',
        status: ThreadStatus.Open,
        priority: MessagePriority.High,
        createdAt: '2023-11-01',
        updatedAt: '2023-11-03',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockThread),
      });

      const result = await communicationService.flagThread('1', FlagSeverity.Critical);

      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/flag', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flaggedSeverity: FlagSeverity.Critical }),
      });
      expect(result).toEqual(mockThread);
    });

    it('should handle fetch errors when flagging a thread', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(communicationService.flagThread('1', FlagSeverity.Critical))
        .rejects.toThrow('Failed to flag thread');
    });
  });
});

describe('Communication Hooks', () => {
  describe('useThreads', () => {
    it('should fetch threads', () => {
      const mockThreads: Thread[] = [
        { id: '1', title: 'Thread 1', platform: CommunicationPlatform.WhatsApp, userId: '1', lastMessageAt: '2023-11-01', status: ThreadStatus.Open, priority: MessagePriority.Medium, createdAt: '2023-11-01', updatedAt: '2023-11-01' },
      ];

      const mockUseState = jest.fn()
        .mockReturnValueOnce([mockThreads, jest.fn()]) // threads
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      const mockUseEffect = jest.fn().mockImplementation((fn) => fn());
      const mockUseCallback = jest.fn().mockImplementation((fn) => fn);

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: mockUseEffect,
        useCallback: mockUseCallback,
      }));

      // Mock the CommunicationService
      const mockCommunicationService = {
        getThreads: jest.fn().mockResolvedValue(mockThreads),
      };

      jest.mock('@/lib/api/services/communication.service', () => {
        return {
          CommunicationService: jest.fn().mockImplementation(() => mockCommunicationService),
        };
      });

      // Re-import after mocking
      const { useThreads } = require('@/lib/hooks/api/useCommunication');
      
      const { threads, loading, error } = useThreads();
      
      expect(threads).toEqual(mockThreads);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('useThreadMessages', () => {
    it('should fetch messages for a thread', () => {
      const mockMessages: Comment[] = [
        { id: '1', threadId: '1', userId: '1', content: 'Hello', createdAt: '2023-11-01', updatedAt: '2023-11-01' },
      ];

      const mockUseState = jest.fn()
        .mockReturnValueOnce([mockMessages, jest.fn()]) // messages
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      const mockUseEffect = jest.fn().mockImplementation((fn) => fn());
      const mockUseCallback = jest.fn().mockImplementation((fn) => fn);

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: mockUseEffect,
        useCallback: mockUseCallback,
      }));

      // Mock the CommunicationService
      const mockCommunicationService = {
        getThreadMessages: jest.fn().mockResolvedValue(mockMessages),
      };

      jest.mock('@/lib/api/services/communication.service', () => {
        return {
          CommunicationService: jest.fn().mockImplementation(() => mockCommunicationService),
        };
      });

      // Re-import after mocking
      const { useThreadMessages } = require('@/lib/hooks/api/useCommunication');
      
      const { messages, loading, error } = useThreadMessages('1');
      
      expect(mockCommunicationService.getThreadMessages).toHaveBeenCalledWith('1');
      expect(messages).toEqual(mockMessages);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });
  });

  describe('useCreateThread', () => {
    it('should create a thread', async () => {
      const mockThread: Thread = {
        id: '3',
        title: 'New Thread',
        platform: CommunicationPlatform.WhatsApp,
        userId: '1',
        lastMessageAt: '2023-11-03',
        status: ThreadStatus.Open,
        priority: MessagePriority.Medium,
        createdAt: '2023-11-03',
        updatedAt: '2023-11-03',
      };

      const mockUseState = jest.fn()
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useCallback: (fn: any) => fn,
      }));

      // Mock the CommunicationService
      const mockCommunicationService = {
        createThread: jest.fn().mockResolvedValue(mockThread),
      };

      jest.mock('@/lib/api/services/communication.service', () => {
        return {
          CommunicationService: jest.fn().mockImplementation(() => mockCommunicationService),
        };
      });

      // Re-import after mocking
      const { useCreateThread } = require('@/lib/hooks/api/useCommunication');
      
      const { createThread } = useCreateThread();
      const result = await createThread(CommunicationPlatform.WhatsApp, '1', 'New Thread');
      
      expect(mockCommunicationService.createThread).toHaveBeenCalledWith(
        CommunicationPlatform.WhatsApp,
        '1',
        'New Thread'
      );
      expect(result).toEqual(mockThread);
    });
  });

  describe('useSendMessage', () => {
    it('should send a message', async () => {
      const mockMessage: Comment = {
        id: '3',
        threadId: '1',
        userId: '1',
        content: 'New message',
        createdAt: '2023-11-03',
        updatedAt: '2023-11-03',
      };

      const mockUseState = jest.fn()
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useCallback: (fn: any) => fn,
      }));

      // Mock the CommunicationService
      const mockCommunicationService = {
        sendMessage: jest.fn().mockResolvedValue(mockMessage),
      };

      jest.mock('@/lib/api/services/communication.service', () => {
        return {
          CommunicationService: jest.fn().mockImplementation(() => mockCommunicationService),
        };
      });

      // Re-import after mocking
      const { useSendMessage } = require('@/lib/hooks/api/useCommunication');
      
      const { sendMessage } = useSendMessage();
      const result = await sendMessage('1', '1', 'New message');
      
      expect(mockCommunicationService.sendMessage).toHaveBeenCalledWith('1', '1', 'New message');
      expect(result).toEqual(mockMessage);
    });
  });

  describe('useFlagThread', () => {
    it('should flag a thread', async () => {
      const mockThread: Thread = {
        id: '1',
        title: 'Flagged Thread',
        platform: CommunicationPlatform.WhatsApp,
        userId: '1',
        lastMessageAt: '2023-11-01',
        status: ThreadStatus.Open,
        priority: MessagePriority.High,
        createdAt: '2023-11-01',
        updatedAt: '2023-11-03',
      };

      const mockUseState = jest.fn()
        .mockReturnValueOnce([false, jest.fn()]) // loading
        .mockReturnValueOnce([null, jest.fn()]); // error

      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useCallback: (fn: any) => fn,
      }));

      // Mock the CommunicationService
      const mockCommunicationService = {
        flagThread: jest.fn().mockResolvedValue(mockThread),
      };

      jest.mock('@/lib/api/services/communication.service', () => {
        return {
          CommunicationService: jest.fn().mockImplementation(() => mockCommunicationService),
        };
      });

      // Re-import after mocking
      const { useFlagThread } = require('@/lib/hooks/api/useCommunication');
      
      const { flagThread } = useFlagThread();
      const result = await flagThread('1', FlagSeverity.Critical);
      
      expect(mockCommunicationService.flagThread).toHaveBeenCalledWith('1', FlagSeverity.Critical);
      expect(result).toEqual(mockThread);
    });
  });
});