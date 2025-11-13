
describe('Admin Communication Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('CommunicationService', () => {
    let communicationService: CommunicationService;

    beforeEach(() => {
      communicationService = new CommunicationService();
    });

    it('should fetch all threads', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: jest.fn().mockResolvedValue([
          {
            id: '1',
            title: 'Client Inquiry',
            status: 'open',
            platform: 'WhatsApp',
            userId: '1',
            priority: 'medium',
            createdAt: '2023-01-01T10:00:00Z',
          },
          {
            id: '2',
            title: 'Support Request',
            status: 'resolved',
            platform: 'WhatsApp',
            userId: '2',
            priority: 'high',
            createdAt: '2023-01-02T15:30:00Z',
          },
        ]),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const threads = await communicationService.getThreads();

      expect(threads).toHaveLength(2);
      expect(threads[0].title).toBe('Client Inquiry');
      expect(threads[1].title).toBe('Support Request');
      expect(threads[0].status).toBe('open');
      expect(threads[1].status).toBe('resolved');
      expect(threads[0].platform).toBe('WhatsApp');
      expect(threads[1].platform).toBe('WhatsApp');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads');
    });

    it('should fetch threads for a specific user', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: jest.fn().mockResolvedValue([
          {
            id: '1',
            title: 'Client Inquiry',
            status: 'open',
            platform: 'WhatsApp',
            userId: '1',
            priority: 'medium',
            createdAt: '2023-01-01T10:00:00Z',
          },
        ]),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const threads = await communicationService.getThreads('1');

      expect(threads).toHaveLength(1);
      expect(threads[0].userId).toBe('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads?userId=1');
    });

    it('should fetch messages for a thread', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: jest.fn().mockResolvedValue([
          {
            id: '101',
            threadId: '1',
            userId: '1',
            content: 'Hello, I have a question about my workout plan.',
            createdAt: '2023-01-01T10:05:00Z',
          },
          {
            id: '102',
            threadId: '1',
            userId: '2',
            content: 'Sure, I can help you with that. What specifically would you like to know?',
            createdAt: '2023-01-01T10:10:00Z',
          },
        ]),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const messages = await communicationService.getThreadMessages('1');

      expect(messages).toHaveLength(2);
      expect(messages[0].threadId).toBe('1');
      expect(messages[1].threadId).toBe('1');
      expect(messages[0].content).toBe('Hello, I have a question about my workout plan.');
      expect(messages[1].content).toBe('Sure, I can help you with that. What specifically would you like to know?');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/messages');
    });

    it('should create a new thread', async () => {
      // Mock the fetch response
      const newThread = {
        id: '3',
        title: 'New Support Ticket',
        status: 'open',
        platform: 'WhatsApp',
        userId: '3',
        priority: 'medium',
        createdAt: '2023-01-03T09:00:00Z',
      };
      const mockResponse = {
        json: jest.fn().mockResolvedValue(newThread),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const thread = await communicationService.createThread(CommunicationPlatform.WhatsApp, '3', 'New Support Ticket');

      expect(thread.title).toBe('New Support Ticket');
      expect(thread.platform).toBe('WhatsApp');
      expect(thread.id).toBe('3');
      expect(thread.status).toBe('open');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: CommunicationPlatform.WhatsApp,
          userId: '3',
          title: 'New Support Ticket',
          status: 'open',
          priority: 'medium',
        }),
      });
    });

    it('should send a message', async () => {
      // Mock the fetch response
      const newMessage = {
        id: '201',
        threadId: '1',
        userId: '1',
        content: 'Thank you for your help!',
        createdAt: '2023-01-01T10:15:00Z',
      };
      const mockResponse = {
        json: jest.fn().mockResolvedValue(newMessage),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const message = await communicationService.sendMessage('1', '1', 'Thank you for your help!');

      expect(message.content).toBe('Thank you for your help!');
      expect(message.threadId).toBe('1');
      expect(message.id).toBe('201');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1', content: 'Thank you for your help!' }),
      });
    });

    it('should flag a thread', async () => {
      // Mock the fetch response
      const flaggedThread = {
        id: '1',
        title: 'Client Inquiry',
        status: 'open',
        platform: 'WhatsApp',
        userId: '1',
        priority: 'high',
        flaggedSeverity: 'Critical',
        createdAt: '2023-01-01T10:00:00Z',
      };
      const mockResponse = {
        json: jest.fn().mockResolvedValue(flaggedThread),
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const thread = await communicationService.flagThread('1', FlagSeverity.Critical);

      expect(thread.flaggedSeverity).toBe('Critical');
      expect(thread.id).toBe('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/threads/1/flag', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flaggedSeverity: FlagSeverity.Critical }),
      });
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(communicationService.getThreads()).rejects.toThrow('Failed to fetch threads');
    });
  });

  describe('Communication Database Operations', () => {
    it('should create a conversation in the database', async () => {
      // Mock the Prisma client
      const mockConversation = {
        id: BigInt(1),
        tenant_id: BigInt(1),
        customer_id: BigInt(10),
        channel: 'WhatsApp',
        started_at: new Date(),
        last_activity_at: new Date(),
      };

      (prisma.conversations.create as jest.Mock).mockResolvedValue(mockConversation);

      const conversation = await prisma.conversations.create({
        data: {
          tenant_id: BigInt(1),
          customer_id: BigInt(10),
          channel: 'wa',
          started_at: new Date(),
          last_activity_at: new Date(),
        },
      });

      expect(conversation.channel).toBe('WhatsApp');
      expect(conversation.customer_id).toBe(BigInt(10));
      expect(prisma.conversations.create).toHaveBeenCalledWith({
        data: {
          tenant_id: BigInt(1),
          customer_id: BigInt(10),
          channel: 'wa',
          started_at: new Date(),
          last_activity_at: new Date(),
        },
      });
    });

    it('should fetch all conversations from the database', async () => {
      // Mock the Prisma client
      const mockConversations = [
        {
          id: BigInt(1),
          tenant_id: BigInt(1),
          customer_id: BigInt(10),
          channel: 'wa',
          started_at: new Date('2023-01-01'),
          last_activity_at: new Date('2023-01-01'),
        },
        {
          id: BigInt(2),
          tenant_id: BigInt(1),
          customer_id: BigInt(11),
          channel: 'wa',
          started_at: new Date('2023-01-02'),
          last_activity_at: new Date('2023-01-02'),
        },
      ];

      (prisma.conversations.findMany as jest.Mock).mockResolvedValue(mockConversations);

      const conversations = await prisma.conversations.findMany({
        where: {
          tenant_id: BigInt(1),
        },
      });

      expect(conversations).toHaveLength(2);
      expect(conversations[0].channel).toBe('WhatsApp');
      expect(conversations[1].channel).toBe('WhatsApp');
      expect(prisma.conversations.findMany).toHaveBeenCalledWith({
        where: {
          tenant_id: BigInt(1),
        },
      });
    });

    it('should create an inbound message in the database', async () => {
      // Mock the Prisma client
      const mockMessage = {
        id: BigInt(1),
        tenant_id: BigInt(1),
        conversation_id: BigInt(1),
        customer_id: BigInt(10),
        text: 'Hello, I need help with my workout plan',
        received_at: new Date(),
      };

      (prisma.inbound_messages.create as jest.Mock).mockResolvedValue(mockMessage);

      const message = await prisma.inbound_messages.create({
        data: {
          tenant_id: BigInt(1),
          conversation_id: BigInt(1),
          customer_id: BigInt(10),
          text: 'Hello, I need help with my workout plan',
          received_at: new Date(),
        },
      });

      expect(message.text).toBe('Hello, I need help with my workout plan');
      expect(message.customer_id).toBe(BigInt(10));
      expect(prisma.inbound_messages.create).toHaveBeenCalledWith({
        data: {
          tenant_id: BigInt(1),
          conversation_id: BigInt(1),
          customer_id: BigInt(10),
          text: 'Hello, I need help with my workout plan',
          received_at: new Date(),
        },
      });
    });

    it('should create an outbound message in the database', async () => {
      // Mock the Prisma client
      const mockMessage = {
        id: BigInt(1),
        tenant_id: BigInt(1),
        conversation_id: BigInt(1),
        customer_id: BigInt(10),
        text: 'Sure, I can help you with that. What specifically would you like to know?',
        status: 'sent',
        sent_at: new Date(),
      };

      (prisma.outbound_messages.create as jest.Mock).mockResolvedValue(mockMessage);

      const message = await prisma.outbound_messages.create({
        data: {
          tenant_id: BigInt(1),
          conversation_id: BigInt(1),
          customer_id: BigInt(10),
          text: 'Sure, I can help you with that. What specifically would you like to know?',
          status: 'sent',
          sent_at: new Date(),
        },
      });

      expect(message.text).toBe('Sure, I can help you with that. What specifically would you like to know?');
      expect(message.status).toBe('sent');
      expect(prisma.outbound_messages.create).toHaveBeenCalledWith({
        data: {
          tenant_id: BigInt(1),
          conversation_id: BigInt(1),
          customer_id: BigInt(10),
          text: 'Sure, I can help you with that. What specifically would you like to know?',
          status: 'sent',
          sent_at: new Date(),
        },
      });
    });
  });
});