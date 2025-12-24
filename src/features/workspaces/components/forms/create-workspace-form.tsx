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
import { useCreateWorkspace } from "../../api/use-create-workspace";
import { createWorkspaceSchema } from "../../schemas";

export function CreateWorkspaceForm() {
  const { mutate } = useCreateWorkspace();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    mutate({ json: values });
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
                  <Input placeholder="Nom du workspace" {...field} />
                </FormControl>
                <FormDescription>Le nom de votre workspace</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Créer</Button>
        </form>
      </Form>
    </div>
  );
}
