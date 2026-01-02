import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { historyKeys } from "./query-keys";
import { AuditLogWithRelations, HistoryFilters } from "../types";

export const useGetWorkspaceHistory = (
  workspaceId: string,
  filters?: HistoryFilters
) => {
  const query = useQuery({
    queryKey: [...historyKeys.workspace(workspaceId, filters)],
    queryFn: async () => {
      const response = await client.api.history.workspace[":id"].$get({
        query: { ...filters },
        param: { id: workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace history");
      }

      const data = await response.json();

      const transformedData: {
        data: AuditLogWithRelations[];
        total: number;
      } = {
        ...data,
        data: data.data.map((log: any) => ({
          ...log,
          createdAt: new Date(log.createdAt),
        })),
      };
      return transformedData;
    },
  });

  return query;
};
