import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, getWorkspaceQuerySchema } from "../schemas";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/features/history/action";
const app = new Hono()
  //******************** */
  //Créer un workspace
  //******************** */
  .post(
    "/create",
    sessionMiddleware,
    zValidator("json", createWorkspaceSchema),
    async (c) => {
      const { name } = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Utilisateur non trouvé" }, 401);
      }

      const workspace = await prisma.workspace.create({
        data: {
          name,
          ownerId: user.id,
          avatarType: "TEXT",
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });

      createAuditLog({
        userId: user.id,
        action: "CREATE",
        entityType: "Workspace",
        entityId: workspace.id,
        workspaceId: workspace.id,
        changes: { before: {}, after: { name: workspace.name } },
        request: c.req.raw,
      });

      return c.json({ data: workspace });
    }
  )
  //******************** */
  //Récupérer tous les workspaces
  //******************** */
  .get("/", sessionMiddleware, async (c) => {
    const workspaces = await prisma.workspace.findMany();

    return c.json({ data: workspaces });
  })
  .get(
    "/:id",
    sessionMiddleware,
    zValidator("query", getWorkspaceQuerySchema),
    async (c) => {
      const { id } = c.req.param();
      const { includeOwner, includeMembers } = c.req.valid("query");

      // Get optional query parameters for including related data
      const withWorspaceOwnerData = includeOwner || false;
      const withWorkspaceMembersData = includeMembers || false;

      const workspace = await prisma.workspace.findUnique({
        where: {
          id,
        },
        include: {
          owner: withWorspaceOwnerData,
          members: withWorkspaceMembersData
            ? {
                include: {
                  user: true,
                },
              }
            : false,
        },
      });

      return c.json({ data: workspace });
    }
  );
export default app;
