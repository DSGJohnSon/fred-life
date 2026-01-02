import HelloPageBackground from "@/components/backgrounds/background-hello-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrent } from "@/features/auth/actions";
import LogoutButton, {
  NotMeButton,
} from "@/features/auth/components/logout-button";
import WorkspaceSelection from "@/features/workspaces/components/workspace-selection";

async function HelloPage() {
  const user = await getCurrent();
  if (!user) return;

  return (
    <HelloPageBackground>
      <div className="flex flex-col items-center gap-8 justify-center h-screen w-screen">
        <div className="flex flex-col items-center">
          <Avatar className="size-24 relative rounded-full overflow-hidden mb-4">
            <AvatarImage src={user.image!} />
            <AvatarFallback className="text-white bg-stone-500 hover:bg-stone-500/75 cursor-pointer font-semibold text-sm rounded-none">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center -space-y-2">
            <h1 className="text-2xl font-semibold">Salut {user.name} !</h1>
            <NotMeButton
              textClassName="text-xs underline underline-offset-2 text-orange-600 hover:text-orange-500 cursor-pointer gap-1"
              iconClassName="size-3"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            C'est une belle journée pour travailler !
          </p>
        </div>
        <WorkspaceSelection />
        <LogoutButton />
      </div>
    </HelloPageBackground>
  );
}

export default HelloPage;
