"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkspaceNameSchema } from "../../schemas";
import { useUpdateWorkspaceName } from "../../api/use-update-workspace-name";

export function UpdateWorkspaceNameForm({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const { mutate, isPending } = useUpdateWorkspaceName();

  const form = useForm<z.infer<typeof updateWorkspaceNameSchema>>({
    resolver: zodResolver(updateWorkspaceNameSchema),
    defaultValues: {
      name: workspaceName,
    },
  });

  function onSubmit(values: z.infer<typeof updateWorkspaceNameSchema>) {
    mutate({ json: values, param: { id: workspaceId } });
  }

  return (
    <div className="space-y-6 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du workspace</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du workspace" {...field} disabled={isPending}/>
                </FormControl>
                <FormDescription>Le nom de votre workspace</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>Mettre à jour</Button>
        </form>
      </Form>
    </div>
  );
}
