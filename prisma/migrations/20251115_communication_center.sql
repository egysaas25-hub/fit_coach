-- Communication Center Tables
-- Channels, Threads, Messages, Internal Comments, Flags

-- Channels table (WhatsApp, Email, Telegram, etc.)
CREATE TABLE IF NOT EXISTS channels (
  channel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  channel_type VARCHAR(50) NOT NULL, -- whatsapp, email, telegram, signal, instagram, facebook
  channel_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB, -- channel-specific configuration
  credentials JSONB, -- encrypted credentials
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, channel_type)
);

-- Message threads (unified across channels)
CREATE TABLE IF NOT EXISTS message_threads (
  thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  external_thread_id VARCHAR(255), -- ID from external platform
  assigned_to UUID REFERENCES team_members(member_id),
  status VARCHAR(50) DEFAULT 'active', -- active, archived, closed
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, channel_id, external_thread_id)
);

CREATE INDEX idx_threads_tenant_client ON message_threads(tenant_id, client_id);
CREATE INDEX idx_threads_assigned ON message_threads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_threads_unread ON message_threads(tenant_id, unread_count) WHERE unread_count > 0;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES message_threads(thread_id) ON DELETE CASCADE,
  external_message_id VARCHAR(255), -- ID from external platform
  sender_type VARCHAR(50) NOT NULL, -- client, trainer, system
  sender_id UUID, -- client_id or team_member_id
  sender_name VARCHAR(255),
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text', -- text, image, video, file, template
  metadata JSONB, -- attachments, template info, etc.
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES team_members(member_id),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id, sent_at DESC);
CREATE INDEX idx_messages_tenant ON messages(tenant_id, sent_at DESC);
CREATE INDEX idx_messages_unread ON messages(tenant_id, is_read) WHERE is_read = false;

-- Internal comments (staff-only annotations on messages)
CREATE TABLE IF NOT EXISTS message_annotations (
  annotation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions JSONB, -- array of mentioned team member IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_annotations_message ON message_annotations(message_id);
CREATE INDEX idx_annotations_author ON message_annotations(author_id);

-- Message flags (for coaching notes and alerts)
CREATE TABLE IF NOT EXISTS message_flags (
  flag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
  flagged_by UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  severity VARCHAR(50) NOT NULL, -- info, coach, warning, critical
  reason TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES team_members(member_id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flags_message ON message_flags(message_id);
CREATE INDEX idx_flags_unresolved ON message_flags(tenant_id, is_resolved) WHERE is_resolved = false;

-- Message templates
CREATE TABLE IF NOT EXISTS message_templates (
  template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables JSONB, -- array of variable names like {{client_name}}
  channel_type VARCHAR(50), -- null = all channels
  category VARCHAR(100), -- greeting, checkin, plan_ready, etc.
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_tenant ON message_templates(tenant_id, is_active);

-- Webhook logs for debugging
CREATE TABLE IF NOT EXISTS webhook_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(channel_id) ON DELETE CASCADE,
  webhook_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_created ON webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_channel ON webhook_logs(channel_id, created_at DESC);

-- Add RLS policies
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON channels TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_threads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_annotations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_flags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_templates TO authenticated;
GRANT SELECT, INSERT ON webhook_logs TO authenticated;
