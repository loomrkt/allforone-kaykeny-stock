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
import { ApiParameters } from "@/interfaces/global";
import clsx from "clsx";
import { useState } from "react";
import ListStock from "./listStockPage";

export default function ListStockPage() {
  const [activeTab, setActiveTab] = useState("Listes des stocks");
  const [params, setParams] = useState<ApiParameters>({
    page: 1,
    limit: 20,
    search: undefined,
  });

  const tabValues = ["Listes des stocks"];

  return (
    <div className="w-full h-full p-4">
      <Tabs
        defaultValue="Listes des stocks"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b items-end flex justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none",
                    activeTab === value
                      ? "text-primary border-b-4 border-accent"
                      : "text-gray-600 hover:text-primary hover:border-b-4 py-2 hover:border-gray-300"
                  )}
                >
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="block md:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {tabValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center rounded-full mb-2 md:flex gap-2 justify-end">
            <SearchInput
              placeholder="Rechercher un stock..."
              value={params.search || ""}
              onChange={(e) =>
                setParams({ ...params, page: 1, search: e.target.value })
              }
              onClear={() =>
                setParams({ ...params, page: 1, search: undefined })
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col">
          {activeTab === "Listes des stocks" && (
            <ListStock params={params} setParams={setParams} />
          )}
        </div>
      </Tabs>
    </div>
  );
}
