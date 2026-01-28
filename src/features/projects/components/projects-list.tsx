"use client";

import { useGetProjectsByWorkspaces } from "../api/use-get-project-by-workspaces";
import EmptyBox from "@/components/ui/empty-box";

function ProjectsList({ workspaceId }: { workspaceId: string }) {
  const { data: projects, isLoading: projectsLoading } =
    useGetProjectsByWorkspaces({ workspaceId });

  if (projectsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        Loading...
      </div>
    );
  }

  if (!projectsLoading && (projects?.length === 0 || !projects)) {
    return <EmptyBox type="projects" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {projects?.map((project) => (
        <div
          key={project.id}
          className="p-4 border rounded-md shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectsList;
