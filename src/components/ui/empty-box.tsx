"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import { LuClockAlert, LuFolderX, LuWind } from "react-icons/lu";
import { Button } from "./button";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

function EmptyBox({
  type,
  className,
}: {
  type: "workspaces" | "projects" | "default";
  className?: string;
}) {
  const { open: openWorkspaceModal } = useCreateWorkspaceModal();
  const { open: openProjectModal } = useCreateProjectModal();

  return (
    <Empty
      className={`border border-dashed border-stone-400 bg-stone-300/50 ${className}`}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {type === "workspaces" ? (
            <LuFolderX className="h-12 w-12 text-stone-400" />
          ) : type === "projects" ? (
            <LuClockAlert className="h-12 w-12 text-stone-400" />
          ) : (
            <LuWind className="h-12 w-12 text-stone-400" />
          )}
        </EmptyMedia>
        <EmptyTitle>
          {type === "workspaces"
            ? "Aucun workspace trouvé"
            : type === "projects"
              ? "Aucun projet trouvé"
              : "Cet endroit est vide"}
        </EmptyTitle>
        <EmptyDescription>
          {type === "workspaces"
            ? "Pour commencer, tu dois créer ou rejoindre un workspace"
            : type === "projects"
              ? "Il n'y a pas encore de projets dans ce workspace"
              : "Il semblerait que les données qui se trouvaient ici se soient envolées !"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {type === "workspaces" ? (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => openWorkspaceModal()}
          >
            Créer un workspace
          </Button>
        ) : type === "projects" ? (
          <Button
            variant="default"
            size="sm"
            className="cursor-pointer"
            onClick={() => openProjectModal()}
          >
            Créer un projet
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}

export default EmptyBox;
