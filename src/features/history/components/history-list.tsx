import EmptyBox from "@/components/ui/empty-box";
import { AuditLogWithRelations } from "../types";
import HistoryItem from "./history-item";

type HistoryListProps = {
  logs: AuditLogWithRelations[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
};

function HistoryList({
  logs,
  isLoading,
  pagination,
  onPageChange,
}: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 w-full animate-pulse rounded-lg bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return <EmptyBox type="history" />;
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="divide-y rounded-md border">
        {logs.map((log) => (
          <HistoryItem key={log.id} log={log} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <button
          className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Précédent
        </button>
        <span className="text-sm">
          Page {pagination.page} sur {totalPages}
        </span>
        <button
          className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default HistoryList;
