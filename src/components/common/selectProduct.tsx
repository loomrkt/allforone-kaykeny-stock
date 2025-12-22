"use client";

import { useProductStore } from "@/stores/product/productStore";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

function SelectProduct({
  name = "productId",
  form,
}: {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  const productsStore = useProductStore(({ products }) => products);

  const products = useMemo(() => productsStore || [], [productsStore]);

  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return (
      products?.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [products, search]);

  const handleSelect = (productId: string) => {
    form.setValue(name, productId);
    setIsOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-sm font-medium text-gray-700">
            Produit <span className="text-destructive">*</span>
          </FormLabel>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full text-left bg-white hover:bg-white border-gray-200 text-primary/60"
                >
                  {products?.find((p) => p.id === field.value)?.name ||
                    "Sélectionner un produit"}
                </Button>
              </FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectProduct;
