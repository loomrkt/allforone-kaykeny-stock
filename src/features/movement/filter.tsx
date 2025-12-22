"use client";
import { getDepots } from "@/api/depot";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Filter as FilterIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";

export type filterType = {
  type?: string;
  sourceId?: string;
  destinationId?: string;
  createdAt?: Date;
  isReturn?: boolean;
  isSale?: boolean;
  email?: string;
};
const DEFAULT_FILTER_VALUE = {
  type: "all",
  sourceId: "all",
  destinationId: "all",
  createdAt: undefined,
};

function Filter({
  handleFilter,
}: {
  handleFilter: (filter: filterType) => void;
}) {
  const [filter, setFilter] = useState<filterType>(DEFAULT_FILTER_VALUE);
  const [open, setOpen] = useState(false);

  const { data: localDepots } = useQuery({
    queryKey: ["get-depots-local"],
    queryFn: () => getDepots({ isSupplier: false }),
  });

  const handleClearFilter = () => {
    setFilter(DEFAULT_FILTER_VALUE);
    handleFilter({});
    setOpen(false);
  };

  const getType = () => {
    switch (filter.type) {
      case "INBOUND":
        return "INBOUND";
      case "BACK":
        return "INBOUND";
      case "OUTBOUND":
        return "OUTBOUND";
      case "TRANSFERT":
        return "OUTBOUND";
      default:
        return undefined;
    }
  };

  const applyFilter = () => {
    handleFilter({
      ...filter,
      isReturn: filter.type === "BACK" || undefined,
      isSale: filter.type === "OUTBOUND" || undefined,
      type: getType(),
      sourceId: filter.sourceId !== "all" ? filter.sourceId : undefined,
      destinationId:
        filter.destinationId !== "all" ? filter.destinationId : undefined,
    });
    setOpen(false);
  };

  const FilterForm = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
      {/* Type */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Type</label>
        <Select
          value={filter.type}
          onValueChange={(value) =>
            setFilter((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="INBOUND">Entrée</SelectItem>
            <SelectItem value="OUTBOUND">Vente</SelectItem>
            <SelectItem value="TRANSFERT">Transfert</SelectItem>
            <SelectItem value="BACK">Retour</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Source */}
      {localDepots?.data && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Source</label>
          <Select
            value={filter.sourceId}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, sourceId: value }))
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {localDepots.data.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Destination */}
      {localDepots?.data && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Destination
          </label>
          <Select
            value={filter.destinationId}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, destinationId: value }))
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {localDepots.data.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col space-y-1.5">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                !filter?.createdAt && "text-muted-foreground"
              )}
            >
              {filter?.createdAt
                ? format(filter.createdAt, "dd/MM/yyyy")
                : "Choisir une date"}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filter?.createdAt}
              onSelect={(date) => {
                if (!date) return;
                const startOfDay = new Date(date);
                startOfDay.setHours(12, 0, 0, 0);
                setFilter({ ...filter, createdAt: startOfDay });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block bg-white border rounded-xl shadow-sm px-4 py-3">
        {FilterForm}
        <div className="flex justify-end mt-4 gap-2">
          <Button size="sm" variant="outline" onClick={handleClearFilter}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={applyFilter}>
            Filtrer
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </DialogTrigger>
          <DialogTitle />
          <DialogContent className="sm:max-w-[95%] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <h2 className="text-base font-semibold">Filtres</h2>
            </DialogHeader>
            <div className="space-y-3">
              {FilterForm}
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={handleClearFilter}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={applyFilter}>
                  Appliquer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Filter;
