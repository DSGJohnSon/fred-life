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
import { createProjectSchema } from "../../schemas";
import { useCreateProject } from "../../api/use-create-project";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoriesCombobox } from "./categories-combobox";
import { useCreateProjectModal } from "../../hooks/use-create-project-modal";

export function CreateProjectForm({ workspaceId }: { workspaceId: string }) {
  const { mutate } = useCreateProject();
  const { close } = useCreateProjectModal();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: ["Test"],
      status: "ACTIVE",
    },
  });

  function onSubmit(values: z.infer<typeof createProjectSchema>) {
    mutate(
      { param: { workspaceId }, json: values },
      {
        onSuccess: () => {
          form.reset();
          close();
        },
      }
    );
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
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mon super projet !"
                    maxLength={255}
                    {...field}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormDescription>
                    Tout projet commence par un nom.
                  </FormDescription>
                  <span
                    className={cn(
                      "text-xs text-muted-foreground",
                      `${field.value.length > 191 && "text-orange-500"}`,
                    )}
                  >
                    {field.value.length}/255
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optionnel)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description du projet"
                    maxLength={1024}
                    {...field}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormDescription>
                    Détaillez ce que ce projet implique.
                  </FormDescription>
                  <span
                    className={cn(
                      "text-xs text-muted-foreground",
                      `${field.value && field.value.length > 767 && "text-orange-500"}`,
                    )}
                  >
                    {field.value && `${field.value.length}/1024`}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Catégories{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optionnel)
                  </span>
                </FormLabel>
                <FormControl>
                    <CategoriesCombobox 
                      workspaceId={workspaceId} 
                      value={field.value}
                      onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {["ACTIVE", "PAUSED", "ARCHIVED"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer" size={"lg"}>Enregistrer ce nouveau projet</Button>
        </form>
      </Form>
    </div>
  );
}
