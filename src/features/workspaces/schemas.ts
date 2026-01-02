import z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(100),
});

export const getWorkspaceQuerySchema = z.object({
  includeOwner: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true"),
  includeMembers: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true"),
});
