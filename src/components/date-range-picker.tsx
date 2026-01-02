"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  addMonths,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { DateInput } from "./date-input";

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

const PRESETS: Preset[] = [
  { name: "today", label: "Aujourd'hui" },
  { name: "yesterday", label: "Hier" },
  { name: "last7", label: "Les 7 derniers jours" },
  { name: "last14", label: "Les 14 derniers jours" },
  { name: "last30", label: "Les 30 derniers jours" },
  { name: "thisWeek", label: "Cette semaine" },
  { name: "lastWeek", label: "La semaine dernière" },
  { name: "thisMonth", label: "Ce mois-ci" },
  { name: "lastMonth", label: "Le mois dernier" },
  { name: "thisYear", label: "Cette année" },
  { name: "lastYear", label: "L'année dernière" },
];

export interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  align?: "start" | "center" | "end";
  locale?: string;
  className?: string;
}

const formatDate = (date: Date, locale = "fr-FR"): string => {
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map((part) => Number.parseInt(part, 10));
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return dateInput;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  align = "center",
  locale = "fr-FR",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  const openedRangeRef = React.useRef<DateRange>(range);
  const [selectedPreset, setSelectedPreset] = React.useState<
    string | undefined
  >(undefined);
  const [calendarMonths, setCalendarMonths] = React.useState<[Date, Date]>([
    new Date(),
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
  ]);

  const getPresetRange = React.useCallback((presetName: string): DateRange => {
    const now = new Date();

    switch (presetName) {
      case "today":
        return { from: startOfDay(now), to: endOfDay(now) };
      case "yesterday": {
        const yesterday = subDays(now, 1);
        return {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        };
      }
      case "last7":
        return {
          from: startOfDay(subDays(now, 6)),
          to: endOfDay(now),
        };
      case "last14":
        return {
          from: startOfDay(subDays(now, 13)),
          to: endOfDay(now),
        };
      case "last30":
        return {
          from: startOfDay(subDays(now, 29)),
          to: endOfDay(now),
        };
      case "thisWeek": {
        return {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 }),
        };
      }
      case "lastWeek": {
        const lastWeek = subWeeks(now, 1);
        return {
          from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
        };
      }
      case "thisMonth": {
        return {
          from: startOfMonth(now),
          to: endOfMonth(now),
        };
      }
      case "lastMonth": {
        const lastMonth = subMonths(now, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      }
      case "thisYear": {
        return {
          from: startOfYear(now),
          to: endOfYear(now),
        };
      }
      case "lastYear": {
        const lastYear = subYears(now, 1);
        return {
          from: startOfYear(lastYear),
          to: endOfYear(lastYear),
        };
      }
      default:
        throw new Error(`Unknown date range preset: ${presetName}`);
    }
  }, []);

  const setPreset = (preset: string): void => {
    const newRange = getPresetRange(preset);
    setRange(newRange);
    setSelectedPreset(preset);
    if (newRange.from) {
      setCalendarMonths([newRange.from, addDays(endOfMonth(newRange.from), 1)]);
    }
  };

  const checkPreset = React.useCallback(() => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);
      if (
        presetRange.from.getTime() === range.from.getTime() &&
        presetRange.to?.getTime() === range.to?.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }
    setSelectedPreset(undefined);
  }, [range, getPresetRange]);

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo
        ? getDateAdjustedForTimezone(initialDateTo)
        : getDateAdjustedForTimezone(initialDateFrom),
    });
    setSelectedPreset(undefined);
    setCalendarMonths([
      new Date(),
      new Date(new Date().setMonth(new Date().getMonth() + 1)),
    ]);
  };

  React.useEffect(() => {
    checkPreset();
  }, [checkPreset]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }) => (
    <Button
      className={cn("justify-start", isSelected && "bg-muted")}
      variant="ghost"
      onClick={() => setPreset(preset)}
    >
      <CheckIcon
        className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {label}
    </Button>
  );

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b;
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  React.useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[300px] justify-start text-left text-[11px] font-normal text-wrap",
            className
          )}
        >
          {formatDate(range.from, locale)}
          {range.to && (
            <>
              <ChevronDownIcon className="mx-2 h-4 w-4" />
              {formatDate(range.to, locale)}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} sideOffset={4}>
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="hidden lg:flex space-x-4">
              {/* Two calendars side by side for desktop */}
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange: any) => {
                  if (newRange?.from && newRange?.to) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: endOfDay(newRange.to),
                    });
                  } else if (newRange?.from) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: undefined,
                    });
                  }
                }}
                month={calendarMonths[0]}
                onMonthChange={(month) =>
                  setCalendarMonths([month, addMonths(month, 1)])
                }
                locale={fr}
                className="border rounded-md"
              />
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange: any) => {
                  if (newRange?.from && newRange?.to) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: endOfDay(newRange.to),
                    });
                  } else if (newRange?.from) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: undefined,
                    });
                  }
                }}
                month={calendarMonths[1]}
                onMonthChange={(month) =>
                  setCalendarMonths([subMonths(month, 1), month])
                }
                locale={fr}
                className="border rounded-md"
              />
            </div>

            {/* Single calendar for mobile */}
            <div className="lg:hidden">
              <Calendar
                mode="range"
                selected={range}
                onSelect={(newRange: any) => {
                  if (newRange?.from && newRange?.to) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: endOfDay(newRange.to),
                    });
                  } else if (newRange?.from) {
                    setRange({
                      from: startOfDay(newRange.from),
                      to: undefined,
                    });
                  }
                }}
                locale={fr}
                className="border rounded-md"
              />
            </div>

            <div className="flex justify-between items-center">
              <DateInput
                value={range.from}
                onChange={(date) => {
                  const toDate =
                    range.to == null || date > range.to ? date : range.to;
                  setRange((prevRange) => ({
                    ...prevRange,
                    from: startOfDay(date),
                    to: toDate ? endOfDay(toDate) : undefined,
                  }));
                }}
              />
              <ChevronDownIcon className="mx-2 h-4 w-4" />
              <DateInput
                value={range.to}
                onChange={(date) => {
                  const fromDate = date < range.from ? date : range.from;
                  setRange((prevRange) => ({
                    ...prevRange,
                    from: startOfDay(fromDate),
                    to: endOfDay(date),
                  }));
                }}
              />
            </div>
          </div>

          {/* Presets Section */}
          <div className="lg:border-l lg:pl-4 space-y-2">
            <h3 className="font-medium text-sm">Périodes</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.({ range });
              }
            }}
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
