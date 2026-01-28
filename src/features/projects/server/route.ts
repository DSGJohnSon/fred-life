import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import {
  workspaceMiddleware,
  workspaceOwnerMiddleware,
} from "@/lib/middlewares/workspace-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createProjectCategorySchema, createProjectSchema } from "../schemas";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { randomColor } from "@/lib/utils";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    workspaceMiddleware,
    workspaceOwnerMiddleware,
    zValidator("json", createProjectSchema),
    async (c) => {
      const workspaceId = c.get("workspace").id;
      const { name, description, categories, status } = c.req.valid("json");

      try {
        const project = await prisma.project.create({
          data: {
            workspace: {
              connect: { id: workspaceId },
            },
            name,
            description,
            categories: {
              create:
                categories?.map((categoryName: string) => ({
                  category: {
                    connect: {
                      workspaceId_name: {
                        workspaceId,
                        name: categoryName.trim().toLowerCase(),
                      },
                    },
                  },
                })) || [],
            },
            status,
          },
        });

        return c.json({ data: project });
      } catch (error) {
        console.error("Error creating project:", error);
        return c.json({ error: "Failed to create project" }, 500);
      }
    },
  )
  .post(
    "/categories",
    sessionMiddleware,
    workspaceMiddleware,
    workspaceOwnerMiddleware,
    zValidator("json", createProjectCategorySchema),
    async (c) => {
      const workspaceId = c.get("workspace").id;
      const { name, color } = c.req.valid("json");

      //Si pas de couleur fournie, on en génère une aléatoire
      const finalColor = color?.trim() || randomColor();

      //On nettoie les données :
      const normalizedName = name.trim().toLowerCase();
      const normalizedColor = finalColor;

      try {
        const projectCategory = await prisma.projectCategory.create({
          data: { workspaceId, name: normalizedName, color: normalizedColor },
        });

        return c.json(
          {
            data: projectCategory,
            created: true,
          },
          201,
        );
      } catch (e) {
        // Gestion des erreurs de contrainte d'unicité
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          const projectCategory = await prisma.projectCategory.findUnique({
            where: { workspaceId_name: { workspaceId, name: normalizedName } },
          });
          if (projectCategory) {
            return c.json(
              {
                data: projectCategory,
                created: false,
              },
              200,
            );
          }
        } else {
          console.error("Erreur lors de la création de la catégorie :", e);
        }
      }

      return c.json(
        { error: "Erreur lors de la création de la catégorie" },
        500,
      );
    },
  )
  .get("/", sessionMiddleware, workspaceMiddleware, async (c) => {
    const workspaceId = c.get("workspace").id;

    try {
      const projects = await prisma.project.findMany({
        where: { workspaceId },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });

      return c.json({ data: projects });
    } catch (error) {
      console.error("Error fetching projects :", error);

      return c.json({ error: "Failed to fetch projects" }, 500);
    }
  })
  .get("/categories", sessionMiddleware, workspaceMiddleware, async (c) => {
    const workspaceId = c.get("workspace").id;

    try {
      const categories = await prisma.projectCategory.findMany({
        where: { workspaceId },
        select: { id: true, name: true, color: true },
        orderBy: { name: "asc" },
      });

      return c.json({ data: categories });
    } catch (error) {
      console.error("Error fetching project categories:", error);

      return c.json({ error: "Failed to fetch project categories" }, 500);
    }
  });

export default app;
