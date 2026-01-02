import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrent } from "@/features/auth/actions";
import { getWorkspaceById } from "@/features/workspaces/actions";
import { redirect } from "next/navigation";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const user = await getCurrent();
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById(workspaceId, {
    includeMembers: true,
  });

  //Vérif. que le workspace existe
  if (!workspace || workspace.data == null) {
    redirect("/workspaces/hello");
  }

  //Vérif que le user en ai membre.
  if (!workspace.data.members.some((member) => member.userId === user?.id)) {
    redirect("/workspaces/hello");
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default WorkspaceLayout;
