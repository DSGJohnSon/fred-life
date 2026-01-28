# Feature – Multi-écrans en temps réel

## Objectif
Permettre à un utilisateur du dashboard personnel d'ajouter des projets et de gérer les TO-DO List qui y sont liées.

## Problématique
- Organiser les tâches d'un projet
- Prioriser les tâches pour conserver un workflow optimal
- Préparer un projet en amont, puis avoir une vue globale de son avancée

## Solution retenue
- Structure de données organisé en vase-clos - par projets -
- Détail d'un projet et suivi en un clin d'oeil
- Interface sobre et organisée

## Gestion de l’état
- État serveur : récupération des projets
- État local : UI (loading, error, optimistic updates)
- Aucune duplication inutile des données

## Fichiers clés
- `features/projects`
