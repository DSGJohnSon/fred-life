"use client";

import ResponsiveModal from "@/components/ui/responsive-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { CreateProjectForm } from "../forms/create-project-fom";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

function CreateProjectModal() {
  const { isOpen, setIsOpen } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
      title={"Création d'un projet"}
      description={"Un nouveau projet, de nouvelles ambitions."}
    >
      <CreateProjectForm workspaceId={workspaceId} />
    </ResponsiveModal>
  );
}

export default CreateProjectModal;
