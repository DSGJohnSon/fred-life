"use client";

import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { LuPlus } from "react-icons/lu";

export function ProjectsHeader() {
  const { open } = useCreateProjectModal();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Projets</h1>
        <p className="text-stone-500">
          Gérez, créez et collaborez sur vos projets ici.
        </p>
      </div>
      <div>
        <Button
          className="cursor-pointer"
          variant={"outline"}
          onClick={() => open()}
        >
          <LuPlus /> Nouveau projet
        </Button>
      </div>
    </div>
  );
}
