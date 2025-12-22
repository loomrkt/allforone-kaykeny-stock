"use client";

import { getProducts } from "@/api/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ProductMultiSelectDialogProps {
  selected: string[];
  onChange: (val: string[]) => void;
}

export default function SelectMultipleProduct({
  selected,
  onChange,
}: ProductMultiSelectDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [localSelection, setLocalSelection] = useState<string[]>([]);

  const categories = useCategoryStore(({ categories }) => categories);
  const collections = useCollectionStore(({ collections }) => collections);
  const [categoryId, setCategoryId] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>("");

  const { data: productsData } = useQuery({
    queryKey: ["get-all-product", search, categoryId, collectionId],
    queryFn: () =>
      getProducts({
        getBaseInfo: true,
        search,
        categoryId,
        collectionId,
      }),
  });

  useEffect(() => {
    if (open) {
      setLocalSelection([...selected]);
    }
  }, [open, selected]);

  const toggle = (id: string) => {
    setLocalSelection((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full bg-white hover:bg-white cursor-pointer"
        >
          Choisir les produits
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choisir les produits</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Rechercher un produit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <Select
            onValueChange={(val) => setCategoryId(val)}
            value={categoryId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => setCollectionId(val)}
            value={collectionId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par collection" />
            </SelectTrigger>
            <SelectContent>
              {collections?.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-[400px] overflow-y-auto mt-4 space-y-2">
          {productsData?.data?.map((p) => (
            <label key={p.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSelection.includes(p.id)}
                onChange={() => toggle(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={() => {
              onChange(localSelection);
              setOpen(false);
            }}
            className="w-full"
          >
            Valider la sélection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
