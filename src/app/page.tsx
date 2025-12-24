import { getCurrent } from "@/features/auth/actions";
import LogoutButton from "@/features/auth/components/logout-button";
import { CreateWorkspaceForm } from "@/features/workspaces/components/forms/create-workspace-form";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-4 border bg-stone-100 rounded-md">
        Bonjour ! {user.name}, bienvenue sur votre espace personnel.
        <LogoutButton className="self-start " />
      </div>
    </div>
  );
}
