import { useCurrent } from "@/features/auth/api/use-current";
import { client } from "@/lib/rpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces[":id"])["$get"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces[":id"])["$get"]
>;

export const useGetWorkspaceById = ({
    workspaceId,
    includeOwner,
    includeMembers
}: {
    workspaceId: string;
    includeOwner?: boolean;
    includeMembers?: boolean;
}) => {
    const query = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {  
            const response = await client.api.workspaces[":id"].$get({
                param: {
                    id: workspaceId,
                },
                query: {
                    includeOwner,
                    includeMembers,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace");
            }

            const data = await response.json();

            return data;
        }
    })

    return query;
}
