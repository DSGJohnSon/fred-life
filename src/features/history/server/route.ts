import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";
import { getUserHistoryQuerySchema, getWorkspaceHistoryQuerySchema } from "../schemas";
import { workspaceMiddleware, workspaceOwnerMiddleware } from "@/lib/middlewares/workspace-middleware";
import z from "zod";
const app = new Hono()
  //******************** */
  //Récupérer l'historique d'un user
  //******************** */
  .get(
    "/user",
    sessionMiddleware,
    zValidator("query", getUserHistoryQuerySchema),
    async (c) => {
      const user = c.get("user");
      const {
        page,
        limit,
        entityType,
        action,
        workspaceId,
        startDate,
        endDate,
      } = c.req.valid("query");

      if (!user) {
        return c.json({ error: "Utilisateur non trouvé" }, 401);
      }

      const logs = await prisma.historyAuditLog.findMany({
        where: {
          userId: user.id,
          ...(entityType && { entityType }),
          ...(action && { action }),
          ...(workspaceId && { workspaceId }),
          ...(startDate &&
            endDate && {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }),
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          workspace: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await prisma.historyAuditLog.count({
        where: { userId: user.id },
      });

      return c.json({ data: logs, total });
    }
  )
  .get(
    "/workspace/:id",
    zValidator("param", z.object({ id: z.string() })),
    sessionMiddleware,
    workspaceMiddleware,
    workspaceOwnerMiddleware,
    zValidator("query", getWorkspaceHistoryQuerySchema),
    async (c) => {
        const workspaceId = c.req.valid("param").id;
        const { entityType, action, startDate, endDate, page, limit, userId } = c.req.valid("query");

        const logs = await prisma.historyAuditLog.findMany({
            where: {
                workspaceId,
                ...(entityType && { entityType }),
                ...(action && { action }),
                ...(userId && { userId }),
                ...(startDate &&
                    endDate && {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    }),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, image: true },
                },
                workspace: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await prisma.historyAuditLog.count({
            where: { workspaceId },
        });

        return c.json({ data: logs, total });
    }
  );
export default app;
