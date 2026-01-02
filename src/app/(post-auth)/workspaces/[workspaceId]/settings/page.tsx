import {
  AvatarGroup,
  AvatarGroupTooltip,
} from "@/components/animate-ui/components/animate/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getWorkspaceById } from "@/features/workspaces/actions";

async function SettingsPage({ params }: { params: { workspaceId: string } }) {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId, {
    includeOwner: true,
    includeMembers: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-stone-500">
          Gestion des paramètres de votre workspace
        </p>
      </div>
      <Separator />
      <div>
        {workspace && workspace.data ? (
          <div className="bg-stone-50 p-4 rounded-lg border border-separate">
            <div></div>
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {workspace?.data?.name}
                </h2>
                <AvatarGroup className="bg-red-600">
                  {workspace?.data?.members.map((member: any, index) => (
                    <Avatar key={index}>
                      <AvatarImage src={member.user?.image} />
                      <AvatarFallback>
                        {member.user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <AvatarGroupTooltip>{member.role}</AvatarGroupTooltip>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
              <p className="text-stone-500 text-xs">
                Dernière mise à jour le{" "}
                <span className="text-stone-500 underline">
                  {new Date(workspace.data.updatedAt)
                    .toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                  -{" "}
                  {new Date(workspace.data.updatedAt)
                    .toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(":", "h")}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 p-4 rounded-lg border border-separate">
            <h2 className="text-lg font-semibold">Workspace non trouvé</h2>
            <p className="text-stone-500 text-sm">
              Le workspace que vous cherchez n'a pas été trouvé
            </p>
          </div>
        )}
      </div>
      <Separator />
    </div>
  );
}

export default SettingsPage;
