"use client";

import SearchInput from "@/components/common/searchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Guard from "@/guard";
import { ApiParameters } from "@/interfaces/global";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import CreateProductPage from "./createProductPage";
import ListProduct from "./listProductPage";

const tabValues = [
  {
    label: "Catalogue des produits",
    value: "productList",
    permission: PERMISSIONS.PRODUCT.READ_ALL,
  },
  {
    label: "Nouveau produit",
    value: "createProduct",
    permission: PERMISSIONS.PRODUCT.CREATE,
  },
];

type Params = Omit<ApiParameters, "search">;
export default function ListProductPage() {
  const [activeTab, setActiveTab] = useState<string>(tabValues[0].value);
  const [params, setParams] = useState<Params>({ page: 1, limit: 20 });
  const [searchParams, setSearchParams] = useState<string>("");
  const debouncedSearch = useDebounce(searchParams, 1000);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
    setParams({ ...params, page: 1 });
  };

  return (
    <div className="w-full h-full p-4">
      <Tabs
        defaultValue="Listes des produits"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b items-end flex justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map(({ value, label, permission }) => (
                <Guard key={value} permission={permission}>
                  <TabsTrigger
                    value={value}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none border-b-4",
                      activeTab === value
                        ? "text-primary border-accent"
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
            <div className="flex flex-row items-center gap-2">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {tabValues.map(({ value, label, permission }) => (
                    <Guard key={value} permission={permission}>
                      <SelectItem value={value}>{label}</SelectItem>
                    </Guard>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 relative">
                <SearchInput
                  placeholder="Rechercher un produit..."
                  value={searchParams}
                  onChange={handleSearch}
                  onClear={() => {
                    setSearchParams("");
                    setParams({ ...params, page: 1, search: undefined });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="hidden items-center mb-2 md:flex gap-2 justify-end">
            <SearchInput
              placeholder="Rechercher un produit..."
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
              <ListProduct
                params={params}
                setParams={setParams}
                search={debouncedSearch}
              />
            )}
          </Guard>

          <Guard permission={PERMISSIONS.MOVEMENT.CREATE}>
            {activeTab === tabValues[1].value && (
              <Guard permission={PERMISSIONS.PRODUCT.CREATE}>
                <TabsContent value={tabValues[1].value} className="mt-0">
                  <CreateProductPage />
                </TabsContent>
              </Guard>
            )}
          </Guard>
        </div>
      </Tabs>
    </div>
  );
}
