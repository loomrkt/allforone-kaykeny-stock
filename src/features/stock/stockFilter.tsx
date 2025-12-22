"use client";

import { getDepots } from "@/api/depot";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/interfaces/category";
import Collection from "@/interfaces/collection";
import Depot from "@/interfaces/depot";
import { useAuthStore } from "@/stores/auth";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { decodeJwtPayload } from "@/utils/jwt";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FilterByColor from "./filterByColor";
import FilterBySize from "./filterBySIze";
import PriceFilter from "./priceFilter";

export type StockFilter = {
  categoryId?: string;
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  colorId?: string;
  sizeId?: string;
  depotId?: string[];
  ageGroupFilter?: string;
  genderFilter?: string;
};

export type StockFilterProps = {
  filter: StockFilter;
  setFilter: (filter: StockFilter) => void;
};

const StockFilters = ({ filter, setFilter }: StockFilterProps) => {
  const categories = useCategoryStore(({ categories }) => categories);
  const collections = useCollectionStore(({ collections }) => collections);

  const [filterState, setFilterState] = useState<StockFilter>({
    ...filter,
  });

  const {
    data: depots = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["depots"],
    queryFn: () => getDepots({}),
  });

  const clearFilterField = (key: keyof StockFilter) =>
    setFilterState((prev) => ({ ...prev, [key]: undefined }));

  const handleChange = (key: keyof StockFilter, value: string | undefined) =>
    setFilterState((prev) => ({ ...prev, [key]: value }));

  const handleFilterApply = () => setFilter({ ...filterState });

  const user = useAuthStore(({ user }) => user);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    !!(decodeJwtPayload(user?.token ?? "")?.role === "SUPER_ADMIN")
  );

  useEffect(() => {
    if (user?.token) {
      setIsAdmin(!!(decodeJwtPayload(user.token)?.role === "SUPER_ADMIN"));
    }
  }, [user]);

  return (
    <div className="w-full max-w-xs h-[80vh] bg-white rounded-lg border border-primary/10 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Filtre</h3>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{
          scrollbarWidth: "none",
        }}
      >
        <div className="space-y-2">
          <Label className="text-lg font-bold text-gray-700">
            Catégories :
          </Label>
          <Select
            value={filterState.categoryId || "all"}
            onValueChange={(value) =>
              handleChange("categoryId", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger
              className="w-full"
              aria-label="Sélectionner une catégorie"
            >
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {(categories || []).map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <Label className="text-lg font-bold text-gray-700">Dépôts :</Label>
            {isLoading && (
              <p className="text-sm text-gray-500">Chargement...</p>
            )}
            {isError && (
              <p className="text-sm text-red-500">Erreur lors du chargement</p>
            )}
            {!isLoading && !isError && (
              <Select
                value={
                  filterState.depotId && filterState.depotId.length > 0
                    ? filterState.depotId[0]
                    : "all"
                }
                onValueChange={(value) =>
                  value === "all"
                    ? clearFilterField("depotId")
                    : setFilterState((prev) => ({ ...prev, depotId: [value] }))
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Sélectionner un dépôt"
                >
                  <SelectValue placeholder="Tous les dépôts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les dépôts</SelectItem>
                  {(Array.isArray(depots) ? depots : depots?.data || []).map(
                    (depot: Depot) => (
                      <SelectItem key={depot.id} value={depot.id}>
                        {depot.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-lg font-bold text-gray-700">
            Collections :
          </Label>
          <Select
            value={filterState.collectionId || "all"}
            onValueChange={(value) =>
              handleChange("collectionId", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger
              className="w-full"
              aria-label="Sélectionner une collection"
            >
              <SelectValue placeholder="Toutes les collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les collections</SelectItem>
              {(collections || []).map((collection: Collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <PriceFilter
            setPrice={({ minPrice, maxPrice }) =>
              setFilterState((prev) => ({ ...prev, minPrice, maxPrice }))
            }
          />
          <FilterByColor
            selectedColorId={filterState.colorId}
            onChange={(colorId) =>
              setFilterState((prev) => ({ ...prev, colorId }))
            }
          />
          <FilterBySize
            selectedSizeId={filterState.sizeId}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(sizeId: any) =>
              setFilterState((prev) => ({ ...prev, sizeId }))
            }
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" onClick={handleFilterApply}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default StockFilters;
