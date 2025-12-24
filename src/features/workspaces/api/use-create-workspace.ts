import { useCurrent } from "@/features/auth/api/use-current";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces.create)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces.create)["$post"]
>;

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrent();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces.create.$post({ json });
      return await response.json();
    },
    onSuccess: (response) => {
      if ("error" in response) return;

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      router.push(`/${response.data.id}/dashboard`);
      toast.success("Workspace créé avec succès!", {
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
    onError: () => {
      toast.error('Une erreur est survenue lors de la création du workspace', {
          style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
          } as React.CSSProperties
        })
    },
  });

  return mutation;
};
