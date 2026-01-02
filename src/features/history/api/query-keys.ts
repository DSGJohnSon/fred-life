import { HistoryFilters } from "../types";

export const historyKeys = {
  all: ["history"] as const,
  
  //Key relative au requêtes History d'un utilisateur
  users: () => [...historyKeys.all, "user"] as const,
  //Key relative au requêtes History d'un utilisateur avec des filtres (Page notament)
  user: (filters?: HistoryFilters) => [...historyKeys.users(), filters] as const,
  
  //Key relative au requêtes History d'un workspace
  workspaces: () => [...historyKeys.all, "workspace"] as const,
  //Key relative au requêtes History d'un workspace avec des filtres (Page notament)
  workspace: (workspaceId: string, filters?: HistoryFilters) => 
    [...historyKeys.workspaces(), workspaceId, filters] as const,
};