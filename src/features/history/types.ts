import {
  HistoryAuditAction,
  HistoryAuditLog,
  HistoryEntityType,
  User,
  Workspace,
} from "@prisma/client";
export type HistoryChanges = {
  provider?: "github" | "google";
  before?: {
    name?: string;
  };
  after?: {
    name?: string;
  };
  [key: string]: any;
};

export type AuditLogWithRelations = Omit<HistoryAuditLog, "changes"> & {
  changes: HistoryChanges | null;
  user: Pick<User, "id" | "name" | "email" | "image">;
  workspace?: Pick<Workspace, "id" | "name"> | null;
};
export type HistoryFilters = {
  page?: number;
  limit?: number;
  entityType?: HistoryEntityType;
  action?: HistoryAuditAction;
  workspaceId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
};
