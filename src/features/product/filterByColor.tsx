"use client";
import { getAllColors } from "@/api/color";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const Loading = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="w-8 h-8 rounded-full" />
      ))}
    </div>
  );
};

function FilterByColor() {
  const { data: colors, isLoading } = useQuery({
    queryKey: ["get-all-color"],
    queryFn: getAllColors,
  });

  return (
    <div>
      <p>Couleurs</p>
      <div className="flex flex-wrap gap-2">
        {isLoading ? <Loading /> : <></>}
        {colors?.data?.map(({ hexaCode }, index) => (
          <Button
            key={index}
            className={cn(
              "w-8 h-8 rounded-full border",
              (hexaCode === "FFF" || hexaCode === "FFFFFF") && "border-primary"
            )}
            style={{
              backgroundColor: `#${hexaCode}`,
              borderColor:
                hexaCode === "FFF" || hexaCode === "FFFFFF"
                  ? "#444"
                  : `#${hexaCode}`,
            }}
          ></Button>
        ))}
      </div>
    </div>
  );
}

export default FilterByColor;
