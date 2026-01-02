# Système d'Historique (Audit Log)

Le système d'historique permet de tracer les actions critiques effectuées par les utilisateurs au sein de l'application. Il enregistre qui a fait quoi, quand, et depuis quel environnement.

## Fonctionnement Global

### 1. Stockage (Base de données)

Toutes les entrées sont stockées dans la table `audit_log` via le modèle Prisma `HistoryAuditLog`. Les informations clés incluent :

- `userId` : L'auteur de l'action.
- `action` : Le type d'action (ex: `CREATE`, `REGISTER`, `LOGIN`).
- `entityType` : La catégorie de l'entité concernée (ex: `Auth`, `Workspace`).
- `changes` : Un objet JSON optionnel contenant les détails (ex: `{ provider: "google" }`).
- `ipAddress` & `userAgent` : Informations techniques capturées automatiquement.

### 2. La fonction `createAuditLog`

Située dans `src/features/history/action.ts`, c'est le point d'entrée unique pour créer un log.

- **Fail Silently** : La fonction est wrappée dans un `try-catch`. Si le logging échoue, une erreur est affichée en console mais l'action principale de l'utilisateur n'est **jamais** bloquée.
- **Capture automatique** : Si vous lui passez l'objet `Request`, elle s'occupe seule d'extraire l'IP et le User Agent.

### 3. Cas particulier : Authentification

Pour l'authentification (Better Auth), nous n'utilisons pas de plugin interne pour éviter les plantages de hooks. À la place, nous wrappons le handler de route dans `src/app/api/auth/[...all]/route.ts`. Cela permet de capturer avec certitude :

- Les inscriptions (`REGISTER`).
- Les connexions classiques (`LOGIN`).
- Les connexions OAuth (`LOGIN_OAUTH`) en extrayant le token de session directement du `Set-Cookie` de la réponse.

### 4. Typage des changements (`changes`)

Le champ `changes` est stocké en JSON dans la base de données. Pour garantir la sécurité du typage (TypeScript) lors de l'affichage :

- Un type `HistoryChanges` est défini dans `src/features/history/types.ts`.
- Toutes les propriétés connues (ex: `provider`, `before`, `after`) y sont déclarées de manière optionnelle.
- Cela évite les erreurs de type `any` ou `unknown` lors de l'accès aux données dans les composants React.

---

## Guide : Ajouter l'historique à une nouvelle fonctionnalité

Pour ajouter du tracing à une nouvelle fonctionnalité (ex: création d'un projet), suivez ces étapes :

### Étape 1 : Mettre à jour le schéma Prisma (si besoin)

Si votre nouvelle action n'existe pas encore, ajoutez-la dans `prisma/schema.prisma` :

```prisma
enum HistoryAuditAction {
  // ... existants
  CREATE_PROJECT // Nouvelle action
}
```

Puis lancez `bunx prisma db push`.

### Étape 2 : Mettre à jour le typage TypeScript

Ajoutez vos nouvelles propriétés dans le type `HistoryChanges` du fichier `src/features/history/types.ts` :

```typescript
export type HistoryChanges = {
  // ... existants
  monNouveauChamp?: string;
};
```

### Étape 3 : Appeler `createAuditLog`

Dans votre Server Action ou votre route d'API :

```typescript
import { createAuditLog } from "@/features/history/action";

export async function maNouvelleAction(data: any) {
  // 1. Effectuer l'action principale
  const result = await prisma.projet.create({ data });

  // 2. Créer le log d'audit (sans attendre .await si vous voulez plus de perf)
  createAuditLog({
    userId: result.creatorId,
    action: "CREATE",
    entityType: "Project", // Assurez-vous qu'il existe dans l'enum HistoryEntityType
    entityId: result.id,
    workspaceId: result.workspaceId,
    changes: { name: result.name }, // Détails optionnels
    request: req, // Passer la Request pour capturer IP/UA
  });

  return result;
}
```

### Étape 5 : Ajouter les labels (Optionnel)

Si vous voulez une description lisible en français dans l'interface, ajoutez votre action dans `src/features/history/utils.ts`, fonction `getActionLabel` :

```typescript
export function getActionLabel(...) {
  // ...
  switch (action) {
    case "CREATE_PROJECT":
      return "Création de projet";
    // ...
  }
}
```

### Étape 6 : Personnaliser le rendu (Optionnel)

Si votre action nécessite d'afficher des informations spécifiques (ex: afficher le nom du projet créé), modifiez `src/features/history/components/history-item.tsx`.

Vous pouvez utiliser le champ `log.changes` qui contient les données JSON que vous avez passées lors de la création du log.

## Bonnes pratiques

- **EntityType** : Utilisez toujours un type présent dans l'énumération `HistoryEntityType`.
- **Context** : Passez toujours l'objet `Request` quand il est disponible.
- **Données sensibles** : Ne stockez jamais de mots de passe ou de données sensibles dans le champ `changes`.

```

```
