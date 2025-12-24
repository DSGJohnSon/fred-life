import z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().min(3).max(100),
})

export const updateWorkspaceNameSchema = z.object({
    name: z.string().min(3).max(100),
})