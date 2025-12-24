-- AlterEnum
ALTER TYPE "WorkspaceAvatarType" ADD VALUE 'IMAGE';

-- AlterTable
ALTER TABLE "workspace" ADD COLUMN     "avatarWithText" BOOLEAN DEFAULT true;
