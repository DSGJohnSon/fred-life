"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useGetWorkspaceHistory } from "@/features/history/api/use-get-workspace-history";

import HistoryFilters from "@/features/history/components/history-filters";
import HistoryList from "@/features/history/components/history-list";
import EmptyBox from "@/components/ui/empty-box";
import { HistoryFilters as HistoryFiltersType } from "@/features/history/types";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useRouter } from "next/navigation";
import LoadingLines from "@/components/animate-ui/loading-lines";

export default function HistoryPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspaceById({
      workspaceId,
      includeOwner: true,
      includeMembers: false,
    });
  const isUserOwner = workspace?.data?.owner.id === user?.id;
  if (!isUserOwner && !isLoadingWorkspace) {
    router.push(`/workspaces/${workspaceId}/dashboard`);
  }

  const [filters, setFilters] = useState<HistoryFiltersType>({});
  const { data: history, isLoading: isLoadingHistory } = useGetWorkspaceHistory(
    workspaceId,
    filters
  );

  if (isLoadingWorkspace || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="grayscale">
          <LoadingLines />
        </div>
      </div>
    );
  }

  if (!history) {
    return <EmptyBox type="history" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historique</h1>
        <p className="text-stone-500">
          Le détail de toutes les actions effectuées sur ton workspace
        </p>
      </div>
      <Separator />
      <HistoryFilters filters={filters} onFiltersChange={setFilters} />
      <HistoryList
        logs={history.data}
        isLoading={isLoadingHistory}
        pagination={{ page: 1, limit: 10, total: history.total }}
        onPageChange={() => {}}
      />
    </div>
  );
}
