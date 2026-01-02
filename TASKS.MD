Task List - Feature Historique (Audit Log)
Phase 1 : Base de Données & Schéma
1.1 Modification du Schéma Prisma
 Modifier le modèle HistoryAuditLog dans 
prisma/schema.prisma
 Ajouter le champ workspaceId String?
 Ajouter la relation vers 
Workspace
 Ajouter les champs ipAddress String? et userAgent String?
 Ajouter l'index @@index([workspaceId, createdAt])
 Créer l'enum HistoryEntityType avec valeurs : Auth, 
Workspace
 Modifier l'enum HistoryAuditAction
 Ajouter REGISTER
 Ajouter LOGIN
 Ajouter LOGIN_OAUTH
 Ajouter la relation auditLogs HistoryAuditLog[] dans le modèle 
User
 Ajouter la relation auditLogs HistoryAuditLog[] dans le modèle 
Workspace
 Exécuter npx prisma migrate dev --name add_history_audit_log
 Exécuter npx prisma generate
 Vérifier que la compilation TypeScript fonctionne sans erreur
Phase 2 : Structure de la Feature
2.1 Créer les Utilitaires
 Créer le fichier src/features/history/utils.ts
 Implémenter getClientInfo(request: Request) pour extraire IP et User Agent
 Implémenter formatHistoryChanges(before: any, after: any) pour formater le JSON
 Implémenter getActionLabel(action, entityType) pour les labels français
2.2 Créer les Schémas Zod
 Créer le fichier src/features/history/schemas.ts
 Créer createAuditLogSchema
 Créer getUserHistoryQuerySchema
 Créer getWorkspaceHistoryQuerySchema
2.3 Créer les Constantes
 Créer le fichier src/features/history/constants.ts
 Définir HISTORY_PAGINATION_LIMIT = 20
 Définir HISTORY_MAX_LIMIT = 100
2.4 Créer les Types TypeScript
 Créer le fichier src/features/history/types.ts
 Définir AuditLogWithRelations
 Définir HistoryFilters
Phase 3 : API & Backend
3.1 Créer les Routes API (Hono)
 Créer le fichier src/features/history/server/route.ts
 Implémenter la route GET /api/history/user
 Ajouter le middleware sessionMiddleware
 Valider les query params avec getUserHistoryQuerySchema
 Récupérer l'utilisateur depuis la session
 Construire la requête Prisma avec filtres (entityType, action, workspaceId, dates)
 Implémenter la pagination (skip, take)
 Inclure les relations (user, workspace)
 Retourner { data, pagination }
 Implémenter la route GET /api/history/workspace/:workspaceId
 Ajouter le middleware sessionMiddleware
 Vérifier que l'utilisateur est admin du workspace
 Valider les query params avec getWorkspaceHistoryQuerySchema
 Construire la requête Prisma avec filtres (entityType, action, userId, dates)
 Implémenter la pagination
 Inclure les relations
 Retourner { data, pagination } ou 403 si non-admin
3.2 Enregistrer les Routes dans l'API
 Modifier 
src/app/api/[[...route]]/route.ts
 Importer les routes history
 Enregistrer .route("/history", history)
3.3 Créer la Fonction Helper
 Créer le fichier src/features/history/actions.ts
 Implémenter createAuditLog(data)
 Extraire IP et User Agent depuis request (si fourni)
 Valider les données avec createAuditLogSchema
 Créer l'entrée dans la base via Prisma
 Gérer les erreurs (fail silently, logger uniquement)
Phase 4 : Frontend - Composants & Pages
4.1 Créer les Hooks React Query
 Créer le dossier src/features/history/api/
 Créer src/features/history/api/use-get-user-history.ts
 Implémenter le hook useGetUserHistory(filters?)
 Utiliser useQuery avec query key ["history", "user", filters]
 Appeler client.api.history.user.$get({ query: filters })
 Créer src/features/history/api/use-get-workspace-history.ts
 Implémenter le hook useGetWorkspaceHistory(workspaceId, filters?)
 Utiliser useQuery avec query key ["history", "workspace", workspaceId, filters]
 Appeler client.api.history.workspace[":workspaceId"].$get({ param, query })
