"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useUserStore } from "@/stores/user/userStore";
import { format } from "date-fns";
import { CalendarIcon, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";
import SelectProduct from "./selectProduct";

export type filter = {
  startDate?: Date;
  endDate?: Date;
  depotId?: string;
  categoryId?: string;
  collectionId?: string;
  productId?: string;
  email?: string;
};

export function FiltersContent({
  filter,
  setFilter,
}: {
  filter: filter;
  setFilter: (value: filter) => void;
}) {
  const { localDepots, supplierDepots } = useDepotStore((depots) => depots);
  const collections = useCollectionStore(({ collections }) => collections);
  const categories = useCategoryStore(({ categories }) => categories);
  const users = useUserStore(({ users }) => users);

  return (
    <div className="w-full grid md:grid-cols-4 lg:grid-cols-8 sm:grid-cols-1 gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label>Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                !filter?.startDate && "text-muted-foreground"
              )}
            >
              {filter?.startDate
                ? format(filter.startDate, "dd/MM/yyyy")
                : "Choisir une date"}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filter?.startDate}
              onSelect={(date) => {
                if (!date) return;
                const startOfDay = new Date(date);
                startOfDay.setHours(12, 0, 0, 0);
                setFilter({ ...filter, startDate: startOfDay });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Date de fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                !filter?.endDate && "text-muted-foreground"
              )}
            >
              {filter?.endDate
                ? format(filter.endDate, "dd/MM/yyyy")
                : "Choisir une date"}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filter?.endDate}
              onSelect={(date) => {
                if (!date) return;
                const startOfDay = new Date(date);
                startOfDay.setHours(12, 0, 0, 0);
                setFilter({ ...filter, endDate: startOfDay });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Dépôt</Label>
        <Select
          onValueChange={(value) => setFilter({ ...filter, depotId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un dépôt" />
          </SelectTrigger>
          <SelectContent>
            {localDepots.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Fournisseur</Label>
        <Select
          onValueChange={(value) => setFilter({ ...filter, depotId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un dépôt" />
          </SelectTrigger>
          <SelectContent>
            {supplierDepots.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Catégorie</Label>
        <Select
          onValueChange={(value) => setFilter({ ...filter, categoryId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories?.length ? (
              categories.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))
            ) : (
              <></>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Modèle</Label>
        <Select
          onValueChange={(value) =>
            setFilter({ ...filter, collectionId: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un modèle" />
          </SelectTrigger>
          <SelectContent>
            {collections?.length ? (
              collections.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))
            ) : (
              <></>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Utilisateur</Label>
        <Select
          onValueChange={(value) =>
            setFilter({ ...filter, collectionId: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un modèle" />
          </SelectTrigger>
          <SelectContent>
            {users?.length ? (
              users.map(({ email, lastName }) => (
                <SelectItem key={email} value={email}>
                  {lastName}
                </SelectItem>
              ))
            ) : (
              <></>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <SelectProduct
          productId={filter.productId}
          onChange={(value) => setFilter({ ...filter, productId: value })}
        />
      </div>
    </div>
  );
}

export default function FiltersDashboard({
  filter,
  setFilter,
}: {
  filter: filter;
  setFilter: (value: filter) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const resetFilter = () => {
    setFilter({});
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="mb-4 max-sm:flex hidden items-center justify-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtrer les données</DialogTitle>
          </DialogHeader>
          <FiltersContent {...{ filter, setFilter, resetFilter }} />
          <div className="flex justify-end mt-4">
            <Button onClick={resetFilter}>
              <RefreshCcw />
              Réinitialiser
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-4 max-sm:hidden">
        <FiltersContent {...{ filter, setFilter, resetFilter }} />
        <div className="flex justify-end mt-2">
          <Button onClick={resetFilter}>
            <RefreshCcw />
            Réinitialiser
          </Button>
        </div>
      </div>
    </>
  );
}
