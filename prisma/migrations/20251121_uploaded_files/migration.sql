-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "blob_url" TEXT NOT NULL,
    "blob_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" BIGINT,
    "customer_id" BIGINT,
    "uploaded_by" BIGINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_files_blob_id_key" ON "uploaded_files"("blob_id");

-- CreateIndex
CREATE INDEX "idx_uploaded_files_tenant_customer" ON "uploaded_files"("tenant_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_uploaded_files_entity" ON "uploaded_files"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_uploaded_files_category" ON "uploaded_files"("tenant_id", "category");

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
