import "server-only";
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { ACTIVE_WORKSPACE_COOKIE } from "@/features/workspaces/constants";
import { prisma } from "../prisma";

type AdditionalContext = {
  Variables: {
    workspace: {
      id: string;
      name: string;
      ownerId: string;
      members: {
        id: string;
        userId: string;
        role: string;
      }[];
    };
  };
};

export const workspaceMiddleware = createMiddleware(async (c, next) => {
  const workspaceId = getCookie(c, ACTIVE_WORKSPACE_COOKIE);
  console.log("workspaceId", workspaceId);

  //Pas de workspace ID fourni :
  if (!workspaceId) {
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
    return c.json({ error: "Workspace non trouvé" }, 404);
  }

  //Vérifier si l'utilisateur est membre du workspace :
  const user = c.get("user");
  const isMember = workspace.members.some((member) => member.userId === user.id);

  if (!isMember) {
    return c.json({ error: "Non autorisé, vous n'êtes pas membre de ce workspace" }, 401);
  }

  c.set("workspace", workspace);
  await next();
});

export const workspaceOwnerMiddleware = createMiddleware(async (c, next) => {
  const workspace = c.get("workspace");
  const user = c.get("user");

  if (!workspace) {
    return c.json({ error: "Workspace non trouvé" }, 404);
  }

  if (workspace.ownerId !== user.id) {
    return c.json({ error: "Non autorisé, vous n'êtes pas propriétaire de ce workspace" }, 401);
  }

  await next();
});
