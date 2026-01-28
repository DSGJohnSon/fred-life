"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Kbd } from "@/components/ui/kbd";
import { useGetProjectCategoriesByWorkspaces } from "../../api/use-get-project-categories-by-workspaces";
import { useCreateProjectCategory } from "../../api/use-create-project-category";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface CategoriesComboboxProps {
  workspaceId: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function CategoriesCombobox({
  workspaceId,
  value = [],
  onChange,
}: CategoriesComboboxProps) {
  const anchor = useComboboxAnchor();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { data: categories, isLoading: categoriesLoading } =
    useGetProjectCategoriesByWorkspaces({ workspaceId });

  const { mutate: createCategory, isPending: isCreating } =
    useCreateProjectCategory();

  const categoryNames = categories?.map((cat) => cat.name) || [];

  const getCategoryColor = (name: string) => {
    return categories?.find((cat) => cat.name === name)?.color || "#000000";
  };

  const categoryExistsIgnoreCase = (input: string) => {
    return categoryNames.some(
      (name) => name.toLowerCase() === input.toLowerCase(),
    );
  };

  const handleCreateCategory = () => {
    if (!inputValue.trim()) return;

    const newCategoryName = inputValue.trim();

    // Vérifier si la catégorie existe déjà
    if (categoryNames.includes(newCategoryName)) {
      // Si elle existe, l'ajouter à la sélection
      if (onChange) {
        onChange([...value, newCategoryName]);
      }
      setInputValue("");
      return;
    }

    // Créer la nouvelle catégorie
    createCategory(
      {
        param: { workspaceId: workspaceId },
        json: { name: newCategoryName },
      },
      {
        onSuccess: (response) => {
          if ("data" in response && onChange) {
            // Ajouter immédiatement la nouvelle catégorie
            onChange([...value, newCategoryName]);
            // Vider l'input après
            setInputValue("");
          }
        },
      },
    );
  };

  return (
    <Combobox
      multiple
      autoHighlight
      items={categoryNames}
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={setOpen}
      disabled={categoriesLoading || isCreating}
    >
      <ComboboxChips
        ref={anchor}
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip
                  key={value}
                  className={"bg-[var(--item-color)]/50 capitalize"}
                  style={
                    {
                      "--item-color": getCategoryColor(value),
                    } as React.CSSProperties
                  }
                >
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder="Sélectionner ou créer des catégories..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setOpen(true)}
              />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        {inputValue && !categoryExistsIgnoreCase(inputValue) && (
          <div className="border-b">
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreating}
              className="text-primary hover:bg-accent w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <LuLoader className="inline mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>Créer "{inputValue}"</>
              )}
            </button>
          </div>
        )}
        <ComboboxEmpty>
          {isCreating
            ? "Création de la catégorie..."
            : inputValue
              ? "Cliquez sur 'Créer' pour ajouter cette catégorie"
              : "Aucune catégorie. Tapez pour en créer une."}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item} className="pr-16">
              <span
                className={cn(
                  `before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:block before:rounded-full ml-1 before:bg-[var(--item-color)] capitalize`,
                )}
                style={
                  {
                    "--item-color": getCategoryColor(item),
                  } as React.CSSProperties
                }
              >
                {item}
              </span>
              <span className="opacity-0 [[data-highlighted]_&]:opacity-100 transition-opacity absolute right-8 pointer-events-none">
                <Kbd className="text-xs">↵</Kbd>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
