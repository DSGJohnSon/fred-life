import { HistoryAuditAction, HistoryEntityType } from "@prisma/client";

export function getClientInfo(request: Request): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  if (!request || !request.headers) {
    return {
      ipAddress: null,
      userAgent: null,
    };
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null;

  const userAgent = request.headers.get("user-agent");

  return {
    ipAddress,
    userAgent,
  };
}

export function formatHistoryChanges(
  before: any,
  after: any
): {
  before: any;
  after: any;
} {
  const diffBefore: Record<string, any> = {};
  const diffAfter: Record<string, any> = {};

  const keys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ]);

  for (const key of keys) {
    if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) {
      diffBefore[key] = before?.[key];
      diffAfter[key] = after?.[key];
    }
  }

  return {
    before: diffBefore,
    after: diffAfter,
  };
}
export function getActionLabel(
  action: HistoryAuditAction,
  entityType: HistoryEntityType
): React.ReactNode {
  if (entityType === "Auth") {
    switch (action) {
      case "REGISTER":
        return "Inscription";
      case "LOGIN":
        return "Connexion";
      case "LOGIN_OAUTH":
        return "Connexion OAuth";
    }
  }

  const entityLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1).toLowerCase();

  switch (action) {
    case "CREATE":
      return (
        <span className="inline-flex items-center gap-1.5">
          Création de{" "}
          <span className="rounded-sm bg-stone-200 text-stone-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
            {entityLabel}
          </span>
        </span>
      );
    case "UPDATE":
      return (
        <span className="inline-flex items-center gap-1.5">
          Modification de{" "}
          <span className="rounded-sm bg-stone-200 text-stone-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
            {entityLabel}
          </span>
        </span>
      );
    case "DELETE":
      return (
        <span className="inline-flex items-center gap-1.5">
          Suppression de{" "}
          <span className="rounded-sm bg-stone-200 text-stone-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
            {entityLabel}
          </span>
        </span>
      );
    default:
      return action;
  }
}
