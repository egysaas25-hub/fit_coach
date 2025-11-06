-- CreateEnum
CREATE TYPE "customer_status" AS ENUM ('lead', 'active', 'paused', 'expired', 'churned', 'paid_pending_kyc', 'lead_incomplete');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('trial', 'active', 'past_due', 'paused', 'cancelled', 'expired', 'paid_pending_kyc');

-- CreateEnum
CREATE TYPE "interaction_channel" AS ENUM ('wa', 'email', 'web');

-- CreateEnum
CREATE TYPE "interaction_direction" AS ENUM ('in', 'out');

-- CreateEnum
CREATE TYPE "ticket_category" AS ENUM ('support', 'nutrition', 'workout', 'billing', 'health');

-- CreateEnum
CREATE TYPE "ticket_priority" AS ENUM ('P1', 'P2', 'P3');

-- CreateEnum
CREATE TYPE "ticket_status" AS ENUM ('open', 'pending', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('image', 'video', 'document');

-- CreateEnum
CREATE TYPE "checkin_period" AS ENUM ('biweekly', 'monthly', 'custom');

-- CreateEnum
CREATE TYPE "checkin_action" AS ENUM ('no_change', 'adjust_nutrition', 'adjust_training', 'followup_needed');

-- CreateEnum
CREATE TYPE "payment_gateway" AS ENUM ('stripe', 'paymob', 'paypal', 'valu', 'sympl', 'halan');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "region" AS ENUM ('MENA', 'NA', 'Other');

-- CreateEnum
CREATE TYPE "language" AS ENUM ('en', 'ar');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'sales', 'coach', 'support', 'finance');

-- CreateEnum
CREATE TYPE "source" AS ENUM ('landing', 'social', 'sales', 'referral', 'campaign', 'post_payment');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "integration_type" AS ENUM ('messaging', 'payments', 'storage', 'analytics', 'auth', 'other');

-- CreateEnum
CREATE TYPE "auth_type" AS ENUM ('api_key', 'oauth2', 'jwt', 'basic', 'none');

-- CreateEnum
CREATE TYPE "webhook_status" AS ENUM ('received', 'processed', 'failed', 'ignored');

-- CreateEnum
CREATE TYPE "outbound_message_status" AS ENUM ('queued', 'sending', 'sent', 'failed', 'canceled', 'throttled', 'deferred');

-- CreateEnum
CREATE TYPE "dispatch_batch_status" AS ENUM ('created', 'running', 'finished', 'failed', 'canceled');

-- CreateEnum
CREATE TYPE "rate_limit_scope" AS ENUM ('global', 'integration', 'customer');

-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('success', 'failed', 'partial', 'canceled', 'queued');

-- CreateEnum
CREATE TYPE "log_level" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "error_severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "resolution_action" AS ENUM ('retry', 'ignore', 'manual');

-- CreateEnum
CREATE TYPE "alert_channel" AS ENUM ('email', 'slack', 'wa', 'sms');

-- CreateEnum
CREATE TYPE "service_status_type" AS ENUM ('up', 'degraded', 'down');

-- CreateEnum
CREATE TYPE "task_type" AS ENUM ('anonymize', 'delete');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('scheduled', 'running', 'done', 'failed');

-- CreateEnum
CREATE TYPE "queue_status" AS ENUM ('parked', 'reprocessed', 'discarded');

