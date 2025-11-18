-- Analytics Dashboard System
-- KPIs, metrics, reports, data aggregation

-- Dashboard KPIs (cached metrics)
CREATE TABLE IF NOT EXISTS dashboard_kpis (
  kpi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  metric_date DATE NOT NULL,
  
  -- Client metrics
  total_clients INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  new_clients_this_month INTEGER DEFAULT 0,
  churned_clients_this_month INTEGER DEFAULT 0,
  
  -- Revenue metrics
  mrr DECIMAL(12, 2) DEFAULT 0, -- Monthly Recurring Revenue
  arr DECIMAL(12, 2) DEFAULT 0, -- Annual Recurring Revenue
  revenue_this_month DECIMAL(12, 2) DEFAULT 0,
  revenue_this_year DECIMAL(12, 2) DEFAULT 0,
  
  -- Retention metrics
  retention_rate_percent DECIMAL(5, 2),
  churn_rate_percent DECIMAL(5, 2),
  
  -- Engagement metrics
  avg_adherence_percent DECIMAL(5, 2),
  avg_check_in_completion_percent DECIMAL(5, 2),
  avg_meal_logging_percent DECIMAL(5, 2),
  
  -- Support metrics
  open_tickets INTEGER DEFAULT 0,
  avg_response_time_minutes DECIMAL(10, 2),
  sla_compliance_percent DECIMAL(5, 2),
  
  -- Content metrics
  total_plans INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  total_foods INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, metric_date)
);

CREATE INDEX idx_kpis_tenant_date ON dashboard_kpis(tenant_id, metric_date DESC);

-- Client analytics
CREATE TABLE IF NOT EXISTS client_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  
  analysis_date DATE NOT NULL,
  
  -- Engagement score (0-100)
  engagement_score DECIMAL(5, 2) DEFAULT 0,
  
  -- Risk score (0-100, higher = more risk)
  churn_risk_score DECIMAL(5, 2) DEFAULT 0,
  risk_level VARCHAR(20), -- low, medium, high, critical
  
  -- Activity metrics
  days_since_last_login INTEGER,
  days_since_last_message INTEGER,
  days_since_last_check_in INTEGER,
  days_since_last_workout INTEGER,
  
  -- Adherence trends
  workout_adherence_7day DECIMAL(5, 2),
  workout_adherence_30day DECIMAL(5, 2),
  nutrition_adherence_7day DECIMAL(5, 2),
  nutrition_adherence_30day DECIMAL(5, 2),
  
  -- Progress metrics
  weight_change_30day DECIMAL(5, 2),
  body_fat_change_30day DECIMAL(4, 2),
  
  -- Satisfaction
  avg_workout_rating DECIMAL(3, 2),
  avg_meal_rating DECIMAL(3, 2),
  
  -- Predictions
  predicted_churn_date DATE,
  predicted_renewal_probability DECIMAL(5, 2),
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, client_id, analysis_date)
);

CREATE INDEX idx_client_analytics_tenant ON client_analytics(tenant_id, analysis_date DESC);
CREATE INDEX idx_client_analytics_risk ON client_analytics(tenant_id, churn_risk_score DESC);
CREATE INDEX idx_client_analytics_engagement ON client_analytics(tenant_id, engagement_score DESC);

-- Revenue analytics
CREATE TABLE IF NOT EXISTS revenue_analytics (
  revenue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, quarterly, yearly
  
  -- Revenue breakdown
  subscription_revenue DECIMAL(12, 2) DEFAULT 0,
  one_time_revenue DECIMAL(12, 2) DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  
  -- Payment gateway breakdown
  stripe_revenue DECIMAL(12, 2) DEFAULT 0,
  paymob_revenue DECIMAL(12, 2) DEFAULT 0,
  paypal_revenue DECIMAL(12, 2) DEFAULT 0,
  other_revenue DECIMAL(12, 2) DEFAULT 0,
  
  -- Metrics
  new_subscriptions INTEGER DEFAULT 0,
  renewed_subscriptions INTEGER DEFAULT 0,
  cancelled_subscriptions INTEGER DEFAULT 0,
  
  -- Growth
  revenue_growth_percent DECIMAL(5, 2),
  subscription_growth_percent DECIMAL(5, 2),
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, period_start, period_end, period_type)
);

CREATE INDEX idx_revenue_tenant_period ON revenue_analytics(tenant_id, period_start DESC);

-- Trainer analytics
CREATE TABLE IF NOT EXISTS trainer_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  
  analysis_date DATE NOT NULL,
  
  -- Client metrics
  total_clients INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  new_clients_this_month INTEGER DEFAULT 0,
  
  -- Performance metrics
  avg_client_adherence DECIMAL(5, 2),
  avg_client_satisfaction DECIMAL(3, 2),
  avg_response_time_minutes DECIMAL(10, 2),
  sla_compliance_percent DECIMAL(5, 2),
  
  -- Activity metrics
  messages_sent INTEGER DEFAULT 0,
  plans_created INTEGER DEFAULT 0,
  check_ins_reviewed INTEGER DEFAULT 0,
  
  -- Results
  clients_achieving_goals INTEGER DEFAULT 0,
  avg_client_weight_change DECIMAL(5, 2),
  avg_client_body_fat_change DECIMAL(4, 2),
  
  -- Ranking
  performance_rank INTEGER,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, member_id, analysis_date)
);

