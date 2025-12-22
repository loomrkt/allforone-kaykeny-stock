"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { useState } from "react";
import PriceFilter from "./priceFilter";

export type productFilter = {
  categoryId?: string;
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductFilterProps = {
  filter: productFilter;
  setFilter: (filter: productFilter) => void;
};

const ProductFilters = ({ filter, setFilter }: ProductFilterProps) => {
  const categories = useCategoryStore(({ categories }) => categories);
  const collections = useCollectionStore(({ collections }) => collections);

  const [filterState, setFilterState] = useState<productFilter>({
    minPrice: filter.minPrice || 0,
    maxPrice: filter.maxPrice || 0,
    categoryId: filter.categoryId || "all",
    collectionId: filter.collectionId || "all",
  });

  const handleChangeCategory = (categoryId: string) =>
    setFilterState({
      ...filterState,
      categoryId: categoryId === "all" ? undefined : categoryId,
    });

  const handleChangeCollection = (collectionId: string) =>
    setFilterState({
      ...filterState,
      collectionId: collectionId === "all" ? undefined : collectionId,
    });

  const handleFilterApply = () => setFilter({ ...filterState });

  return (
    <div
      className="w-full max-h-[calc(100vh-12rem)] max-w-xs px-4 bg-white rounded-lg border border-primary/10 space-y-6 overflow-y-auto"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 pt-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtre</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium underline text-gray-700">
          Catégories:
        </Label>
        <Select
          value={filterState.categoryId || "all"}
          onValueChange={handleChangeCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {(categories || []).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium underline text-gray-700">
          Collections:
        </Label>
        <Select
          value={filterState.collectionId || "all"}
          onValueChange={handleChangeCollection}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {(collections || []).map((collection) => (
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
            setFilterState({ ...filterState, minPrice, maxPrice })
          }
        />
      </div>
      <div
        className="flex w-full items-center justify-center sticky bottom-0 bg-white py-4"
        onClick={handleFilterApply}
      >
        <Button className="w-full">OK</Button>
      </div>
    </div>
  );
};

export default ProductFilters;
