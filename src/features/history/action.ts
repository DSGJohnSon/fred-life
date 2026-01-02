import { HistoryAuditAction, HistoryEntityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getClientInfo } from "./utils";
import { createAuditLogSchema } from "./schemas";

export async function createAuditLog(data: {
  userId: string;
  action: HistoryAuditAction;
  entityType: HistoryEntityType;
  entityId?: string;
  workspaceId?: string;
  changes?: any;
  request?: Request; // Pour extraire IP et User Agent
}): Promise<void> {
  try {
    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    if (data.request) {
      const info = getClientInfo(data.request);
      ipAddress = info.ipAddress;
      userAgent = info.userAgent;
    }

    // Préparer les données pour la validation - Utilisation explicite de null pour éviter les P2003
    const logData = {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId ?? null,
      workspaceId: data.workspaceId ?? null,
      changes: data.changes ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    };

    // Valider les données
    const validatedData = createAuditLogSchema.parse(logData);

    // Créer l'entrée dans la base
    await prisma.historyAuditLog.create({
      data: {
        userId: validatedData.userId,
        action: validatedData.action,
        entityType: validatedData.entityType,
        entityId: validatedData.entityId,
        workspaceId: validatedData.workspaceId,
        changes: validatedData.changes,
        ipAddress: validatedData.ipAddress,
        userAgent: validatedData.userAgent,
      },
    });
  } catch (error) {
    // Logger l'erreur mais ne pas bloquer l'action principale (fail silently)
    console.error("[CREATE_AUDIT_LOG_ERROR]", error);
  }
}
