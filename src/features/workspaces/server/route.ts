import { sessionMiddleware } from "@/lib/middlewares/session-middleware";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceNameSchema } from "../schemas";
import { prisma } from "@/lib/prisma";
import { workspaceOwnerMiddleware } from "@/lib/middlewares/workspace-middleware";
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
        },
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
  });
export default app;