4.2 Créer les Composants UI
 Créer le dossier src/features/history/components/
 Créer src/features/history/components/history-item.tsx
 Afficher l'avatar de l'utilisateur
 Afficher le nom de l'utilisateur
 Afficher l'action formatée (via getActionLabel)
 Afficher le nom du workspace (si applicable)
 Afficher la date/heure relative
 Ajouter une icône selon le type d'action
 Ajouter un tooltip sur l'avatar avec l'IP address
 Créer src/features/history/components/history-list.tsx
 Afficher une liste de HistoryItem
 Gérer l'état de chargement (skeleton)
 Gérer l'état vide (via HistoryEmpty)
 Afficher la pagination en bas
 Créer src/features/history/components/history-filters.tsx
 Ajouter un Select pour entityType
 Ajouter un Select pour action
 Ajouter un Date picker pour startDate et endDate
 Ajouter un Select pour workspaceId (si showWorkspaceFilter)
 Ajouter un Select pour userId (si showUserFilter)
 Ajouter un bouton "Réinitialiser"
 Créer src/features/history/components/history-empty.tsx
 Afficher un message "Aucune action enregistrée"
 Ajouter une icône
4.3 Créer les Pages
 Créer src/app/(post-auth)/account/page.tsx (si n'existe pas)
 Créer une page de profil utilisateur
 Ajouter un lien vers /account/history
 Créer src/app/(post-auth)/account/history/page.tsx
 Utiliser useGetUserHistory avec state pour filtres et pagination
 Afficher HistoryFilters avec showWorkspaceFilter={true}
 Afficher HistoryList
 Ajouter un header "Historique de mon compte"
 Modifier 
src/app/(post-auth)/workspaces/[workspaceId]/history/page.tsx
 Récupérer workspaceId depuis params
 Vérifier que l'utilisateur est admin (côté serveur ou hook)
 Utiliser useGetWorkspaceHistory avec state pour filtres et pagination
 Afficher HistoryFilters avec showUserFilter={true}
 Afficher HistoryList
 Ajouter un header "Historique du workspace"
 Protéger la page : rediriger ou afficher erreur si non-admin
Phase 5 : Intégration & Tests
5.1 Intégrer l'Historique dans l'Authentification
 Identifier le fichier de register (Better Auth)
 Après succès du register, appeler createAuditLog avec action REGISTER
 Identifier le fichier de login credentials (Better Auth)
 Après succès du login, appeler createAuditLog avec action LOGIN
 Identifier le callback OAuth (Better Auth)
 Après succès du login OAuth, appeler createAuditLog avec action LOGIN_OAUTH
 Enregistrer le provider (google, github) dans changes
5.2 Intégrer l'Historique dans les Workspaces
 Modifier 
src/features/workspaces/server/route.ts
 Route POST /create : Après création, appeler createAuditLog avec action CREATE
 Créer route PATCH /workspaces/:id (si n'existe pas)
 Après mise à jour, appeler createAuditLog avec action UPDATE
 Créer route DELETE /workspaces/:id (si n'existe pas)
 Avant suppression, appeler createAuditLog avec action DELETE
5.3 Ajouter les Liens de Navigation
 Vérifier que le lien "Historique" est présent dans 
NavUser
 (déjà fait)
 Ajouter un lien "Mon compte" dans 
NavUser
 Rediriger vers /account
5.4 Tests Manuels
 Test du schéma Prisma
 Vérifier que la migration s'exécute sans erreur
 Vérifier que les types TypeScript sont générés
 Test de l'enregistrement d'historique
 S'inscrire avec credentials → vérifier entrée REGISTER dans la base
 Se connecter avec credentials → vérifier entrée LOGIN
 Se connecter avec OAuth → vérifier entrée LOGIN_OAUTH avec provider
 Créer un workspace → vérifier entrée CREATE avec workspaceId
 Test des routes API
 Appeler GET /api/history/user avec différents filtres
 Vérifier la pagination
 Appeler GET /api/history/workspace/:id en tant qu'admin → doit retourner les logs
 Appeler en tant que membre non-admin → doit retourner 403
 Test des pages UI
 Naviguer vers /account/history
 Vérifier que les actions personnelles s'affichent
 Tester les filtres (workspace, date, type)
 Tester la pagination
 Survoler un avatar → vérifier que l'IP s'affiche
 Naviguer vers /workspaces/[id]/history en tant qu'admin
 Vérifier que toutes les actions du workspace s'affichent
 Tester les filtres (utilisateur, date, type)
 Tester la pagination
 Tenter d'accéder en tant que membre non-admin → vérifier protection
Notes
Fail Silently : Si createAuditLog échoue, logger l'erreur mais ne pas bloquer l'action principale
Performance : Les index Prisma sont cruciaux pour les requêtes rapides
Sécurité : Toujours vérifier les permissions avant de retourner l'historique workspace
Extensibilité : La structure permet d'ajouter facilement de nouveaux entityType et action
