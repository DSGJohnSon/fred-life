import { ProjectStatus } from "@prisma/client";
import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  description: z.string().max(1024).optional(),
  categories: z.array(z.string()).max(3).optional(),
  status: z.nativeEnum(ProjectStatus),
});

//Schemas pour les catégories de projets
export const createProjectCategorySchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").min(3).max(7).optional(), // Code couleur hexadécimal avec # obligatoire
});
