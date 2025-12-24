import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)["update-name"][":id"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)["update-name"][":id"]["$put"]
>;

export const useUpdateWorkspaceName = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces["update-name"][":id"].$put({
        json,
        param,
      });
      return await response.json();
    },
    onSuccess: (response) => {
      if ("error" in response) return;

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      toast.success("Nom modifié avec succès!", {
        description: response.data.name,
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
    },
    onError: (response) => {
      toast.error(
        "Une erreur est survenue lors de la modification du workspace",
        {
          description: response.message,
          style: {
            "--normal-bg":
              "color-mix(in oklab, var(--destructive) 10%, var(--background))",
            "--normal-text": "var(--destructive)",
            "--normal-border": "var(--destructive)",
          } as React.CSSProperties,
        }
      );
    },
  });

  return mutation;
};
