import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrent } from "@/features/auth/actions";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { redirect } from "next/navigation";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: { workspaceId: string };
}

async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const { workspaceId } = await params;

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
        <AppSidebar variant="inset" defaultWorkspaceId={workspaceId} />
        <SidebarInset>
          <div>
            {workspaceId || "No workspace selected"}
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default WorkspaceLayout;
