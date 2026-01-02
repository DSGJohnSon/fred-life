import "server-only";
import { createMiddleware } from "hono/factory";
import { prisma } from "../prisma";

export const workspaceMiddleware = createMiddleware(async (c, next) => {
  const workspaceId = c.req.param("id");

  //Pas de workspace ID fourni :
  if (!workspaceId) {
    console.log("Workspace ID manquant");
    return c.json({ error: "Workspace ID manquant" }, 400);
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  //Pas de workspace trouvé :
  if (!workspace) {
    console.log("Workspace non trouvé");
    return c.json({ error: "Workspace non trouvé" }, 404);
  }

  //Vérifier si l'utilisateur est membre du workspace :
  const user = c.get("user");
  const isMember = workspace.members.some((member) => member.userId === user.id);

  console.log("workspace", workspace);
  console.log("members", workspace.members);
  console.log("isMember", isMember);

  if (!isMember) {
    console.log("Non autorisé, vous n'êtes pas membre de ce workspace");
    return c.json({ error: "Non autorisé, vous n'êtes pas membre de ce workspace" }, 401);
  }

  c.set("workspace", workspace);
  await next();
});

export const workspaceOwnerMiddleware = createMiddleware(async (c, next) => {
  const workspace = c.get("workspace");
  const user = c.get("user");

  if (!workspace) {
    console.log("Workspace non trouvé");
    return c.json({ error: "Workspace non trouvé" }, 404);
  }

  if (workspace.ownerId !== user.id) {
    console.log("Non autorisé, vous n'êtes pas propriétaire de ce workspace");
    return c.json({ error: "Non autorisé, vous n'êtes pas propriétaire de ce workspace" }, 401);
  }

  await next();
});
