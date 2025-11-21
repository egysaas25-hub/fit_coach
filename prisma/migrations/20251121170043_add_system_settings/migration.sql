/*
  Warnings:

  - Made the column `status` on table `nutrition_plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "nutrition_plans" ALTER COLUMN "status" SET NOT NULL;

-- CreateTable
CREATE TABLE "automation_workflows" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" TEXT NOT NULL,
    "actions" JSONB NOT NULL,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "executions" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_run_at" TIMESTAMPTZ,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "category" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "updated_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_automation_workflows_active" ON "automation_workflows"("tenant_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_automation_workflows_category" ON "automation_workflows"("tenant_id", "category");

-- CreateIndex
CREATE INDEX "idx_system_settings_tenant_category" ON "system_settings"("tenant_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_tenant_id_category_key" ON "system_settings"("tenant_id", "category");

-- AddForeignKey
ALTER TABLE "automation_workflows" ADD CONSTRAINT "automation_workflows_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_workflows" ADD CONSTRAINT "automation_workflows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "team_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
