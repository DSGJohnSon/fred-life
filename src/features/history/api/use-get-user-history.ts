import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { historyKeys } from "./query-keys";
import { AuditLogWithRelations, HistoryFilters } from "../types";

export const useGetUserHistory = (filters?: HistoryFilters) => {
  const query = useQuery({
    queryKey: [...historyKeys.user(filters)],
    queryFn: async () => {
      const response = await client.api.history.user.$get({
        query: filters ?? {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user history");
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
