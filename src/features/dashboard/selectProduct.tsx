"use client";

import { getProducts } from "@/api/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { truncateText } from "@/lib/utils";
import { useProductStore } from "@/stores/product/productStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface SelectProductProps {
  productId?: string;
  onChange: (value: string) => void;
}

function SelectProduct({ productId, onChange }: SelectProductProps) {
  const setProducts = useProductStore((state) => state.setProducts);
  const { data: productsData } = useQuery({
    queryKey: ["get-all-product"],
    queryFn: () => getProducts({ getBaseInfo: true }),
  });

  const products = useMemo(
    () => productsData?.data || [],
    [productsData?.data]
  );
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  useEffect(() => {
    if (products.length) setProducts(products);
  }, [products, setProducts]);

  const handleSelect = (selectedId: string) => {
    onChange(selectedId);
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-1.5">
      <label className="text-sm font-medium text-gray-700">Produit</label>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="w-full text-left bg-white hover:bg-white border-gray-200 text-primary/60"
          >
            {products.find((p) => p.id === productId)?.name
              ? truncateText(
                  products.find((p) => p.id === productId)?.name || "",
                  20
                )
              : "Sélectionner un produit"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sélectionner un produit</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Rechercher un produit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <Button
                  key={product.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelect(product.id)}
                >
                  {product.name}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground px-2">
                Aucun produit trouvé.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SelectProduct;
