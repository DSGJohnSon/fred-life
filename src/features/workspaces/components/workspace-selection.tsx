"use client";

import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { WorkspaceAvatarHelloPage } from "./workspace-avatar";
import Link from "next/link";

function WorkspaceSelection() {
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  return (
    <div>
      {workspacesLoading && <p>Loading...</p>}
      <div className="flex items-center gap-6">
        {workspaces?.data.map((workspace) => {
          return (
            <Link className="flex flex-col items-center gap-2"
            href={`/${workspace.id}/dashboard`}>
              <WorkspaceAvatarHelloPage
                key={workspace.id}
                name={workspace.name}
              />
              <span>{workspace.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default WorkspaceSelection;
