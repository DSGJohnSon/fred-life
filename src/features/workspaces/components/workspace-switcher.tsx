"use client";

import { LuCog, LuFolders, LuPlus } from "react-icons/lu";

import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "./workspace-avatar";

import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useAutoWorkspaceRedirect } from "@/hooks/use-auto-redirect";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateWorkspaceModal();
  const { setAutoWorkspaceRedirect } = useAutoWorkspaceRedirect();
  const { data: workspaces } = useGetWorkspaces();

  const router = useRouter();

  const onSelectWorkspace = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}/dashboard`);
  };

  const onRedirectHelloPage = async () => {
    await setAutoWorkspaceRedirect(false);
    router.push(`/workspaces/hello`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-stone-500">
          Workspaces ({workspaces?.data.length})
        </p>
        <div className="flex items-center gap-2">
          <LuPlus className="size-4 text-stone-500 cursor-pointer hover:opacity-75 transition" onClick={() => open()} />
        </div>
      </div>
      <Select
        onValueChange={(value) => {
          if (value === "hello") {
            onRedirectHelloPage();
          } else {
            onSelectWorkspace(value);
          }
        }}
        defaultValue={workspaceId}
      >
        <SelectTrigger className="w-full bg-white font-medium py-1 px-2 hover:border-stone-400 cursor-pointer transition">
          <SelectValue placeholder="No Workspace Selected" />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" sideOffset={4}>
          {Array.isArray(workspaces?.data) &&
            workspaces?.data.map((workspace) => {
              return (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex justify-start items-center gap-3 font-medium">
                    <WorkspaceAvatar name={workspace.name} />
                    <span className="truncate">{workspace.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          <SelectItem value="hello">
            <div className="flex justify-start items-center gap-3 font-medium">
              <LuFolders className="size-5 text-stone-500 cursor-pointer hover:opacity-75 transition" />
              <span className="truncate">Retour à la page de sélection</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
