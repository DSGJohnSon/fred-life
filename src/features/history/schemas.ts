import { z } from "zod";
import { HistoryAuditAction, HistoryEntityType } from "@prisma/client";
// Schéma pour créer une entrée d'historique
export const createAuditLogSchema = z.object({
  userId: z.string(),
  action: z.nativeEnum(HistoryAuditAction),
  entityType: z.nativeEnum(HistoryEntityType),
  entityId: z.string().nullable().optional(),
  workspaceId: z.string().nullable().optional(),
  changes: z.any().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});
// Schéma pour récupérer l'historique utilisateur
export const getUserHistoryQuerySchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  entityType: z.nativeEnum(HistoryEntityType).optional(),
  action: z.nativeEnum(HistoryAuditAction).optional(),
  workspaceId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
});
// Schéma pour récupérer l'historique workspace
export const getWorkspaceHistoryQuerySchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  entityType: z.nativeEnum(HistoryEntityType).optional(),
  action: z.nativeEnum(HistoryAuditAction).optional(),
  userId: z.string().optional(), // Filtrer par utilisateur
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