-- CreateTable
CREATE TABLE "currencies" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fx_rate_to_usd" DECIMAL(10,4) NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Cairo',
    "currency_id" BIGINT,
    "default_language" "language" NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_branding" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "logo_url" TEXT,
    "primary_color" TEXT,
    "whatsapp_number" TEXT,
    "template_config" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "phone_e164" TEXT NOT NULL,
    "phone_e164_encrypted" BYTEA,
    "wa_contact_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" "gender",
    "age" SMALLINT,
    "height_cm" SMALLINT,
    "start_weight_kg" DECIMAL(6,2),
    "country" TEXT,
    "city" TEXT,
    "region" "region" NOT NULL DEFAULT 'MENA',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Cairo',
    "source" "source" NOT NULL,
    "status" "customer_status" NOT NULL,
    "goal" TEXT,
    "language" "language" NOT NULL DEFAULT 'en',
    "preferred_currency_id" BIGINT,
    "consent_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_health_conditions" (
    "id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "condition_text" TEXT NOT NULL,
    "severity" "severity",
    "diagnosed_at" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_health_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "notes" TEXT,
    "lifestyle" JSONB,
    "medical_json" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "wa_user_id" TEXT,
    "max_caseload" SMALLINT NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "plan_code" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "currency_id" BIGINT NOT NULL,
    "amount_usd" DECIMAL(10,2),
    "fx_rate" DECIMAL(10,4),
    "status" "subscription_status" NOT NULL,
    "start_at" TIMESTAMPTZ NOT NULL,
    "renew_at" TIMESTAMPTZ,
    "cancel_at" TIMESTAMPTZ,
    "sales_owner_id" BIGINT,
    "coach_owner_id" BIGINT,
    "rotation_priority" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "subscription_id" BIGINT,
    "gateway" "payment_gateway" NOT NULL,
    "provider_region" "region" NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency_id" BIGINT NOT NULL,
    "amount_usd" DECIMAL(10,2),
    "fx_rate" DECIMAL(10,4),
    "status" "payment_status" NOT NULL,
    "paid_at" TIMESTAMPTZ,
    "receipt_url" TEXT,
    "installment_plan" JSONB,
    "meta" JSONB,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_pricing" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "plan_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency_id" BIGINT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "referrer_customer_id" BIGINT NOT NULL,
    "invite_code" TEXT NOT NULL,
    "referred_phone" TEXT NOT NULL,
    "converted_subscription_id" BIGINT,
    "reward_cents" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "channel" "interaction_channel" NOT NULL,
    "direction" "interaction_direction" NOT NULL,
    "intent_code" TEXT,
    "message_text" TEXT,
    "by_team_member_id" BIGINT,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "channel" "interaction_channel" NOT NULL DEFAULT 'wa',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "language" NOT NULL,
    "approved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbound_messages" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "conversation_id" BIGINT,
    "customer_id" BIGINT NOT NULL,
    "integration_account_id" BIGINT,
    "wa_message_id" TEXT,
    "text" TEXT,
    "received_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "inbound_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbound_messages" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "conversation_id" BIGINT,
    "customer_id" BIGINT NOT NULL,
    "integration_account_id" BIGINT,
    "template_id" BIGINT,
    "text" TEXT,
    "send_after" TIMESTAMPTZ,
    "status" "outbound_message_status" NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "attempts" SMALLINT NOT NULL DEFAULT 0,
    "priority" SMALLINT NOT NULL DEFAULT 5,
    "dedupe_key" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ,

    CONSTRAINT "outbound_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_types" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "media_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" JSONB NOT NULL,
    "training_type_id" BIGINT,
    "muscle_group_id" BIGINT,
    "description" JSONB,
    "equipment_needed" TEXT,
    "calories_burned_per_min" DECIMAL(6,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plans" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "version" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "split" TEXT,
    "notes" TEXT,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plan_exercises" (
    "id" BIGSERIAL NOT NULL,
    "plan_id" BIGINT NOT NULL,
    "exercise_id" BIGINT NOT NULL,
    "sets" SMALLINT NOT NULL,
    "reps" SMALLINT NOT NULL,
    "order_index" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plan_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_facts" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "food_name" JSONB NOT NULL,
    "portion_size" TEXT NOT NULL,
    "calories" DECIMAL(6,2),
    "protein_g" DECIMAL(6,2),
    "carbs_g" DECIMAL(6,2),
    "fat_g" DECIMAL(6,2),
    "fiber_g" DECIMAL(6,2),
    "category" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plans" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "version" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "calories_target" SMALLINT,
    "notes" TEXT,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plan_macros" (
    "id" BIGSERIAL NOT NULL,
    "plan_id" BIGINT NOT NULL,
    "calories" DECIMAL(6,2),
    "protein_g" DECIMAL(6,2),
    "carbs_g" DECIMAL(6,2),
    "fat_g" DECIMAL(6,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_plan_macros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_meals" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "plan_id" BIGINT NOT NULL,
    "meal_name" TEXT NOT NULL,
    "order_index" SMALLINT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "nutrition_meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_meal_items" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "meal_id" BIGINT NOT NULL,
    "food_name" TEXT NOT NULL,
    "food_id" BIGINT,
    "portion_size" TEXT,
    "calories" DECIMAL(6,2),
    "protein_g" DECIMAL(6,2),
    "carbs_g" DECIMAL(6,2),
    "fat_g" DECIMAL(6,2),
    "fiber_g" DECIMAL(6,2),
    "alternatives" JSONB,
    "order_index" SMALLINT NOT NULL,

    CONSTRAINT "nutrition_meal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkins" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "period" "checkin_period" NOT NULL,
    "inbody_json" JSONB,
    "checkin_date" DATE NOT NULL,
    "reviewed_by" BIGINT,
    "reviewed_at" TIMESTAMPTZ,
    "action_taken" "checkin_action",

    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_tracking" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight_kg" DECIMAL(6,2),
    "workout_done" BOOLEAN,
    "sleep_hours" DECIMAL(3,1),
    "pain_score" SMALLINT,
    "notes" TEXT,

    CONSTRAINT "progress_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbody_metrics" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height_cm" DECIMAL(6,2),
    "weight_kg" DECIMAL(6,2),
    "bmi" DECIMAL(6,2),
    "body_fat_percent" DECIMAL(6,2),
    "muscle_mass_kg" DECIMAL(6,2),
    "water_percent" DECIMAL(6,2),
    "visceral_fat_level" DECIMAL(6,2),
    "bmr_kcal" INTEGER,
    "tdee_kcal" INTEGER,
    "systolic_bp" INTEGER,
    "diastolic_bp" INTEGER,
    "heart_rate_bpm" INTEGER,
    "spo2_percent" DECIMAL(6,2),
    "body_temp_c" DECIMAL(4,1),
    "notes" TEXT,

    CONSTRAINT "inbody_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_definitions" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_metrics" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "metric_definition_id" BIGINT NOT NULL,
    "metric_value" DECIMAL(12,4) NOT NULL,
    "category" TEXT NOT NULL,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" BIGINT NOT NULL,

    CONSTRAINT "customer_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "category" "ticket_category" NOT NULL,
    "priority" "ticket_priority" NOT NULL DEFAULT 'P2',
    "status" "ticket_status" NOT NULL DEFAULT 'open',
    "subject" TEXT NOT NULL,
    "notes" TEXT,
    "assigned_to" BIGINT,
    "opened_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_events" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "funnel_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "churn_feedback" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "customer_id" BIGINT,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "churn_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" "integration_type" NOT NULL,
    "base_url" TEXT,
    "docs_url" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_accounts" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "integration_id" BIGINT NOT NULL,
    "account_name" TEXT NOT NULL,
    "auth_type" "auth_type" NOT NULL,
    "secret_ref" TEXT,
    "metadata" JSONB,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_subscriptions" (
    "id" BIGSERIAL NOT NULL,
    "integration_account_id" BIGINT NOT NULL,
    "topic" TEXT NOT NULL,
    "callback_url" TEXT NOT NULL,
    "secret_ref" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" BIGSERIAL NOT NULL,
    "subscription_id" BIGINT,
    "external_event_id" TEXT,
    "topic" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "received_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ,
    "status" "webhook_status" NOT NULL DEFAULT 'received',
    "error" TEXT,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_references" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "media_type" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_library" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "title" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "description" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduler_jobs" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "cron_expr" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduler_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_runs" (
    "id" BIGSERIAL NOT NULL,
    "job_id" BIGINT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ,
    "status" "job_status" NOT NULL,
    "items_processed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "meta" JSONB,

    CONSTRAINT "job_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_jobs" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "args" JSONB,
    "status" "job_status" NOT NULL DEFAULT 'queued',
    "attempts" SMALLINT NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "background_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "actor_team_member_id" BIGINT,
    "entity" TEXT NOT NULL,
    "entity_id" BIGINT,
    "action" TEXT NOT NULL,
    "diff" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_access_log" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "team_member_id" BIGINT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" BIGINT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_access_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "idx_customers_phone" ON "customers"("tenant_id", "phone_e164");

-- CreateIndex
CREATE INDEX "idx_customers_active" ON "customers"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_tenant_id_phone_e164_key" ON "customers"("tenant_id", "phone_e164");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_customer_id_key" ON "customer_profiles"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_tenant_id_email_key" ON "team_members"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "idx_subscriptions_renew" ON "subscriptions"("tenant_id", "renew_at");

-- CreateIndex
CREATE INDEX "idx_subscriptions_active" ON "subscriptions"("tenant_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_interactions_customer" ON "interactions"("tenant_id", "customer_id", "sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "message_templates_tenant_id_name_language_key" ON "message_templates"("tenant_id", "name", "language");

-- CreateIndex
CREATE INDEX "idx_inbound_customer_time" ON "inbound_messages"("tenant_id", "customer_id", "received_at");

-- CreateIndex
CREATE INDEX "idx_inbound_tenant_conversation" ON "inbound_messages"("tenant_id", "conversation_id", "received_at");

-- CreateIndex
CREATE INDEX "idx_outbound_customer_status" ON "outbound_messages"("tenant_id", "customer_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "idx_outbound_send_after" ON "outbound_messages"("tenant_id", "send_after");

-- CreateIndex
CREATE UNIQUE INDEX "training_types_tenant_id_name_key" ON "training_types"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_groups_tenant_id_name_key" ON "muscle_groups"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_tenant_id_name_key" ON "exercises"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "idx_training_customer" ON "training_plans"("tenant_id", "customer_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_facts_tenant_id_food_name_key" ON "nutrition_facts"("tenant_id", "food_name");

-- CreateIndex
CREATE INDEX "idx_nutrition_customer" ON "nutrition_plans"("tenant_id", "customer_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_checkins_customer" ON "checkins"("tenant_id", "customer_id", "checkin_date");

-- CreateIndex
CREATE INDEX "idx_progress_customer" ON "progress_tracking"("tenant_id", "customer_id", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_inbody_customer" ON "inbody_metrics"("tenant_id", "customer_id", "recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "metric_definitions_tenant_id_name_key" ON "metric_definitions"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "idx_metrics_customer" ON "customer_metrics"("tenant_id", "customer_id", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_tickets_open" ON "tickets"("tenant_id", "priority");

-- CreateIndex
CREATE INDEX "idx_funnel_tenant_event" ON "funnel_events"("tenant_id", "event_name", "event_at");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_tenant_id_name_key" ON "integrations"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_external_event_id_key" ON "webhook_events"("external_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "scheduler_jobs_tenant_id_name_key" ON "scheduler_jobs"("tenant_id", "name");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_branding" ADD CONSTRAINT "tenant_branding_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_preferred_currency_id_fkey" FOREIGN KEY ("preferred_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_health_conditions" ADD CONSTRAINT "customer_health_conditions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_sales_owner_id_fkey" FOREIGN KEY ("sales_owner_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_coach_owner_id_fkey" FOREIGN KEY ("coach_owner_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_pricing" ADD CONSTRAINT "plan_pricing_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_pricing" ADD CONSTRAINT "plan_pricing_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_customer_id_fkey" FOREIGN KEY ("referrer_customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_converted_subscription_id_fkey" FOREIGN KEY ("converted_subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_by_team_member_id_fkey" FOREIGN KEY ("by_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_integration_account_id_fkey" FOREIGN KEY ("integration_account_id") REFERENCES "integration_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "message_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_integration_account_id_fkey" FOREIGN KEY ("integration_account_id") REFERENCES "integration_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_types" ADD CONSTRAINT "training_types_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muscle_groups" ADD CONSTRAINT "muscle_groups_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_training_type_id_fkey" FOREIGN KEY ("training_type_id") REFERENCES "training_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plan_exercises" ADD CONSTRAINT "training_plan_exercises_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plan_exercises" ADD CONSTRAINT "training_plan_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_facts" ADD CONSTRAINT "nutrition_facts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plan_macros" ADD CONSTRAINT "nutrition_plan_macros_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "nutrition_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_meals" ADD CONSTRAINT "nutrition_meals_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_meals" ADD CONSTRAINT "nutrition_meals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "nutrition_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_meal_items" ADD CONSTRAINT "nutrition_meal_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_meal_items" ADD CONSTRAINT "nutrition_meal_items_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "nutrition_meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_meal_items" ADD CONSTRAINT "nutrition_meal_items_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "nutrition_facts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_tracking" ADD CONSTRAINT "progress_tracking_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_tracking" ADD CONSTRAINT "progress_tracking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbody_metrics" ADD CONSTRAINT "inbody_metrics_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbody_metrics" ADD CONSTRAINT "inbody_metrics_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_definitions" ADD CONSTRAINT "metric_definitions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_metrics" ADD CONSTRAINT "customer_metrics_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_metrics" ADD CONSTRAINT "customer_metrics_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_metrics" ADD CONSTRAINT "customer_metrics_metric_definition_id_fkey" FOREIGN KEY ("metric_definition_id") REFERENCES "metric_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_metrics" ADD CONSTRAINT "customer_metrics_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_events" ADD CONSTRAINT "funnel_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_events" ADD CONSTRAINT "funnel_events_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "churn_feedback" ADD CONSTRAINT "churn_feedback_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "churn_feedback" ADD CONSTRAINT "churn_feedback_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_accounts" ADD CONSTRAINT "integration_accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_accounts" ADD CONSTRAINT "integration_accounts_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_subscriptions" ADD CONSTRAINT "webhook_subscriptions_integration_account_id_fkey" FOREIGN KEY ("integration_account_id") REFERENCES "integration_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "webhook_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_references" ADD CONSTRAINT "media_references_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduler_jobs" ADD CONSTRAINT "scheduler_jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_runs" ADD CONSTRAINT "job_runs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "scheduler_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_jobs" ADD CONSTRAINT "background_jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_team_member_id_fkey" FOREIGN KEY ("actor_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_access_log" ADD CONSTRAINT "data_access_log_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_access_log" ADD CONSTRAINT "data_access_log_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
