"use client";

import { getProducts } from "@/api/product";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/interfaces/product";
import { useQuery } from "@tanstack/react-query";

interface MultiSelectProductsProps {
  selected: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectProducts({
  selected,
  onChange,
}: MultiSelectProductsProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts({});
      return Array.isArray(response?.data) ? response.data : [];
    },
  });

  const toggleProduct = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((pid) => pid !== id)
        : [...selected, id]
    );
  };

  return (
    <ScrollArea className="h-40 border rounded-md p-2">
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        products.map((product) => (
          <label
            key={product.id}
            className="flex items-center space-x-2 cursor-pointer py-1"
          >
            <Checkbox
              checked={selected.includes(product.id)}
              onCheckedChange={() => toggleProduct(product.id)}
            />
            <span className="text-sm">{product.name}</span>
          </label>
        ))
      )}
    </ScrollArea>
  );
}
