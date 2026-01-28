import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

type ProjectCategory = {
  name: string;
  id: string;
  color: string | null;
};
type ApiSuccess = {
  data: ProjectCategory[];
};
type ApiError = {
  error: string;
};
type ApiResponse = ApiSuccess | ApiError;

export const useGetProjectCategoriesByWorkspaces = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    enabled: !!workspaceId,
    queryKey: ["workspaces", workspaceId, "project-categories"],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["projects"][
        "categories"
      ].$get({
        param: { workspaceId: workspaceId },
      });

      const payload: ApiResponse = await response.json();

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload
            ? payload.error
            : "Failed to fetch project categories",
        );
      }

      return payload.data;
    },
  });

  return query;
};
