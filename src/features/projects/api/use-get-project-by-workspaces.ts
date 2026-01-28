import { client } from "@/lib/rpc";
import { ProjectStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  categories: {
    category: {
      id: string;
      name: string;
      color: string | null;
    };
  }[] | null;
};
type ApiSuccess = {
  data: Project[];
};
type ApiError = {
  error: string;
};
type ApiResponse = ApiSuccess | ApiError;

export const useGetProjectsByWorkspaces = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    enabled: !!workspaceId,
    queryKey: ["workspaces", workspaceId, "projects"],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["projects"].$get({
        param: { workspaceId: workspaceId },
      });

      const payload: ApiResponse = await response.json();

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload
            ? payload.error
            : "Failed to fetch projects",
        );
      }

      return payload.data;
    },
  });

  return query;
};
