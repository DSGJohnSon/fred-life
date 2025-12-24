"use client";

// --- Imports ---
import { useState } from "react";
import { FaCopy } from "react-icons/fa6";

// --- Types (TypeScript) ---
interface JsonViewerProps {
  data: unknown; // On accepte n'importe quoi en entrée
  title?: string; // Titre optionnel du bloc
  isLoading?: boolean; // Indique si on est en chargement
  className?: string; // Classe optionnelle pour le container
}

interface JsonNodeProps {
  keyName: string; // La clé (ex: "firstName")
  value: any; // La valeur (ex: "Fred")
  isLast: boolean; // Pour savoir si on met une virgule "," à la fin
}

// --- Utilitaires Design (Gestion des couleurs) ---
const getTypeColor = (value: any): string => {
  if (typeof value === "string") return "text-emerald-400";
  if (typeof value === "number") return "text-orange-400";
  if (typeof value === "boolean") return "text-rose-400";
  if (value === null) return "text-gray-500";
  return "text-slate-300";
};

// --- Composant Récursif ---
const JsonNode = ({ keyName, value, isLast }: JsonNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isEmpty = isObject && Object.keys(value).length === 0;

  if (!isObject) {
    return (
      <div className="font-mono text-sm leading-6 hover:bg-slate-800/50 px-1 rounded">
        <span className="text-sky-300">"{keyName}"</span>
        <span className="text-slate-400">: </span>
        <span className={getTypeColor(value)}>
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
        {!isLast && <span className="text-slate-500">,</span>}
      </div>
    );
  }

  const brackets = isArray ? ["[", "]"] : ["{", "}"];
  const keys = Object.keys(value);

  return (
    <div className="font-mono text-sm leading-6">
      {/* Ligne du Parent */}
      <div
        className="flex items-center hover:bg-slate-800/50 px-1 rounded cursor-pointer group"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {/* Chevron - isOpen Visualisation */}
        <span
          className={`mr-1 text-slate-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          ▶
        </span>

        <span className="text-sky-300">"{keyName}"</span>
        <span className="text-slate-400">: </span>
        <span className="text-yellow-500">{brackets[0]}</span>

        {/* Aperçu quand c'est fermé */}
        {!isOpen && (
          <span className="text-slate-400/80 italic text-xs ml-2">
            {isArray ? `Array(${keys.length})` : `Object{...}`}
          </span>
        )}
      </div>

      {/* Contenu */}
      {isOpen && !isEmpty && (
        <div className="pl-6 border-l border-slate-700 ml-2">
          {/* La ligne ci-dessus crée le guide visuel vertical */}
          {keys.map((key, index) => (
            <JsonNode
              key={key}
              keyName={key}
              value={value[key]}
              isLast={index === keys.length - 1} // Pas de virgule pour le dernier
            />
          ))}
        </div>
      )}

      {/* Fermeture du bloc */}
      {isOpen && (
        <div className="pl-2 hover:bg-slate-800/50 rounded">
          <span className="text-yellow-500">{brackets[1]}</span>
          {!isLast && <span className="text-slate-500">,</span>}
        </div>
      )}

      {/* Si fermé, on affiche juste la fermeture sur la même ligne */}
      {!isOpen && (
        <span className="text-yellow-500 ml-1">
          {brackets[1]}
          {!isLast && ","}
        </span>
      )}
    </div>
  );
};

// --- Composant Principal ---
export const JsonViewer = ({
  data,
  title = "JSON Data",
  isLoading,
  className,
}: JsonViewerProps) => {
  const [copied, setCopied] = useState(false);
  // Parsing sécurisé : on s'assure que data est un objet
  let parsedData = data;
  let error = null;

  if (isLoading) {
    return (
      <div className={`bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700 w-full max-w-3xl mx-auto my-8 ${className}`}>
        {/* Header identique au viewer final */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-2">
              {title}
            </span>
          </div>
          <div className="text-xs font-medium px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-500">
            <FaCopy />
          </div>
        </div>

        {/* Skeleton Loader animé */}
        <div className="p-4 space-y-3 animate-pulse">
          {/* Ligne 1 - Objet racine */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-20"></div>
            <div className="h-4 bg-slate-700 rounded w-8"></div>
          </div>

          {/* Lignes 2-6 - Propriétés simulées */}
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-2">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-24"></div>
              <div className="h-4 bg-slate-700 rounded w-32"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-28"></div>
              <div className="h-4 bg-slate-700 rounded w-40"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-20"></div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-32"></div>
              <div className="h-4 bg-slate-700 rounded w-36"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-16"></div>
              <div className="h-4 bg-slate-700 rounded w-28"></div>
            </div>
          </div>

          {/* Ligne de fermeture */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-700 rounded w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      error = "JSON invalide";
    }
  }

  // Fonction de copie
  const handleCopy = () => {
    const textToCopy = JSON.stringify(parsedData, null, 2); // On reformate proprement
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset après 2 secondes
    });
  };

  return (
    <div className={`bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700 w-full max-w-3xl mx-auto my-8 ${className}`}>
      {/* Header façon "Mac OS" ou IDE */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        {/* Partie Gauche : Titre et Déco */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-2">
            {title}
          </span>
        </div>

        {/* Partie Droite : Bouton Copier */}
        <button
          onClick={handleCopy}
          className={`
            text-xs font-medium px-3 py-1 rounded transition-all duration-200 border
            ${
              copied
                ? "bg-green-500/10 border-green-500/50 text-green-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
            }
          `}
          aria-label="Copy JSON"
        >
          {copied ? "Copié ! ✨" : <FaCopy />}
        </button>
      </div>

      {/* Corps du Viewer */}
      <div className="p-4 overflow-x-auto">
        {error ? (
          <div className="text-red-400 font-mono p-4 bg-red-900/10 rounded border border-red-900/50">
            ⚠️ Erreur : {error}
          </div>
        ) : (
          // On démarre la récursivité avec un noeud "root"
          <JsonNode keyName="json" value={parsedData} isLast={true} />
        )}
      </div>
    </div>
  );
};
