-- CreateTable
CREATE TABLE "otp_codes" (
    "id" BIGSERIAL NOT NULL,
    "phone_e164" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "attempts" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_workflows" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submitted_by" BIGINT NOT NULL,
    "reviewed_by" BIGINT,
    "reviewed_at" TIMESTAMPTZ,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_otp_phone_expires" ON "otp_codes"("phone_e164", "expires_at");

-- CreateIndex
CREATE INDEX "idx_approval_workflows_status" ON "approval_workflows"("tenant_id", "status", "entity_type");

-- CreateIndex
CREATE INDEX "idx_approval_workflows_submitter" ON "approval_workflows"("tenant_id", "submitted_by");

-- AddForeignKey
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_workflows" ADD CONSTRAINT "approval_workflows_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
