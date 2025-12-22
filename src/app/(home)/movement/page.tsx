"use client";

import SearchInput from "@/components/common/searchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Guard from "@/guard";
import { ApiParameters } from "@/interfaces/global";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ChangeEvent, Suspense, useState } from "react";
import CreateMovement from "./createMovement";
import ListStockMovement from "./listMouvementPage";

const tabValues = [
  {
    label: "Historique des mouvements",
    value: "movementList",
    permission: PERMISSIONS.MOVEMENT.READ_ALL,
  },
  {
    label: "Créer un mouvement",
    value: "createMovement",
    permission: PERMISSIONS.MOVEMENT.CREATE,
  },
];

export default function ListStockMovementPage() {
  const [activeTab, setActiveTab] = useState(tabValues[0].value);
  const [params, setParams] = useState<ApiParameters>({ page: 1, limit: 20 });
  const [searchParams, setSearchParams] = useState<string>("");
  const debouncedSearch = useDebounce(searchParams, 1000);
  // const tabValues = ["Listes des mouvements", "Mouvements"];

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
    setParams({ ...params, page: 1 });
  };

  return (
    <div className="w-full h-full p-4">
      <Tabs
        defaultValue="Listes des mouvements"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b items-end flex justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map(({ label, value, permission }) => (
                <Guard key={value} permission={permission}>
                  <TabsTrigger
                    value={value}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none",
                      activeTab === value
                        ? "text-primary border-b-4 border-accent"
                        : "text-gray-600 hover:text-primary hover:border-b-4 py-2 hover:border-gray-300"
                    )}
                  >
                    {label}
                  </TabsTrigger>
                </Guard>
              ))}
            </TabsList>
          </div>

          <div className="block md:hidden mb-4">
            <div className="flex flex-col w-full items-center gap-2">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {tabValues.map(({ label, value, permission }) => (
                    <Guard key={value} permission={permission}>
                      <SelectItem value={value}>{label}</SelectItem>
                    </Guard>
                  ))}
                </SelectContent>
              </Select>
              <SearchInput
                placeholder="Recherche par produit"
                value={searchParams}
                onChange={handleSearch}
                onClear={() => {
                  setSearchParams("");
                  setParams({ ...params, page: 1, search: undefined });
                }}
              />
            </div>
          </div>

          <div className="hidden items-center mb-2 md:flex gap-2 justify-end">
            <SearchInput
              placeholder="Recherche par produit"
              value={searchParams}
              onChange={handleSearch}
              onClear={() => {
                setSearchParams("");
                setParams({ ...params, page: 1, search: undefined });
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col">
          <Guard permission={PERMISSIONS.MOVEMENT.READ_ALL}>
            {activeTab === tabValues[0].value && (
              <ListStockMovement
                params={params}
                setParams={setParams}
                search={debouncedSearch}
              />
            )}
          </Guard>

          <Guard permission={PERMISSIONS.MOVEMENT.CREATE}>
            {activeTab === tabValues[1].value && (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full w-full">
                    Cahrgement du formulaire...
                  </div>
                }
              >
                <CreateMovement />
              </Suspense>
            )}
          </Guard>
        </div>
      </Tabs>
    </div>
  );
}
