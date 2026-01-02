/*
  Warnings:

  - Changed the type of `entityType` on the `audit_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HistoryEntityType" AS ENUM ('Auth', 'Workspace');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HistoryAuditAction" ADD VALUE 'REGISTER';
ALTER TYPE "HistoryAuditAction" ADD VALUE 'LOGIN';
ALTER TYPE "HistoryAuditAction" ADD VALUE 'LOGIN_OAUTH';

-- AlterTable
ALTER TABLE "audit_log" ADD COLUMN     "workspaceId" TEXT DEFAULT 'null',
DROP COLUMN "entityType",
ADD COLUMN     "entityType" "HistoryEntityType" NOT NULL,
ALTER COLUMN "entityId" DROP NOT NULL,
ALTER COLUMN "entityId" SET DEFAULT 'null';

-- CreateIndex
CREATE INDEX "audit_log_entityType_entityId_idx" ON "audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_log_workspaceId_createdAt_idx" ON "audit_log"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
