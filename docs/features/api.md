
# API

Cette application expose une API HTTP via Hono, montée sous le préfixe `/api`.

- Base path: `/api`
- Routes (actuelles):
	- `/api/workspaces/*`
	- `/api/workspaces/:id/projects/*`

## Conventions

### Format des réponses

Succès:

```json
{ "data": {} }
```

Erreur:

```json
{ "error": "message" }
```

### Authentification

Les endpoints documentés ci-dessous utilisent `sessionMiddleware`.

- Attendu: cookie de session `better-auth.session_token`
- Réponses possibles:
	- `401` si non authentifié / session invalide

### Autorisations (workspace)

Certains endpoints utilisent `workspaceOwnerMiddleware` (propriétaire du workspace).

Note: ce middleware s'appuie sur un `workspace` déjà présent dans le contexte Hono (via `workspaceMiddleware`). Si la route ne passe pas par un middleware qui charge le workspace, l'API peut répondre `404 Workspace non trouvé`.

## Projects

Préfixe: `/api/workspaces/:id/projects`

### POST /api/workspaces/:id/projects/create

Crée un projet.

Middleware:

- Auth: `sessionMiddleware`
- Autorisation: `workspaceOwnerMiddleware`
- Validation: `createProjectSchema`

Body (JSON):

```json
{
	"name": "Mon projet",
	"description": "Optionnel",
	"categories": ["categoryId1", "categoryId2"],
	"status": "ACTIVE"
}
```

Règles:

- `id` (URL): requis — id du workspace
- `name`: requis (1..255)
- `description`: optionnel (max 1024)
- `categories`: optionnel (max 3) — liste d'IDs de catégories à connecter au projet
- `status`: optionnel — enum Prisma `ProjectStatus` (`ACTIVE`, `PAUSED`, `ARCHIVED`), défaut `ACTIVE`

Réponse:

- `200`:

```json
{ "data": { "id": "...", "workspaceId": "...", "name": "...", "description": "...", "status": "ACTIVE", "createdAt": "...", "updatedAt": "..." } }
```

Exemple:

```bash
curl -X POST http://localhost:3000/api/workspaces/<workspaceId>/projects/create \
	-H "Content-Type: application/json" \
	--cookie "better-auth.session_token=..." \
	-d '{"name":"Projet","description":"...","categories":["<categoryId>"],"status":"ACTIVE"}'
```

### POST /api/workspaces/:id/projects/categories/create

Crée une catégorie de projet.

Middleware:

- Auth: `sessionMiddleware`
- Autorisation: `workspaceOwnerMiddleware`
- Validation: `createProjectCategorySchema`

Body (JSON):

```json
{
	"projectId": "projectId",
	"name": "Backend",
	"color": "#FF5733"
}
```

Règles:

- `projectId`: requis
- `name`: requis (1..100)
- `color`: optionnel — code couleur hexadécimal

Réponse:

- `200`:

```json
{ "data": { "id": "...", "name": "...", "color": "...", "createdAt": "...", "updatedAt": "..." } }
```

### GET /api/workspaces/:id/projects/categories

Liste toutes les catégories de projets du workspace (tous projets confondus).

Middleware:

- Auth: `sessionMiddleware`
- Autorisation: `workspaceMiddleware` (membre du workspace)

Réponse:

- `200`:

```json
{ "data": [{ "id": "...", "projectId": "...", "name": "...", "color": "...", "createdAt": "...", "updatedAt": "..." }] }
```

