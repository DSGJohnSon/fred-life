import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrent } from "@/features/auth/actions";
import LogoutButton from "@/features/auth/components/logout-button";
import WorkspaceSelection from "@/features/workspaces/components/workspace-selection";
import { redirect } from "next/navigation";

async function HelloPage() {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col items-center gap-8 justify-center h-screen w-screen">
      <div className="flex flex-col items-center">
        <Avatar className="size-10 relative rounded-full overflow-hidden">
          <AvatarImage src={user.image!} />
          <AvatarFallback className="text-white bg-stone-500 hover:bg-stone-500/75 cursor-pointer font-semibold text-sm rounded-none">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1>Bonjour, {user.name}</h1>
        <p>Sélectionnez un workspace pour travailler.</p>
      </div>
      <WorkspaceSelection />
      <LogoutButton />
    </div>
  );
}

export default HelloPage;
