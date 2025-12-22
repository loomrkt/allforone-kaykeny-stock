"use client";

import { getStocks } from "@/api/stock";
import { useStockStore } from "@/stores/stock/stockStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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

function SelectStock({
  name = "stockId",
  form,
}: {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  const setStocks = useStockStore(({ setStocks }) => setStocks);
  const stocksStore = useStockStore(({ stocks }) => stocks);

  const { data: stocksData } = useQuery({
    queryKey: ["get-all-stock"],
    queryFn: () => getStocks({}),
  });

  const stocks = useMemo(
    () => stocksData?.data || stocksStore || [],
    [stocksData?.data, stocksStore]
  );

  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredStocks = useMemo(() => {
    return (
      stocks?.filter(
        (stock) =>
          stock &&
          typeof stock.productName === "string" &&
          stock.productName.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [stocks, search]);

  useEffect(() => {
    if (stocksData?.data) setStocks(stocksData.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocksData?.data]);

  const handleSelect = (stockId: string) => {
    form.setValue(name, stockId);
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
                  {stocks?.find((s) => s?.id === field.value)?.productName ||
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
                {filteredStocks.length ? (
                  filteredStocks.map((stock) => (
                    <Button
                      key={stock.id}
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => handleSelect(stock.id)}
                    >
                      <span>{stock.productName}</span>
                      <span className="font-normal text-primary/80">
                        (stock disponible :{stock.quantity})
                      </span>
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

export default SelectStock;
