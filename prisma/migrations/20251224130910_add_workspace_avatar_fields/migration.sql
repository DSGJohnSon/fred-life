-- CreateEnum
CREATE TYPE "WorkspaceAvatarType" AS ENUM ('TEXT', 'COLOR', 'GRADIENT');

-- AlterTable
ALTER TABLE "workspace" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "avatarColor1" TEXT,
ADD COLUMN     "avatarColor2" TEXT,
ADD COLUMN     "avatarType" "WorkspaceAvatarType" NOT NULL DEFAULT 'TEXT';
