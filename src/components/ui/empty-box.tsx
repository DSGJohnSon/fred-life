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

function EmptyBox({ type, className }: { type: "workspaces" | "history" |  "default", className?: string }) {
  const { open } = useCreateWorkspaceModal();

  return (
    <Empty className={`border border-dashed border-stone-400 bg-stone-300/50 ${className}`}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {type === "workspaces" ? <LuFolderX /> : type === "history" ? <LuClockAlert /> : <LuWind />}
        </EmptyMedia>
        <EmptyTitle>
          {type === "workspaces"
            ? "Aucun workspace trouvé"
            : type === "history" ? "Aucun historique trouvé" : "Cet endroit est vide"}
        </EmptyTitle>
        <EmptyDescription>
          {type === "workspaces"
            ? "Pour commencer, tu dois créer ou rejoindre un workspace"
            : "Il semblerait que les données qui se trouvaient ici se soient envolées !"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {type === "workspaces" ? (
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => open()}>
            Créer un workspace
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}

export default EmptyBox;
