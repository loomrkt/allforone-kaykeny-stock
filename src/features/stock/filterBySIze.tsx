"use client";

import { getSizes } from "@/api/size";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Size } from "@/interfaces/size";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type FilterBySizeProps = {
  selectedSizeId?: string;
  onChange: (sizeId?: string) => void;
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

function FilterBySize({ selectedSizeId, onChange }: FilterBySizeProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["get-all-size"],
    queryFn: () => getSizes({}),
  });

  const sizes = data?.data ?? [];

  if (isLoading) return <Loading />;
  if (!sizes.length) return null;

  return (
    <div>
      <p className="mb-2 font-bold text-lg">Tailles :</p>
      <div className="hidden sm:flex flex-wrap gap-2">
        <Button
          onClick={() => onChange(undefined)}
          className={cn(
            "w-8 h-8 rounded-full border border-gray-300",
            !selectedSizeId && "ring-2 ring-offset-2 ring-primary"
          )}
          variant="outline"
          aria-label="Toutes les tailles"
        >
          ✕
        </Button>
        {sizes.map((size: Size) => (
          <Button
            key={size.id}
            onClick={() => onChange(size.id)}
            className={cn(
              "w-8 h-8 rounded-full border",
              selectedSizeId === size.id && "ring-2 ring-offset-2 ring-primary"
            )}
            variant="outline"
            aria-label={`Filtrer par ${size.name}`}
          >
            {size.name}
          </Button>
        ))}
      </div>
      <div className="sm:hidden">
        <Select
          value={selectedSizeId || "all"}
          onValueChange={(value) =>
            onChange(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger
            className={cn("w-full")}
            aria-label="Sélectionner une taille"
          >
            <SelectValue placeholder="Toutes les tailles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les tailles</SelectItem>
            {sizes.map((size: Size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterBySize;
