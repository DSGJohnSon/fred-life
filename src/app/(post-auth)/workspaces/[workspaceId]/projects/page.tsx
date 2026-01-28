import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LuPlus } from "react-icons/lu";
import { ProjectsHeader } from "./projects-header";
import EmptyBox from "@/components/ui/empty-box";
import ProjectsList from "@/features/projects/components/projects-list";

interface ProjectsPageProps {
  params: Promise<{ workspaceId: string }>;
}

async function ProjectsPage({ params }: ProjectsPageProps) {
  const { workspaceId } = await params;

  return (
    <div className="space-y-6">
      <ProjectsHeader />
      <Separator />
      <ProjectsList workspaceId={workspaceId} />
    </div>
  );
}

export default ProjectsPage;
