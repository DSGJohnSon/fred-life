"use client";

import ResponsiveModal from "@/components/ui/responsive-modal";
import { CreateWorkspaceForm } from "../forms/create-workspace-form";
import { useCreateWorkspaceModal } from "../../hooks/use-create-workspace-modal";

function CreateWorkspaceModal() {
  const { isOpen, setIsOpen } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
      title={"Création d'un workspace"}
      description={"Cet espace centralisera toute tes données."}
    >
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
}

export default CreateWorkspaceModal;
