"use client";

import { getAllColors } from "@/api/color";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Color } from "@/interfaces/color";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type FilterByColorProps = {
  selectedColorId?: string;
  onChange: (colorId?: string) => void;
};

const Loading = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="w-8 h-8 rounded-full" />
      ))}
    </div>
  );
};

function FilterByColor({ selectedColorId, onChange }: FilterByColorProps) {
  const { data: colors, isLoading } = useQuery({
    queryKey: ["get-all-color"],
    queryFn: getAllColors,
  });

  if (isLoading) return <Loading />;
  if (!colors?.data?.length) return null;

  return (
    <TooltipProvider>
      <div>
        <p className="mb-2 font-bold text-lg">Couleurs :</p>
        <div className="hidden sm:flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onChange(undefined)}
                className={cn(
                  "w-8 h-8 rounded-full p-0 border border-gray-300",
                  !selectedColorId && "ring-2 ring-offset-2 ring-primary"
                )}
                aria-label="Toutes les couleurs"
              >
                ✕
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toutes les couleurs</p>
            </TooltipContent>
          </Tooltip>
          {colors.data.map(({ hexaCode, id, name }: Color) => {
            const color = hexaCode.startsWith("#") ? hexaCode : `#${hexaCode}`;
            const isWhite =
              color.toUpperCase() === "#FFFFFF" ||
              color.toUpperCase() === "#FFF";

            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onChange(id)}
                    className={cn(
                      "w-8 h-8 rounded-full p-0",
                      isWhite && "border border-gray-400",
                      selectedColorId === id &&
                        "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Filtrer par ${name}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="sm:hidden">
          <Select
            value={selectedColorId || "all"}
            onValueChange={(value) =>
              onChange(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger
              className={cn("w-full")}
              aria-label="Sélectionner une couleur"
            >
              <SelectValue placeholder="Toutes les couleurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les couleurs</SelectItem>
              {colors.data.map(({ id, name }: Color) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default FilterByColor;
