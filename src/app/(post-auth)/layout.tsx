import { getCurrent } from "@/features/auth/actions";
import CreateWorkspaceModal from "@/features/workspaces/components/modals/create-workspace-modal";
import CreateProjectModal from "@/features/projects/components/modal/create-project-modal";
import { redirect } from "next/navigation";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

async function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      {children}
    </>
  );
}

export default WorkspaceLayout;
