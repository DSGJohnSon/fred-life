"use client";

import { DateRange, DateRangePicker } from "@/components/date-range-picker";
import type { HistoryFilters } from "../types";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Label } from "@/components/ui/label";
import { LuRefreshCcw } from "react-icons/lu";

type HistoryFiltersProps = {
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
};

export default function HistoryFilters({
  filters,
  onFiltersChange,
}: HistoryFiltersProps) {
  const handleFilterChange = (key: keyof HistoryFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handleDateRangeChange = (range: DateRange) => {
    onFiltersChange({
      ...filters,
      startDate: range.from.toISOString(),
      endDate: range.to?.toISOString(),
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaces();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="entityType" className="text-xs">
            Type d'entité
          </Label>
          <Select
            value={filters.entityType ?? "all"}
            onValueChange={(v) => handleFilterChange("entityType", v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type d'entité" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Workspace">Workspace</SelectItem>
              <SelectItem value="Auth">Authentification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="action" className="text-xs">
            Action
          </Label>
          <Select
            value={filters.action ?? "all"}
            onValueChange={(v) => handleFilterChange("action", v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="CREATE">Création</SelectItem>
              <SelectItem value="UPDATE">Modification</SelectItem>
              <SelectItem value="DELETE">Suppression</SelectItem>
              <SelectItem value="LOGIN">Connexion</SelectItem>
              <SelectItem value="REGISTER">Inscription</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="workspaceId" className="text-xs">
            Workspace
          </Label>
          {isLoadingWorkspaces ? (
            <Select
              value={filters.workspaceId ?? "all"}
              onValueChange={(v) => handleFilterChange("workspaceId", v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Tous</SelectItem>
              </SelectContent>
            </Select>
          ) : workspaces && workspaces.data.length > 0 ? (
            <Select
              value={filters.workspaceId ?? "all"}
              onValueChange={(v) => handleFilterChange("workspaceId", v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Tous</SelectItem>
                {workspaces.data.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dateRange" className="text-xs">
            Dates
          </Label>
          <DateRangePicker
            initialDateFrom={filters.startDate}
            initialDateTo={filters.endDate}
            onUpdate={({ range }) => {
              handleDateRangeChange(range);
            }}
          />
        </div>
      </div>
      <span className="text-xs block">{JSON.stringify(filters)}</span>
      <Button
        onClick={handleReset}
        variant="link"
        size="sm"
        className="text-xs cursor-pointer"
      >
        <LuRefreshCcw className="size-3" />
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
