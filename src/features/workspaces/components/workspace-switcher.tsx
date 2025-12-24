"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useRouter } from "next/navigation";
import { LucideCog, LucidePlusCircle } from "lucide-react";

export const WorkspaceSwitcher = ({ defaultWorkspaceId }: { defaultWorkspaceId: string }) => {
  const { data: workspaces } = useGetWorkspaces();

  const router = useRouter();

  const onSelectWorkspace = (workspaceId: string) => {
    router.push(`/${workspaceId}/dashboard`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-stone-500">Workspaces</p>
        <div className="flex items-center gap-2">
          <LucideCog className="size-5 text-stone-500 cursor-pointer hover:opacity-75 transition" />
         <LucidePlusCircle className="size-5 text-stone-500 cursor-pointer hover:opacity-75 transition" />
        </div>
      </div>
      <Select onValueChange={onSelectWorkspace} defaultValue={defaultWorkspaceId}>
        <SelectTrigger className="w-full bg-white font-medium py-1 px-2 hover:border-stone-400 cursor-pointer transition">
          <SelectValue placeholder="No Workspace Selected" />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" sideOffset={4}>
          {Array.isArray(workspaces?.data) && workspaces?.data.map((workspace) => {
            return (
              <SelectItem key={workspace.id} value={workspace.id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar name={workspace.name} />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
