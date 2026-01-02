"use server";

import { client } from "@/lib/rpc";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "../auth/constants";

export const getWorkspaceById = async (
  workspaceId: string,
  options?: {
    includeOwner?: boolean;
    includeMembers?: boolean;
  }
) => {
  const session = (await cookies()).get(AUTH_COOKIE);

  if (!session) return null;

  try {
    const response = await client.api.workspaces[":id"].$get(
      {
        param: {
          id: workspaceId,
        },
        query: {
          includeOwner: options?.includeOwner ? "true" : "false",
          includeMembers: options?.includeMembers ? "true" : "false",
        },
      },
      {
        headers: {
          Cookie: `${AUTH_COOKIE}=${session.value}`,
        },
      }
    );

    const workspace = response.json();

    if (!workspace) {
      return null;
    }

    return workspace;
  } catch (error) {
    return null;
  }
};