CREATE INDEX idx_trainer_analytics_tenant ON trainer_analytics(tenant_id, analysis_date DESC);
CREATE INDEX idx_trainer_analytics_rank ON trainer_analytics(tenant_id, performance_rank);

-- System health metrics
CREATE TABLE IF NOT EXISTS system_health_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  metric_timestamp TIMESTAMPTZ NOT NULL,
  
  -- API performance
  api_avg_response_time_ms DECIMAL(10, 2),
  api_p95_response_time_ms DECIMAL(10, 2),
  api_error_rate_percent DECIMAL(5, 2),
  api_requests_per_minute INTEGER,
  
  -- Database performance
  db_avg_query_time_ms DECIMAL(10, 2),
  db_slow_queries INTEGER,
  db_connections_active INTEGER,
  
  -- WhatsApp delivery
  whatsapp_messages_sent INTEGER DEFAULT 0,
  whatsapp_delivery_success_rate DECIMAL(5, 2),
  whatsapp_avg_delivery_time_seconds DECIMAL(10, 2),
  
  -- AI usage
  ai_generations_today INTEGER DEFAULT 0,
  ai_tokens_used_today INTEGER DEFAULT 0,
  ai_cost_today_usd DECIMAL(10, 4),
  
  -- Storage
  storage_used_gb DECIMAL(10, 2),
  storage_limit_gb DECIMAL(10, 2),
  
  -- Queue status
  queue_pending_jobs INTEGER DEFAULT 0,
  queue_failed_jobs INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_system_health_timestamp ON system_health_metrics(metric_timestamp DESC);
CREATE INDEX idx_system_health_tenant ON system_health_metrics(tenant_id, metric_timestamp DESC);

-- Social media analytics (Instagram, Facebook, TikTok)
CREATE TABLE IF NOT EXISTS social_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  platform VARCHAR(50) NOT NULL, -- instagram, facebook, tiktok, youtube
  metric_date DATE NOT NULL,
  
  -- Follower metrics
  followers_count INTEGER DEFAULT 0,
  followers_growth INTEGER DEFAULT 0,
  
  -- Engagement metrics
  posts_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  
  -- Reach metrics
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  
  -- Conversion metrics
  profile_visits INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, platform, metric_date)
);

CREATE INDEX idx_social_analytics_tenant ON social_analytics(tenant_id, metric_date DESC);
CREATE INDEX idx_social_analytics_platform ON social_analytics(platform, metric_date DESC);

-- Landing page analytics
CREATE TABLE IF NOT EXISTS landing_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  page_url VARCHAR(500) NOT NULL,
  metric_date DATE NOT NULL,
  
  -- Traffic metrics
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2),
  avg_time_on_page_seconds INTEGER,
  
  -- Conversion metrics
  form_submissions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2),
  leads_generated INTEGER DEFAULT 0,
  
  -- Traffic sources
  organic_traffic INTEGER DEFAULT 0,
  paid_traffic INTEGER DEFAULT 0,
  social_traffic INTEGER DEFAULT 0,
  direct_traffic INTEGER DEFAULT 0,
  referral_traffic INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, page_url, metric_date)
);

CREATE INDEX idx_landing_analytics_tenant ON landing_analytics(tenant_id, metric_date DESC);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  
  report_name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL, -- dashboard_kpis, client_analytics, revenue, trainer_performance
  
  -- Schedule
  frequency VARCHAR(20) NOT NULL, -- daily, weekly, monthly
  day_of_week INTEGER, -- 0-6 for weekly
  day_of_month INTEGER, -- 1-31 for monthly
  time_of_day TIME,
  
  -- Recipients
  recipients JSONB NOT NULL, -- [{email, name}, ...]
  
  -- Format
  format VARCHAR(20) DEFAULT 'pdf', -- pdf, excel, csv
  
  -- Filters
  filters JSONB,
  
  is_active BOOLEAN DEFAULT true,
  
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES team_members(member_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scheduled_reports_tenant ON scheduled_reports(tenant_id, is_active);
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at) WHERE is_active = true;

-- Add RLS policies
ALTER TABLE dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON dashboard_kpis TO authenticated;
GRANT SELECT ON client_analytics TO authenticated;
GRANT SELECT ON revenue_analytics TO authenticated;
GRANT SELECT ON trainer_analytics TO authenticated;
GRANT SELECT ON system_health_metrics TO authenticated;
GRANT SELECT ON social_analytics TO authenticated;
GRANT SELECT ON landing_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON scheduled_reports TO authenticated;

-- Comments
COMMENT ON TABLE dashboard_kpis IS 'Cached dashboard KPIs for quick loading';
COMMENT ON TABLE client_analytics IS 'Client engagement and churn risk analysis';
COMMENT ON TABLE revenue_analytics IS 'Revenue breakdown and growth metrics';
COMMENT ON TABLE trainer_analytics IS 'Trainer performance and client results';
COMMENT ON TABLE system_health_metrics IS 'System performance and health monitoring';
COMMENT ON TABLE social_analytics IS 'Social media performance tracking';
COMMENT ON TABLE landing_analytics IS 'Landing page conversion tracking';
COMMENT ON TABLE scheduled_reports IS 'Automated report generation and delivery';
