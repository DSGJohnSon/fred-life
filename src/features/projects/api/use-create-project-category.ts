import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["projects"]["categories"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["projects"]["categories"]["$post"]
>;

export const useCreateProjectCategory = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.workspaces[":workspaceId"].projects.categories.$post({
        param,
        json,
      });
      return await res.json();
    },
    onSuccess: (response, variables) => {
      if ("error" in response) {
        toast.error(response.error);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["workspaces", variables.param.id, "project-categories"],
      });
      toast.success(`Catégorie de projet '${variables.json.name}' créée avec succès !`);

      router.refresh();
    },
  });
};