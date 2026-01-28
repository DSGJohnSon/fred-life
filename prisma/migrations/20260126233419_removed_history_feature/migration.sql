/*
  Warnings:

  - You are about to drop the `audit_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_userId_fkey";

-- DropForeignKey
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_workspaceId_fkey";

-- DropTable
DROP TABLE "audit_log";

-- DropEnum
DROP TYPE "HistoryAuditAction";

-- DropEnum
DROP TYPE "HistoryEntityType";
