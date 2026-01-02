import { AuditLogWithRelations } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  CircleHelp,
  Globe,
  Monitor,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { getActionLabel } from "../utils";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa6";

type HistoryItemProps = {
  log: AuditLogWithRelations;
};

const getIcon = (action: string) => {
  switch (action) {
    case "REGISTER":
      return <UserPlus className="h-4 w-4 text-emerald-500" />;
    case "LOGIN":
      return <LogIn className="h-4 w-4 text-blue-500" />;
    case "LOGIN_OAUTH":
      return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
    case "CREATE":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "UPDATE":
      return <Pencil className="h-4 w-4 text-amber-500" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4 text-rose-500" />;
    default:
      return <CircleHelp className="h-4 w-4 text-slate-400" />;
  }
};

function HistoryItem({ log }: HistoryItemProps) {
  const initials = log.user.name
    ? log.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const actionLabel = getActionLabel(log.action, log.entityType);
  const date = new Date(log.createdAt);
  const relativeDate = formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr,
  });
  const exactDate = format(date, "PPP 'à' HH:mm:ss", { locale: fr });

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-transparent transition-all hover:bg-slate-50/50 hover:border-slate-100 group relative">
      {/* Header: Action & Time */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
            {getIcon(log.action)}
          </div>
          <div className="text-sm font-bold text-slate-900 leading-none">
            {actionLabel}
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 cursor-help whitespace-nowrap">
                {relativeDate}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs font-medium">{exactDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Footer: Details & Actor */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {/* Action Details */}
          <div className="flex items-center gap-1.5 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-100/50">
            {log.entityType === "Auth" &&
              log.action === "LOGIN_OAUTH" &&
              (log.changes?.provider === "github" ? (
                <FaGithub className="size-3.5 text-slate-900" />
              ) : log.changes?.provider === "google" ? (
                <FcGoogle className="size-3.5" />
              ) : null)}

            {log.workspace && (
              <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
                {log.workspace.name}
              </span>
            )}

            {!log.workspace && log.entityType !== "Auth" && (
              <span className="italic text-slate-400">Pas de détails</span>
            )}

            {log.entityType === "Auth" && !log.changes?.provider && (
              <span className="text-slate-400">Authentification directe</span>
            )}
          </div>

          <span className="text-slate-200">|</span>

          {/* Actor */}
          <div className="flex items-center gap-2 group/actor py-0.5 px-1.5 rounded-full hover:bg-white transition-colors border border-transparent hover:border-slate-100">
            <span className="text-slate-400 font-medium">par</span>
            <Avatar className="h-5 w-5 border border-white shadow-sm">
              <AvatarImage src={log.user.image || undefined} />
              <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-slate-700">
              {log.user.name}
            </span>
          </div>
        </div>

        {/* Technical Info Trigger (Legacy Move) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-1">
                {log.ipAddress && (
                  <Globe className="h-3 w-3 text-slate-300 hover:text-indigo-400 transition-colors cursor-help" />
                )}
                {log.userAgent && (
                  <Monitor className="h-3 w-3 text-slate-300 hover:text-indigo-400 transition-colors cursor-help" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="p-3 space-y-2 max-w-xs shadow-xl"
            >
              {log.ipAddress && (
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="h-3 w-3 text-indigo-400" />
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              )}
              {log.userAgent && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Monitor className="h-3 w-3 text-indigo-400 shrink-0" />
                  <span className="line-clamp-2">{log.userAgent}</span>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default HistoryItem;
