"use client";

import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { WorkspaceAvatarHelloPage } from "./workspace-avatar";
import Link from "next/link";
import LoadingLines from "@/components/animate-ui/loading-lines";
import EmptyBox from "@/components/ui/empty-box";
import { useEffect } from "react";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { useAutoWorkspaceRedirect } from "@/hooks/use-auto-redirect";

function WorkspaceSelection() {
  const router = useRouter();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { open: openCreateWorkspaceModal } = useCreateWorkspaceModal();
  const { autoWorkspaceRedirect } = useAutoWorkspaceRedirect();

  useEffect(() => {
    if (workspaces?.data.length === 0) {
      openCreateWorkspaceModal();
    };

    if (autoWorkspaceRedirect && workspaces?.data.length === 1) {
      router.push(`/workspaces/${workspaces?.data[0].id}/dashboard`);
    }
  }, [workspaces]);

  return (
    <div className="w-full flex flex-col items-center">
      {workspacesLoading ? (
        <div className="grayscale">
          <LoadingLines />
        </div>
      ) : !workspacesLoading && workspaces?.data.length === 0 ? (
        <EmptyBox type="workspaces" className="w-1/2" />
      ) : (
        <div className="flex flex-col justify-between items-center h-[30svh]">
          <div>
            <p className="font-semibold text-orange-600 uppercase text-sm bg-orange-100 border border-orange-300 py-1.5 px-4 rounded-full">
              Sélectionne un workspace pour commencer
            </p>
          </div>
          <div className="flex items-center gap-6">
            {workspaces?.data.map((workspace) => {
              return (
                <Link
                  className="flex flex-col items-center gap-4 p-6 hover:scale-97 hover:bg-stone-200 transition-all"
                  style={{ borderRadius: "calc(var(--radius) + 24px)" }}
                  href={`/workspaces/${workspace.id}/dashboard`}
                  key={workspace.id}
                >
                  <WorkspaceAvatarHelloPage name={workspace.name} />
                  <span className="text-lg font-semibold">
                    {workspace.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSelection;
